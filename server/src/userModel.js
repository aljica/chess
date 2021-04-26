const db = require('./database/userDB');
const User = require('./models/user.model');

exports.addUser = (username) => {
  if (username.length === 0 || username.length > 15) return false;
  let user = new User(username);
  const userID = user.getID();
  user = JSON.stringify(user);
  console.log('model', user);
  db.addUser(userID, user);
};
