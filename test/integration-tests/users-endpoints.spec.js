'use strict';
/* globals supertest */
const app = require('../../src/app');
const knex = require('knex');
const helpers = require('../test-helpers');
const bcrypt = require('bcryptjs');
require('../setup');
const UserService = require('../../src/users/user-service');

// generate database/table data for user related endpoints
describe('User Endpoints', () => {
  let db;
  const testUsers = helpers.testUsers();

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

  // TEST SUITE #1 Register new user endpoint
  // requires user_name, user_email, user_password
  describe('POST api/users', () => {
    const requiredFields = ['user_name', 'user_email', 'user_password'];
    requiredFields.forEach(field => {

      // return 400 and error msg when field is missing
      it(`returns 400 and error message when ${field} is missing`, () => {
        const requestBody = helpers.createNewUserRequest();
        delete requestBody[field];

        return supertest(app)
          .post('/api/users/register')
          .set('Content-Type', 'application/json')
          .send(requestBody)
          .expect(400, {message: `${field} is required`});
      });
    });

    requiredFields.forEach(field => {

      // return 400 and error msg when field begins or ends with spaces
      it(`returns 400 if ${field} begins or ends with spaces`, () => {
        const requestBody = helpers.createNewUserRequest();
        requestBody[field] = ` ${requestBody[field]} `; 

        return supertest(app)
          .post('/api/users/register')
          .set('Content-Type', 'application/json')
          .send(requestBody)
          .expect(400, {message: `${field} cannot begin or end with spaces`});
      });
    });

    // return 400 and error msg if user_name is less than 3 characters
    it('returns 400 and error message if user_name is less than 3 characters', () => {
      const requestBody = helpers.createNewUserRequest();
      requestBody.user_name = 'f';

      return supertest(app)
        .post('/api/users/register')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(400, {message: {error: true, user_name: 'username must be at least 3 characters'}});
        
    });

    // return 400 and error msg when if invalid email
    it('returns 400 and error message if invalid email format', () => {
      const requestBody = helpers.createNewUserRequest();
      requestBody.user_email = 'foo.com';

      return supertest(app)
        .post('/api/users/register')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(400, {message: {error: true, user_email: 'invalid email format'}});
    });

    // return 400 and error msg when password is less than 6 chars
    it('returns 400 and error message if password less than 6 characters', () => {
      const requestBody = helpers.createNewUserRequest();
      requestBody.user_password = '12345';
      return supertest(app)
        .post('/api/users/register')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(400, {message: {error: true, user_password: 'password must be at least 6 characters'}});
    });

    // tests for if a user account uses credentials entered to register a new user
    context('when a user already exists', () => {
      before('create users', async () => await helpers.createUsers(db, testUsers));

      // 400 and error msg if same email as existing email is used
      it('returns 400 and error message if same email is used', () => {
      
        const requestBody = helpers.createNewUserRequest();
        requestBody.user_email = testUsers[0].user_email;
  
        return supertest(app)
          .post('/api/users/register')
          .set('Content-Type', 'application/json')
          .send(requestBody)
          .expect(400, {message: 'email is already in use'});
      });
    });
    
    // successful registration
    it('returns 201, user obj, location and auth headers when saved successfully', () => {
      const requestBody = helpers.createNewUserRequest();
      
      return supertest(app)
        .post('/api/users/register')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(201)
        .then(async res => {
          const savedUser = await UserService.findById(db, res.body.id);
          const expectedAuthToken = helpers.createAuthToken(savedUser).split(' ')[1];
          expect(res.headers.location).to.equal(`/api/users/${savedUser.id}`);
          expect(res.body.authToken).to.equal(expectedAuthToken);
          expect(res.body.user_name).to.equal(savedUser.user_name);
          expect(res.body.user_email).to.equal(savedUser.user_email);
          // eslint-disable-next-line no-unused-expressions
          expect(res.body.user_password).to.be.undefined;
          const isMatch = await bcrypt.compare(requestBody.user_password, savedUser.user_password);
          // eslint-disable-next-line no-unused-expressions
          expect(isMatch).to.be.true;
        });
    });
  });
});
