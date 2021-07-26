import mongoose from 'mongoose';
import idValidator from 'mongoose-id-validator';

/* TODO Find solution for accepted and declined invitations, as they dont
need to stay in the db. Maybe a clean up cronjob with a limit of 30 days?
*/

const ChallangeInvitationSchema = mongoose.Schema({
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
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'declined', 'accepted'],
  },
  __v: {
    type: Number,
    select: false,
  },
});

module.exports = mongoose.model(
  'ChallangeInvitation',
  ChallangeInvitationSchema.plugin(idValidator)
);
