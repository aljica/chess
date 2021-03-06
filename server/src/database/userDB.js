const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system

const databasePath = path.join(__dirname, '..', 'db.sqlite');
const db = require('better-sqlite3')('users.db', { databasePath });

function init() {
  db.prepare('DROP TABLE IF EXISTS users').run();
  db.prepare('DROP TABLE IF EXISTS sessions').run();
  db.prepare('DROP TABLE IF EXISTS stats').run();
  db.prepare('CREATE TABLE users (username TEXT UNIQUE, userData TEXT)').run();
  db.prepare('CREATE TABLE sessions (username TEXT UNIQUE, sessionid TEXT UNIQUE)').run();
  db.prepare('CREATE TABLE stats (username TEXT UNIQUE, playedgames INTEGER, won INTEGER, drawn INTEGER)').run();
}

init();

exports.getUserBySession = (sessionID) => {
  try {
    const username = db.prepare('SELECT username FROM sessions WHERE sessionid=?').get(sessionID);
    if (username === undefined) return null; // no such username-sessionid pairing exists.
    return username.username;
  } catch (e) {
    throw new Error(e);
  }
};

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

// Returns integer (number of changes - in this case deletions - made).
exports.deleteUserSession = (username) => db.prepare('DELETE FROM sessions WHERE username=?').run(username).changes;

exports.addUser = (username, userData) => {
  try {
    db.prepare('INSERT INTO users VALUES(?,?)').run(username, userData);
    db.prepare('INSERT INTO stats VALUES(?, 0, 0, 0)').run(username);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

exports.getUser = (username) => db.prepare('SELECT userData FROM users WHERE username=?').get(username);

// Value tells us what to increment
// Returns number of changes made (0 if none, 1 if succeeded)
exports.updateUserStats = (username, value) => db.prepare(`UPDATE stats SET ${value} = ${value} + 1 WHERE username=?`).run(username).changes;

exports.getUserStats = (username) => db.prepare('SELECT * FROM stats WHERE username=?').get(username);
