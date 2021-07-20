import express from 'express';

// Import middleware
import auth from '../middleware/auth';

// Import Db Functions
import challangeLeaderboarddb from '../database/challangeLeaderboarddb';
import userdb from '../database/userdb';

// Import utils
import messageService from '../utils/messagesService';
import challangeService from '../services/challangeService';

// Define globals
const router = express.Router();

/**
 * Get Challangeleaderboard from challange id
 * Method: GET
 * @returns {Array<Object>} Created feed
 */
router.get('/:id', auth, async (request, response) => {
  const challangeLeaderboard = await challangeLeaderboarddb.getChallangeLeaderboardByChallangeId(
    request.params.id
  );
  // get current interval of challange
  const currentInterval = await challangeService.identifyCurrentInterval(
    request.params.id
  );

  const leaderboard = [];
  if (challangeLeaderboard !== null) {
    for (let i = 0; i < challangeLeaderboard.length; i++) {
      // get username
      const user = await userdb.getUserById(challangeLeaderboard[i].user);

      let accomplishedRepititions = 0;
      // get repetitions of user of current interavl
      // eslint-disable-next-line func-names
      challangeLeaderboard[i].timespanrepetitions.forEach(function (interval) {
        if (currentInterval === interval.intervalNumber) {
          accomplishedRepititions = interval.accomplishedRepititions;
        }

        console.log('intervla', interval);
      });

      const userObject = messageService.formatLeaderboardRow(
        user.username,
        challangeLeaderboard[i].totalrepetitions,
        accomplishedRepititions
      );
      leaderboard.push(userObject);
    }

    console.log('leaderboard', leaderboard);
    return response.json(leaderboard);
  }
  return response.status(400).json(challangeLeaderboard);
});

module.exports = router;
