import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import io from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

/* Vue.use(
  new VueSocketIO({
    debug: true,
    connection: io('http://localhost:8989', { transports: ['websocket'] }), // options object is Optional
  }),
); */

const socket = io('http://localhost:8989', { transports: ['websocket'] });
Vue.use(VueSocketIOExt, socket);

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
    render: (h) => h(App),
  }).$mount('#app');
})();
