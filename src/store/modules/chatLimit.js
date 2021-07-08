import * as types from '../mutation-types'

const chatLimit = {
  namespaced: true,
  state: {
    mute: false, // 用户被禁言
    allMuted: false // 全体禁言
  },
  mutations: {
    [types.CHAT_MUTE](state, reLoad) {
      state.mute = reLoad
    },
    [types.CHAT_AllMUTE](state, reLoad) {
      state.allMuted = reLoad
    }
  }
}

export default chatLimit
