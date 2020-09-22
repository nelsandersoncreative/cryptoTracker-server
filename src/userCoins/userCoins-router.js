'use strict';

const express = require('express');
const bodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');
const userCoinsRouter = express.Router();
const userCoinsService = require('./userCoins-service');
const { format } = require('morgan');


// @route   GET api/user-coins/:user_id
// @desc    Get a user's coin list (response is an array of coin_codes)
// @access  Private
// HEADERS: Auth Bearer Token
// pass in user id in params, Auth header key: Authorization value: Bearer <json web token>

userCoinsRouter
  .route('/:id')
  .get(requireAuth, async (req, res, next) => {
    const { id } = req.params;
    try {
      const coinsArray = await userCoinsService.getUserCoins(req.app.get('db'), id);

      if (!coinsArray) {
        return next({status: 404, message: `unable to find a list of coins with id: ${id}`});
      }
      res.json(coinsArray);
   } catch(err) {
      next({status: 500, message: err.message});
    }
  });


  // @route   PUT api/user-coins/add-coins/
  // @desc    Add a coin to user's coin list
  // @access  Private
  // HEADERS: Auth Bearer Token
  //pass in user_id and array of coins in req.body
  // replace the existing values in the DB with the new values

userCoinsRouter
.route('/add-coins/')
.put(requireAuth, bodyParser, async (req, res, next) => {
  const { id, coins } = req.body;

  if (!id) {
    return next({status: 400, message: 'user_id is required'});
  }
  const coinsArray = await userCoinsService.getUserCoins(req.app.get('db'), id);
  try {
      if (coinsArray.length === 0) {
        const newCoinsArray = await userCoinsService.createCoinsList(req.app.get('db'), coins, id);
        res.json(newCoinsArray);
      } else {
        const updatedCoinsArray = await userCoinsService.updateCoinsArray(req.app.get('db'), coins, id);
        res.json(updatedCoinsArray);
      }    

    } catch(err) {
    next({status: 500, message: err.message});
  }
});

// // @route   PUT api/user-coins/remove-coin/:id
// // @desc    Remove a coin from user's list
// // @access  Private
// // pass in coin code in params -- user_id and index in req.body
// // get the original array from the DB, remove the item from array by index, userCoinsService.updatecoinsArray to update array

// userCoinsRouter
// .route('/remove-coin/:coin_code')
// .put(requireAuth, bodyParser, async (req, res, next) => {
//   const { coin_code } = req.params;
//   const { id, index } = req.body;

//   if (!id || !index) {
//     return next({status: 400, message: 'user_id and index is required'});
//   }
  
//   try { 
//     const oldCoinsArray = await userCoinsService.getUserCoins(req.app.get('db'), id);
//     let newCoinsArray = oldCoinsArray[0].coins;
//     newCoinsArray.splice(index, 1);
//     const updatedCoinsArray = await userCoinsService.updateCoinsArray(req.app.get('db'), newCoinsArray, id);
//     res.json(updatedCoinsArray);
//   } catch(err) {
//     next({status: 500, message: err.message});
//   }
// });


module.exports = userCoinsRouter;
