import mongoose from 'mongoose';
import idValidator from 'mongoose-id-validator';

// Child Referencing: the parent references its children.
// TODO anderes Schema überlegen, bei einer logActivity braucht es keine message
const InvitationSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  challange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challange',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  invitationstatus: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'declined', 'accepted'],
  },
});

module.exports = mongoose.model(
  'Invitation',
  InvitationSchema.plugin(idValidator)
);
