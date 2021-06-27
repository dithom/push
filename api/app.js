import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import formatMessage from './utils/messagesService';

// Import routes
import indexRoute from './route/index';
import challangeRoute from './route/challange';
import challangeFeedRoute from './route/challangeFeed';
import userRoute from './route/user';

// Import models
import ChallangeFeed from './model/ChallangeFeed';
import User from './model/User';

const socketio = require('socket.io');

// App
const app = express();
// socket. io
const server = http.createServer(app);
// create new instance attachet to the http server
const io = socketio(server, {
  cors: { origin: '*' },
});
const botName = 'admin';

// event listeners
io.on('connection', (socket) => {
  socket.on('joinRoom', (username) => {
    // socket -> sends to the user who is connecting -> single client
    socket.emit('message', formatMessage(botName, 'Welcome to the challange'));

    // Broadcast  -> sends to everybody but the user who is connecting
    socket.broadcast.emit(
      'message',
      formatMessage(botName, 'A User has joined the feed')
    );
  });

  // Listen for chatMessage from user
  socket.on('chatMessage', (msg) => {
    // save msg to database
    const currentDate = new Date();
    const chatMessage = new ChallangeFeed({
      type: msg.type,
      message: msg.text,
      date: currentDate,
      user: msg.userId,
      challange: msg.challangeId,
    });
    chatMessage.save();
    // find username by id
    User.findOne({
      _id: msg.userId,
    })
      .then((user) => {
        // send message to every client
        io.emit('message', formatMessage(user.username, msg.text));
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A User has left the chat')); // io -> sends to all clients
  });
});

// dotenv
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1', indexRoute);
app.use('/api/v1/challange', challangeRoute);
app.use('/api/v1/challangeFeed', challangeFeedRoute);
app.use('/api/v1/user', userRoute);

// Database
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  authSource: process.env.DB_AUTH_SOURCE,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on('error', () => {
  /* eslint-disable-next-line */
  console.error.bind(console, 'connection error:');
});

db.once('open', () => {
  /* eslint-disable-next-line */
  console.log('Successfully connected to database!');
});

// Start server
server.listen(process.env.SERVER_PORT, () =>
  console.log(`Server running on port ${process.env.SERVER_PORT}`)
);
