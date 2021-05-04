import mongoose from 'mongoose';

const ResetPasswordRequestSchema = mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
  },
  resetId: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model(
  'ResetPasswordRequest',
  ResetPasswordRequestSchema
);
