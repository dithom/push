const jwt = require('jsonwebtoken');

// import models
const User = require('../models/User');

const auth = async (request, response, next) => {
  const token = request.header('auth-token');

  if (!token) {
    return response.status(401).json({
      error: 'Access denied'
    })
  }

  // verfiy token
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    // check user
    if (verifiedToken._id) {
      try {
        const user = await User.findOne({
          _id: verifiedToken._id
        });

        if (user) {
          request.userId = verifiedToken._id;
          return next();
        }

        return response.status(400).json({
          error: 'Failed to validate user.'
        });
      } catch(error) {
        return response.status(400).json({
          error: 'Error finding user.'
        });
      }
    }
  } catch(error) {
    return response.status(400).json({
      error: 'Token not valid.'
    });
  }
}

module.exports = auth;