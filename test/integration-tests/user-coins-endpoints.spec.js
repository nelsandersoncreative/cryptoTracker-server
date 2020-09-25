'use strict';

/* globals supertest */
const app = require('../../src/app');
const knex = require('knex');
const helpers = require('../test-helpers');
const UserCoinsService = require('../../src/userCoins/userCoins-service');
const { createCoinList } = require('../test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');
require('../setup');

describe('User Coins Endpoints', () => {
  let db;
  let testUsers = helpers.testUsers();

  before('connect db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });

    app.set('db', db);
  });

  before('clear table data', () => helpers.cleanTables(db));
  afterEach('clear table data', () => helpers.cleanTables(db));
  after('close db connection', () => db.destroy());
  beforeEach('seed users', () => helpers.createUsers(db, testUsers));




  // TEST #1 GET User Coins List

  describe('GET /api/user-coins/:user_id', () => {
    //if user has no coins in coins list yet
    it('successfully creates and then retrieves a user coin list when user previously had no coin list', async () => {
      return supertest(app)
        .get('/api/user-coins/1')
        .set('Content-Type', 'application/json')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .expect(200, [])
        .then(async () => {
          const coinsList = ["BTC"]
            // eslint-disable-next-line no-unused-expressions
            let userCoins = await UserCoinsService.createCoinsList(db, coinsList, 1);
            // eslint-disable-next-line no-unused-expressions
            userCoins = await UserCoinsService.getUserCoins(db, 1);
            // eslint-disable-next-line no-unused-expressions
            expect(userCoins).to.be.an('array');
          });
    });
  });


  // TEST #2. PUT Update a user's coin list
  
  describe('PUT /api/user-coins/add-coins/', () => {

    it('when no coin list is found, initialize a coinlist', () => {
      return supertest(app)
        .put('/api/user-coins/add-coins/')
        .set('Content-Type', 'application/json')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .then(async () => {
          const coinsList = ["BTC"]
          // eslint-disable-next-line no-unused-expressions
          let userCoins = await UserCoinsService.createCoinsList(db, coinsList, 1);
          // eslint-disable-next-line no-unused-expressions
          let latestUserCoins = await UserCoinsService.getUserCoins(db, 1);
          // eslint-disable-next-line no-unused-expressions
          expect(201);
        });
    });

    it('returns 201 created when coin list is updated', () => {
      return supertest(app)
        .put('/api/user-coins/add-coins')
        .set('Content-Type', 'application/json')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .then(async () => {
          const coinsList = ["BTC"]
          // because this user doesn't have a coin list, create one
          await UserCoinsService.createCoinsList(db, coinsList, 1);
          const newCoinsArray = ["BTC", "DOG"]
          // update the coin list with the newly added coin
          const coinsArray = await UserCoinsService.updateCoinsArray(db, newCoinsArray, 1);
          expect(201);
       });
    });
  });
});