const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system

const databasePath = path.join(__dirname, '..', 'db.sqlite');
const db = require('better-sqlite3')('users.db', { databasePath });

db.prepare('DROP TABLE IF EXISTS users').run();
db.prepare('DROP TABLE IF EXISTS sessions').run();
db.prepare('CREATE TABLE users (username TEXT UNIQUE, userData TEXT)').run();
db.prepare('CREATE TABLE sessions (userid INTEGER UNIQUE, sessionid TEXT UNIQUE)').run();

exports.linkUserAndSession = (sessionID, userID) => {
  db.prepare('INSERT INTO sessions VALUES(?,?)').run(sessionID, userID);
  const data = db.prepare('SELECT * FROM sessions WHERE sessionid=?').get(sessionID);
  console.log(data);
};

exports.addUser = (username, userData) => {
  db.prepare('INSERT INTO users VALUES(?,?)').run(username, userData);
  const user = db.prepare('SELECT * FROM users WHERE username=?').get(username);
  console.log('us', user);
  const userAsObj = JSON.parse(user.userData);
  console.log(userAsObj.name);
};
