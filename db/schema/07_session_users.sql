DROP TABLE IF EXISTS session_users CASCADE;

CREATE TABLE session_users (
  id SERIAL PRIMARY KEY NOT NULL,
  session_id INT REFERENCES sessions(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE
);
