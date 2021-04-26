const db = require('./database/userDB');
const User = require('./models/user.model');

const bcrypt = require('bcrypt');
const saltRounds = 10;

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
}

exports.addUser = async (username, password) => {
  let user = null;
  const hash = await hashPassword(password);
  console.log(hash);

  try {
    user = new User(username, hash);
  } catch (e) {
    console.log(e);
    return false;
  }
  user = JSON.stringify(user);
  console.log('model', user);
  db.addUser(username, user);
};
