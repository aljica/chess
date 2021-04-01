const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system

const databasePath = path.join(__dirname, '..', 'db.sqlite');
const db = require('better-sqlite3')('x.db', { databasePath });

db.prepare('DROP TABLE IF EXISTS games').run();
db.prepare('CREATE TABLE games (id INTEGER UNIQUE, sock1 TEXT UNIQUE, sock2 TEXT UNIQUE, FEN TEXT, moves TEXT, turn INTEGER)').run();

exports.insertNewChessGame = () => {
  const gameID = Math.random();
  const startingFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'; // Starting chess position
  try {
    db.prepare('INSERT INTO games VALUES(?, ?, ?, ?, ?, ?)').run(gameID, null, null, startingFEN, '', 0);
    return gameID;
  } catch (e) {
    return false;
  }
};

exports.getSockets = (gameID) => db.prepare('SELECT sock1, sock2 FROM games WHERE id=?').get(gameID);

exports.addPlayerSocketToGame = (gameID, socketID, sockX) => db.prepare(`UPDATE games SET ${sockX} = ? WHERE id=?`).run(socketID, gameID);

exports.getAllGames = () => db.prepare('SELECT id FROM games').all();
