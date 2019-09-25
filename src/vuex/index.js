// vuex的入口文件
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions.js'
import * as getters from './getters.js'
import mutations from './mutations.js'
import state from './state.js'
import creatLogger from 'vuex/dist/logger.js'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state,
  plugins: [
    creatLogger()
  ]
})