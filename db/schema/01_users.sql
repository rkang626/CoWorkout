DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  gender VARCHAR(16),
  birth_date DATE,
  weight_lbs INT,
  height_in INT,
  city VARCHAR(255),
  state VARCHAR(255),
  profile_image_url VARCHAR(255)
);
