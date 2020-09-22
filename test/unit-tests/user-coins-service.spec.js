'use strict'

require('../setup');
const helpers = require('../test-helpers');
const UserCoinsService = require('../../src/userCoins/userCoins-service');
const knex = require('knex');

// Testing User Coins Service
describe('UserCoinsService', () => {
  let db;
  const testUsers = helpers.testUsers();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before('clean db', () => helpers.cleanTables(db));
  after('close db', () => db.destroy());
  
  beforeEach('create users', () => helpers.createUsers(db, testUsers));
  afterEach('clean db', () => helpers.cleanTables(db));

  describe('findCurrentByUserId', () => {

    // 1. when no coins list exists for a user --> it should return an array with a length of 0
    context('when no coins exist for a user', () => {
      it('returns an array with a length of zero', async () => {
        const user_id = 1;
        const coins = await UserCoinsService.getUserCoins(db, user_id);
        // eslint-disable-next-line no-unused-expressions
        expect(coins.length).to.be.equal(0);
      });
    });

    // 2. when a user coin list exists --> returns { coins: [] }
    context('when a user coinslist exists', () => {
      it('returns an array with a length > 0', async () => {
        const user_id = 1;
        const oldCoinsArray = ["DOG", "404"]
        const newCoinsArray = ["BTC"];
        await UserCoinsService.createCoinsList(db, oldCoinsArray, user_id);
        const addCoin = await UserCoinsService.updateCoinsArray(db, newCoinsArray, user_id);
        // eslint-disable-next-line no-unused-expressions
        const updatedArray = await UserCoinsService.getUserCoins(db, user_id);
        expect(updatedArray[0].coins.length > 0).to.be.true;
      });
    });
  });
});










    
