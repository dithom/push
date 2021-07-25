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
    select: false,
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
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  __v: {
    type: Number,
    select: false,
  },
});

module.exports = mongoose.model('User', UserSchema);
