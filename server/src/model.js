const User = require('./models/user.model');
const Game = require('./models/game.model');
const db = require('./database/db');

let users = {};
let games = {};

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

exports.createGame = async () => {
  const gameID = await db.insertNewChessGame();
  const newGame = new Game();
  games[newGame.id] = newGame;
  return gameID;
};

exports.addPlayerToGame = async (gameID, socketID) => {
  /* const players = await db.get('SELECT sock1, sock2 FROM games WHERE id=?', [gameID], function(err, row) {
    const sock1 = row.sock1; const sock2 = row.sock2;
    if (sock1 === null) {
      console.log(sock1);
      // await db.run('UPDATE games SET ')
    }
  }); */
  const sockets = await db.getSockets(gameID);
  await console.log(sockets);
  return sockets;

  // games[gameID].addPlayer(socketID);
  // this.io.emit('updatePlayers', games[gameID].players);
};

exports.allGames = () => Object.values(games);

exports.findGame = (gameID) => {
  gamesAsList = Object.values(games);
  const game = gamesAsList.filter((game) => game.id == gameID)[0];
  return game;
};

exports.joinGame = (id, socketID) => games[id].addPlayer(socketID);
