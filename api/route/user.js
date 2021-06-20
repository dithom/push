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
 */

router.get('/highscore', auth, async (request, response) => {
  // Check if ID matches one in the users table and change archived to true
  // get all challanges associated to signed in user
  try {
    // Check if user email already exists
    const user = await User.findOne({
      _id: request.userId,
    });

    return response.json({ highscore: user.highscore });
  } catch (error) {
    return response.status(400).json(error);
  }
});

/**
 * Get username of specific user by id
 * Method: GET
 * @returns <json> user
 */

router.get('/userinformation', auth, async (request, response) => {
  // Check if ID matches one in the users table and change archived to true
  // get all challanges associated to signed in user
  try {
    // Check if user email already exists
    const user = await User.findOne({
      _id: request.userId,
    });

    return response.json(user);
  } catch (error) {
    return response.status(400).json(error);
  }
});

/**
 * Get Challenge Leaderbord (Top-10)
 * Method: GET
 * @returns {Array<Object>} List of highscore and user in descending order
 */
router.get('/leaderboard', auth, async (request, response) => {
  try {
    const Users = await User.find();
    const highscoreList = [];

    // get only the username and his/her score
    for (let i = 0; i < Users.length; i++) {
      const item = Users[i];
      const userScore = { username: item.username, highscore: item.highscore };
      highscoreList.push(userScore);
    }

    // sort by highscore in descending order
    highscoreList.sort(
      (a, b) => parseFloat(b.highscore) - parseFloat(a.highscore)
    );

    return response.json(highscoreList);
  } catch (error) {
    return response.status(400).json(error);
  }
});

/**
 * Get userinformation by email or mail
 * Method: GET
 * @returns <json> user
 */

router.post('/getAttendee', auth, async (request, response) => {
  // Check if ID matches one in the users table and change archived to true
  // get all challanges associated to signed in user
  try {
    // Check if user email already exists
    const user = await User.findOne({
      username: request.body.username,
    });
    return response.json(user);
  } catch (error) {
    return response.status(400).json(error);
  }
});

module.exports = router;
