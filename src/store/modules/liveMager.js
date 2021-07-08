import * as types from '../mutation-types'
const liveMagerModules = {
  namespaced: true,
  state: {
    emailInfo: {
      activity_id: '',
      emailInviteId: '',
      emailTemplateId: 1,
      title: '',
      content: '',
      desc: '',
      senderName: ''
    },
    goodsVisInfo: {}
  },
  getters: {
    emailInfo: state => state.emailInfo
  },
  mutations: {
    [types.EMAIL_INFO] (state, reLoad) {
      state.emailInfo = reLoad
    },
    [types.GOODS_VIS_INFO] (state, reLoad) {
      state.goodsVisInfo = reLoad
    }
  }
}

export default liveMagerModules
