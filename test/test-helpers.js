'use strict'

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users,
      user_coins
      RESTART IDENTITY CASCADE
    `
  );
};

function createAuthToken(user, secret=process.env.JWT_SECRET, expiry=process.env.JWT_EXPIRY) {
  const token = jwt.sign({ user_id: user.user_id }, secret, {
    subject: user.user_email,
    expiresIn: expiry,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

function createNewUserRequest() {
  return {
    user_name: 'foo bar',
    user_email: 'foo@bar.com',
    user_password: '123456',
  };
};

function testUsers() {
  return [
    {
      user_name: 'John Doe',
      user_email: 'foo@bar.com',
      user_password: 'foobar123'
    },
    {
      user_name: 'Jane Smith',
      user_email: 'foo@baz.com',
      user_password: 'foobaz123'
    }
  ];
};

function createUsers(db, users) {
  const preppedUsers = users.map(user => {
    return {...user, user_password: bcrypt.hashSync(user.user_password, 1)};
  });

  return db('users')
    .insert(preppedUsers)
    .returning('*')
    .then(rows => rows);
};

function findByEmail(db, user_email) {
  return db('users').where({user_email}).first('*');
};

function createCoinList(db, user_id) {
  return db('user_coins')
    .insert({ user_id: user_id })
    .returning("*")
    .then(rows => {
    return rows[0];
    });
};
    

function updateCoinsList(db, newCoinsArray, id) {
  return db('user_coins')
  .where({ user_id: id })
  .update({
    coins: newCoinsArray
  })
  .returning("*")
  .then(rows => {
    return rows[0];
  });
};

module.exports = {
  cleanTables,
  createAuthToken,
  createNewUserRequest,
  createUsers,
  testUsers,
  findByEmail,
  createCoinList,
  updateCoinsList
};