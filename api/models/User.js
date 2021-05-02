const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 5,
    max: 255
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  username: {
    type: String,
    required: true,
    min: 6,
    max: 255
  }
});

module.exports = mongoose.model('User', UserSchema);