import mongoose from 'mongoose';

// TODO Find solution for archived challanges as this is a individual user setting

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1023,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 255,
  },
  archived: {
    type: Boolean,
    required: true,
    default: false,
  },
  highscore: {
    type: Number,
    required: true,
    default: 0,
  },
  
});

module.exports = mongoose.model('User', UserSchema);
