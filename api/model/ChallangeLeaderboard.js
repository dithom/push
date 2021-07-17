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
  invitationstatus: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'declined', 'accepted'],
  },
});

module.exports = mongoose.model(
  'ChallangeLeaderboard',
  ChallangeLeaderboardSchema.plugin(idValidator)
);
