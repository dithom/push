import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import routes
import indexRoute from './routes/index';
import challangeRoute from './routes/challange';

// App
const app = express();

// dotenv
dotenv.config();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/v1', indexRoute);
app.use('/api/v1/challange', challangeRoute);

// Database
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  authSource: process.env.DB_AUTH_SOURCE,
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
