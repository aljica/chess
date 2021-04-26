const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system

const databasePath = path.join(__dirname, '..', 'db.sqlite');
const db = require('better-sqlite3')('users.db', { databasePath });

db.prepare('DROP TABLE IF EXISTS users').run();
db.prepare('DROP TABLE IF EXISTS sessions').run();
db.prepare('CREATE TABLE users (username TEXT UNIQUE, userData TEXT)').run();
db.prepare('CREATE TABLE sessions (username INTEGER UNIQUE, sessionid TEXT UNIQUE)').run();

exports.getUser = (username) => db.prepare('SELECT username FROM users WHERE username=?').get(username);

exports.linkUserAndSession = (sessionID, username) => {
  try {
    const user = this.getUser(username);
    if (user === undefined) throw new Error('username does not exist');
    db.prepare('INSERT INTO sessions VALUES(?,?)').run(username, sessionID);
    const data = db.prepare('SELECT * FROM sessions WHERE username=?').get(username);
    console.log('test', data);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

exports.addUser = (username, userData) => {
  try {
    db.prepare('INSERT INTO users VALUES(?,?)').run(username, userData);
  } catch (e) {
    throw new Error(e);
  }
  const user = db.prepare('SELECT * FROM users WHERE username=?').get(username);
  console.log('us', user);
  const userAsObj = JSON.parse(user.userData);
  console.log(userAsObj.name);
};
