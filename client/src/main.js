import Vue from 'vue';
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: io('http://localhost:8989', { transports: ['websocket'] }), // options object is Optional
  }),
);

Vue.config.productionTip = false;

(async () => {
  // Find out if the user is already logged in
  /* const { isAuthenticated } = await fetch('/api/isAuthenticated')
    .then(resp => resp.json())
    .catch(console.error);
  store.commit('setIsAuthenticated', isAuthenticated); */

  new Vue({
    router,
    store,
    template: '<App :socket="$socket"/>',
    components: { App },
    render: (h) => h(App),
  }).$mount('#app');
})();
