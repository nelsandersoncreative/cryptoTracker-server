'use strict'

const setDatabaseUrl = env => {
  if (env === 'production') {
    return process.env.DATABASE_URL;
  } else if (env === 'development') {
    return process.env.DEV_DATABASE_URL;
  } else {
    return process.env.TEST_DATABASE_URL;
  }
};

module.exports = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: setDatabaseUrl(process.env.NODE_ENV) || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY
};
