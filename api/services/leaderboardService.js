// Import Db Functions
import invitationdb from '../database/invitationdb';
import challangeLeaderboarddb from '../database/challangeLeaderboarddb';
import challangedb from '../database/challangedb';

async function createLeaderboard(Users) {
  const highscoreList = [];

  // get only the username and his/her score
  for (let i = 0; i < Users.length; i++) {
    const item = Users[i];
    const userScore = { username: item.username, highscore: item.highscore };
    highscoreList.push(userScore);
  }

  // sort by highscore in descending order
  highscoreList.sort(
    (a, b) => parseFloat(b.highscore) - parseFloat(a.highscore)
  );
  return highscoreList;
}

async function updateInvitationAnswer(invitationid, answer) {
  const invitation = await invitationdb.getInvitationById(invitationid);
  const challange = await challangedb.getChallangeById(invitation.challange);

  const updatedInvitation = await challangeLeaderboarddb.updateInvitationStatus(
    invitation.receiver,
    challange.id,
    answer
  );
  return updatedInvitation;
}

module.exports = {
  createLeaderboard,
  updateInvitationAnswer,
};
