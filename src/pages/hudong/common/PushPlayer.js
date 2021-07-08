/**
 * 推流器，封装PaaS 互动SDK
 *
 * @export
 * @param appId, roomId, inavId, token, rootEleId
 * @class HostPusher extends BasePusher
 * @author yongguan.yang
 */
export default class PushPusher {
  /**
   * @param appId
   * @param roomId
   * @param inavId
   * @param token
   * @returns {Promise<any>}
   */
  constructor (opt) {
    this.opt = {
      ...opt
    }
    this.vhallrtc = null
    this.currentStreamId = ''
  }
  /* 初始化实例 */
  initPushInstance () {
    return new Promise((resolve, reject) => {
      VhallRTC.createInstance(this.opt, event => {
        this.vhallrtc = event.vhallrtc
        resolve(event)
      }, fail => {
        reject(fail)
      })
    })
  }
  /* 销毁实例 */
  destroyInstance () {
    return new Promise((resolve, reject) => {
      this.vhallrtc.destroyInstance({}, success => {
        resolve(success)
      }, fail => {
        reject(fail)
      })
    })
  }
  /* 创建本地流 */
  createLocalStream (videoNode, profile, videoDevice, audioDevice) {
    let opt = {
      videoNode: videoNode, // 传入本地视频显示容器，必填
      audio: true, // 是否获取音频，选填，默认为true
      video: true, // 是否获取视频，选填，默认为true
      speaker: true, // 桌面共享是否分享音频(chrome浏览器弹框左下角显示“分享音频”选框)，选填，默认为true
      showControls: false, // 是否开启视频原生控制条，选填，默认为true
      profile: profile || VhallRTC['RTC_VIDEO_PROFILE_480P_16x9_H'], // 自定义分辨率，使用分辨率模板，选填，与videoQuality参数互斥，优先使用profile参数，推荐使用。
      // videoQuality: { width: 640, height: 480, bitrate: 720, framerate: 15 }, // 自定义分辨率、码率、帧率(5~30)，选填 不使用profile模板时可选填，初学者不推荐使用。
      mute: { audio: false, video: false }, // 是否静音，关视频，选填，默认为false
      videoDevice: videoDevice || '', // 视频设备id，选填 默认为系统缺省
      audioDevice: audioDevice || '', // 音频设备id，选填 默认为系统缺省
      videoCodec: VhallRTC.CODECS_VP8 // 视频编码，选填 默认为VP8
    }
    return new Promise((resolve, reject) => {
      this.vhallrtc.createStream(opt, success => {
        this.currentStreamId = success.streamId
        resolve(success)
      }, fail => {
        reject(fail)
      })
    })
  }
  /* 销毁本地流 */
  destoryLocalStream (streamId) {
    return new Promise((resolve, reject) => {
      this.vhallrtc.destroyStream({
        streamId: streamId
      }, success => {
        this.currentStreamId = ''
        resolve(success)
      }, fail => {
        reject(fail)
      })
    })
  }
  /* 推送本地流 */
  publishStream (streamId) {
    return new Promise((resolve, reject) => {
      this.vhallrtc.publish({
        streamId: streamId
      }, success => {
        resolve(success)
      }, fail => {
        reject(fail)
      })
    })
  }
  /* 停止推送本地流 */
  stopPublishStream (streamId) {
    return new Promise((resolve, reject) => {
      this.vhallrtc.unpublish({
        streamId: streamId
      }, success => {
        resolve(success)
      }, fail => {
        reject(fail)
      })
    })
  }
  /* 开始旁路推流 */
  startBroadCast () {
    return new Promise((resolve, reject) => {
      this.vhallrtc.startBroadCast({
        layout: VhallRTC.CANVAS_LAYOUT_PATTERN_GRID_1, // 旁路布局，选填 默认一人平铺类型
        profile: VhallRTC.BROADCAST_VIDEO_PROFILE_1080P_1,
        border: { // 旁路边框 选填。
          width: 2, // 边框大小  值为 [2、 4 、 6 、8] 其中一个
          color: '0xffffff' // 边框颜色
        }
      }, (success) => {
        resolve(success)
      }, (fail) => {
        reject(fail)
      })
    })
  }
  /* 停止旁路推流 */
  stoptBroadCast (roomId) {
    return new Promise((resolve, reject) => {
      this.vhallrtc.stopBroadCast({
        roomId: roomId || this.opt.roomId // 直播房间ID,必填
      }, success => {
        resolve(success)
      }, fail => {
        reject(fail)
      })
    })
  }
  /**
   * 获取音视频设备列表
   * @returns {Promise<any>}
   */
  getDeviceList () {
    return new Promise((resolve, reject) => {
      this.vhallrtc.getDevices({}, success => {
        resolve(success)
      }, fail => {
        reject(fail)
      })
    })
  }
  /**
   * 获取设备分辨率列表
   * @returns {Promise<any>}
   */
  getVideoSizeList (deviceId) {
    return new Promise((resolve, reject) => {
      this.vhallrtc.getVideoConstraints({
        deviceId: deviceId
      }, success => {
        resolve(success)
      }, fail => {
        reject(fail)
      })
    })
  }
  /**
   * 获取直播流播放音量
   * @returns {Promise<any>}
   */
  getAudioLevel (streamId) {
    return new Promise((resolve, reject) => {
      this.vhallrtc.getAudioLevel({
        streamId: streamId || this.currentStreamId
      }, val => {
      /* 当流不包含音频或禁止音频轨道时，返回值为0。
         支持本地流，表示当前采集的音量。
         支持远端流，表示当前播放的音量。
         该音量值是在内部定时每一秒更新一次，因此不是完全实时的。
         由于此数值跟物理音量并非线性关系，建议设计为： 共5格，
         1格：数值0-0.04
         2格：数值0.04-0.16
         3格：数值0.16-0.36
         4格：数值0.36-0.64
         5格：数值0.64-1 */
        if (val <= 0.08) resolve(1)
        else if (val <= 0.16) resolve(2)
        else if (val <= 0.36) resolve(3)
        else if (val <= 0.64) resolve(4)
        else resolve(5)
      }, fail => {
        reject(fail)
      })
    })
  }
  /**
   * 直播丢包率
   * @returns {Promise<any>}
   */
  getLossRate (streamId) {
    return new Promise((resolve, reject) => {
      if (this.vhallrtc) {
        this.vhallrtc.getStreamPacketLoss({
          streamId: streamId || this.currentStreamId
        }, success => {
          resolve(success)
        }, fail => {
          reject(fail)
        })
      } else {
        resolve()
      }
    })
  }
  /**
   * 获取上下行丢包率
   * @returns {Promise<any>}
   */
  getUpDownLossRate () {
    return new Promise((resolve, reject) => {
      this.vhallrtc.getPacketLossRate({}, success => {
        // upLossRate, // 上行丢包率
        // downLossRate // 下行丢包率
        resolve(success)
      }, fail => {
        reject(fail)
      })
    })
  }
  /**
   * 设置静音
   */
  setMuteAudio (streamId, isMute) {
    this.vhallrtc.muteAudio({
      streamId: streamId,
      isMute: isMute
    })
  }
  /**
   * 设置静音
   */
  setMuteVideo (streamId, isMute) {
    this.vhallrtc.muteVideo({
      streamId: streamId,
      isMute: isMute
    })
  }
}
