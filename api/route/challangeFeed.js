import express from 'express';
import { body, validationResult } from 'express-validator';

// Import middleware
import auth from '../middleware/auth';
import User from '../model/User';
// Import models
import Challange from '../model/Challange';

// Define globals
const router = express.Router();

/**
 * post new feed item to challangefeed collection
 * Method: POST
 * @returns {Object} Created feed
 */
router.post('/challangeFeed', auth, async (request, response) => {
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

module.exports = router;
