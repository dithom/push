import express from 'express';
import { body, validationResult } from 'express-validator';

// Import middleware
import auth from '../middleware/auth';
import User from '../model/User';
// Import models
import Challange from '../model/Challange';

// Define globals
const router = express.Router();

// TODO Find solution for challange feeds. Separate collection or put it into challange?
// TODO GET Endpoint for getting a specific challange at /:id including optional ?feed parameter to populate feed (if this will be done as referance)
// TODO PATCH Endpoint for updating properties of a specific challange at /:id
// TODO PUT Endpoint for overriding a specific challange at /:id (maybe for v2)
// TODO Find solution for DELETE Endpoint, as we can not simply delete a challange for all competitors
// TODO After Challange creation, each competitor has to accept the challange -> how is this messaged sent?

/**
 * Finds active challanges associated to signed in user (creator or competitor)
 * Method: GET
 * @returns {Array<Object>} List of challanges
 */
router.get('/active', auth, async (request, response) => {
  // TODO Return challange(s) including archived for signed in user with /?archived (maybe for v2)

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // get all challanges associated to signed in user
  try {
    const challanges = await Challange.find({
      $or: [
        {
          creator: request.userId,
        },
        {
          competitors: request.userId,
        },
      ],
      $and: [{ endDate: { $gte: today } }],
    });

    return response.json(challanges);
  } catch (error) {
    return response.status(400).json(error);
  }
});

/**
 * Finds archived challanges associated to signed in user (creator or competitor)
 * Method: GET
 * @returns {Array<Object>} List of challanges
 */
router.get('/archived', auth, async (request, response) => {
  // TODO Return challange(s) including archived for signed in user with /?archived (maybe for v2)

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // get all challanges associated to signed in user
  try {
    const challanges = await Challange.find({
      $or: [
        {
          creator: request.userId,
        },
        {
          competitors: request.userId,
        },
      ],
      $and: [{ endDate: { $lt: today } }],
    });

    return response.json(challanges);
  } catch (error) {
    return response.status(400).json(error);
  }
});

/**
 * Creates a new challange as signed in user
 * Method: POST
 * @param  {string} name
 * @param  {string} description
 * @param  {string} category
 * @param  {Date} startDate
 * @param  {Date} endDate
 * @param  {number} repetitions
 * @param  {string} timespan
 * @param  {string} visibility
 * @param {Array<string>} [competitors]
 * @returns {Object} Created challange
 */
router.post(
  '/create',
  auth,
  body('name').isString().isLength({ min: 6, max: 255 }),
  body('description').isString().isLength({ min: 6, max: 1023 }),
  body('category').isString(),
  body('startDate').isDate(), // yyyy-mm-dd
  body('endDate').isDate(),
  body('repetitions').isInt(),
  body('timespan').isString(),
  body('visibility').isString(),
  body('competitors').isArray(),
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

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    today = new Date(`${yyyy}-${mm}-${dd}`);

    if (startDate < today) {
      return response.status(400).json({
        error: 'The start date can not be set to earlier than today.',
      });
    }

    if (endDate <= startDate) {
      return response.status(400).json({
        error:
          'The end date can not be set to equal or earlier than the start date.',
      });
    }

    // Check if user is also in competitors
    if (request.body.competitors.includes(request.userId)) {
      return response.status(400).json({
        error:
          'The creator of this challange can not be added as a competitor.',
      });
    }

    // Create new challange
    const newChallange = new Challange({
      name: request.body.name,
      description: request.body.description,
      category: request.body.category,
      startDate: request.body.startDate,
      endDate: request.body.endDate,
      repetitions: request.body.repetitions,
      timespan: request.body.timespan,
      creator: request.userId,
      visibility: request.body.visibility,
      competitors: request.body.competitors,
    });

    try {
      const savedChallange = await newChallange.save();
      return response.json(savedChallange);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
);

/**
 * Update Challange with attendees
 * Method: PATCH
 * @returns {Object} Created challange
 */
router.patch('/addattendees', auth, async (request, response) => {
  const competitorsNames = request.body.competitors;
  const competitorIds = [];
  for (let i = 0; i < competitorsNames.length; i++) {
    console.log('username', competitorsNames[i].username);
    const user = await User.findOne({
      username: competitorsNames[i].username,
    });
    competitorIds.push(user._id);
  }
  // find and update challange by name
  const filter = { name: request.body.name };
  const update = { competitors: competitorIds };
  try {
    const challanges = await Challange.findOneAndUpdate(filter, update);
    return response.json(challanges);
  } catch (error) {
    return response.status(400).json(error);
  }
});

module.exports = router;
