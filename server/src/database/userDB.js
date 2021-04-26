const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system

const databasePath = path.join(__dirname, '..', 'db.sqlite');
const db = require('better-sqlite3')('x.db', { databasePath });

db.prepare('DROP TABLE IF EXISTS users').run();
db.prepare('DROP TABLE IF EXISTS sessions').run();
db.prepare('CREATE TABLE users (userid INTEGER UNIQUE, user TEXT)').run();
db.prepare('CREATE TABLE sessions (userid INTEGER UNIQUE, sessionid TEXT UNIQUE)').run();

exports.linkUserAndSession = (sessionID, userID) => {
  db.prepare('INSERT INTO sessions VALUES(?,?)').run(sessionID, userID);
  const data = db.prepare('SELECT * FROM sessions WHERE sessionid=?').get(sessionID);
  console.log(data);
};

exports.addUser = (userID, user) => {
  db.prepare('INSERT INTO users VALUES(?,?)').run(userID, user);
  const users = db.prepare('SELECT user FROM users WHERE userid=?').get(userID);
  console.log(users);
  const userAsObj = JSON.parse(users.user);
  console.log(userAsObj.name);
};
