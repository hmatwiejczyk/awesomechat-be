// server configuration
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];
// global imports
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const logger = require('morgan');
// local imports
const authRoutes = require('./routes/authRoutes');

const server = express();
// middleware
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(cookieParser());
// server.use(logger('dev'));

// cors
server.use(cors());
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin',
    'X-Requested-Width',
    'Content-Type',
    'Accept',
    'Authorization'
  );
  next();
});
// routes
server.use('/api/awesomechat/auth', authRoutes);

mongoose
  .connect(`${config.database.host}/${config.database.db}`, {
    useNewUrlParser: true
  })
  .then(() => {
    server.listen(config.server.port, () => {
      console.log(`Server is running on ${config.server.port} in ${env} mode.`);
      console.log(`Client MongoDB is connected with ${config.database.db} db.`);
    });
  })
  .catch(err => {
    console.log(err);
  });
