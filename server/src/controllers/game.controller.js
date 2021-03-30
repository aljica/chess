const express = require('express');
const model = require('../model.js');

const router = express.Router();

router.get('/random', (req, res) => {
  console.log(req.session);
});

router.get('/gameList', (req, res) => {
  const games = model.allGames();
  res.status(200).json({ list: games });
});

router.get('/createGame', (req, res) => {
  const gameID = model.createGame(0);
  res.status(200).send({ gameID });
});

module.exports = { router };
