<template>
  <div>
    <h1>Lobby</h1>
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
  </div>
</template>

<script>
export default {
  name: 'Lobby',
  components: {},
  data() {
    return {
      games: [],
    };
  },
  methods: {
    async createGame() {
      const gameID = await fetch('/api/createGame')
        .then((res) => res.json())
        .then((data) => data.gameID)
        .catch(console.error);
      console.log('logging from lobby');
      console.log(gameID);
      this.$router.push(`/game/${gameID}`);
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
  },
};
</script>
