const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system
const { Database } = require('sqlite3').verbose();

const databasePath = path.join(__dirname, '..', 'db.sqlite');
const db = new Database(databasePath);

// Promisify sqlite3 to simplify usage of async/await
const util = require('util');
db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

async function cleanDB() {
  await db.run('DROP TABLE IF EXISTS users');
  await db.run('CREATE TABLE users (username TEXT NOT NULL UNIQUE, password TEXT NOT NULL)');
  await db.run('DROP TABLE IF EXISTS games');
  await db.run('CREATE TABLE games (id INTEGER UNIQUE, sock1 TEXT UNIQUE, sock2 TEXT UNIQUE, FEN TEXT, moves TEXT, turn INTEGER)');
};
cleanDB();

exports.insertNewChessGame = async () => {
  const gameID = Math.random();
  const startingFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'; // Starting chess position
  await db.run('INSERT INTO games VALUES(?, ?, ?, ?, ?, ?)', [gameID, null, null, startingFEN, '', 0], function(err) {
    if (err) {
      console.log(err.message);
    }
    console.log('inserted!');
  });
  return gameID;
};

exports.getSockets = async (gameID) => {
  const sockets = await db.get('SELECT sock1, sock2 FROM games WHERE id=?', [gameID], function(err, row) {
    if (err) {
      return err;
    }
    const sockets = [row.sock1, row.sock2];
    return sockets;
  });
  return sockets;
};

