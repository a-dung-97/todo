import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { getInfo } from "./api/user";
Vue.config.productionTip = false;
router.beforeEach(async (to, from, next) => {
  if (to.path === "/") {
    if (store.getters.isAuth === true) {
      const { first_name, last_name } = await getInfo();
      store.commit("SET_NAME", first_name + " " + last_name);
      next();
    } else {
      next({ path: "/login" });
    }
  } else if (to.path === "/login") {
    if (store.getters.isAuth === false) next();
    else {
      next({ path: "/" });
    }
  } else next();
});
new Vue({
  router,
  store,
  vuetify,
  render: function(h) {
    return h(App);
  },
}).$mount("#app");
