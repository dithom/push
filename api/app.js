const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// app
const app = express();

// dotenv
dotenv.config();

// import routes
const challangeRoute = require('./routes/challange');
const userRoute = require('./routes/user');

// middlewares
app.use(express.json());

// routes
app.use('/api/v1/challange', challangeRoute)
app.use('/api/v1/user', userRoute)

// db
mongoose.connect(
  `mongodb://${ process.env.DB_HOST }:${ process.env.DB_PORT }`,
  {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    authSource: process.env.DB_AUTH_SOURCE,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on('error', () => {
  console.error.bind(console, 'connection error:');
});

db.once('open', () => {
  console.log('Successfully connected to database!');
});

// start server
app.listen(process.env.SERVER_PORT);