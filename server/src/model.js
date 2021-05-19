const spawn = require('child_process').spawn;
const db = require('./database/db');
const userDB = require('./database/userDB');

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

function userExceededGameLimit(userIdentifier, gameLimit = 1) {
  const userGames = db.getGamesByUserID(userIdentifier);
  if (userGames.length >= gameLimit) return true;
  return false;
}

function getUserIdentifier(sessionID) {
  const username = userDB.getUserBySession(sessionID);
  if (username !== null) return username;
  return sessionID;
}

/**
 * Returns the user object with the given name.
 * @param {void}
 * @returns {Int/Boolean} gameID - The ID of the newly created
 * game, or false if creation not successful.
 */
exports.createGame = (sessionID) => {
  const userIdentifier = getUserIdentifier(sessionID);

  // Check if user is allowed to create a new game.
  if (userExceededGameLimit(userIdentifier)) throw new Error('User is already in max number of games, cannot create a new one.');
  /* const userGames = db.getGamesByUserID(userIdentifier);
  const gameLimit = 1; // Number of concurrent games user is allowed.
  // TODO: Should be fetched from database (premium users can play more games at once).
  console.log('userGames', userGames);
  if (userGames.length >= gameLimit) throw new Error('User is already in max number of games, cannot create a new one.'); */

  // If user is not currently in a game, let them create a new one.
  const gameID = db.insertNewChessGame();
  // this.io.emit('updateGames', this.getGames());
  // exports.io.emit("event", 4);
  return gameID;
};

// Checks if game exists & ensures user making data requests to/from the game is actually part
// of the game. Returns userIdentifier of the opposing player.
function validatePlayersAndGetOpponent(gameID, userIdentifier) {
  const players = db.getSessionIDs(gameID);
  if (players === undefined) throw new Error('no such gameID exists');
  if (players.sock1 === userIdentifier) return players.sock2;
  if (players.sock2 === userIdentifier) return players.sock1;
  throw new Error('user not part of the game');
}

exports.resign = (gameID, sessionID) => {
  const userIdentifier = getUserIdentifier(sessionID);
  try {
    // Make sure request-maker is part of the game.
    validatePlayersAndGetOpponent(gameID, userIdentifier);
    return this.endGame(gameID, userIdentifier, 'resign');
  } catch (e) {
    throw new Error('resignation failed');
  }
};

/**
 * Ends a game.
 * @param {Integer} gameID - The ID of the game
 * @param {String} userIdentifier - Username/SessionID of player making the request
 * @param {String} result - "draw" or "resign"
 * @returns {Boolean} _ - true (for success) or false for failure
 */
exports.endGame = (gameID, userIdentifier, result) => {
  let opponentIdentifier = null;
  try {
    opponentIdentifier = validatePlayersAndGetOpponent(gameID, userIdentifier);
  } catch (e) {
    throw new Error(e);
  }

  switch (result) {
    case 'resign': {
      const changes = db.deleteChessGame(gameID);
      if (changes === 0) return 'resignation unsuccessful for some reason';
      const statsChanges = userDB.updateUserStats(opponentIdentifier, 'won');
      if (statsChanges === 0) console.log('could not update user stats, user not registered?');
      this.io.in(gameID).emit('resign');
      return 'resigned successfully';
    }
    case 'draw': {
      const changes = db.deleteChessGame(gameID);
      if (changes === 0) return 'draw unsuccessful for some reason';
      const statsChange1 = userDB.updateUserStats(userIdentifier, 'drawn');
      const statsChange2 = userDB.updateUserStats(opponentIdentifier, 'drawn');
      if (statsChange1 === 0 || statsChange2 === 0) console.log('could not update user stats for draw');
      return 'draw';
    }
    default: {
      throw new Error('result is invalid');
    }
  }
};

/**
 * Returns the user object with the given name.
 * @param {Integer, String} - (gameID, socketID): ID of the game and unique ID of user's socket.
 * @returns {List/Boolean} sockets - A two-element list of socket
 * IDs, or false if there are already two players in the game.
 */
// sessionID is actually userIdentifier (per username or by sessionID).
exports.addPlayerToGame = (gameID, sessionID) => {
  console.log('sess', sessionID);
  const sockets = this.getPlayersInGame(gameID);
  if (sockets === undefined) return false;
  if (sockets.sock1 === null) {
    db.addPlayerSocketToGame(gameID, sessionID, 'sock1');
  } else if (sockets.sock2 === null) {
    if (!(sessionID === sockets.sock1)) {
      db.addPlayerSocketToGame(gameID, sessionID, 'sock2');
      userDB.updateUserStats(sessionID, 'playedgames'); // Increment # played games.
      // Get opponent (first person who joined) to update their stats.
      const player1 = validatePlayersAndGetOpponent(gameID, sessionID);
      userDB.updateUserStats(player1, 'playedgames');
    }
  }
  this.io.emit('updatePlayers', sockets);
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
    const userIdentifier = getUserIdentifier(sessionID);

    if (!userExceededGameLimit(userIdentifier)) {
      const addPlayerSucceeded = this.addPlayerToGame(gameID, userIdentifier);
      if (addPlayerSucceeded === false) return false;
    }

    const players = this.getPlayersInGame(gameID);
    const fen = this.getGameFEN(gameID).FEN;
    const legalMoves = await this.chessLogic(fen, '');
    const data = { players: players, fen: fen, legalMoves: legalMoves };
    // this.io.in(gameID).emit('playerJoined', players);
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

exports.updateGameFEN = (gameID, fen) => db.updateFEN(gameID, fen);

// This function serves to ensure whoever is trying to
// make the move is actually one of the two chess players
// and that it is their turn.
exports.correctMoveMaker = (gameID, fen, sessionID) => {
  const players = this.getPlayersInGame(gameID);
  // Extract which player's turn it is from fen:
  const fenAsList = fen.split('/');
  const gameInfo = fenAsList[fenAsList.length - 1].split(' ');
  const toMove = gameInfo[1];
  if (toMove === 'w') {
    if (players.sock1 === sessionID) return true;
  } else if (toMove === 'b') {
    if (players.sock2 === sessionID) return true;
  }
  return false;
};

exports.makeMove = async (gameID, move, sessionID) => {
  try {
    let userIdentifier = sessionID; // Identify user by sessionID or by username
    // depending on whether or not they're logged in.
    const username = userDB.getUserBySession(sessionID);
    if (username !== null) userIdentifier = username;

    let fen = this.getGameFEN(gameID); // Get game's FEN
    if (fen === undefined) return false;
    fen = fen.FEN;
    if (!this.correctMoveMaker(gameID, fen, userIdentifier)) return false;
    const data = await this.chessLogic(fen, move); // Make the move
    /*
    if (data[0] === 'checkmate') console.log('checkmate');
    if (data[0] === 'insufficient') console.log('draw');
    */
    // Below means that the move was unsuccessful for w/e reason,
    // such as move parameter being undefined
    // which could happen if API caller sends in wrong data in the PUT request's body.
    if (data.fen === undefined) return false;
    // If move = '', data.fen access will fail and error will be thrown. Good!
    this.updateGameFEN(gameID, data.fen); // Update game's FEN in DB
    if (data.checkmate) {
      const opponent = validatePlayersAndGetOpponent(gameID, userIdentifier);
      this.endGame(gameID, opponent, 'resign');
      console.log('checkmate');
    }
    if (data.insufficient) {
      this.endGame(gameID, userIdentifier, 'draw');
      console.log('drawn due to insufficient');
    }
    this.io.in(gameID).emit('moveMade', data);
    return data; // Object containing fen & legalMoves
  } catch (e) {
    throw new Error(e);
  }
};
