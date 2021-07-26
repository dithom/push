import express from 'express';
import { ObjectID } from 'mongodb';
import { body, validationResult } from 'express-validator';

// Import middleware
import auth from '../middleware/auth';

// Import models
import User from '../model/User';
import Challange from '../model/Challange';
import ChallangeInvitation from '../model/ChallangeInvitation';

// Define globals
const router = express.Router();

// TODO Find solution for DELETE Endpoint, as we can not simply delete a challange for all competitors

/**
 * Returns list of challanges matching given query parameters limited to 100.
 * Method: GET
 * @param {string} [search]
 * @param {string} [sort]
 * @param {string} [order]
 * @param {string} [limit]
 * @returns {Array<Object>} Challanges
 */
router.get('/', auth, async (request, response) => {
  let challanges = [];
  const query = {};
  const options = {
    limit: 100,
    populate: [
      {
        path: 'participants',
        select: ['username', 'score'],
      },
      {
        path: 'creator',
        select: ['username', 'score'],
      },
    ],
  };

  if (Object.prototype.hasOwnProperty.call(request.query, 'search')) {
    query.name = {
      $regex: request.query.search,
      $options: 'i',
    };

    query.visibility = 'public';
  }

  if (Object.prototype.hasOwnProperty.call(request.query, 'sort')) {
    let order = 'asc';

    if (Object.prototype.hasOwnProperty.call(request.query, 'order')) {
      order = request.query.order;
    }

    options.sort = { [request.query.sort]: order };
  }

  if (Object.prototype.hasOwnProperty.call(request.query, 'limit')) {
    options.limit = Math.min(parseInt(request.query.limit, 10), 100);
  }

  try {
    if (
      Object.keys(query).length !== 0 ||
      Object.prototype.hasOwnProperty.call(request.query, 'sort')
    ) {
      challanges = await Challange.find(query, {}, options);
    }

    return response.json(challanges);
  } catch (error) {
    return response.status(400).json(error);
  }
});

/**
 * Returns challange information for specific challange.
 * Method: GET
 * @returns {Object} Challange
 */
router.get('/:id', auth, async (request, response) => {
  try {
    const challange = await Challange.findById(
      request.params.id,
      {},
      {
        populate: [
          {
            path: 'participants',
            select: ['username', 'score'],
          },
          {
            path: 'creator',
            select: ['username', 'score'],
          },
        ],
      }
    );

    if (challange.visibility === 'private') {
      if (String(challange.creator._id) === request.userId) {
        return response.json(challange);
      }

      for (let i = 0; i < challange.participants.length; i += 1) {
        if (String(challange.participants[i]._id) === request.userId) {
          return response.json(challange);
        }
      }

      return response.status(401).json();
    }

    return response.json(challange);
  } catch (error) {
    return response.status(400).json(error);
  }
});

/**
 * Creates a new challange as signed in user
 * Method: POST
 * @param {string} name
 * @param {string} description
 * @param {string} category
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {number} repetitions
 * @param {string} timespan
 * @param {string} visibility
 * @param {Array<string>} [participants]
 * @returns {Object} Created challange
 */
router.post(
  '/',
  auth,
  body('name').isString().isLength({ min: 6, max: 255 }),
  body('description').isString().isLength({ min: 6, max: 1023 }),
  body('category').isString(),
  body('startDate').isDate(),
  body('endDate').isDate(),
  body('repetitions').isInt(),
  body('timespan').isString(),
  body('visibility').isString(),
  async (request, response) => {
    // Find validation errors and wrap them in an object
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    // Check dates
    const startDate = new Date(request.body.startDate);
    const endDate = new Date(request.body.endDate);

    if (startDate < new Date()) {
      return response.status(400).json({
        error: 'The start date can not be set to earlier than today.',
      });
    }

    if (endDate <= startDate) {
      return response.status(400).json({
        error: `The end date can not be set to equal or earlier than the start
          date.`,
      });
    }

    // Check if signed in user is also participant
    if (request.body.participants.includes(request.userId)) {
      return response.status(400).json({
        error: 'The creator can not be added as a participant.',
      });
    }

    // Check participants
    if (request.body.participants && Array.isArray(request.body.participants)) {
      for (let i = 0; i < request.body.participants.length; i += 1) {
        if (!ObjectID.isValid(request.body.participants[i])) {
          return response.status(400).json({
            error: 'Participant ID not valid.',
          });
        }

        try {
          /* eslint-disable-next-line */
          await User.findById(request.body.participants[i]);
        } catch (error) {
          return response.status(400).json({
            error: 'Participant ID does not exist.',
          });
        }
      }
    }

    // Create new challange
    const requestBody = { ...request.body };
    delete requestBody.participants;

    const newChallange = new Challange({
      ...requestBody,
      creator: request.userId,
    });

    // Create challange invitations
    const newChallangeInvitations = [];

    if (request.body.participants && Array.isArray(request.body.participants)) {
      request.body.participants.forEach((participant) => {
        const newChallangeInvitation = new ChallangeInvitation({
          sender: request.userId,
          receiver: participant,
          challange: newChallange._id,
        });

        newChallangeInvitations.push(newChallangeInvitation);
      });
    }

    // Save challange
    let savedNewChallange = null;

    try {
      savedNewChallange = await newChallange.save();
    } catch (error) {
      return response.status(400).json({
        error: 'Error while saving challange.',
      });
    }

    // Save challange invitations
    for (let i = 0; i < newChallangeInvitations.length; i += 1) {
      try {
        /* eslint-disable-next-line */
        await newChallangeInvitations[i].save();
      } catch (error) {
        // Delete created challange and all created invitations again
        try {
          /* eslint-disable */
          await ChallangeInvitation.deleteMany({ challange: newChallange._id });
          await Challange.findByIdAndDelete(newChallange._id);
          /* eslint-enable */
        } catch (deleteError) {
          return response.status(400).json({
            error: `Error while deleting already created entries of failed
              request`,
          });
        }

        return response.status(400).json({
          error: 'Error while saving challange invitations.',
        });
      }
    }

    return response.json(savedNewChallange);
  }
);

/**
 * Updates challange information for specific challange.
 * Method: PATCH
 * @returns {Object} Updated challange
 */
router.patch('/:id', auth, async (request, response) => {
  try {
    const challange = await Challange.findById(request.params.id);

    // check permission
    if (String(challange.creator._id) !== request.userId) {
      return response.status(401).json();
    }

    // deny adding participants without invitation
    if (request.body.participants) {
      return response.status(400).json({
        error: `Participants can not be updated directly. Send an invitation or
          remove them explicitly.`,
      });
    }

    await Challange.findByIdAndUpdate(request.params.id, request.body);
    const updatedChallange = await Challange.findById(
      request.params.id,
      {},
      {
        populate: [
          {
            path: 'participants',
            select: ['username', 'score'],
          },
          {
            path: 'creator',
            select: ['username', 'score'],
          },
        ],
      }
    );

    return response.json(updatedChallange);
  } catch (error) {
    return response.status(400).json(error);
  }
});

module.exports = router;
