const express = require('express');
const model = require('../model.js');

const router = express.Router();

router.get('/gameList', (req, res) => {
  const games = model.allGames();
  res.status(200).json({ list: games });
});

router.get('/createGame', (req, res) => {
  const gameID = model.createGame(0);
  res.status(200).send({ gameID });
});

router.get('/joinGame', (req, res) => {
  console.log('socketid');
  console.log(req.session.socketID);
  model.addPlayerToGame(0, req.session.socketID);
  const players = model.findGame(0).players;
  console.log(players);
  res.status(200).send({ list: players });
});

module.exports = { router };
