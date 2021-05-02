const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const ResetPasswordRequestSchema = mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: 'User'
  },
  resetId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('ResetPasswordRequest',
  ResetPasswordRequestSchema);