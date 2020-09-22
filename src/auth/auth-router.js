'use strict'

const express = require('express');
const bodyParser = express.json();
const authRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth');
const AuthService = require('./auth-service');
const UserService = require('../users/user-service');

authRouter
  .route('/login')

  // @route   POST api/auth/login
  // @desc    Authorize user and get token
  // @access  Public
  // in req.body as JSON pass in: user_email, user_password

  .post(bodyParser, async (req, res, next) => {
    const { user_email, user_password } = req.body;

    if (!user_email || !user_password) {
      return next({ status: 400, message: 'Enter a username, email and password.' });
    }

    try {
      const user = await AuthService.findByEmail(req.app.get('db'), user_email);
      
      if(!user) {
        return next({ status: 401, message: 'Try again. Wrong username, email or password.'});
      }

      const isMatch = await AuthService.comparePasswords(user_password, user.user_password);

      if (!isMatch) {
        return next({ status: 401, message: 'Try again. Wrong username, email or password.'});
      }

      const sub = user.user_email;
      const payload = { user_id: user.id };
      const authToken = await AuthService.createJwt(sub, payload);

      res.json({ authToken, user: UserService.serialize(user) });
    } catch(err) {
      next({ status: 500, message: err.message });
    }
  });

// @route   DELETE api/users/remove
// @desc    Remove user
// @access  Private
// in req.body as JSON pass in: user_name, user_email, user_password; Headers: key: Authorization value: Bearer <json web token>

authRouter
  .route('/:id')
  .delete(requireAuth, async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return next({status: 400, message: 'user_id is required'});
    }
    try {
      const user = await AuthService.removeUser(req.app.get('db'), id);

      res.json({ message: `user profile deleted successfully` });

   } catch(err) {
      next({status: 500, message: err.message});
    }
  });

module.exports = authRouter;
