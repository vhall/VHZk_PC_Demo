import * as types from '../mutation-types'

const loginModules = {
  namespaced: true,
  state: {
    isLogin: false,
    authLoginInIframe: false,
    loginInfo: {}
  },
  getters: {
    isLoginGetter: (state) => state.isLogin,
    loginInfo: (state) => state.loginInfo
  },
  mutations: {
    [types.LOGIN_INFO] (state, status) {
      state.loginInfo = status || { mobile: '' }
    },
    [types.AUTH_LOGIN_INIFRAME] (state) {
      state.authLoginInIframe = true
    }
  }
}

export default loginModules
