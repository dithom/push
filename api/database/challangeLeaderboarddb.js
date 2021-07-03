// Import models
import ChallangeLeaderboard from '../model/ChallangeLeaderboard';

async function saveAttendeetoLeaderboard(userid, challangeid) {
  try {
    const userLeaderboard = new ChallangeLeaderboard({
      user: userid,
      challange: challangeid,
      totalrepititions: 0,
      timespanrepititions: 0,
    });

    userLeaderboard.save();
    return userLeaderboard;
  } catch (error) {
    return error;
  }
}

module.exports = {
  saveAttendeetoLeaderboard,
};
