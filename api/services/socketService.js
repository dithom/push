// import utils
import messageService from '../utils/messagesService';
import challangeService from './challangeService';
// Import Db Functions
import challangeFeeddb from '../database/challangeFeeddb';
import challangeLeaderboarddb from '../database/challangeLeaderboarddb';
import userdb from '../database/userdb';

function socketListener(io) {
  // event listeners (chatMessages and logActivity)
  io.on('connection', (socket) => {
    // Listen for chatMessage
    socket.on('chatMessage', (message) => {
      // save msg to database
      try {
        challangeFeeddb.saveChatMessage(message);
      } catch (error) {
        console.log(error);
      }
      // find username by id
      userdb
        .getUserById(message.userId)
        .then((user) => {
          // send chat message to every client
          io.emit(
            'message',
            messageService.formatMessage(user.username, message.text)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    });

    // Listen for logActivity from user
    socket.on('logMessage', (message) => {
      // save msg to database
      try {
        challangeFeeddb.saveChatMessage(message);
      } catch (error) {
        console.log(error);
      }
      // save accomplished activity to db
      challangeLeaderboarddb.updateTotalRepetitions(
        message.userId,
        message.challangeId
      );
      challangeService
        .identifyCurrentInterval(message.challangeId)
        .then((currentInterval) =>
          challangeLeaderboarddb.updateIntervalRepetitions(
            message.userId,
            message.challangeId,
            currentInterval
          )
        );

      // find username by id
      userdb
        .getUserById(message.userId)
        .then((user) => {
          // send chat message to every client
          io.emit(
            'message',
            messageService.formatMessage(
              user.username,
              'has performed an activity '
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
}
module.exports = {
  socketListener,
};
