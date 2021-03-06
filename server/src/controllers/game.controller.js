const express = require('express');
const model = require('../model.js');

const router = express.Router();

router.get('/gameList', (req, res) => {
  try {
    const games = model.getGames();
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
    const { sessionID } = req;
    const gameID = model.createGame(sessionID);
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
    if (data === false) res.sendStatus(500);
    else res.status(200).send(data);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.put('/move/:gameID', async (req, res) => {
  try {
    const { gameID } = req.params;
    const { sessionID } = req;
    const { move } = req.body;
    const data = await model.makeMove(gameID, move, sessionID);
    if (data === false) res.sendStatus(500);
    else res.status(200).send(data);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.delete('/resign/:gameID', async (req, res) => {
  try {
    const { gameID } = req.params;
    const { sessionID } = req;
    const resign = model.resign(gameID, sessionID);
    if (resign === 'resigned successfully') res.status(200).send({ resign: 'success' });
    else res.status(500).send({ resign: 'failed' });
  } catch (e) {
    res.status(500).send({ resign: 'failed' });
  }
});

module.exports = { router };
