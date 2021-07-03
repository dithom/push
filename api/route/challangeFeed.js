import express from 'express';
import { body, validationResult } from 'express-validator';

// Import middleware
import auth from '../middleware/auth';

// Import Db Functions
import challangeFeeddb from '../database/challangeFeeddb';

// Define globals
const router = express.Router();

/**
 * Get Challange Feed from specific challange by id
 * Method: GET
 * @returns {Array<Object>} Created feed
 */
router.get('/:id', auth, async (request, response) => {
  const challangeFeed = await challangeFeeddb.getChallangeFeedById(
    request.params.id
  );
  if (challangeFeed !== null) {
    return response.json(challangeFeed);
  }
  return response.status(400).json(challangeFeed);
});

module.exports = router;
