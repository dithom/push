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

async function getPendingInvitationsByUserId(userid) {
  try {
    const invitations = await Invitation.find({
      $and: [{ receiver: userid }, { invitationstatus: 'pending' }],
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

async function updateInvitationStatus(userid, challangeid, answer) {
  const options = { returnNewDocument: true };
  const filter = { receiver: userid, challange: challangeid };
  const update = { $set: { invitationstatus: answer } };

  try {
    // update attendee array in collection
    const challangesLeaderboard = await Invitation.findOneAndUpdate(
      filter,
      update,
      options
    );

    return challangesLeaderboard;
  } catch (error) {
    return error;
  }
}

module.exports = {
  saveInvitation,
  getPendingInvitationsByUserId,
  getInvitationById,
  updateInvitationStatus,
};
