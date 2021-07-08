import * as types from '../mutation-types'
import { ResolutionMap, LocalKey } from 'src/utils/ConfigTool'

const LivePc = {
  namespaced: true,
  state: {
    openWechatSubscribe: 'Y',
    bu: 'zhike',
    activityInfo: {}, // 活动信息
    liveDevices: {
      camera: '',
      mic: '',
      videoSize: ''
    },
    cameraDevices: [],
    micDevices: [],
    customTheme: {
      bgImg: '',
      logoImg: '',
      chatImg: ''
    },
    downTimer: 0,
    lotteryDownTimer: 0,
    redBagInfo: {
      condition: '',
      password: ''
    },
    visiteInfo: {},
    goodsVisInfo: {},
    buttonSettings: {
      showPlaySpeed: false,
      showResolution: false,
      showInviteCard: true,
      showSubscribe: true
    },
    barrageSettings: {
      useBarrage: false,
      barrageFontSize: '14px',
      barrageFontColor: '#fffff'
    }
  },
  getters: {
    liveDevices: state => state.liveDevices,
    roomPaas: (state) => state.roomPaas,
    activityInfo: (state) => state.activityInfo,
    customTheme: (state) => state.customTheme,
    downTimer: state => state.downTimer,
    lotteryDownTimer: state => state.lotteryDownTimer,
    redBagInfo: state => state.redBagInfo,
    visiteInfo: state => state.visiteInfo,
    openWechatSubscribe: state => state.openWechatSubscribe,
    bu: state => state.bu,
    hasRewardModule: state => state.activityInfo.reward_status === 'Y', // 是否打开了打赏
    hasGiftModule: state => state.activityInfo.gift_status === 'Y', // 是否打开了礼物
    liveCamera (state) { // 所选中摄像头相关信息(上报设备)
      let camera = state.liveDevices.camera
      let cameraDevices = state.cameraDevices
      if (!cameraDevices.length) {
        try {
          cameraDevices = JSON.parse(sessionStorage.getItem(LocalKey.CAMERA_DEVICES))
          if (Array.isArray(cameraDevices) && cameraDevices.length) {
            camera = sessionStorage.getItem(LocalKey.CAMERA)
          } else {
            return null
          }
        } catch (e) {
          console.error(e)
          return null
        }
      }
      return cameraDevices.find(item => item.deviceId === camera)
    },
    liveMic (state) { // 所选中麦克风相关信息(上报设备)
      let mic = state.liveDevices.mic
      let micDevices = state.micDevices
      if (!micDevices.length) {
        try {
          micDevices = JSON.parse(sessionStorage.getItem(LocalKey.MIC_DEVICES))
          if (Array.isArray(micDevices) && micDevices.length) {
            mic = sessionStorage.getItem(LocalKey.MIC)
          } else {
            return null
          }
        } catch (e) {
          console.error(e)
          return null
        }
      }
      return micDevices.find(item => item.deviceId === mic)
    },
    liveVideoSize (state) {
      const size = state.liveDevices.videoSize || sessionStorage.getItem(LocalKey.VIDEO_SIZE)
      return ResolutionMap[size]
    }
  },
  mutations: {
    [types.VIDEO_DEVICE] (state, reLoad) {
      state.liveDevices = reLoad
    },
    [types.LIVE_DEVICES_LIST] (state, { cameraDevices, micDevices }) {
      state.cameraDevices = cameraDevices
      state.micDevices = micDevices
    },
    [types.ACTIVITY_INFO] (state, reLoad) {
      state.activityInfo = reLoad
    },
    [types.CUSTOM_THEME] (state, reLoad) {
      state.customTheme = reLoad
    },
    [types.DOWN_TIMER] (state, reLoad) {
      state.downTimer = reLoad
    },
    [types.LOTTERY_DOWN_TIMER] (state, reLoad) {
      state.lotteryDownTimer = reLoad
    },
    [types.RED_BAG_INFO] (state, reLoad) {
      state.redBagInfo = reLoad
    },
    [types.VISITE_INFO] (state, reLoad) {
      state.visiteInfo = reLoad
    },
    [types.OPEN_WX_SUBSCRIBE] (state, reLoad) {
      state.openWechatSubscribe = reLoad
    },
    [types.ACTIVITY_BU] (state, reLoad) {
      state.bu = reLoad
    },
    [types.GOODS_VIS_INFO] (state, reLoad) {
      state.goodsVisInfo = reLoad
    },
    [types.BARRAGE_SETTINGS] (state, reLoad) {
      state.barrageSettings = reLoad
    },
    [types.BUTTON_SETTINGS] (state, reLoad) {
      state.buttonSettings = reLoad
    },
    [types.REWARD_SWITCH] (state, reLoad) {
      state.activityInfo.reward_status = reLoad
    },
    [types.GIFT_SWITCH] (state, reLoad) {
      state.activityInfo.gift_status = reLoad
    }
  }
}

export default LivePc
