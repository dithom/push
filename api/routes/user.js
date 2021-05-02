const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const bytes = require('bytes');

router.post('/signup', async(request, response) => {
  // TODO add validation
  if (!request.body.email) {
    return response.status(400).json({
      error: 'No sufficient data provided.'
    });
  }

  // check users
  const user = await User.findOne({
    email: request.body.email
  });

  if (user) {
    return response.status(400).json({
      error: 'A user with this email already exists.'
    });
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(request.body.password, salt);

  // create new user
  const newUser = new User({
    email: request.body.email,
    password: hashedPassword,
    username: request.body.username
  });

  try {
    const savedNewUser = await newUser.save();
    return response.json(savedNewUser);
  } catch(error) {
    return response.json(error)
  }
});

router.post('/signin', async(request, response) => {
  // TODO add validation
  if (!request.body.email) {
    return response.status(400).json({
      error: 'No sufficient data provided.'
    });
  }

  // check users
  const user = await User.findOne({
    email: request.body.email
  });

  if (!user) {
    return response.status(400).json({
      error: 'Email is not valid.'
    });
  }

  const passwordIsValid = await bcrypt.compare(request.body.password,
    user.password);

  if (!passwordIsValid) {
    return response.status(400).json({
      error: 'Password is not valid.'
    });
  }

  return response.json({
    message: 'Logged in'
  });
});

module.exports = router;