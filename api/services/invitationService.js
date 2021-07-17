// Import Db Functions
import userdb from '../database/userdb';
import challangedb from '../database/challangedb';

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

module.exports = {
  createInvitations,
};
