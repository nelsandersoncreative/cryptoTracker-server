'use strict'

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router');
const userCoinsRouter = require('./userCoins/userCoins-router');
const usersRouter = require('./users/users-router');

const app = express();

// env variables for localhost and heroku
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(express.json());

app.use(cors());

// displays if app running
app.get("/", (req, res) => {
  res.send("CryptoTracker Server is running...")
});

// endpoints ... routing to respective routers.  The functions for each route use corresponding helper functions found in "services" files
app.use('/api/auth', authRouter);
app.use('/api/user-coins', userCoinsRouter);
app.use('/api/users', usersRouter);
app.use(errorHandler);

// ERROR HANDLING: SHOW DETAILED ERRORS IN DEVELOPMENT,
// NON DETAILED MESSAGES IN PRODUCTION FOR SECURITY
function errorHandler(error, req, res, next) {
  const code = error.status || 500;

  if (NODE_ENV === 'production') {
    error.message = code === 500 ? 'internal server error' : error.message;
  } else {
    console.error(error);
  }
  res.status(code).json({ message: error.message });
};

module.exports = app;
