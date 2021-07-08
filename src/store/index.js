import Vue from 'vue'
import Vuex from 'vuex'
import appModules from './modules/app'
import loginModules from './modules/login'
import Live from './modules/live'
import chatLimit from './modules/chatLimit'
Vue.use(Vuex)

const isDev = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  strict: isDev,
  state: {
    num: 3
  },
  getters: {
    isEven: (state) => state.num % 2 === 0
  },
  mutations: {
    addNum (state, data) {
      state.num += data.num
    }
  },
  actions: {
    addNumAsync ({
      commit
    }, data) {
      setTimeout(() => {
        commit('addNum', data)
      }, 2000)
    }
  },
  modules: {
    app: appModules,
    login: loginModules,
    liveMager: Live,
    chatLimit: chatLimit
  }
})

export default store
