import express from 'express';
// Import middleware
import auth from '../middleware/auth';

// Import Db Functions
import userdb from '../database/userdb';

// Import Service Functions
import leaderboardService from '../services/leaderboardService';

// Define globals
const router = express.Router();

/**
 * Set user mode to archived = true
 * Method: DELETE
 * @returns {Object} Updated user
 */

router.delete('/delete', auth, async (request, response) => {
  // Check if ID matches one in the users table and change archived to true
  const user = await userdb.findByIdAndArchive(request.userId);
  if (user !== null) {
    return response.json(user);
  }
  return response.status(400).json({
    error: 'Failed to delete User.',
  });
});

/**
 * Get highscore of specific user
 * Method: GET
 * @returns {Number} Highscore
 */

router.get('/highscore', auth, async (request, response) => {
  // Check if ID matches one in the users table and change archived to true
  const user = await userdb.getUserById(request.userId);
  if (user !== null) {
    return response.json({ highscore: user.highscore });
  }
  return response.status(400).json(user);
});

/**
 * Get Information of user(id)
 * Method: GET
 * @returns {Object} Challange
 */
router.get('/userinformation/:id', auth, async (request, response) => {
  // Check if ID matches one in the users table and change archived to true
  const user = await userdb.getUserById(request.params.id);

  if (user !== null) {
    return response.json(user);
  }
  return response.status(400).json(user);
});

/**
 * Get username of specific user by id
 * Method: GET
 * @returns {Object}  user
 */

router.get('/userinformation', auth, async (request, response) => {
  // Check if ID matches one in the users table and change archived to true
  const user = await userdb.getUserById(request.userId);
  if (user !== null) {
    return response.json(user);
  }
  return response.status(400).json(user);
});

/**
 * Get Challenge Leaderbord (Top-10)
 * Method: GET
 * @returns {Array<Object>} List of highscore and user in descending order
 */
router.get('/leaderboard', auth, async (request, response) => {
  const allUsers = await userdb.getAllUsers(request.body.userId);
  if (allUsers !== 'error') {
    const leaderboard = leaderboardService.createLeaderboard(allUsers);
    return response.json(leaderboard);
  }
  return response.status(400).json('leaderboard not found');
});

// TODO check if user is archived or not
// TODO check if not own username

/**
 * Get userinformation by email or mail
 * Method: GET
 * @returns {Object} user
 */

// TODO Add Body validation

router.post('/getAttendee', auth, async (request, response) => {
  // Check if ID matches one in the users table and change archived to true
  const user = await userdb.getUserByName(request.body.username);
  if (user !== null) {
    return response.json(user);
  }
  return response.status(400).json(user);
});

module.exports = router;
