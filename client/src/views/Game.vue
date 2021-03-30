<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1>Number Guess Game</h1>
    <div>
      <h1 v-if="checkWaiting()">Waiting for player</h1>
      <h1 v-else>Connected!</h1>
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
    };
  },
  methods: {
    checkWaiting() {
      console.log(this.players);
      if (this.players[0] === null || this.players[1] === null) return true;
      return false;
    },
    async join() {
      const players = await fetch('/api/joinGame')
        .then((res) => res.json())
        .then((data) => data.players)
        .catch(console.error);
      this.players = players;
    },
  },
  created() {
    this.join();

    this.socket = this.$root.socket;
    this.socket.on('updatePlayers', (players) => {
      this.players = players;
    });
  },
};
</script>
