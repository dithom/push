import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import sendmail from 'sendmail';
import { body, validationResult } from 'express-validator';

// Import models
import User from '../models/User';
import ResetPasswordRequest from '../models/ResetPasswordRequest';

// Define globals
const router = express.Router();

/**
 * Creates a new user.
 * Method: POST
 * @param  {string} email
 * @param  {string} password
 * @param  {string} username
 * @returns {Object} Created user
 */
router.post(
  '/signup',
  body('email').isString().isEmail().isLength({ min: 6, max: 255 }),
  body('password').isString().isLength({ min: 6, max: 255 }),
  body('username').isString().isLength({ min: 6, max: 255 }),
  async (request, response) => {
    // Find validation errors and wrap them in an object
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    // Check if user email already exists
    const userEmail = await User.findOne({
      email: request.body.email,
    });

    if (userEmail) {
      return response.status(400).json({
        error: 'A user with this email already exists.',
      });
    }

    // Check if username already exists
    const userName = await User.findOne({
      username: request.body.username,
    });

    if (userName) {
      return response.status(400).json({
        error: 'A user with this username already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(request.body.password, salt);

    // Create new user
    const newUser = new User({
      email: request.body.email,
      password: hashedPassword,
      username: request.body.username,
    });

    try {
      const savedNewUser = await newUser.save();
      return response.json(savedNewUser);
    } catch (error) {
      return response.json(error);
    }
  }
);

/**
 * Signs in an existing user.
 * Method: POST
 * @param  {string} email
 * @param  {string} password
 * @returns {Object} JWT containing the user id
 */
router.post(
  '/signin',
  body('email').isString().isEmail().isLength({ min: 6, max: 255 }),
  body('password').isString().isLength({ min: 6, max: 255 }),
  async (request, response) => {
    // Find validation errors and wrap them in an object
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    // Check user
    const user = await User.findOne({
      email: request.body.email,
    });

    if (!user) {
      return response.status(400).json({
        error: 'Email is not valid.',
      });
    }

    const passwordIsValid = await bcrypt.compare(
      request.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return response.status(400).json({
        error: 'Password is not valid.',
      });
    }

    // Create and assign token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return response.header('auth-token', token).json({
      authToken: token,
    });
  }
);

/**
 * Creates a new reset password request and sends an email.
 * Method: POST
 * @param  {string} email
 * @returns {Object} Success message
 */
router.post('/forgot', async (request, response) => {
  // TODO add validation
  if (!request.body.email) {
    return response.status(400).json({
      error: 'No sufficient data provided.',
    });
  }

  // Check user
  const user = await User.findOne({
    email: request.body.email,
  });

  if (!user) {
    return response.status(400).json({
      error: 'Email is not valid.',
    });
  }

  // Delete previous requests
  try {
    await ResetPasswordRequest.deleteOne({
      email: request.body.email,
    });
  } catch (error) {
    response.json([
      {
        error: 'Failed to delete previous reset password request.',
      },
    ]);
  }

  // Create new reset request
  const resetId = uuidv4();
  const newResetPasswordRequest = new ResetPasswordRequest({
    userId: user._id,
    resetId,
  });

  try {
    const savedNewResetPasswordRequest = await newResetPasswordRequest.save();

    // Send mail
    try {
      sendmail({
        from: process.env.SENDMAIL_FROM,
        to: request.body.email,
        subject: 'Reset password',
        html: `
          Reset your password using this link:
          ${process.env.FRONTEND_URL}${process.env.FRONTEND_RESET_PASSWORD_PATH}/${resetId}
        `,
      });

      return response.json([
        {
          message: 'Mail has been sent.',
        },
        savedNewResetPasswordRequest,
      ]);
    } catch (error) {
      return response.status(400).json({
        error: 'Failed to send mail.',
      });
    }
  } catch (error) {
    return response.status(400).json(error);
  }
});

/**
 * Resets password for an existing reset password request.
 * Method: POST
 * @param  {string} resetId
 * @param {string} password
 * @returns {Object} Updated user
 */
router.post('/reset', async (request, response) => {
  // TODO add validation
  if (!request.body.password) {
    return response.status(400).json({
      error: 'No sufficient data provided.',
    });
  }

  // Check reset requests
  const resetPasswordRequest = await ResetPasswordRequest.findOne({
    resetId: request.body.resetId,
  });

  if (!resetPasswordRequest) {
    return response.status(400).json({
      error: 'Reset id is not valid.',
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(request.body.password, salt);

  try {
    // Delete requests
    await ResetPasswordRequest.deleteOne({
      _id: resetPasswordRequest._id,
    });

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: resetPasswordRequest.userId,
      },
      {
        password: hashedPassword,
      }
    );

    return response.json(updatedUser);
  } catch (error) {
    return response.status(400).json({
      error: 'Failed to reset password.',
    });
  }
});

module.exports = router;
