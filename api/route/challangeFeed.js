import express from 'express';
import { body, validationResult } from 'express-validator';

// Import middleware
import auth from '../middleware/auth';
// Import models
import ChallangeFeed from '../model/ChallangeFeed';

// Define globals
const router = express.Router();

/**
 * post new feed item to challangefeed collection
 * Method: GET
 * @returns {Array<Object>} Created feed
 */
router.get('/:id', auth, async (request, response) => {
  try {
    // Get Challange
    const challangeFeed = await ChallangeFeed.find({
      challange: request.params.id,
    });

    return response.json(challangeFeed);
  } catch (error) {
    return response.status(400).json(error);
  }
});

module.exports = router;
