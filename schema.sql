DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS articles_categories CASCADE;

CREATE TABLE categories(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) NOT NULL
);

GRANT ALL ON TABLE categories TO admindev;

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  avatar varchar(50) NOT NULL
);

GRANT ALL ON TABLE users TO admindev;

CREATE TABLE articles(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  fullText text NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  picture varchar(50) NOT NULL,
  user_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

GRANT ALL ON TABLE articles TO admindev;

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text text NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  article_id integer NOT NULL,
  user_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

GRANT ALL ON TABLE comments TO admindev;

CREATE TABLE articles_categories(
  article_id integer NOT NULL,
  category_id integer NOT NULL,
  PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

GRANT ALL ON TABLE articles_categories TO admindev;

CREATE INDEX ON articles(title);
