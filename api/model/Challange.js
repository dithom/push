import mongoose from 'mongoose';
import idValidator from 'mongoose-id-validator';

const ChallangeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  description: {
    type: String,
    required: true,
    min: 6,
    max: 1023,
  },
  category: {
    type: String,
    enum: ['sports'],
    default: 'sports',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  frequency: {
    type: Number,
    required: true,
  },
  frequencyUnit: {
    type: String,
    required: true,
    enum: ['minute', 'hour', 'day', 'month'],
    default: 'day',
  },
  visibility: {
    type: String,
    required: true,
    enum: ['public', 'private'],
    default: 'public',
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  competitors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model(
  'Challange',
  ChallangeSchema.plugin(idValidator)
);
