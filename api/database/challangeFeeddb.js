// Import models
import ChallangeFeed from '../model/ChallangeFeed';

async function getChallangeFeedById(challangeFeedid) {
  try {
    const challange = await ChallangeFeed.find({
      challange: challangeFeedid,
    });
    return challange;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getChallangeFeedById,
};
