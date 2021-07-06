import mongoose from 'mongoose';
import idValidator from 'mongoose-id-validator';

// Child Referencing: the parent references its children.

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
    enum: ['sport', 'art', 'reading', 'music'],
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
  repetitions: {
    type: Number,
    required: true,
  },
  maximumRepetitions: {
    type: Number,
    required: true,
  },
  // wie of müssen repititions durchgeführt werden?
  intervals: {
    type: Number,
    required: true,
  },
  timespan: {
    type: String,
    required: true,
    enum: ['day', 'week', 'month'],
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
    required: true,
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
