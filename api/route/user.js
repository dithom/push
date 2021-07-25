import express from 'express';
import { ObjectID } from 'mongodb';

// Import middleware
import auth from '../middleware/auth';

// Import models
import User from '../model/User';
import Challange from '../model/Challange';

// Define globals
const router = express.Router();

/**
 * Returns list of users matching given query parameters limited to 100.
 * Method: GET
 * @param {string} [search]
 * @param {string} [sort]
 * @param {string} [order]
 * @param {string} [limit]
 * @returns {Object} User
 */
router.get('/', auth, async (request, response) => {
  let users = [];
  const query = {};
  const options = {
    limit: 100,
  };

  if (Object.prototype.hasOwnProperty.call(request.query, 'search')) {
    query.$or = [
      {
        username: {
          $regex: request.query.search,
          $options: 'i',
        },
      },
      {
        email: {
          $regex: request.query.search,
          $options: 'i',
        },
      },
    ];
  }

  if (Object.prototype.hasOwnProperty.call(request.query, 'sort')) {
    let order = 'asc';

    if (Object.prototype.hasOwnProperty.call(request.query, 'order')) {
      order = request.query.order;
    }

    options.sort = { [request.query.sort]: order };
  }

  if (Object.prototype.hasOwnProperty.call(request.query, 'limit')) {
    options.limit = Math.min(parseInt(request.query.limit, 10), 100);
  }

  try {
    if (
      Object.keys(query).length !== 0 ||
      Object.prototype.hasOwnProperty.call(request.query, 'sort')
    ) {
      users = await User.find(query, {}, options);
    }

    return response.json(users);
  } catch (error) {
    //
  }

  return response.status(400).json();
});

/**
 * Returns user information for signed in user.
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
 * Updates user information for signed in user.
 * Method: PATCH
 * @param {string} [email]
 * @param {string} [password]
 * @param {string} [username]
 * @param {boolean} [archived]
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
 * Returns challanges associated to signed in user (creator or competitor).
 * Method: GET
 * @param {boolean} [completed]
 * @returns {Array<Object>} List of challanges
 */
router.get('/me/challanges', auth, async (request, response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const query = {
      $or: [
        {
          creator: request.userId,
        },
        {
          competitors: request.userId,
        },
      ],
      $and: [
        {
          endDate: {
            $gt: today,
          },
        },
      ],
    };

    if (Object.prototype.hasOwnProperty.call(request.query, 'completed')) {
      query.$and = [
        {
          endDate: {
            $lte: today,
          },
        },
      ];
    }

    const challanges = await Challange.find(query);

    return response.json(challanges);
  } catch (error) {
    //
  }

  return response.status(400).json();
});

/**
 * Returns user information for a user id or username.
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
