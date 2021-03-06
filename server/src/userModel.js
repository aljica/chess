const bcrypt = require('bcrypt');

const db = require('./database/userDB');
const gameDB = require('./database/db');
const User = require('./models/user.model');

function checkPassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

// userProfile should return username, number of played games, number of lost games,
// number of drawn games, and all gameID's of currently active games.
exports.userProfile = async (sessionID) => {
  try {
    const username = db.getUserBySession(sessionID);
    if (username === null) return false;
    const stats = db.getUserStats(username);
    const gameIDs = gameDB.getGamesByUserID(username);
    if (gameIDs !== null) {
      const data = { stats, gameIDs };
      return data;
    }
    return stats;
  } catch (e) {
    throw new Error(e);
  }
};

exports.userLogin = async (sessionID, username, password) => {
  try {
    let userData = db.getUser(username);
    if (userData === undefined) throw new Error('username does not exist');
    userData = JSON.parse(userData.userData);
    const hashedPassword = userData.password;
    const passwordsMatch = await checkPassword(password, hashedPassword);
    if (!passwordsMatch) throw new Error('passwords do not match');
    return db.linkUserAndSession(sessionID, username);
  } catch (e) {
    throw new Error(e);
  }
};

// User logout should automatically resign active games
// i.e. check if user has current active games (will be a DB table for that).
exports.userLogout = (sessionID) => {
  try {
    const username = db.getUserBySession(sessionID);
    if (username === null) return false;
    return db.deleteUserSession(username);
  } catch (e) {
    throw new Error(e);
  }
};

function hashPassword(password) {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) return reject(err);
      return resolve(hash);
    });
  });
}

exports.addUser = async (username, password) => {
  try {
    if (username.length === 0 || username.length > 15 || username === undefined) {
      throw new Error('username problem');
    }
    if (password.length === 0 || password.length > 15 || password === undefined) {
      throw new Error('password problem');
    }
    const hash = await hashPassword(password);
    let user = new User(username, hash);
    user = JSON.stringify(user);
    console.log('model', user);
    return db.addUser(username, user);
  } catch (e) {
    throw new Error(e);
  }
};
