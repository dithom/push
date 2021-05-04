const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const ResetPasswordRequestSchema = mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  resetId: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('ResetPasswordRequest',
  ResetPasswordRequestSchema);