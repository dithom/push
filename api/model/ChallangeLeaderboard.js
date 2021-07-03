import mongoose from 'mongoose';
import idValidator from 'mongoose-id-validator';

const ChallangeLeaderboardSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  challange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challange',
    required: true,
  },
  totalrepititions: {
    type: Number,
    required: true,
    default: 0,
  },
  // accomplished repitions per timespan
  timespanrepititions: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model(
  'ChallangeLeaderboard',
  ChallangeLeaderboardSchema.plugin(idValidator)
);
