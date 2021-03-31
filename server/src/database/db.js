const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system
const databasePath = path.join(__dirname, '..', 'db.sqlite');
const db = require('better-sqlite3')('x.db', {databasePath});

let stmt = db.prepare('DROP TABLE IF EXISTS games');
stmt.run();
stmt = db.prepare('CREATE TABLE games (id INTEGER UNIQUE, sock1 TEXT UNIQUE, sock2 TEXT UNIQUE, FEN TEXT, moves TEXT, turn INTEGER)');
stmt.run();

exports.insertNewChessGame = () => {
  const gameID = Math.random();
  const startingFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'; // Starting chess position
  let stmt = db.prepare('INSERT INTO games VALUES(?, ?, ?, ?, ?, ?)');
  stmt.run(gameID, null, null, startingFEN, '', 0);
  return gameID;
};

exports.getSockets = async (gameID) => {
  return await db.get('SELECT sock1, sock2 FROM games WHERE id=?', [gameID], function(err, row) {
    if (err) {
      return err;
    }
    const sockets = [row.sock1, row.sock2];
    return sockets;
  });
};

exports.addPlayerSocketToGame = async (gameID, socketID, sockX) => {
  if (sockX === 1) {
    let sql = 'INSERT INTO games (sock1) VALUES (?) WHERE id=?';
  } else if (sockX === 2) {
    let sql = 'INSERT INTO games (sock2) VALUES (?) WHERE id=?';
  } else {
    return false;
  }
  await db.run(sql, [socketID, gameID], function(err) {
    if (err) {
      return err;
    }
  });
};
