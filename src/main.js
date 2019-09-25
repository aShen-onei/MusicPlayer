import 'babel-polyfill'
import Vue from 'vue'
import App from './app.vue'
import router from './router/router.js'
import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import store from './vuex'

import './commons/style/index.scss'

Vue.use(VueLazyLoad, {
  loading: require('commons/image/default.png')
})
FastClick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')