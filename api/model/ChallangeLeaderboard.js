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
  // accomplished repitions per timespan
  timespanrepetitions: {
    type: Array,
    required: true,
    default: [
      {
        intervalNumber: 0,
        accomplishedRepititions: 0,
      },
    ],
  },
  totalrepetitions: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    default: 'passive',
    enum: ['active', 'passive'],
  },
});

module.exports = mongoose.model(
  'ChallangeLeaderboard',
  ChallangeLeaderboardSchema.plugin(idValidator)
);
