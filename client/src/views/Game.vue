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
    <Board :id="gameID" :fen="fen" />
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
      socket: null,
      turn: null,
    };
  },
  methods: {
    do(index) {
      console.log(index);
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
        self.fen = data.fen.FEN;
        console.log(self.fen);
      } catch (e) {
        console.log(e);
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
