import mongoose from 'mongoose';

const ResetPasswordRequestSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
