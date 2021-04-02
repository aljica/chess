const express = require('express');
const model = require('../model.js');

const router = express.Router();

router.get('/gameList', (req, res) => {
  const games = model.getGames();
  console.log(req.sessionID);
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
  const { sessionID } = req;
  console.log(sessionID);
  // console.log('sessionID', req.sessionID);
  //console.log('sessionID from joingame', req.sessionID);
  // console.log(req.sessionStore.sessions);
  // Extract socketID from request.
  // const data = Object.values(req.sessionStore);
  // const dataFilter = Object.values(data[3]);
  // console.log('datafilter');
  // console.log(dataFilter);
  // const cookie = JSON.parse(dataFilter[dataFilter.length-1]);
  // console.log(cookie);
  // const socketID = cookie.socketID;
  // console.log('socketID from api', socketID);

  // Make sure socketID is not undefined, if so, return 401.
  // console.log('socketid from joingame');
  // console.log(socketID);
  model.addPlayerToGame(gameID, sessionID);
  const players = model.getPlayersInGame(gameID);
  res.status(200).send(players);
});

module.exports = { router };
