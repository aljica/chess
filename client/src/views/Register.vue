<template>
  <div>
    <form v-on:submit="register">
      <input type="text" v-model="username">Username
      <br>
      <input type="password" v-model="password">Password
      <br>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  components: {},
  data() {
    return {
      username: null,
      password: null,
    };
  },
  methods: {
    async register() {
      console.log(this.username);
      console.log(this.password);
      try {
        const response = await fetch('/api/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: this.username, password: this.password }),
        });
        if (response.status === 200) console.log('registered');
        else console.log('failed to reg');
      } catch (e) {
        console.log('failed to register');
        this.$router.push('/register');
      }
    },
  },
};
</script>
