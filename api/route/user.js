import express from 'express';
import { ObjectID } from 'mongodb';

// Import models
import User from '../model/User';

// Import middleware
import auth from '../middleware/auth';

// Define globals
const router = express.Router();

/**
 * Returns user information for signed in user
 * Method: GET
 * @returns {Object} User
 */
router.get('/me', auth, async (request, response) => {
  const user = await User.findById(request.userId);

  if (user !== null) {
    return response.json(user);
  }

  return response.status(400).json();
});

/**
 * Updates user information for signed in user
 * Method: PATCH
 * @returns {Object} User
 */
router.patch('/me', auth, async (request, response) => {
  try {
    await User.findByIdAndUpdate(request.userId, request.body);
    const updatedUser = await User.findById(request.userId);
    return response.json(updatedUser);
  } catch (error) {
    //
  }

  return response.status(400).json();
});

/**
 * Returns user information for a user id or username
 * Method: GET
 * @returns {Object} User
 */
router.get('/:idOrUsername', auth, async (request, response) => {
  const isId = ObjectID.isValid(request.params.idOrUsername);

  try {
    let user = null;

    if (isId) {
      user = await User.findById(request.params.idOrUsername);
    } else {
      user = await User.findOne({ username: request.params.idOrUsername });
    }

    if (user !== null) {
      return response.json(user);
    }
  } catch (error) {
    //
  }

  return response.status(400).json();
});

module.exports = router;
