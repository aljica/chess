const express = require('express');
const model = require('../model.js');

const router = express.Router();

router.get('/getSession', (req, res) => {
  console.log('logging');
  console.log(req.session);
  const socketID = req.session.socketID;
  console.log('socketID from api');
  console.log(socketID);
  res.status(200).send({ socketID });
});

module.exports = { router };
