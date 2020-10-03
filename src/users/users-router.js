'use strict'

const express = require('express');
const usersRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');
const AuthService = require('../auth/auth-service');
const UserService = require('./user-service');

// usersRouter
usersRouter
.route('/register')

// @route   POST api/users/register
// @desc    Register user
// @access  Public
// in req.body as JSON pass in: user_name, user_email, user_password

.post(bodyParser, async (req, res, next) => {
    const { user_name, user_email, user_password } = req.body;
    const user = { user_name, user_email, user_password };

    for (const [key, value] of Object.entries(user)) {
      if (!value) {
        return next({ status: 400, message: `${key} is required`});
      } else if (value.startsWith(' ') || value.endsWith(' ')) {
        return next({ status: 400, message: `${key} cannot begin or end with spaces`});
      }
    }

    const response = UserService.validateUserFields(user);
    if (response.error) {
      return next({ status: 400, message: response });
    }

    try {
      const emailTaken = await UserService.findByEmail(req.app.get('db'), user.user_email);
      if (emailTaken) {
        return next({ status: 400, message: 'Email is already in use' });
      }

      user.user_password = await UserService.hashPassword(user.user_password);

      const savedUser = await UserService.insert(req.app.get('db'), user);
      delete savedUser.user_password;

      const sub = savedUser.user_email;
      const payload = { user_id: savedUser.user_id };
      const authToken = await AuthService.createJwt(sub, payload);
      savedUser.authToken = authToken;

      res
        .status(201)
        .location(`/api/users/${savedUser.id}`)
        .json(savedUser);
    } catch (err) {
      next({ message: err.message });
    }
});    

  module.exports = usersRouter;
  