'use strict';

/* globals supertest */
const knex = require('knex');
const app = require('../../src/app');
const helpers = require('../test-helpers');
const AuthService = require('../../src/auth/auth-service');

// generate database/table data for auth enpdpoints
describe('Auth Endpoints', function() {
  let db;
  let testUsers = helpers.testUsers();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  beforeEach('seed users', () => helpers.createUsers(db, testUsers));

  //TESTING FOR ALL AUTH ENDPOINTS -- required fields: user_email, user_password
  describe('POST /api/auth/login', () => {
    const requiredFields = ['user_name', 'user_email', 'user_password'];
    requiredFields.forEach(field => {

      // return 400 and error msg if a field is missing
      it(`returns 400 and error message when ${field} is missing`, () => {
        const requestBody = {user_name: testUser.user_name, user_email: testUser.user_email, user_password: testUser.password};
        delete requestBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .set('Content-Type', 'application/json')
          .send(requestBody)
          .expect(400, {message: 'Enter a username, email and password.'});
      });
    });

    // return a 401 if user enters invalid email
    it('return 401 when invalid email', () => {
      const requestBody = {user_name: testUser.user_name, user_email: 'fake@fake.fake', user_password: testUser.user_password};

      return supertest(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(401, {message: 'Try again. Wrong username, email or password.'});
    });

    // return 401 if user enters invalid passsword
    it('return 401 when invalid password', () => {
      const requestBody = {user_name: testUser.user_name, user_email: testUser.user_email, user_password: 'justPlainWrong'};

      return supertest(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(401, {message: 'Try again. Wrong username, email or password.'});
    });

    // return 200 if user successfully enters valid credentials
    it('return 200, authToken and user when successful', async () => {
      const user = await helpers.findByEmail(db, testUser.user_email);
      const requestBody = {user_name: testUser.user_name, user_email: testUser.user_email, user_password: testUser.user_password};
      const expectedToken = AuthService.createJwt(testUser.user_email, {user_id: user.id});

      return supertest(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(200)
        .then(res => {
          expect(res.body.authToken).to.equal(expectedToken);
          expect(res.body.user.id).to.equal(user.id);
          expect(res.body.user.user_email).to.equal(user.user_email);
          // eslint-disable-next-line no-unused-expressions
          expect(res.body.user.user_password).to.be.undefined;
        });
    });
  });
});
