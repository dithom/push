import express from 'express';
import _ from 'lodash';
import { body, validationResult } from 'express-validator';

// Import middleware
import auth from '../middleware/auth';

// Import models
import Challange from '../model/Challange';

// Define globals
const router = express.Router();

// TODO Find solution for challange feeds. Separate collection or put it into challange?
// TODO Endpoint for updating challange
// TODO Endpoint for deleting challange

/**
 * Finds one or more challanges associated to signed in user
 * (creator or competitor)
 * Method: GET
 * @returns {Array<Object>} List of challanges
 */
router.get('/', auth, async (request, response) => {
  // get all active challanges associated to signed in user
  if (_.isEmpty(request.params)) {
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
      });

      return response.json(challanges);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  // TODO Return a specific challange for signed in user with /?id
  // TODO Return a specific challange including feed for signed in user with /?id&feed
  // TODO Return challange(s) including archived for signed in user with /?archived
  return response.status(400).json({
    error:
      'No sufficient parameters or parameters which can not be used in conjunction provided.',
  });
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
 * @param  {number} frequency
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
  body('startDate').isDate(),
  body('endDate').isDate(),
  body('repetitions').isNumeric(),
  body('frequency').isInt(),
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

    if (startDate < new Date()) {
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
      frequency: request.body.frequency,
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

module.exports = router;
