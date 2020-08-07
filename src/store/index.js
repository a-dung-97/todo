import Vue from "vue";
import Vuex from "vuex";
import { getToken } from "../utils/auth";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: getToken(),
    name: "",
  },
  getters: {
    isAuth(state) {
      return !!state.token;
    },
  },
  mutations: {
    SET_TOKEN(state, token) {
      this.state.token = token;
    },
    SET_NAME(state, name) {
      this.state.name = name;
    },
  },
});
