import Vue from 'vue';
import VueRouter from 'vue-router';
import GameView from '../views/Game.vue';
import LobbyView from '../views/Lobby.vue';
import RegisterView from '../views/Register.vue';
import LoginView from '../views/Login.vue';
// import store from '../store';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/lobby' },
  { path: '/lobby', component: LobbyView },
  { path: '/game/:gameID', component: GameView },
  { path: '/register', component: RegisterView },
  { path: '/login', component: LoginView },
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
