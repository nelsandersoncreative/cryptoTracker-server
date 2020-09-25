# Crypto Tracker App

Create a wallet of cryptocurrency coins you want to follow.  See chronological visualizations of coin prices measured in days, weeks or months dating as far back as 2010 all the way to the present.

This is the backend for `cryptoTracker`.  A live version of the app can be found at [https://cryptotracker-omega.vercel.app/](https://cryptotracker-omega.vercel.app/)

The front end client can be found at [https://github.com/nelsandersoncreative/cryptotracker-client](https://github.com/nelsandersoncreative/cryptotracker-client).

## Introduction

If you'd like to learn more about Crypto Tracker, discover cryptocurrency coins you haven't heard about or just want to see general cryptocurrency prices, you have come to the right place. With this app you will be able to explore cryptocurrency coins, save the ones you like in a wallet and refer to them whenever you'd like.

## Screenshots

| Home       | Favorites   | Search     | Login       | Dashboard   | New Dash   | Results     |
|------------|-------------|------------|-------------|-------------|------------|-------------|
| <img src="/assets/cryptotracker-home-public.png" width="250"> | <img src="/assets/cryptotracker-home-favorites-public.png" width="250"> | <img src="/assets/cryptotracker-home-search-public.png" width="250"> | <img src="/assets/cryptotracker-login.png" width="250"> | <img src="/assets/cryptotracker-dashboard.png" width="250"> | <img src="/assets/cryptotracker-dashfiller.png" width="250"> | <img src="/assets/cryptotracker-search-query-public.png" width="250"> |

## Technology

#### Back End

* Node and Express
  * Authentication via JWT
  * RESTful Api
* Testing
  * Supertest (integration)
  * Mocha and Chai (unit)
* Database
  * Postgres
  * Knex.js - SQL wrapper

#### Production

Deployed via Heroku


## Set up

Major dependencies for this repo include Postgres and Node.

To get setup locally, do the following:

1. Clone this repository to your machine, `cd` into the directory and run `npm install`


2. Create the dev and test databases: 

`createdb -U postgres cryptotrackerapp`
and 
`createdb -U postgres cryptotrackerapp-test`


3. Create a `.env` and a `.env.test` file in the project root

Inside the `.env` files you'll need the following:

````
DEV_DATABASE_URL=postgresql://postgres@localhost/cryptotrackerapp
JWT_SECRET=secret
JWT_EXPIRY=1w
PORT=9000

````

Your `.env.test` will be the same except your database url will be called `TEST_DATABASE_URL`. The TEST_DATABASE_URL and MIGRATION_DB_NAME will have "test" appended to it.  Here is what env.test will look like respectively:

````
NODE_ENV=test
PORT=8000

MIGRATION_DB_HOST=localhost
MIGRATION_DB_PORT=5432
MIGRATION_DB_NAME=cryptotrackerapp-test
MIGRATION_DB_USER=postgres
TEST_DATABASE_URL="postgresql://postgres@localhost/cryptotrackerapp-test"

JWT_SECRET='super-secret'
JWT_EXPIRY='1w'


````

4. Migrations run automatically for the app itself in server.js and are imported from src > helpers > createTables.  They only create tables if tables haven't yet been created

5. Run the tests, to ensure stable build of server - `npm test`

6. Start the app - `npm run dev`