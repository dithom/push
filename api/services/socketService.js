// Import models
import ChallangeFeed from '../model/ChallangeFeed';
import User from '../model/User';

// import utils
import formatMessage from '../utils/messagesService';
// Import Db Functions
import challangeFeeddb from '../database/challangeFeeddb';
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
          io.emit('message', formatMessage(user.username, message.text));
        })
        .catch((err) => {
          console.log(err);
        });
    });

    // Listen for chatMessage and logActivity from user
    socket.on('logMessage', (message) => {
      console.log('activity logged');
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
            formatMessage(user.username, 'has performed an activity ')
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
