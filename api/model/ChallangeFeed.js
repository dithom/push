import mongoose from 'mongoose';
import idValidator from 'mongoose-id-validator';

// Child Referencing: the parent references its children.

const ChallangeFeedSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['message', 'accomplishedActivity', 'day', 'week', 'month'],
  },
  message: {
    type: String,
    required: true,
    min: 6,
    max: 1023,
  },
  date: {
    type: Date,
    required: true,
  },
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
});

module.exports = mongoose.model(
  'ChallangeFeed',
  ChallangeFeedSchema.plugin(idValidator)
);
