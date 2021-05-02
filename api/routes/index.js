const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const sendmail = require('sendmail')();

// import models
const User = require('../models/User');
const ResetPasswordRequest = require('../models/ResetPasswordRequest');

/*
Endpoint: Signup
Method: POST
Parameters:
  - email
  - password

Creates a new user
*/
router.post('/signup', async(request, response) => {
  // TODO add validation
  if (!request.body.email) {
    return response.status(400).json({
      error: 'No sufficient data provided.'
    });
  }

  // check user
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

/*
Endpoint: Signin
Method: POST
Parameters:
  - email
  - password

Returns a JWT containing the user id
*/
router.post('/signin', async(request, response) => {
  // TODO add validation
  if (!request.body.email) {
    return response.status(400).json({
      error: 'No sufficient data provided.'
    });
  }

  // check user
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

  // create and assign token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return response.header('auth-token', token).json({
    authToken: token
  });
});

/*
Endpoint: Forgot password
Method: POST
Parameters:
  - email

Creates a new reset password request and sends a mail
*/
router.post('/forgot', async(request, response) => {
  // TODO add validation
  if (!request.body.email) {
    return response.status(400).json({
      error: 'No sufficient data provided.'
    });
  }

  // check user
  const user = await User.findOne({
    email: request.body.email
  });

  if (!user) {
    return response.status(400).json({
      error: 'Email is not valid.'
    });
  }

  // delete previous requests
  await ResetPasswordRequest.deleteOne({
    email: request.body.email
  });

  // create new reset request
  const resetId = uuidv4();
  const newResetPasswordRequest = new ResetPasswordRequest({
    userId: user._id,
    resetId: resetId
  });

  try {
    const savedNewResetPasswordRequest = await newResetPasswordRequest.save();

    // send mail
    try {
      sendmail({
        from: process.env.SENDMAIL_FROM,
        to: request.body.email,
        subject: 'Reset password',
        html: `
          Reset your password using this link:
          http://localhost/reset-password/${ resetId }
        `,
      });

      return response.json([
        {
          message: 'Mail has been sent.'
        },
        savedNewResetPasswordRequest
      ]);
    } catch(error) {
      return response.status(400).json({
        error: 'Failed to send mail.'
      });
    }
  } catch(error) {
    return response.status(400).json(error)
  }
});

/*
Endpoint: Reset password
Method: POST
Parameters:
  - resetId
  - password

Resets password for an existing reset password request
*/
router.post('/reset', async(request, response) => {
  // TODO add validation
  if (!request.body.password) {
    return response.status(400).json({
      error: 'No sufficient data provided.'
    });
  }

  // check reset requests
  const resetPasswordRequest = await ResetPasswordRequest.findOne({
    resetId: request.body.resetId
  });

  if (!resetPasswordRequest) {
    return response.status(400).json({
      error: 'Reset id is not valid.'
    });
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(request.body.password, salt);

  try {
    const updatedUser = await User.findOneAndUpdate({
      _id: resetPasswordRequest.userId
    },
    {
      password: hashedPassword
    });

    return response.json(updatedUser);
  } catch(error) {
    return response.status(400).json({
      error: 'Failed to reset password.'
    });
  }
});

module.exports = router;