BEGIN;

TRUNCATE
  user_coins
  RESTART IDENTITY CASCADE;

INSERT INTO user_coins (coins, user_id)
VALUES
  (ARRAY ['BTC'], 1);
  
COMMIT;