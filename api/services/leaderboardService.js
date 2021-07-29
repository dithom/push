// Import Db Functions
import invitationdb from '../database/invitationdb';
import challangeLeaderboarddb from '../database/challangeLeaderboarddb';
import challangedb from '../database/challangedb';

/**
 * create leaderboard of all users, sort by highscore
 * @param {Object} Users Object
 * @returns {Array} leaderboard sorted by highscore
 */
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

/**
 * update invitation answer in challange leaderboard
 * @param {id} invitationid Object
 * @param {String} answer given answer to an invitation of user
 * @returns {object} updated invitation
 */
async function updateInvitationAnswer(invitationid, answer) {
  const invitation = await invitationdb.getInvitationById(invitationid);
  const challange = await challangedb.getChallangeById(invitation.challange);

  const updatedLeaderboard = await challangeLeaderboarddb.updateInvitationStatus(
    invitation.receiver,
    challange.id,
    answer
  );
  return updatedLeaderboard;
}

module.exports = {
  createLeaderboard,
  updateInvitationAnswer,
};
