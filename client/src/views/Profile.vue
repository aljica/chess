<template>
  <div>
    <span v-if="usernameIsNull()">Not logged in</span>
    <div v-else>
      <span>Username: {{ this.username }}</span>
      <br>
      <span>Played Games: {{ this.playedgames }}</span>
      <br>
      <span>Won Games: {{ this.wongames }}</span>
      <br>
      <span>Drawn Games: {{ this.drawngames }}</span>
      <br>
      <span>Active Games: {{ this.gameids }}</span>
      <br>
      <button @click="logout()">
        Logout
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  components: {},
  data() {
    return {
      username: null,
      playedgames: null,
      wongames: null,
      drawngames: null,
      gameids: null,
    };
  },
  methods: {
    usernameIsNull() {
      if (this.username === null) return true;
      return false;
    },
    async getProfile() {
      try {
        const response = await fetch('/api/profile/');
        const data = await response.json();
        console.log('data', data);
        this.username = data.stats.username;
        this.playedgames = data.stats.playedgames;
        this.wongames = data.stats.won;
        this.drawngames = data.stats.drawn;
        this.gameids = data.gameIDs;
      } catch (e) {
        console.log('not logged in');
      }
    },
    logout() {
      fetch('/api/logout');
      this.username = null;
    },
  },
  created() {
    this.getProfile();
  },
};
</script>
