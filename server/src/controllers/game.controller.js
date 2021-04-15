const express = require('express');
const model = require('../model.js');

const router = express.Router();

router.get('/gameList', (req, res) => {
  try {
    const games = model.getGames();
    console.log(req.sessionID);
    res.status(200).json({ list: games });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

// Post request?
router.get('/createGame', (req, res) => {
  // Check if user already created a game in the last X seconds.
  // Should have a database table that keeps track of sessionID
  // and timestamp of latest game creation.
  // This should be a post request: play as white/black, time controls etc.
  try {
    const gameID = model.createGame();
    res.status(200).send({ gameID });
  } catch (e) {
    res.sendStatus(500);
  }
});

// Should probably be a PUT request, because players are updated (although not always?)
router.get('/joinGame/:gameID', async (req, res) => {
  try {
    const { gameID } = req.params;
    const { sessionID } = req;
    const data = await model.joinGame(gameID, sessionID);
    res.status(200).send(data);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.put('/move/:gameID', async (req, res) => {
  try {
    console.log('init');
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = { router };
