<template>
  <div>
    <h1>Lobby</h1>
    <h2>{{ this.$store.state.count }}</h2>
    <div class="row">
        <div class="well" v-for="game in games" :key="game.id">
          <div class="row" style="text-align: center;">
            <h4>
              <span>{{ game.id }}</span>
            </h4>
          </div>
        </div>
      </div>
    <input class="btn btn-default" type="submit" v-on:click="createGame()" value="Create New Game"/>
    <h1>{{ this.random }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Lobby',
  components: {},
  data() {
    return {
      games: [],
      random: this.$store.state.count,
    };
  },
  methods: {
    async createGame() {
      try {
        const response = await fetch('/api/createGame');
        const data = await response.json();
        this.$router.push(`/game/${data.gameID}`);
      } catch (e) {
        console.log(e);
      }
    },
    getGames() {
      fetch('/api/gameList')
        .then((res) => res.json())
        .then((data) => {
          this.games = data.list;
        })
        .catch(console.error);
    },
  },
  created() {
    this.getGames();
    // this.socket = this.$root.socket;
    /* this.socket.on('randUpdate', (r) => {
      console.log('logging from updaterandom socket');
      this.random = r;
    }); */
    this.$socket.client.on('event', (data) => {
      console.log(data);
      this.$store.commit('setCount', data);
      this.random = this.$store.state.count;
    });
  },
};
</script>
