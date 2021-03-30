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
  // async-await makes this return an [object Object]?
  // remove async and db stuff and everything's fine again...
  const gameID = Math.random();
  const randomNum = Math.floor(Math.random() * 10 + 1)
  await db.run('INSERT INTO games VALUES(?, ?, ?, ?, ?)', [gameID, null, null, randomNum, 1], function(err) {
    if (err) {
      console.log(err.message);
    }
    console.log('inserted!');
  });
  const newGame = new Game();
  games[newGame.id] = newGame;
  console.log('from model');
  console.log(gameID);
  return newGame.id;
};

exports.addPlayerToGame = (id, socketID) => {
  games[id].addPlayer(socketID);
  this.io.emit('updatePlayers', games[id].players);
};

exports.allGames = () => Object.values(games);

exports.findGame = (gameID) => {
  gamesAsList = Object.values(games);
  const game = gamesAsList.filter((game) => game.id == gameID)[0];
  return game;
};

// exports.findGame = (id) => games[id];

exports.joinGame = (id, socketID) => games[id].addPlayer(socketID);
