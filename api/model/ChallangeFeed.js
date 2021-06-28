import mongoose from 'mongoose';
import idValidator from 'mongoose-id-validator';

// Child Referencing: the parent references its children.
// TODO anderes Schema überlegen, bei einer logActivity braucht es keine message
const ChallangeFeedSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['message', 'accomplishedActivity'],
  },
  message: {
    type: String,
    required: false,
    min: 0,
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
