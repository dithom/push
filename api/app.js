const express = require('express');
const mongoose = require('mongoose');

// app
const app = express();

// import routes
const userRoute = require('./routes/user');

// middlewares
app.use(express.json());

// routes
app.use('/api/v1/user', userRoute)

// db
mongoose.connect(
  'mongodb://root:root@db:27017/app?authSource=admin',
  {
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
app.listen(3000);