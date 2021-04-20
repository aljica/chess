<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1>Number Guess Game</h1>
    <div v-if="checkWaiting()">
      <h1>Waiting for player</h1>
    </div>
    <div v-else>
      <h1>Connected!</h1>
    </div>
    <div>include form here for number submission depending on whose turn it is</div>
    <div v-if="this.fetchingFEN === true">
      Wait for Board
    </div>
    <div v-else>
      <Board :id="gameID" :fen="fen" />
    </div>
    <button @click="setfen()">x</button>
  </div>
</template>

<script>
import Board from '../components/Board.vue';

export default {
  name: 'Game',
  components: {
    Board,
  },
  data() {
    return {
      gameID: this.$route.params.gameID,
      waiting: true,
      players: [null, null],
      fen: null,
      fetchingFEN: true,
      socket: null,
      turn: null,
      selected: null,
      possibleMoves: [],
    };
  },
  methods: {
    numToAlpha(i) {
      const alpha = {
        1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h',
      };
      return alpha[i];
    },
    squareClicked(i, j) {
      const chosenSquare = `${this.numToAlpha(j)}${i}`; // The square (chess coordinates) user clicked
      if (chosenSquare === this.selected) {
        this.selected = null;
        console.log('piece returned to its place');
        return;
      }
      this.possibleMoves.forEach((move) => {
        const sourceSquare = `${move[0]}${move[1]}`; // move FROM square TO square. This gets the FROM square (source square).
        if (!this.selected) {
          if (chosenSquare === sourceSquare) {
            this.selected = chosenSquare;
            console.log('selected!', this.selected);
          }
        } else {
          const destinationSquare = `${move[2]}${move[3]}`; // Destination square.
          if (this.selected === sourceSquare) {
            if (chosenSquare === destinationSquare) {
              this.selected = null;
              console.log('move made!', destinationSquare);
            }
          }
        }
      });
    },
    setfen() {
      this.fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
    },
    checkWaiting() {
      if (this.players[0] === null || this.players[1] === null) return true;
      return false;
    },
    async join() {
      const self = this;
      try {
        const response = await fetch(`http://localhost:8989/api/joinGame/${this.gameID}`, { credentials: 'include' }); // 'same-origin' on credentials? if so, why?
        const data = await response.json();
        self.players[0] = data.players.sock1;
        self.players[1] = data.players.sock2;
        self.fen = data.fen;
        self.possibleMoves = data.legalMoves;
        this.fetchingFEN = false;
      } catch (e) {
        console.log('Invalid gameID');
      }
    },
  },
  created() {
    this.join();

    // this.socket = this.$root.socket;
    /* this.socket.on('updatePlayers', (players) => {
      console.log('from game socket');
      console.log(this.players);
      this.players = players;
      console.log(this.players);
    }); */
  },
};
</script>
