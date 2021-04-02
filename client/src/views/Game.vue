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
  </div>
</template>

<script>
export default {
  name: 'Game',
  components: {},
  data() {
    return {
      gameID: this.$route.params.gameID,
      waiting: true,
      players: [null, null],
      socket: null,
      turn: null,
    };
  },
  methods: {
    checkWaiting() {
      if (this.players[0] === null || this.players[1] === null) return true;
      return false;
    },
    async join() {
      const self = this;
      try {
        const response = await fetch(`http://localhost:8989/api/joinGame/${this.gameID}`, { credentials: 'include' }); // 'same-origin' on credentials? if so, why? 'include' doesn't send sessionID, why?
        const data = await response.json();
        self.players = data.players;
        console.log(self.players);
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
