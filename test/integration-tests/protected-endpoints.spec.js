'use strict';

/* globals supertest */
const knex = require('knex');
const app = require('../../src/app');
const helpers = require('./../test-helpers');

describe('Protected Endpoints', function() {
  let db;
  let testUsers = helpers.testUsers();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  beforeEach('seed users', () => helpers.createUsers(db, testUsers));

  const protectedEndpoints = [
    {
      name: 'GET /api/user-coins/:user_id',
      path: '/api/user-coins/1',
      method: supertest(app).get
    },
    {
      name: 'PUT /api/user-coins/add-coins/',
      path: '/api/user-coins/add-coins/',
      method: supertest(app).put
    }
  ];

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {

// if there is no bearer token --> throw an error
      it('returns 401 "Missing bearer token" if no token provided', () => {
        return endpoint.method(endpoint.path)
          .expect(401, {message: 'Missing bearer token'});
      });

// if there is an invalid token --> throw an error      
      it('returns 401 "Unauthorized request" when invalid JWT secret', () => {
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.createAuthToken(testUsers[0], 'badSecret'))
          .expect(401, { message: 'Unauthorized request' });
      });

// if there is an invalid email --> throw an error  
      it('returns 401 "Unauthorized request" when invalid email', async () => {
        const invalidUser = await helpers.findByEmail(db, testUsers[0].user_email);
        invalidUser.user_email = 'fake@fake.fake';

        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.createAuthToken(invalidUser))
          .expect(401, { message: 'Unauthorized request' });
      });
    });
  });
});