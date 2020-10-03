'use strict'

const app = require('./app');
const { PORT, DATABASE_URL } = require('./config');
const knex = require('knex');
const { createTables } = require("./helpers/createTables");

//Connect Database
const db = knex({
  client: "pg",
  connection: DATABASE_URL,
  // debug: true
});

app.set("db", db);

// this function is in the helpers directory. Check if tables exist, if they don't run migrations
createTables(db);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
