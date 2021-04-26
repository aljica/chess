const bcrypt = require('bcrypt');

const db = require('./database/userDB');
const User = require('./models/user.model');

exports.userLogin = (sessionID, username) => {
  try {
    return db.linkUserAndSession(sessionID, username);
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
    if (username.length === 0 || username.length > 15) throw new Error('username problem');
    if (password.length === 0 || password.length > 15) throw new Error('password problem');
    const hash = await hashPassword(password);
    let user = new User(username, hash);
    user = JSON.stringify(user);
    console.log('model', user);
    db.addUser(username, user);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
