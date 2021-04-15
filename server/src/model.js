const spawn = require('child_process').spawn;
const db = require('./database/db');

// Will be initialized in the exports.init function
exports.io = undefined;

/**
 * Initialize the model
 * @param { { io: SocketIO.Server} } config - The configurations needed to initialize the model.
 * @returns {void}
 */
exports.init = ({ io }) => {
  exports.io = io;
};

/**
 * Returns the user object with the given name.
 * @param {void}
 * @returns {Int/Boolean} gameID - The ID of the newly created
 * game, or false if creation not successful.
 */
exports.createGame = () => {
  const gameID = db.insertNewChessGame();
  // this.io.emit('updateGames', this.getGames());
  // exports.io.emit("event", 4);
  return gameID;
};

/**
 * Returns the user object with the given name.
 * @param {Integer, String} - (gameID, socketID): ID of the game and unique ID of user's socket.
 * @returns {List/Boolean} sockets - A two-element list of socket
 * IDs, or false if there are already two players in the game.
 */
exports.addPlayerToGame = (gameID, sessionID) => {
  const sockets = this.getPlayersInGame(gameID);
  if (sockets === undefined) return false;
  if (sockets.sock1 === null) {
    db.addPlayerSocketToGame(gameID, sessionID, 'sock1');
  } else if (sockets.sock2 === null) {
    if (sessionID === sockets.sock1) return false;
    db.addPlayerSocketToGame(gameID, sessionID, 'sock2');
  } else return false;
  // this.io.emit('updatePlayers', sockets);
  return sockets;
};

exports.getGameFEN = (gameID) => db.getFEN(gameID);

exports.getGames = () => db.getAllGames();

exports.getPlayersInGame = (gameID) => db.getSessionIDs(gameID);

function parseData(data) {
  let parsedData = `${data}`;
  // Replace all instances of single-quotes to double-quotes
  // Necessary for JSON.parse() to work, which parses
  // a string (which is parameter data's data type) to an object
  for (let i = 0; i < data.length; i += 1) {
    const char = data.charAt(i);
    if (char === '\'') parsedData = parsedData.replace('\'', '"');
  }
  return JSON.parse(parsedData);
}

exports.chessLogic = (FEN, move = '') => {
  /* If move === '', this function only returns legal moves
  If move === 'g6g7', i.e. a legit move, return dict of FEN & legalmoves.
  Otherwise, just raise an error.
  */
  const pythonProcess = spawn('python', [
    '/home/linker/Documents/programming/chess-logic/chess-logic.py',
    FEN, move,
  ]);

  return new Promise((resolve, reject) => {
    pythonProcess.stdout.on('data', (data) => {
      try {
        resolve(parseData(data.toString()));
      } catch (e) {
        reject(new Error('failed to parse data'));
      }
    });
  });
};

exports.joinGame = async (gameID, sessionID) => {
  try {
    const addPlayerSucceeded = this.addPlayerToGame(gameID, sessionID);
    if (addPlayerSucceeded === false) return false;
    const players = this.getPlayersInGame(gameID);
    const fen = this.getGameFEN(gameID).FEN;
    const legalMoves = await this.chessLogic(fen, '');
    const data = { players: players, fen: fen, legalMoves: legalMoves };
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

exports.updateGameFEN = (gameID, fen) => db.updateFEN(gameID, fen);

exports.makeMove = async (gameID, move) => {
  try {
    let fen = this.getGameFEN(gameID); // Get game's FEN
    if (fen === undefined) return false;
    fen = fen.FEN;
    const data = await this.chessLogic(fen, move); // Make the move
    // If move = '', data.fen access will fail and error will be thrown. Good!
    this.updateGameFEN(gameID, data.fen); // Update game's FEN in DB
    return data; // Object containing fen & legalMoves
  } catch (e) {
    throw new Error(e);
  }
};
