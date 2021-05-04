import mongoose from 'mongoose';

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
    required: true,
    min: 6,
    max: 255,
  },
  duration: {
    type: Number,
    required: true,
    min: 6,
    max: 1023,
  },
  frequency: {
    type: Number,
    required: true,
    min: 6,
    max: 1023,
  },
  timeunit: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  visibility: {
    type: Boolean,
    required: true,
    min: 6,
    max: 255,
  },
  attendees: {
    type: Array,
    required: true,
    min: 6,
    max: 1023,
  }
});

module.exports = mongoose.model('Challange', ChallangeSchema);
