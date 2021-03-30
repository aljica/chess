const express = require('express');
const model = require('../model.js');

const router = express.Router();

router.get('/gameList', (req, res) => {
  const games = model.allGames();
  res.status(200).json({ list: games });
});

router.get('/createGame', (req, res) => {
  const gameID = model.createGame()
    .then((id) => console.log(id));
  console.log('gameid from odel');
  console.log(gameID);
  res.status(200).send({ gameID });
});

router.get('/joinGame/:gameID', (req, res) => {
  const gameID = req.params.gameID;
  model.addPlayerToGame(gameID, req.session.socketID);
  const players = model.findGame(gameID).players;
  res.status(200).send({ list: players });
});

module.exports = { router };
