// server configuration
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];
// server variables
const express = require('express');
const mongoose = require('mongoose');

const server = express();

mongoose
  .connect(`${config.database.host}/${config.database.db}`)
  .then(() => {
    server.listen(config.server.port, () => {
      console.log(`Server is running on ${config.server.port} in ${env} mode.`);
      console.log(`Client MongoDB is connected with ${config.database.db} db.`);
    });
  })
  .catch(err => {
    console.log(err);
  });
