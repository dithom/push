// Import models
import ChallangeLeaderboard from '../model/ChallangeLeaderboard';

async function saveUserToLeaderboard(userid, challangeid) {
  try {
    const userLeaderboard = new ChallangeLeaderboard({
      user: userid,
      challange: challangeid,
      totalrepititions: 0,
      timespanrepititions: [
        {
          intervalNumber: 1,
          accomplishedRepititions: 0,
        },
      ],
    });

    userLeaderboard.save();
    return userLeaderboard;
  } catch (error) {
    return error;
  }
}

async function updateLeaderboard(userid, challangeid) {
  const filter = { user: userid, challange: challangeid };
  const update = { $inc: { totalrepititions: 1 } };
  try {
    // update attendee array in collection
    const challanges = await ChallangeLeaderboard.findOneAndUpdate(
      filter,
      update
    );
    return challanges;
  } catch (error) {
    return error;
  }
}

module.exports = {
  saveUserToLeaderboard,
  updateLeaderboard,
};
