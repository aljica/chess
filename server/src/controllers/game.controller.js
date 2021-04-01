const express = require('express');
const model = require('../model.js');

const router = express.Router();

router.get('/gameList', (req, res) => {
  const games = model.getGames();
  res.status(200).json({ list: games });
});

router.get('/createGame', (req, res) => {
  // Check if user already created a game in the last X seconds.
  // Should have a database table that keeps track of sessionID and timestamp of latest game creation.
  const gameID = model.createGame();
  res.status(200).send({ gameID });
});

router.get('/joinGame/:gameID', (req, res) => {
  const { gameID } = req.params;
  const { socketID } = req.sessionStore;
  const arr = Object.values(req.sessionStore);
  const x = Object.values(arr[3]);
  const y = Object.values(x);
  const p = y[1];
  let ob = JSON.parse(p);
  console.log(ob.socketID);

  console.log(p);
  const {"cookie": foo} = p;
  console.log(p[1]);
  // Make sure socketID is not undefined, if so, return 401.
  console.log('socketid from joingame');
  console.log(socketID);
  model.addPlayerToGame(gameID, socketID);
  const players = model.getPlayersInGame(gameID);
  res.status(200).send(players);
});

module.exports = { router };
