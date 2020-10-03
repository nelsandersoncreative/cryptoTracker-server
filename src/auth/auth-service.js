'use strict'

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

// Helper functions relating to authorization (login/registration) for communicating with PostgreSQL database
const AuthService = {
  findByEmail(knex, user_email) {
    return knex('users').where({user_email}).first('*');
  },

  comparePasswords(loginPassword, savedPassword) {
    return bcrypt.compare(loginPassword, savedPassword);
  },

  createJwt(subject, payload) {
    return jwt.sign(payload, JWT_SECRET, {
      subject, 
      expiresIn: JWT_EXPIRY,
      algorithm: 'HS256'
    });
  },

  removeUser(knex, user_id) {
    return knex('users').where({ 'id': user_id}).del();
  },

  verifyJwt(token) {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    });
  },

};

module.exports = AuthService;
