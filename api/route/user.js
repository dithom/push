import express from 'express';
// Import models
import User from '../model/User';

// Import middleware
import auth from '../middleware/auth';

// Define globals
const router = express.Router();

/**
 * Set user mode to archived = true
 * Method: DELETE
 * @returns {Object} Updated user
 */

router.delete('/delete', auth, async (request, response) => {
  // Check if ID matches one in the users table and change archived to true
  try {
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      { _id: request.userId },
      {
        archived: true,
      }
    );
    return response.json(updatedUser);
  } catch (error) {
    return response.status(400).json({
      error: 'Failed to delete User.',
    });
  }
});

/**
 * Get highscore of specific user
 * Method: GET
 * @returns {Number} Highscore


router.get('/highscore', auth, async (request, response) => {
  // Check if ID matches one in the users table and change archived to true
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
    });

    return response.json(challanges);
  } catch (error) {
    return response.status(400).json(error);
  }
});
 */

module.exports = router;
