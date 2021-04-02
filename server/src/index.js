// enhances log messages with timestamps etc
const betterLogging = require('better-logging');

const { Theme } = betterLogging;
betterLogging(console, {
  color: Theme.green,
});

const path = require('path'); // helper library for resolving relative paths
const expressSession = require('express-session');
const socketIOSession = require('express-socket.io-session');
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');

console.logLevel = 4; // Enables debug output
const publicPath = path.join(__dirname, '..', '..', 'client', 'dist');
const port = 8989; // The port that the server will listen to
const app = express(); // Creates express app

const httpServer = http.Server(app);
const io = require('socket.io')(httpServer); // Creates socket.io app

// Required 
var cors = require('cors');

// Add headers. So that frontend can access backend API.
const corsOptions = {
  origin: true,
  allowedHeaders: true,
  credentials: true
};
app.use(cors(corsOptions));

// Setup middleware
app.use(betterLogging.expressMiddleware(console, {
  ip: { show: true, color: Theme.green.base },
  method: { show: true, color: Theme.green.base },
  header: { show: false },
  path: { show: true },
  body: { show: true },
}));
app.use(express.json()); /*
This is a middleware that parses the body of the request into a javascript object.
It's basically just replacing the body property like this:
req.body = JSON.parse(req.body)
*/
app.use(express.urlencoded({ extended: true }));

// Setup session
const session = expressSession({
  name: 'myCookie',
  secret: 'I am secret', // Must be a random string!
  resave: true,
  saveUninitialized: true,
});
app.use(session);
io.use(socketIOSession(session, {
  autoSave: true,
  saveUninitialized: true,
}));

// Serve client
//app.use(express.static(publicPath));

// Bind REST controllers to /api/*
const game = require('./controllers/game.controller.js');
const auth = require('./controllers/auth.controller.js');

app.use('/api', game.router);
app.use('/api', auth.router);

// Init model
const model = require('./model.js');

model.init({ io });

// Handle connected socket.io sockets
io.on('connection', (socket) => {
  //console.log('unique socketid', socket.id);
  //console.log('express-sessionID from socket', socket.handshake.sessionID);
  // console.log('entire socket handshake', socket.handshake);

  //socket.on('updateRandom', 4);
  /*socket.on('updateRandom', (data) => {
    console.log(data);
    io.emit('event', data);
  });*/

  socket.on('disconnect', () => console.log('disconnected'));
});

// Start server
httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
