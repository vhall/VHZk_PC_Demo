<template>
  <div class="play-container" @mouseenter="controlOver" :class="{'small-window': smallWindow, 'play-move': isMoveing}">
    <div class="video-box" @click="clickVideo" v-ComLoading="videoLoading">
      <span class="end-box" v-if="isShowVideo">
          <i class="end-img camera-icon"></i>
      </span>
      <div class="auto-image-bg" v-if="isAuto" :style="{backgroundImage:`url(${imageAutoSrc})`}">
        <span class="end-box default-auto-box">
          <i class="iconfont icon-yinpinx"></i>
          <span>音频模式</span>
      </span>
      </div>
      <span class="end-box" v-if="playType=='end'&&role!=='host'">
          <i class="end-img watch-live-end-icon"></i>
          <p>直播已结束</p>
      </span>
      <span class="end-box" v-if="videoConvering">
          <i class="end-img watch-live-end-icon"></i>
          <p>活动已结束，直播回放视频正在生成中，请稍等</p>
      </span>
      <span class="end-box" v-if="playType==='third' && role==='host' && !startStream">
          <i class="end-img watch-third-icon"></i>
          <p>您已设置第三方推流，请预先使用推流软件进行推流，并点击页面中的"开始直播"按钮～</p>
      </span>
      <span v-if="initFail&&role==='host'" class="end-box">
          <i class="iconfont icon-tanhao1 none-video"></i>
          <p>无法获取摄像头画面</p>
      </span>
      <div class="play-video-box"
           :type="playType"
           :id="playBoxId"
           v-if="playType=='live'">
      </div>
      <div class="play-video-box"
           :type="playType"
           :id="playBoxId"
           v-else-if="playType=='vod'">
      </div>
      <div class="play-video-box"
           :type="playType"
           :id="playBoxId"
           v-else-if="playType=='end'">
      </div>
      <div class="play-video-box"
           :type="playType"
           :id="playBoxId"
           v-else>
        <div class="image-bg" v-if="imageSrc && playType === 'pre'" :style="{backgroundImage:`url(${imageSrc})`}"></div>
      </div>
      <div class="cover-box"
           v-if="!videoConvering && role!=='host'&&!isPlayState&&(playType=='vod'||playType=='warm'||playType=='live')"
           @click="playPaasVideo">
        <div class="image-bg"
             v-if="showImg && imageSrc"
             :style="{backgroundImage:`url(${imageSrc})`}"></div>
        <i class="play-btn"
           v-if="playLoading"></i>
      </div>
    </div>
    <div class="control-video-box"
         :class="{disabled: hoverTime}"
         v-if="playType=='vod' || playType=='warm' || (playType =='live' && role=='watcher')">
      <video-control v-if="isControl"
                     ref="vControl"
                     :currentTime="currentTime"
                     :totalTime="totalTime"
                     :qualitys="qualitys"
                     :currentQuality="currentQuality"
                     :playType="playType"
                     :filename="filename"
                     :playState="isPlayState"
                     :markPoints="markPoints"
                     @control="playControl"></video-control>
    </div>
    <!-- 直播使用控制声音，视频画面 -->
    <div class="doc-pop-hover" v-if="smallWindow && role!=='watcher'">
      <div class="doc-pop-warp">
        <div class="doc-pop-row" v-if="playType=='live' && role=='host'">
          <span class="pop-title">主持人</span>
          <span class="pop-icon" title="打开摄像头" v-if="isShowVideo" @click="showVideo(false)">
          <i class="iconfont icon-shexiangtouguanbi"></i>
        </span>
          <span class="pop-icon" title="关闭摄像头" v-else @click="showVideo(true)">
          <i class="iconfont icon-shexiangtou"></i>
        </span>
          <span class="pop-icon" title="打开麦克风" v-if="isMutoAuto" @click="mutoAuto(false)">
          <i class="iconfont icon-iicon-maikefeng6"></i>
        </span>
          <span class="pop-icon" title="关闭麦克风" v-else @click="mutoAuto(true)">
          <i :class="`iconfont icon-icon_mic_${audioLevel}`"></i>
        </span>
        </div>
        <div class="doc-pop-row">
          <span class="pop-title">视图</span>
          <span class="pop-icon" v-if="!isVideoFullscreen" title="切换" @click="changeLayoutView"><i class="iconfont icon-icon_qiehuan"></i></span>
          <span class="pop-icon" v-if="!isVideoFullscreen" title="全屏" @click="fullPlayScreen"><i class="iconfont icon-icon-quanping"></i></span>
          <span class="pop-icon" v-else title="退出全屏" @click="exitPlayScreen"><i class="iconfont icon-icon-quxiaoquanping"></i></span>
        </div>
      </div>
    </div>
    <div class="pop-water-cover" v-if="smallWindow && role=='watcher'">
      <span class="pop-icon" title="点击拖拽" type="drag" v-if="!isMoveing"><i type="drag" class="iconfont icon-tuodong"></i></span>
      <span class="pop-icon" title="还原" type="reset" v-else><i type="reset" class="iconfont icon-yuanwei"></i></span>
      <span class="pop-icon" title="切换" type="changeLayout"><i type="changeLayout" class="iconfont icon-qiehuan"></i></span>
    </div>
  </div>
</template>

<script>
import { AppTool, BusTool } from 'src/utils/ConfigTool'
import VideoControl from './control'
import { mapState } from 'vuex'
import EventBus from 'src/utils/eventBus.js'
export default {
  name: 'video-box',
  components: { VideoControl },
  data () {
    return {
      default_cover: AppTool.default_cover,
      hoverTime: 0,
      playComps: {},
      playBtnShow: false,
      imageUrl: '',
      imageAutoUrl: '',
      filename: '',
      recordId: '', // 视频id
      playBoxId: `play-vides-box`,
      currentStreamId: '',
      activity_id: '',
      mediaStreamId: '', // 桌面共享本地流id
      currentTime: 0,
      totalTime: 10000,
      setIntervalHandler: 0,
      isPlayState: false,
      showImg: false,
      isMutoAuto: false,
      isShowVideo: false,
      isShowVideoChange: false,
      isAutoPlay: false,
      isControl: false,
      volumeSize: 100, // 声音大小
      playLoading: false,
      videoLoading: false,
      videoConvering: false,
      count: 0,
      qualitys: [{
        idx: 0,
        def: 'same'
      }], // 视频质量
      currentQuality: {},
      videoConfIdx: 0,
      failCount: 0,
      audioLevel: 1,
      initFail: false,
      isAuto: false, // 是否是音频
      isVideoFullscreen: false,
      isMoveing: false,
      markPoints: [] // 打点信息
    }
  },
  props: {
    role: {
      type: String,
      default: 'watcher' // 发起端(host), 助理(assistant) 观看(watcher)
    },
    playType: {
      type: String,
      default: '' // 直播(live), 回放(vod), 暖场(warm), 结束(end), 第三方(third)
    },
    isDoc: { // 是否文档
      type: Boolean,
      default: false
    },
    startInit: {
      type: Boolean,
      required: true,
      default: false
    },
    startStream: {
      type: Boolean,
      default: false
    },
    smallWindow: {
      type: Boolean,
      default: false
    },
    isShareScreen: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.activity_id = this.$route.params.id
    this.changeFullScreen()
    this.initBusEvent()
  },
  computed: {
    ...mapState('liveMager', {
      activityInfo: state => state.activityInfo,
      barrageSettings: state => state.barrageSettings
    }),
    ...mapState('login', {
      loginInfo: (state) => state.loginInfo
    }),
    imageSrc () {
      if (!this.imageUrl && this.role === 'host') {
        return ''
      }
      if (!this.imageUrl) return this.default_cover
      return `${this.$imgHost}/${this.imageUrl}?x-oss-process=image/resize,m_lfit,w_2000${window.webp ? '/format,webp' : ''}`
    },
    imageAutoSrc () {
      if (!this.imageAutoUrl && this.role === 'host') {
        return ''
      }
      if (!this.imageAutoUrl) return this.default_cover
      return `${this.$imgHost}/${this.imageAutoUrl}?x-oss-process=image/resize,m_lfit,w_2000${window.webp ? '/format,webp' : ''}`
    }
  },
  watch: {
    playType: {
      handler () {
        this.initFail = false
        this.changePlayType()
        if (this.playType === 'third' && this.isShowVideo) {
          this.isShowVideo = false
          this.isShowVideoChange = true
        } else if (this.isShowVideoChange) {
          this.isShowVideo = true
          this.isShowVideoChange = false
        }
      },
      immediate: true
    }
  },
  beforeDestroy () {
    console.log('--video-com--beforeDestroy')
    clearTimeout(this.st)
    this.destoryComs()
    let docDoc = document.querySelector('.video-watch-warp')
    if (docDoc) {
      docDoc.removeEventListener('mousedown', this.docWatchDown, false)
    }
  },
  mounted () {
    this.initDocMove()
  },
  methods: {
    initBusEvent () {
      // 发送弹幕
      const sendBarrageFunc = this.$throttle((content) => { // 两秒一条弹幕
        VHALL_ZK.$player.addBarrage(content)
      }, 2000)
      EventBus.$on('send_barrage', (content) => {
        if (this.playType === 'warm' || this.playType === 'pre') return // 暖场时不发弹幕
        sendBarrageFunc(content)
      })
    },
    controlOver () {
      this.hoverTime = 200
      let s = setTimeout(() => {
        clearTimeout(s)
        this.hoverTime = 0
      }, this.hoverTime)
    },
    /* 初始组件 */
    initComponent () {
      console.log('-----------------palyType:' + this.playType + '--------------------')
      this.isPlayState = false
      this.showImg = true
      if (this.playType === 'live') { // 直播
        this.filename = ''
        this.initLivePlay()
      } else if (this.playType === 'pre') { // 预告
        this.imageUrl = this.activityInfo.img_url
        this.imageAutoUrl = this.activityInfo.img_url
      } else if (this.playType === 'warm') { // 暖场
        this.showImg = false
        this.queryWarmInfo()
      } else if (this.playType === 'vod') { // 回放
        this.showImg = false
        this.initPlayBack()
      } else if (this.playType === 'end') {
        this.destoryComs()
      }
    },
    changeFullScreen() {
      const setFullscreen = () => {
        const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement
        if (fullscreenElement) {
          this.isVideoFullscreen = true
          this.$emit('fullScreen', true)
        } else {
          this.isVideoFullscreen = false
          this.$emit('fullScreen', false)
        }
      }
      window.addEventListener('fullscreenchange', setFullscreen, true)
      window.addEventListener('webkitfullscreenchange', setFullscreen, true)
    },
    clickVideo () {
      if (this.playType === 'pre') {
        return
      }
      // 观看端，且不是直播
      if (this.role === 'watcher' && this.playType !== 'live') {
        this.$refs.vControl && this.$refs.vControl.playORpause()
      }
    },
    /* 改版播放类型 */
    changePlayType () {
      if (!this.startInit) return
      if ('live|warm|vod|end|pre|third|assistant'.indexOf(this.playType) !== -1) {
        this.isAutoPlay = false
        this.initComponent()
      }
    },
    /* 初始化直播 */
    initLivePlay () {
      this.imageUrl = this.activityInfo.img_url
      this.imageAutoUrl = this.activityInfo.img_url
      clearInterval(this.setIntervalHandler)
      this.initPlayer('live')
    },
    initPlayBack () {
      window.VHALL_ZK.$api.getActivityPlayBackInfo().then((res) => {
        this.imageUrl = res.data.cover || this.activityInfo.img_url
        this.imageAutoUrl = res.data.cover || this.activityInfo.img_url
        if (res.data.replay.video) { // 回放视频
          this.recordId = res.data.replay.video
          this.totalTime = res.data.replay.duration || 0
          this.playBackVideo(res.data.replay.status)
        }
      })
    },
    /* 播放暖场视频 */
    playBackVideo (stauts) {
      if (this.playType === 'vod' && stauts === 'PROCESS') { // 没有回放视频，此时视频转码中
        this.videoConvering = true
        this.$nextTick(() => {
          this.showImg = true
        })
      } else {
        this.showImg = true
        if (this.isDoc && !VHALL_ZK.$doc.initResult) { // 如果文档没有初始化完成，必须文档加载完成再初始化播放器
          VHALL_ZK.$event.on(VHALL_ZK.EVENTS.DocReady, () => {
            this.$debounce(() => {
              this.initPlayer('vod')
            })
          })
        } else {
          this.initPlayer('vod')
        }
      }
    },
    addEventPlayer () {
      const VHALL_ZK = window.VHALL_ZK
      VHALL_ZK.$player.on(VHALL_ZK.EVENTS.PLAY, () => {
        console.log('play')
        this.isPlayState = true
        this.dealWithVideo()
      })
      // 视频卡顿时触发
      VHALL_ZK.$player.on(VHALL_ZK.EVENTS.LAG_REPORT, () => {
        console.log('-----视频卡顿-----')
        if (this.isPlayState && this.playType !== 'end') {
          this.videoLoading = true
        } else {
          this.videoLoading = false
        }
      })
      // 视频卡顿恢复时触发
      VHALL_ZK.$player.on(VHALL_ZK.EVENTS.LAG_RECOVER, () => {
        console.log('-----卡顿恢复-----')
        this.videoLoading = false
      })
      // 当前清晰度改变时触发(卡顿时自动切清晰度触发，手动切换不触发)
      VHALL_ZK.$player.on(VHALL_ZK.EVENTS.DEFINITION_CHANGE, () => {
        this.currentQuality = VHALL_ZK.$player.getCurrentQuality()
      })
      // 直播时延
      VHALL_ZK.$player.on(VHALL_ZK.EVENTS.TIMEUPDATE, (e) => {
        EventBus.$emit(BusTool.LIVE_DELAY, e.delay)
      })
    },
    playPaasVideo () {
      const warm = this.activityInfo.warm
      if (this.playType === 'warm' && (!warm.record || warm.record.video_info.length <= 0)) { /* 未上传视频或者未转码完成 */
        this.$messageBox({
          header: '提示',
          content: '此时没有暖场视频',
          confirmText: '确定'
        })
        return
      }
      this.isPlayState = true
      this.imageUrl = ''
      this.qualitys = VHALL_ZK.$player.getQualityList()
      this.currentQuality = VHALL_ZK.$player.getCurrentQuality()
      VHALL_ZK.$player.play()
      if (this.playType !== 'live') {
        this.dealWithVideo()
      }
      // 兼容刚进入页面时只有音频的特殊情况
      let st = setTimeout(() => {
        clearTimeout(st)
        this.isAuto = this.currentQuality.def === 'a'
      }, 1000)
    },
    dealWithVideo () {
      if (!this.qualitys || this.qualitys.length <= 1) {
        this.qualitys = window.VHALL_ZK.$player.getQualityList()
      }
      this.currentQuality = window.VHALL_ZK.$player.getCurrentQuality()
      clearInterval(this.setIntervalHandler)
      this.setIntervalHandler = setInterval(() => {
        this.currentTime = window.VHALL_ZK.$player.getCurrentTime()
        if (this.totalTime === parseInt(this.currentTime) + 1) {
          clearInterval(this.setIntervalHandler)
          if (this.isAutoPlay) {
            this.seekProgress(0)
            window.VHALL_ZK.$player.play()
            this.dealWithVideo()
          } else {
            this.isPlayState = false
            this.currentTime = 0
          }
        }
      }, 1000)
    },
    queryWarmInfo () {
      const warm = this.activityInfo.warm
      this.imageUrl = warm.img_url || this.activityInfo.img_url
      this.imageAutoUrl = warm.img_url || this.activityInfo.img_url
      this.playBtnShow = true
      this.filename = warm.filename
      this.recordId = warm.record_id
      this.isAutoPlay = warm.play_type === 'AUTO'
      if (warm.record) {
        this.totalTime = parseInt(warm.record.vod_info.duration)
        if (warm.record.video_info.length <= 0) { /* 未上传视频或者未转码完成 */
          this.showImg = true
          return
        }
        this.playBackVideo()
      } else {
        this.showImg = true
      }
    },
    initPlayer (type) {
      // 创建实例
      this.$nextTick(() => {
        this.playLoading = true
        VHALL_ZK.$player.init({
          type: type || 'live', // live 直播  vod 点播  必填
          recordId: this.recordId || '', // type==vod时必传
          videoNode: this.playBoxId // 播放器的容器， div的id 必填
        })
        VHALL_ZK.$event.on(VHALL_ZK.EVENTS.PlayerReady, (res) => {
          console.log('--初始化直播播放器成功--')
          this.isControl = true
          this.markPoints = VHALL_ZK.$player.getMarkPoints()
          this.addEventPlayer()
          this.$emit('playReady', true)
          if (this.barrageSettings.useBarrage) {
            VHALL_ZK.$player.setBarrageOption(this.barrageSettings)
            if (this.activityInfo.layout !== 2) { // 文档直播先不开启
              VHALL_ZK.$player.toggleBarrage(true)
            } else {
              VHALL_ZK.$player.toggleBarrage(false)
            }
          }
        })
      })
    },
    /* 开启，关闭 视频 */
    showVideo (e) {
      this.$toast(`摄像头已${e ? '关闭' : '开启'}`)
      this.isShowVideo = e
    },
    playControl (e) {
      const controlType = e.type
      if (controlType === 'progress') { // seek播放进度
        this.seekProgress(e.value)
      } else if (controlType === 'play') { // 播放控制
        if (this.playType !== 'live') {
          this.play(e.value)
        }
      } else if (controlType === 'mute') { // 是否禁音
        this.mutoAuto(e.value)
      } else if (controlType === 'volumeSize') { // 声音大小
        this.changeVolume(e.value)
      } else if (controlType === 'selectQuality') { // 画面质量
        this.isAuto = (e.value.def === 'a' || false)
        VHALL_ZK.$player.setQuality(e.value)
      } else if (controlType === 'fullScree') { // 全屏控制
        this.fullScree(e.value)
      } else if (controlType === 'fullBrowser') { // 浏览器全屏
        this.$emit('fullBrowser', e.value)
      } else if (controlType === 'rePlay') { // 重新播放
        VHALL_ZK.$player.play()
        this.dealWithVideo()
      } else if (controlType === 'selectSpeed') { // 设置倍速
        VHALL_ZK.$player.setPlaySpeed(e.value)
      } else if (controlType === 'barrageSwitch') { // 设置弹幕
        VHALL_ZK.$player.toggleBarrage(e.value)
      }
    },
    /* 播放，暂停 */
    play (e) {
      if (this.playType === 'warm' || this.playType === 'vod') { // 暖场，回放
        if (e) {
          VHALL_ZK.$player.play()
          this.dealWithVideo()
        } else {
          VHALL_ZK.$player.pause()
        }
      } else if (this.playType === 'live') {
        if (e) {
          VHALL_ZK.$player.play()
        } else {
          VHALL_ZK.$player.pause()
        }
      }
    },
    /* 开启，禁止声音 */
    mutoAuto (e) {
      this.$toast(`音量已${e ? '关闭' : '开启'}`)
      this.isMutoAuto = e
      if (this.role === 'host') { // 主持人互动端
        this.pushPlayer.setMuteAudio(this.currentStreamId, this.isMutoAuto)
      } else {
        VHALL_ZK.$player.setMute(this.isMutoAuto)
      }
    },
    /* 声音大小 */
    changeVolume (volume) {
      this.volumeSize = volume
      if (this.playType === 'live') { // 直播
        if (this.role === 'host') { // 主持人互动端
        } else if (this.role === 'watcher') { // 观看端
          VHALL_ZK.$player.setVolume(volume)
        }
      } else if (this.playType === 'warm' || this.playType === 'vod') { // 暖场，回放
        VHALL_ZK.$player.setVolume(volume)
      }
    },
    /* 开启，关闭 全屏 */
    fullScree (e) {
      EventBus.$emit('FullScreen', e)
      if (this.playType === 'live') { // 直播
        if (this.role === 'host') { // 主持人互动端
        } else if (this.role === 'watcher') { // 观看端
          this.toggleFullScreen(e)
        }
      } else if (this.playType === 'warm' || this.playType === 'vod') { // 暖场，回放
        this.toggleFullScreen(e)
      }
    },
    seekProgress (progress) {
      VHALL_ZK.$player.seekTime(this.totalTime * progress / 100)
    },
    destoryComs () {
      clearInterval(this.setIntervalHandler)
      this.videoLoading = false
      console.log('-----销毁--播放器-----')
      VHALL_ZK.$player.destroy()
    },
    changeLayoutView () {
      EventBus.$emit('changeLayoutView', 'videoLayout')
      /* 重置播放器，保证视频弹幕尺寸正常 */
      VHALL_ZK.$player.resetVideo()
    },
    fullPlayScreen() {
      this.isVideoFullscreen = true
      const element = document.querySelector('.play-container')
      this.toggleFullScreen(true, element)
    },
    exitPlayScreen() {
      this.isVideoFullscreen = false
      this.toggleFullScreen(false)
    },
    /* 切换全屏状态 */
    toggleFullScreen (e, ele) {
      const element = ele || document.querySelector('.play-video-box')
      if (e) {
        if (element.requestFullscreen) element.requestFullscreen()
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen()
        else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen()
        else if (element.msRequestFullscreen) element.msRequestFullscreen()
      } else {
        if (document.exitFullscreen) document.exitFullscreen()
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
        else if (document.msExitFullscreen) document.msExitFullscreen()
      }
    },
    initDocMove () {
      if (this.role === 'watcher') {
        let docDoc = document.querySelector('.video-watch-warp')
        docDoc.addEventListener('mousedown', this.docWatchDown, false)
      }
    },
    docWatchDown (e) {
      if (e.target.getAttribute('type') === 'reset') { // 点击还原
        console.log('-----点击还原------')
        this.resetPosition()
        this.isMoveing = false
      } else if (e.target.getAttribute('type') === 'drag') { // 点击拖拽
        console.log('-----点击拖拽------')
        this.moveTool()
        this.isMoveing = true
        e.preventDefault()
      } else if (e.target.getAttribute('type') === 'changeLayout') { // 点击切换
        console.log('-----点击切换------')
        this.resetPosition()
        this.isMoveing = false
        this.changeLayoutView()
        e.preventDefault()
      }
    },
    downEvent(e) {
      // 兼容触摸屏
      if (e.changedTouches && e.changedTouches.length >= 1) {
        e = e.changedTouches[0]
      }
      let docBar = document.querySelector('.video-watch-warp')
      if (!docBar) return
      if (e.pageY < 200) {
        docBar.setAttribute('class', 'video-watch-warp long-touch top-sector')
      } else {
        docBar.setAttribute('class', 'video-watch-warp long-touch')
      }
      this.disX = e.clientX - docBar.offsetLeft
      this.disY = e.clientY - docBar.offsetTop
      document.addEventListener('mousemove', this.moveEvent, false)
      // 兼容触摸屏
      document.addEventListener('touchmove', this.moveEvent, false)
    },
    upEvent(e) {
      // 兼容触摸屏
      if (e && e.changedTouches && e.changedTouches.length >= 1) {
        e = e.changedTouches[0]
      }
      let docBar = document.querySelector('.video-watch-warp')
      if (e && e.clientY < 200) {
        docBar.setAttribute('class', 'video-watch-warp top-sector')
      } else {
        docBar.setAttribute('class', 'video-watch-warp')
      }
      this.disX = 0
      this.disY = 0
      document.removeEventListener('mousemove', this.moveEvent, false)
      // 兼容触摸屏
      document.removeEventListener('touchmove', this.moveEvent, false)
    },
    moveEvent(e) {
      // 兼容触摸屏
      if (e && e.changedTouches && e.changedTouches.length >= 1) {
        e = e.changedTouches[0]
      }
      let docBar = document.querySelector('.video-watch-warp')
      let left = e.clientX - this.disX
      // 计算左右边界
      left = left <= -150 ? -150 : (left >= document.body.clientWidth - 150 ? document.body.clientWidth - 150 : left)
      // 保证不超出边界
      if (left + 60 + 400 >= document.body.clientWidth) {
        left = document.body.clientWidth - 400 - 60 - 10
      }
      let top = e.clientY - this.disY
      // 计算上下边界
      top = top < 0 ? 0 : (top >= window.screen.height - 50 ? window.screen.height - 50 : top)
      docBar.style.left = left + 'px'
      docBar.style.top = top + 'px'
      if (e && e.pageY < 200) {
        docBar.setAttribute('class', 'video-watch-warp long-touch')
      } else {
        docBar.setAttribute('class', 'video-watch-warp long-touch')
      }
    },
    moveTool () {
      this.$nextTick(() => {
        if (!this.isMove) {
          this.isMove = true
          let docBar = document.querySelector('.video-watch-warp')
          let mainDom = document.querySelector('.main-box-item')
          let offsetWidth = this.isVideoFullscreen ? 0 : mainDom.offsetLeft
          docBar.style.left = docBar.offsetLeft + offsetWidth + 'px'
          if (docBar.style.position === 'fixed') {
            docBar.style.top = docBar.offsetTop + 'px'
          } else {
            let offsetTop = this.isVideoFullscreen ? 0 : 102
            docBar.style.top = docBar.offsetTop + offsetTop + 'px'
          }
          // // 初始化位置
          docBar.style.marginLeft = 0 + 'px'
          docBar.style.bottom = 'auto'
          docBar.style.right = 'auto'
          docBar.style.position = 'fixed'
          docBar.setAttribute('title', '长按拖动')
          docBar.addEventListener('mousedown', this.downEvent, false)
          document.addEventListener('mouseup', this.upEvent, false)
          // 兼容触摸屏
          docBar.addEventListener('touchstart', this.downEvent, false)
          document.addEventListener('touchend', this.upEvent, false)
        }
      })
    },
    resetPosition () {
      this.isMove = false
      let docBar = document.querySelector('.video-watch-warp')
      document.removeEventListener('mouseup', this.upEvent, false)
      docBar.removeEventListener('mousedown', this.downEvent, false)
      // 兼容触摸屏
      document.removeEventListener('touchend', this.upEvent, false)
      docBar.removeEventListener('touchstart', this.downEvent, false)
      docBar.style = ''
      docBar.setAttribute('title', '')
    }
  }
}
</script>

<style scoped lang="scss">
.play-container {
  position: relative;
  height: 100%;
  overflow: hidden;
  /deep/ {
    .com-notification {
      z-index: 10;
    }
  }
  #vh-video {
    object-fit: cover;
  }
  &.play-move {
    &:hover {
      cursor: move;
    }
  }
  &.small-window {
    .end-box .end-img {
      width: 80px;
      height: 80px;
    }
    .live-control {
      display: none;
    }
    .control-video-box {
      display: none;
    }
    .doc-pop-hover {
      display: none;
    }
    &:hover {
      .doc-pop-hover {
        display: block;
      }
      .pop-water-cover {
        display: block;
      }
    }
    .pop-water-cover {
      display: none;
      position: absolute;
      width: 88px;
      top: 10px;
      right: 0;
      font-size: 0;
      z-index: 3200;
      .pop-icon {
        display: inline-block;
        width: 34px;
        height: 34px;
        line-height: 34px;
        margin-right: 10px;
        border-radius: 50%;
        background-color: rgba(30, 30, 30, .7);
        color: #fff;
        text-align: center;
        font-size: 18px;
        .iconfont {
          font-size: 18px;
        }
        &:hover {
          cursor: pointer;
          color: #FFD021;
        }
      }
    }
    .cover-box {
      .play-btn {
        width: 40px;
        height: 40px;
        margin-left: -20px;
        margin-top: -21px;
      }
    }
  }
  .doc-pop-hover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 11;
    .doc-pop-warp {
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding-right: 5px;
      .doc-pop-row {
        line-height: 32px;
        font-size: 14px;
        text-align: center;
        padding: 5px 0;
        color: #fff;
        .pop-title {
          display: inline-block;
          width: 50px;
          text-align: right;
        }
        .pop-icon {
          display: inline-block;
          width: 32px;
          height: 32px;
          line-height: 32px;
          margin-left: 10px;
          border-radius: 50%;
          text-align: center;
          background-color: rgba(100, 100, 100, .6);
          &:hover {
            cursor: pointer;
            color: #333;
            background-color: #FDD43F;
          }
        }
      }
    }
  }
  .video-box {
    position: relative;
    height: 100%;
    &:before {
      display: block;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }
  }
  .auto-image-bg{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    z-index: 2;
  }
  .end-box {
    position: absolute;
    display: block;
    width: 90%;
    color: #999999;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    img {
      width: 180px;
      height: 180px;
    }
    .end-img {
      display: block;
      width: 180px;
      height: 180px;
      margin: 0 auto;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
    }
    .camera-icon {
      background-image: url('../../../assets/image/camera-icon.png');
    }
    .watch-third-icon {
      background-image: url('../../../assets/image/watch_third2x.png');
    }
    .watch-live-end-icon {
      background-image: url('../../../assets/image/watch_liveEnd@2x.png');
    }
    .none-video{
      color: #ddd;
      font-size: 100px;
    }
    p {
      margin-top: 10px;
      line-height: 24px;
      font-size: 14px;
    }
  }
  .default-auto-box {
    top: 40px;
    left: 84px;
    border-radius: 5px;
    width: 122px;
    height: 40px;
    line-height: 40px;
    text-align: left;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 14px;
    padding: 0 20px;
    .icon-yinpinx {
      color: #1bcab7;
      font-size: 14px;
      margin-right: 4px;
    }
  }
  .image-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .live-control {
    position: absolute;
    bottom: 30px;
    left: 30px;
    z-index: 2;
    .control-item {
      display: inline-block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #222;
      border-radius: 50%;
      margin-right: 5px;
      .iconfont {
        color: #ccc;
        font-size: 16px;
      }
      &:hover {
        cursor: pointer;
        background-color: #ffd021;
        .iconfont {
          color: #222;
        }
      }
    }
  }
  .play-video-box /deep/ {
    position: relative;
    height: calc(100% + 2px);
    width: calc(100% + 2px);
    top: -1px;
    left: -1px;
    .vjs-big-play-button,
    .vjs-control-bar {
      display: none;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .cover-box {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: 11;
    img {
      width: 100%;
      height: 100%;
    }
    .play-btn {
      position: absolute;
      display: block;
      width: 80px;
      height: 80px;
      top: 50%;
      left: 50%;
      margin-left: -40px;
      margin-top: -41px;
      background-image: url('../../../assets/image/play-btn.png');
      background-size: cover;
      &:hover {
        opacity: 0.9;
      }
    }
    &:hover {
      cursor: pointer;
    }
  }
  .control-video-box {
    position: absolute;
    left: 0;
    bottom: -50px;
    width: 100%;
    height: 48px;
    padding-top: 10px;
    z-index: 10;
    animation: control-animation-hide 0.5s linear;
  }
  &:hover {
    .control-video-box {
      z-index: 10;
      animation: control-animation-show 0.3s linear both;
    }
  }
  @keyframes control-animation-show {
    from {
      bottom: -41px;
    }
    to {
      bottom: 0;
    }
  }
  @keyframes control-animation-hide {
    from {
      bottom: 0;
    }
    to {
      bottom: -41px;
    }
  }
}
</style>
