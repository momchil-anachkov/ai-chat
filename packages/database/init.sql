CREATE TABLE chat_rooms (
  name VARCHAR(256) PRIMARY KEY NOT NULL
);

INSERT INTO chat_rooms (name) VALUES
  ('humans'),
  ('robots');

CREATE TABLE roles (
  name VARCHAR(256) PRIMARY KEY NOT NULL
);

INSERT INTO roles (name) VALUES
  ('user'),
  ('assistant');

CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY NOT NULL,
  room VARCHAR(256) REFERENCES chat_rooms (name) NOT NULL,
  username VARCHAR(256) NOT NULL,
  role VARCHAR(256) NOT NULL REFERENCES roles (name),
  text TEXT NOT NULL
);
