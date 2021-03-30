const express = require('express');
const model = require('../model.js');

const router = express.Router();

router.get('/gameList', (req, res) => {
  const games = model.allGames();
  res.status(200).json({ list: games });
});

router.get('/createGame', async (req, res) => {
  const gameID = await model.createGame();
  res.status(200).send({ gameID });
});

router.get('/joinGame/:gameID', (req, res) => {
  const gameID = req.params.gameID;
  model.addPlayerToGame(gameID, req.session.socketID);
  const players = model.findGame(gameID).players;
  res.status(200).send({ list: players });
});

module.exports = { router };