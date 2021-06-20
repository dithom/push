import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Import routes
import indexRoute from './route/index';
import challangeRoute from './route/challange';
import userRoute from './route/user';
// App
const app = express();

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
app.listen(process.env.SERVER_PORT);
