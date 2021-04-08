const User = require("./models/user.model");
const Game = require("./models/game.model");
const db = require("./database/db");
const spawn = require("child_process").spawn;

/**
 * unregisteredSockets is used as a temporary pool of sockets
 * that belong to users who are yet to login.
 */
let nextUnregisteredSocketID = 0;
let unregisteredSockets = {};

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
 * Add a socket.io socket to the pool of unregistered sockets
 * @param {SocketIO.Socket} socket - The socket.io socket to add to the pool.
 * @returns {Number} The ID of the socket in the pool of unregistered sockets.
 */
exports.addUnregisteredSocket = (socket) => {
  const socketID = nextUnregisteredSocketID;
  nextUnregisteredSocketID += 1;

  unregisteredSockets[socketID] = socket;
  return socketID;
};

const assignUnregisteredSocket = (socketID) => {
  const socket = unregisteredSockets[socketID];
  unregisteredSockets = Object.keys(unregisteredSockets)
    .filter((sockID) => sockID !== socketID)
    .reduce(
      (res, sockID) => ({ ...res, [sockID]: unregisteredSockets[sockID] }),
      {}
    );

  return socket;
};

/**
 * Creates a user with the given name.
 * @param {String} name - The name of the user.
 * @param {Number} socketID - An optional ID of a socket.io socket in the unregistered sockets pool.
 * @see model.addUnregisteredSocket
 * @returns {void}
 */
exports.addUser = (name, socketID = undefined) => {
  users[name] = new User(name);
  if (socketID !== undefined) {
    users[name].socket = assignUnregisteredSocket(socketID);
  }
};

/**
 * Updated the socket associated with the user with the given name.
 * @param {String} name - The name of the user.
 * @param {SocketIO.Socket} socket - A socket.io socket.
 * @returns {void}
 */
exports.updateUserSocket = (name, socket) => {
  users[name].socket = socket;
};

/**
 * Returns the user object with the given name.
 * @param {String} name - The name of the user.
 * @returns {User}
 */
exports.findUser = (name) => users[name];

/* Game Rooms Code Below */

/**
 * Returns the user object with the given name.
 * @param {void}
 * @returns {Int/Boolean} gameID - The ID of the newly created game, or false if creation not successful.
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
 * @returns {List/Boolean} sockets - A two-element list of socket IDs, or false if there are already two players in the game.
 */
exports.addPlayerToGame = (gameID, sessionID) => {
  const sockets = db.getSessionIDs(gameID);
  if (sockets.sock1 === null) {
    db.addPlayerSocketToGame(gameID, sessionID, "sock1");
  } else if (sockets.sock2 === null) {
    db.addPlayerSocketToGame(gameID, sessionID, "sock2");
  } else {
    return false;
  }
  // this.io.emit('updatePlayers', sockets);
  return sockets;
};

exports.getGameFEN = (gameID) => db.getFEN(gameID);

exports.getGames = () => {
  return db.getAllGames();
};

exports.getPlayersInGame = (gameID) => db.getSessionIDs(gameID);

exports.chessLogic = (FEN, getMoves = 'yes', move = '') => {
  const pythonProcess = spawn("python", [
    "/home/linker/Documents/programming/chess-logic/chess-logic.py",
    FEN, getMoves, move
  ]);
  let res = null;
  
  return new Promise((resolve, reject) => {
    pythonProcess.stdout.on("data", (data) => {
      if (getMoves === 'yes') {
        data = data.toString()
        let parsedData = `${data}`;
        for (let i = 0; i < data.length; i++) {
          char = data.charAt(i);
          if (char === '\'') {
            parsedData = parsedData.replace('\'', '\"');
          }
        }
        res = JSON.parse(parsedData); // Returns data as array
        resolve(res);
      } else if (getMoves === 'no') {
        const FEN = data.toString();
        if (FEN === 'failed') {
          res = 'moveFailed';
          reject(res);
        } else {
          res = FEN;
          resolve(res);
        }
      } else {
        res = 'Incorrect getMoves parameter (yes/no)';
        reject(res);
      }
    });
  });
};
