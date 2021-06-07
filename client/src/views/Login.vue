<template>
  <div>
    <form v-on:submit="login">
      <input type="text" v-model="username">Username
      <br>
      <input type="password" v-model="password">Password
      <br>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {},
  data() {
    return {
      username: null,
      password: null,
    };
  },
  methods: {
    async login() {
      console.log(this.username);
      console.log(this.password);
      try {
        const response = await fetch('/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: this.username, password: this.password }),
        });
        if (response.status === 200) console.log('logged in');
        else console.log('failed to login');
      } catch (e) {
        console.log('failed to login');
        this.$router.push('/login');
      }
    },
  },
};
</script>
