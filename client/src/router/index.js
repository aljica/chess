import Vue from 'vue';
import VueRouter from 'vue-router';
import GameView from '../views/Game.vue';
import LobbyView from '../views/Lobby.vue';
// import store from '../store';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/lobby' },
  { path: '/lobby', component: LobbyView },
  { path: '/game/:gameID', component: GameView },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

// Setup Authentication guard
/* router.beforeEach((to, from, next) => {
  if (store.state.isAuthenticated || to.path === '/login') {
    next();
  } else {
    console.info('Unauthenticated user. Redirecting to login page.');
    next('/login');
  }
}); */

export default router;
