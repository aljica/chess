import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// no-param-reassign prevents store.isAuthenticated = isAuthenticated
/* eslint-disable no-param-reassign */
export default new Vuex.Store({
  state: {
    count: 0,
    isAuthenticated: false,
    isAdminAuth: false,
  },
  mutations: {
    setIsAuthenticated(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    setAdminAuth(state, isAdminAuth) {
      state.isAdminAuth = isAdminAuth;
    },
    setCount(state, data) {
      state.count = data;
    },
  },
  getters: {
    adminAuth: (state) => state.isAdminAuth,
  },
  actions: {
  },
  modules: {
  },
});
