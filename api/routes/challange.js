import express from 'express';
import { body, validationResult } from 'express-validator';
// Import middlewares
import auth from '../middlewares/auth';

// Import models
import Challange from '../models/challange';

// Define globals
const router = express.Router();

router.get('/', auth, (request, response) => {
  return response.json([
    {
      name: 'Dummy challange',
      requestedFromUserId: request.userId,
    },
  ]);
});

/**
 * Creates a new challenge
 * Method: POST
 * @param  {string} name
 * @param  {string} description
 * @param  {string} category
 * @param  {Integer} duration
 * @param  {Integer} frequency
 * @param  {string} timeunit
 * @param  {boolean} visibility
 * @param {Array} attendees
 * @returns {object} Created user
 */

router.post(
  '/create',
  auth,
  body('name').isString(),
  body('description').isString(),
  body('category').isString(),
  body('duration').isInt(),
  body('frequency').isInt(),
  body('timeunit').isString(),
  body('visibility').isBoolean(),
  body('attendees').isArray(),
  async (request, response) => {
    // Find validation errors and wrap them in an object
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    // Create new challange
    const newChallange = new Challange({
      name: request.body.name,
      description: request.body.description,
      category: request.body.category,
      duration: request.body.duration,
      frequency: request.body.frequency,
      timeunit: request.body.timeunit,
      visibility: request.body.visibility,
      attendees: request.body.attendees,
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
