// Import models
import Invitation from '../model/Invitation';

async function saveInvitation(invitation, competitorId, challangeId) {
  const currentDate = new Date();
  const newInvitation = new Invitation({
    sender: invitation.userId,
    receiver: competitorId,
    date: currentDate,
    challange: challangeId,
  });
  try {
    const savedInvitation = await newInvitation.save();
    return savedInvitation;
  } catch (error) {
    return error;
  }
}

async function getInvitationsByUserId(userid) {
  try {
    const invitations = await Invitation.find({
      receiver: userid,
    });
    return invitations;
  } catch (error) {
    return error;
  }
}

async function getInvitationById(invitationid) {
  try {
    const invitation = await Invitation.findOne({
      _id: invitationid,
    });
    return invitation;
  } catch (error) {
    return error;
  }
}

module.exports = {
  saveInvitation,
  getInvitationsByUserId,
  getInvitationById,
};
