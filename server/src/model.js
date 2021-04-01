const User = require('./models/user.model');
const Game = require('./models/game.model');
const db = require('./database/db');

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
      {},
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
exports.createGame = () => db.insertNewChessGame();

/**
 * Returns the user object with the given name.
 * @param {Integer, String} - (gameID, socketID): ID of the game and unique ID of user's socket.
 * @returns {List/Boolean} sockets - A two-element list of socket IDs, or false if there are already two players in the game.
 */
exports.addPlayerToGame = (gameID, socketID) => {
  const sockets = db.getSockets(gameID);
  if (sockets.sock1 === null) {
    db.addPlayerSocketToGame(gameID, socketID, 'sock1');
  } else if (sockets.sock2 === null) {
    db.addPlayerSocketToGame(gameID, socketID, 'sock2');
  } else {
    return false;
  }
  return sockets;
  // this.io.emit('updatePlayers', games[gameID].players);
};

exports.getGames = () => db.getAllGames();

exports.getPlayersInGame = (gameID) => db.getSockets(gameID);
