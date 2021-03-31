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
  // 0 indicates player 1's turn, 1 player 2's turn.
  // On server reset, sock1 and sock2 should be automatically reset.
  // Rows that were inserted long enough ago should migrate to a history table/be deleted.
  db.run('CREATE TABLE games (id INTEGER UNIQUE, sock1 TEXT UNIQUE, sock2 TEXT UNIQUE, FEN TEXT, moves TEXT, turn INTEGER)');
});

module.exports = db;
