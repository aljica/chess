const express = require('express');
const model = require('../model.js');
const userModel = require('../userModel.js');

const router = express.Router();

router.get('/getSession', (req, res) => {
  console.log('logging');
  console.log(req.session);
  const { socketID } = req.session;
  console.log('socketID from api');
  console.log(socketID);
  res.status(200).send({ socketID });
});

router.post('/register', async (req, res) => {
  try {
    const { username } = req.body;
    const { password } = req.body;
    const registrationSucceeded = await userModel.addUser(username, password);
    if (registrationSucceeded === false) res.sendStatus(500);
    else res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { sessionID } = req;
    const { username } = req.body;
    const { password } = req.body;
    await userModel.userLogin(sessionID, username, password);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = { router };
