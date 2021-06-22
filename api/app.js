import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';

// Import routes
import indexRoute from './route/index';
import challangeRoute from './route/challange';
import userRoute from './route/user';

const socketio = require('socket.io');

// App
const app = express();
// socket. io
const server = http.createServer(app);
// create new instance attachet to the http server
const io = socketio(server, {
  cors: { origin: '*' },
});

app.get('/', function (req, res) {
  res.sendfile('index.html');
});
// event listeners
io.on('connection', (socket) => {
  // if client from the frontend connects
  console.log('a user connected');
  // Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
  socket.on('message', (message) => {
    // listen on custom events on the socket object
    console.log(message);
    // remit the message -> for all clients
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });
});
/*
http.listen(process.env.SERVER_PORT, function () {
  console.log('listening on *:3000');
});
*/
// dotenv
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1', indexRoute);
app.use('/api/v1/challange', challangeRoute);
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
