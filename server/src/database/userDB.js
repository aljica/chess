const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system

const databasePath = path.join(__dirname, '..', 'db.sqlite');
const db = require('better-sqlite3')('users.db', { databasePath });

db.prepare('DROP TABLE IF EXISTS users').run();
db.prepare('DROP TABLE IF EXISTS sessions').run();
db.prepare('CREATE TABLE users (username TEXT UNIQUE, userData TEXT)').run();
db.prepare('CREATE TABLE sessions (username INTEGER UNIQUE, sessionid TEXT UNIQUE)').run();

exports.getUser = (username) => db.prepare('SELECT userData FROM users WHERE username=?').get(username);

exports.linkUserAndSession = (sessionID, username) => {
  try {
    const currentSessionID = db.prepare('SELECT sessionid FROM sessions WHERE username=?').get(username);
    if (currentSessionID !== undefined) {
      db.prepare('UPDATE sessions SET sessionid=? WHERE username=?').run(sessionID, username);
    } else {
      db.prepare('INSERT INTO sessions VALUES(?,?)').run(username, sessionID);
    }
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

exports.addUser = (username, userData) => {
  try {
    db.prepare('INSERT INTO users VALUES(?,?)').run(username, userData);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};
