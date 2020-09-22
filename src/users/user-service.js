'use strict'

const bcrypt = require('bcryptjs');

const UserService = {
  validateUserFields(user) {
    const response = {};
    const validations = {
      user_name: this.validateUserName,
      user_email: this.validateUserEmail,
      user_password: this.validateUserPassword
    };

    for (const [field, validation] of Object.entries(validations)) {
      let result = validation(user[field]);
      if (result.error) {
        response[field] = result.error;
        response.error = true;
      }
    }
    return response;
  },

  validateUserName(user_name) {
    const response = {};
    if (user_name.length < 3) {
      response.error = 'username must be at least 3 characters';
    }
    return response;
  },
  
  validateUserEmail(user_email) {
    const response = {};
    if (!/\S+@\S+/.test(user_email)) {
      response.error = 'invalid email format';
    }
    return response;
  },

  validateUserPassword(user_password) {
    const response = {};
    if (user_password.length < 6) {
      response.error = 'password must be at least 6 characters';
    }
    return response;
  },

  insert(knex, user) {
    return knex('users')
      .insert(user)
      .returning('*')
      .then(rows => rows[0]);
  },

  findById(knex, id) {
    return knex('users').where({id}).first('*');
  },

  findByEmail(knex, user_email) {
    return knex('users')
      .where({user_email})
      .first('*');
  },

  hashPassword(password) {
    return bcrypt.hash(password, 10);
  },

  serialize(user) {
    const { id, user_name, user_email } = user;
    return { id, user_name, user_email };
  }
};

module.exports = UserService;
