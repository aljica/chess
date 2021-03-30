const express = require('express');
const model = require('../model.js');

const router = express.Router();

router.get('/gameList', (req, res) => {
  const games = model.allGames();
  res.status(200).json({ list: games });
});

router.get('/createGame', (req, res) => {
  const gameID = model.createGame();
  console.log('gameid from odel');
  console.log(gameID);
  res.status(200).send({ gameID });
});

router.get('/joinGame/:gameID', (req, res) => {
  console.log(req.params);
  const gameID = req.params.gameID;
  console.log('gameid');
  console.log(gameID);
  model.addPlayerToGame(gameID, req.session.socketID);
  const players = model.findGame(gameID).players;
  res.status(200).send({ list: players });
});

module.exports = { router };
