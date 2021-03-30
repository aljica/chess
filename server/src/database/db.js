const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system
const { Database } = require('sqlite3').verbose();

const databasePath = path.join(__dirname, '..', 'db.sqlite');
const db = new Database(databasePath);

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS users');
  db.run('CREATE TABLE users (username TEXT NOT NULL UNIQUE, password TEXT NOT NULL)');

  const statement = db.prepare('INSERT INTO users VALUES("john", "pass1")');
  statement.run();
  statement.finalize();

  db.run('INSERT INTO users VALUES("sara", "pass2")');

  db.run('DROP TABLE IF EXISTS games');
  db.run('CREATE TABLE games (id INTEGER, playersocket1 TEXT UNIQUE, playersocket2 TEXT UNIQUE, number INTEGER, turn INTEGER)');
});

module.exports = db;
