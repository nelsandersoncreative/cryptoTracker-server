BEGIN;

TRUNCATE
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, user_email, user_password)
VALUES
  ('sampleUser', 'sampleUser1@sampleUser.com', 'foobar');
		
COMMIT;