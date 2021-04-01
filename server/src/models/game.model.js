/**
 * @class Game
 */
class Game {
  constructor() {
    this.id = Math.random();
    this.number = Math.floor(Math.random() * 10 + 1);
    this.players = [null, null]; // SocketIDs
    this.socketID = null;
    this.numGuesses = 0;
    this.turn = 0; // Whose turn it is
  }

  addPlayer(socketID) {
    if (this.players[0] === null) {
      this.players[0] = socketID;
    } else if (this.players[1] === null && this.players[0] !== socketID) {
      this.players[1] = socketID;
    }
  }

  checkGuess(guess) {
    return guess === this.number;
  }
}

module.exports = Game;
