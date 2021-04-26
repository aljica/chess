const db = require('./database/userDB');
const User = require('./models/user.model');

const bcrypt = require('bcrypt');
const saltRounds = 10;

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) return reject(err);
      return resolve(hash);
    });
  });
}

exports.addUser = async (username, password) => {
  let hash = null;
  try {
    if (username.length === 0 || username.length > 15) throw new Error('username problem');
    if (password.length === 0 || password.length > 15) throw new Error('password problem');
    hash = await hashPassword(password);
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
