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
      connections: [null, null],
      socket: null,
    };
  },
  methods: {
    checkWaiting() {
      if (this.connections[0] === null || this.connections[1] === null) return true;
      return false;
    },
    get() {
      fetch('/api/getSession')
        .then((res) => res.json())
        .then((data) => {
          console.log('socketID');
          console.log(data);
          if (this.user1 === null) {
            console.log('user1');
            this.user1 = data.socketID;
            console.log(this.user1);
          } else if (this.user2 === null) {
            console.log('user2');
            this.user2 = data.socketID;
            console.log(this.user2);
          }
        })
        .catch(console.error);
    },
  },
  created() {
    // this.get();

    this.socket = this.$root.socket;
    console.log(this.socket);
    /* this.socket.on('connection', () => {
      this.get();
    }); */
  },
};
</script>
