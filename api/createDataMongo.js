const mongoose = require('mongoose');
const express = require('express');
// App
const app = express();

mongoose.connect('mongodb://root:root@localhost:27017/app?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log('Connection Successful!');
});

// Start server
app.listen(3000);
