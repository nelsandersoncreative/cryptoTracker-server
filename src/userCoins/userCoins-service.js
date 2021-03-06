'use strict'

// Helper functions relating to user coin data for communicating with PostgreSQL database
const UserCoinsService = {
  getUserCoins(knex, user_id) {
    return knex('user_coins')
    .select('coins')  
    .where({
        user_id: user_id
      })
  },
  createCoinsList(knex, coins, id) {
    return knex('user_coins')
    .insert({ user_id: id, coins: coins })
    .returning("*")
    .then((rows) => {
      return rows[0];
    });
  },
  updateCoinsArray(knex, newCoinsArray, id) {
    return knex('user_coins')
      .where({ user_id: id })
      .update({
        coins: newCoinsArray
      })
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  }
};

module.exports = UserCoinsService;
