// Import Db Functions
import userdb from '../database/userdb';
import challangedb from '../database/challangedb';
import invitationdb from '../database/invitationdb';
import challangeLeaderboarddb from '../database/challangeLeaderboarddb';

/**
 * creates invitation objects for all participants
 * @param {Object} Invitation Object
 * @returns {Array} List of Invitations
 */
async function createInvitations(invitations) {
  const invitationList = [];

  // get only the username and his/her score
  for (let i = 0; i < invitations.length; i++) {
    // get sender/receiver/challange name
    const user = await userdb.getUserById(invitations[i].sender);
    const challange = await challangedb.getChallangeById(
      invitations[i].challange
    );
    const invitationObject = {
      sender: user.username,
      challange: challange.name,
      date: invitations[0].date,
      id: invitations[0]._id,
    };
    invitationList.push(invitationObject);
  }
  return invitationList;
}

/**
 * updates answer of user in invitation and leaderboard database
 * @param {id} invitationid Object
 * @param {String} answer given answer to an invitation of user
 * @returns {Object} updated invitations
 */
async function updateInvitationAnswer(invitationid, answer) {
  const invitation = await invitationdb.getInvitationById(invitationid);
  const challange = await challangedb.getChallangeById(invitation.challange);

  // map answer to status in challange leaderboards
  let status = '';
  if (answer === 'accepted') {
    status = 'active';
  } else {
    status = 'passive';
  }

  const updatedInvitation = await invitationdb.updateInvitationStatus(
    invitation.receiver,
    challange.id,
    answer
  );

  const updatedLeaderboard = await challangeLeaderboarddb.updateInvitationStatus(
    invitation.receiver,
    challange.id,
    status
  );

  return updatedInvitation;
}

module.exports = {
  createInvitations,
  updateInvitationAnswer,
};
