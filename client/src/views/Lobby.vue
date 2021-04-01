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
      try {
        const response = await fetch('http://localhost:8989/api/createGame');
        const data = await response.json();
        this.$router.push(`/game/${data.gameID}`);
      } catch (e) {
        console.log(e);
      }
    },
    getGames() {
      fetch('http://localhost:8989/api/gameList')
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
