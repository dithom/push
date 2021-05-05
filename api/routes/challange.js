import express from 'express';
import { body, validationResult } from 'express-validator';

// Import middlewares
import auth from '../middlewares/auth';

// Import models
import Challange from '../models/Challange';

// Define globals
const router = express.Router();

/**
 * Finds one or more challanges connected to signed in user
 * Method: GET
 * @returns {Array<Object>} List of challanges
 */
router.get('/', auth, (request, response) => {
  return response.json([
    {
      name: 'Dummy challange',
      requestedFromUserId: request.userId,
    },
  ]);
});

/**
 * Creates a new challange as signed in user
 * Method: POST
 * @param  {string} name
 * @param  {string} description
 * @param  {string} category
 * @param  {Date} startDate
 * @param  {Date} endDate
 * @param  {number} frequency
 * @param  {string} frequencyUnit
 * @param  {string} visibility
 * @param {Array<string>} competitors
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
  body('frequency').isInt(),
  body('frequencyUnit').isString(),
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
      frequency: request.body.frequency,
      frequencyUnit: request.body.frequencyUnit,
      creator: request.userId,
      visibility: request.body.visibility,
      competitors: request.body.competitors,
    });

    try {
      const savedChallange = await newChallange.save();
      return response.json(savedChallange);
    } catch (error) {
      return response.json(error);
    }
  }
);

module.exports = router;
