const db = require('./database/userDB');
const User = require('./models/user.model');

exports.addUser = (username, password) => {
  if (username.length === 0 || username.length > 15) return false;
  let user = new User(username, password);
  user = JSON.stringify(user);
  console.log('model', user);
  db.addUser(username, user);
};
