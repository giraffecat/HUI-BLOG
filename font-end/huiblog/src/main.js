import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/bootstrap.css'
import './assets/css/iconfont.css'
import './assets/css/index.css'
import vuetify from './plugins/vuetify'
import dayjs from "dayjs";
import "highlight.js/styles/atom-one-dark.css";
import 'animate.css';


Vue.filter("date", function(value) {
  return dayjs(value).format("YYYY-MM-DD");
});
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
