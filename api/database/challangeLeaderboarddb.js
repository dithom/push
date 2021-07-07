// Import models
import ChallangeLeaderboard from '../model/ChallangeLeaderboard';

async function saveUserToLeaderboard(userid, challangeid) {
  try {
    const userLeaderboard = new ChallangeLeaderboard({
      user: userid,
      challange: challangeid,
      totalrepetitions: 0,
      timespanrepetitions: [
        {
          intervalNumber: 0,
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

async function updateTotalRepetitions(userid, challangeid) {
  const filter = { user: userid, challange: challangeid };
  const update = { $inc: { totalrepetitions: 1 } };
  try {
    // update attendee array in collection
    const challanges = await ChallangeLeaderboard.findOneAndUpdate(
      filter,
      update
    );
    console.log('updated', challanges);
    return challanges;
  } catch (error) {
    return error;
  }
}

async function updateIntervalRepetitions(userid, challangeid, currentInterval) {
  // first try to overwrite existing value
  try {
    let result = await ChallangeLeaderboard.findOneAndUpdate(
      {
        user: userid,
        challange: challangeid,
        'timespanrepetitions.intervalNumber': currentInterval,
      },
      {
        $inc: { 'timespanrepetitions.$.accomplishedRepititions': 1 },
      }
    );
    if (result === null) {
      // record not found, so create a new entry
      console.log('interval not found, create new one');
      result = await ChallangeLeaderboard.findOneAndUpdate(
        {
          user: userid,
          challange: challangeid,
          'timespanrepetitions.intervalNumber': { $ne: currentInterval },
        },
        {
          $push: {
            timespanrepetitions: {
              intervalNumber: currentInterval,
              accomplishedRepititions: 1,
            },
          },
        }
      );
    }
    return result;
  } catch (error) {
    console.log('error', error);
    return error;
  }
}

async function getChallangeLeaderboardByChallangeId(challangeid) {
  try {
    const challangeLeaderboard = await ChallangeLeaderboard.find({
      challange: challangeid,
    });
    return challangeLeaderboard;
  } catch (error) {
    return error;
  }
}

module.exports = {
  saveUserToLeaderboard,
  updateTotalRepetitions,
  updateIntervalRepetitions,
  getChallangeLeaderboardByChallangeId,
};
