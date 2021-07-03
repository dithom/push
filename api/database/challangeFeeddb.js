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

async function saveChatMessage(message) {
  try {
    const currentDate = new Date();
    const chatMessage = new ChallangeFeed({
      type: message.type,
      message: message.text,
      date: currentDate,
      user: message.userId,
      challange: message.challangeId,
    });
    chatMessage.save();
    return chatMessage;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getChallangeFeedById,
  saveChatMessage,
};
