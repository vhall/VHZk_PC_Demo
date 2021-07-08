<template>
  <div class="control-box">
    <div class="progress-box"
         v-if="playType!='live'">
      <el-slider v-model="progress"
                 :format-tooltip="formatTooltip"
                 @change="changeVal"></el-slider>
      <div class="propress-point"
           v-for="(point, idx) in markPoints"
           @click="seekPoint(point)"
           :style="{ left: leftRatio(point.timePoint) + '%' }"
           :key="idx">
        <span class="propress-point-tips"
              :class="{'tips-left': leftRatio(point.timePoint) < 5, 'tips-right': leftRatio(point.timePoint) > 95}">{{point.msg}}</span>
      </div>
    </div>
    <!--<div class="time-box">-->
    <!--<span>{{currentDate}}</span>/<span>{{allDate}}</span>-->
    <!--</div>-->
    <div class="auto-box">
      <div class="mode-item fl"
           v-if="playType!='live'">
        <i v-if="progress==100"
           class="iconfont icon-yulanxuanzhuan"
           @click="rePlayEvent()"
           title="重播"></i>
        <i v-else-if="!isPlay"
           @click="playEvent(true)"
           class="iconfont icon-bofang_icon"
           title="播放"></i>
        <i v-else
           @click="playEvent(false)"
           class="iconfont icon-zanting_icon"
           title="暂停"></i>
      </div>
      <div class="mode-item time-box"
           v-if="playType!='live'">
        <span>{{currentDate}}</span><span>/{{allDate}}</span>
      </div>
      <!--<div class="mode-item"-->
           <!--v-if="filename">-->
        <!--正在播放暖场视频：{{filename}}-->
      <!--</div>-->
      <div class="mode-item fr"
           @click="fullScreeEvent">
        <i v-if="!fullScree"
           class="iconfont icon-quanpingzhankai"
           title="全屏"></i>
        <i v-else
           class="iconfont icon-quanpingshouqi"
           title="退出全屏"></i>
      </div>
      <div class="mode-item fr"
           @click.stop="fullBrowser">
        <i v-if="isFullBrowser"
           class="iconfont icon-wangyequanping_tuichu"
           title="退出网页全屏"></i>
        <i v-else
           class="iconfont icon-wangyequanping"
           title="网页全屏"></i>
      </div>
      <div class="mode-item fr" v-if="barrageSettings.useBarrage">
        <span v-if="barrageSwitch" class="barrage-toggle open" @click.stop="toggleBarrage(false)"></span>
        <span v-else class="barrage-toggle close" @click.stop="toggleBarrage(true)"></span>
      </div>
      <div class="mode-item fr"
           v-if="playType != 'live' && buttonSettings.showPlaySpeed"
           @mouseover.stop="showSpeedBlock=true"
           @mouseout.stop="showSpeedBlock=false">
        <span class="quality-info">倍速</span>
        <transition name="fade">
          <div class="qualitys-box"
              v-show="showSpeedBlock">
            <span :class="{'quality-item':true, active:selectSpeed==idx}"
                  v-for="(item,idx) in speedList"
                  :key="idx"
                  @click="selectPlaySpeed(idx)">{{item.name}}</span>
          </div>
        </transition>
      </div>
      <div class="mode-item fr"
          v-if="showResolution"
          @mouseover.stop="overEvent"
          @mouseout.stop="outEvent">
        <span class="quality-info" v-if="qualitys.length<=0">原画</span>
        <span class="quality-info" v-else>{{qualitys[selectQuality]|fmtQuality}}</span>
        <transition name="fade">
          <div class="qualitys-box"
               v-show="showQualityBlock">
            <span :class="{'quality-item':true, active:selectQuality==idx}"
                  v-for="(item,idx) in qualitys"
                  :key="idx"
                  @click="selectPlayQuality(idx)">{{item|fmtQuality}}</span>
          </div>
        </transition>
      </div>
      <div class="mode-item fr">
        <i v-if="mute"
           @click.stop="muteEvent"
           style="margin-right: 4px;"
           class="iconfont icon-yangshengqiguan"
           title="声音"></i>
        <i v-else
           @click.stop="muteEvent"
           style="margin-right: 4px;"
           class="iconfont icon-yangshengqikai"
           title="声音"></i>
        <div class="mute-block">
          <el-slider v-model="volumeSize"
                     height="100%">
          </el-slider>
        </div>
      </div>
      <div class="mode-item fr mode-live"
        v-if="playType=='live'">LIVE
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import EventBus from 'src/utils/eventBus.js'
const controlTypes = {
  mute: 'mute',
  play: 'play',
  rePlay: 'rePlay',
  volumeSize: 'volumeSize',
  fullScree: 'fullScree',
  selectQuality: 'selectQuality',
  selectSpeed: 'selectSpeed',
  fullBrowser: 'fullBrowser',
  barrageSwitch: 'barrageSwitch',
  progress: 'progress'
}
const controlTypeValues = {
  mute: '声音控制',
  play: '播放控制',
  rePlay: '重新播放',
  volumeSize: '声音大小',
  fullScree: '全屏控制',
  selectQuality: '画质',
  selectSpeed: '倍速',
  fullBrowser: '浏览器-全屏',
  progress: '播放进度'
}
export default {
  name: 'control',
  data () {
    return {
      mute: false, // 是否禁音
      isPlay: true,
      volumeSize: 100,
      tempVolumeSize: 50,
      fullScree: false,
      isFullBrowser: false,
      showQualityBlock: false,
      selectQuality: 0,
      current: 0,
      progress: 0,
      showSpeedBlock: false,
      showBarrageBlock: false,
      barrageSwitch: true,
      speedList: [
        { name: '0.75x', value: 0.75 },
        { name: '1x', value: 1 },
        { name: '1.25x', value: 1.25 },
        { name: '1.5x', value: 1.5 },
        { name: '2x', value: 2 }
      ],
      selectSpeed: 1
    }
  },
  computed: {
    ...mapState('liveMager', {
      buttonSettings: state => state.buttonSettings,
      barrageSettings: state => state.barrageSettings
    }),
    allDate () {
      return this.formatDate(this.totalTime)
    },
    currentDate () {
      return this.formatDate(this.currentTime)
    },
    rate () {
      return 100 * this.currentTime / this.totalTime
    },
    showResolution() {
      return this.playType === 'vod' || (this.playType == 'live' && this.buttonSettings.showResolution)
    }
  },
  props: {
    currentTime: {
      type: Number,
      default: 0
    },
    totalTime: {
      type: Number,
      default: 1000
    },
    qualitys: {
      type: Array,
      default () {
        return [{
          idx: 0,
          def: 'same'
        }]
      }
    },
    currentQuality: Object, // 当前清晰度
    playType: {
      type: String,
      required: true,
      default: '' // 直播(live), 回放(vod), 暖场(warm), 结束(end)
    },
    playState: Boolean,
    filename: String,
    markPoints: {
      type: Array,
      required: false,
      default () {
        return []
      }
    }
  },
  watch: {
    currentTime: {
      handler (newVal) {
        this.current = newVal
      },
      immediate: true
    },
    playState: {
      handler (newVal) {
        this.isPlay = newVal
      },
      immediate: true
    },
    rate: {
      handler (newVal) {
        this.progress = newVal
      },
      immediate: true
    },
    volumeSize (newVal) {
      if (newVal === 0) {
        this.mute = true
      } else {
        this.mute = false
      }
      this.changeControl(controlTypes.volumeSize, newVal)
    },
    currentQuality: {
      handler (newVal) {
        this.qualitys.every((item, idx) => {
          if (item.idx === newVal.idx) {
            return false
          }
        })
      }
    }
  },
  filters: {
    fmtQuality (obj) {
      const val = obj.def
      if (val === 'a') {
        return '音频'
      } else if (val === 'same') {
        return '原画'
      } else if (val === '720p') {
        return '720p'
      } else if (val === '480p') {
        return '480p'
      } else if (val === '360p') {
        return '360p'
      } else if (val === '1080p') {
        return '1080p'
      }
      return '原画'
    }
  },
  created() {
    this.initBusEvent()
  },
  mounted () {
    let timeout = 0
    window.addEventListener('resize', () => {
      if (timeout) return
      timeout = setTimeout(() => {
        clearTimeout(timeout)
        timeout = 0
        if (!document.fullscreenElement) {
          this.fullScree = false
        }
      }, 500)
    }, false)
    if (this.playType !== 'live') {
      // 添加空格键控制播放、暂停
      window.addEventListener('keydown', () => {
        var e = event || window.event
        if (e.keyCode === 32) { // 空格键
          this.playORpause()
        }
      }, false)
    }
  },
  methods: {
    leftRatio (val) {
      return val * 100 / this.totalTime
    },
    changeControl (type, value) {
      this.$emit('control', {
        type: type,
        value: value,
        msg: controlTypeValues[type]
      })
    },
    playORpause () {
      this.playEvent(!this.isPlay)
    },
    selectPlayQuality (idx) {
      if (this.selectQuality === idx) return
      this.selectQuality = idx
      this.changeControl(controlTypes.selectQuality, this.qualitys[idx])
    },
    selectPlaySpeed (idx) {
      if (this.selectSpeed === idx) return
      this.selectSpeed = idx
      this.changeControl(controlTypes.selectSpeed, this.speedList[idx].value)
    },
    formatTooltip (val) {
      return this.formatDate((val / 100) * this.totalTime)
    },
    seekPoint (point) {
      this.progress = (point.timePoint / this.totalTime) * 100
      this.changeVal()
    },
    changeVal () {
      this.changeControl(controlTypes.progress, this.progress)
    },
    muteEvent () {
      this.mute = !this.mute
      if (this.mute) {
        this.tempVolumeSize = this.volumeSize
        this.volumeSize = 0
      } else {
        // 关闭静音时恢复上次设置声音
        this.volumeSize = this.tempVolumeSize ? this.tempVolumeSize : 10
      }
      this.changeControl(controlTypes.mute, this.mute)
    },
    overEvent () {
      this.showQualityBlock = true
    },
    outEvent () {
      this.showQualityBlock = false
    },
    rePlayEvent () { // 重播
      this.changeControl(controlTypes.rePlay, true)
    },
    playEvent (type) {
      this.isPlay = type
      this.changeControl(controlTypes.play, this.isPlay)
    },
    fullScreeEvent () {
      this.fullScree = !this.fullScree
      this.changeControl(controlTypes.fullScree, this.fullScree)
    },
    escfullScreeEvent () {
      this.fullScree = false
      this.changeControl(controlTypes.fullScree, this.fullScree)
    },
    fullBrowser () {
      if (this.fullScree) {
        this.fullScree = false
        this.changeControl(controlTypes.fullScree, this.fullScree)
      }
      this.isFullBrowser = !this.isFullBrowser
      this.changeControl(controlTypes.fullBrowser, this.isFullBrowser)
    },
    toggleBarrage (open = false) {
      this.barrageSwitch = open
      this.changeControl(controlTypes.barrageSwitch, open)
    },
    formatDate (cTime) {
      let h = ((cTime / 3600 >> 0) + '')
      let m = ((cTime / 60 % 60 >> 0) + '').padStart(2, 0)
      let s = ((cTime % 60 >> 0) + '').padStart(2, 0)
      return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`
    },
    initBusEvent () {
      EventBus.$on('changeLayoutView', (videoLayout) => {
        const isVideoLayout = (videoLayout === 'videoLayout')
        this.changeControl(controlTypes.barrageSwitch, isVideoLayout)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .control-box {
    position: relative;
    width: 100%;
    height: 38px;
    line-height: 38px;
    animation: control-animation-hide 1s linear;
    background-color: rgba(0, 0, 0, 0.75);
    text-align: left;
    color: #fff;
    .time-box {
      display: inline-block;
      font-size: 14px;
      margin-left: -10px;
      span {
        color: #ccc;
        &:last-child {
          opacity: 0.8;
        }
      }
    }
    .auto-box {
      margin: 0 10px;
      .mode-item {
        position: relative;
        display: inline-block;
        padding: 0 10px;
        line-height: 38px;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
        color: #fff;
        .iconfont {
          font-size: 14px;
          color: #ccc;
          &:hover {
            color: #ffd021;
          }
        }
        .mute-block {
          display: inline-block;
          width: 90px;
          vertical-align: middle;
          margin-left: 5px;
          /deep/ {
            .el-slider__bar {
              background-color: #ffd021;
              height: 4px;
            }
            .el-slider__button {
              border: none;
              background-color: #fff;
              width: 8px;
              height: 8px;
              box-shadow: 0 0 10px #fff;
            }
            .el-slider__runway {
              border-radius: 2px;
              height: 4px;
              margin: 4px 0;
              background-color: rgba(255, 255, 255, 0.5);
            }
            .el-slider__button-wrapper {
              top: -16px;
            }
          }
        }
        .quality-info {
          width: 46px;
          height: 20px;
          border-radius: 10px;
          background: #222;
          display: inline-block;
          line-height: 1;
          padding: 5px 0;
          overflow: visible;
          &:hover {
            color: #FFD021;
          }
          // background-color: #333;
          // border-radius: 15px;
          // opacity: 0.9;
        }
        .qualitys-box {
          position: absolute;
          bottom: 40px;
          left: 50%;
          width: 120px;
          padding: 8px 0;
          text-align: center;
          transform: translateX(-50%);
          background: #000;
          box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2), 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          opacity: 0.7;
          // border-bottom: 4px solid rgba(255, 255, 255, 0.5);
          border-radius: 4px;
          .quality-item {
            display: block;
            line-height: 36px;
            &:hover {
              cursor: pointer;
              opacity: 0.9;
              color: #5d6afe;
            }
            &.active {
              color: #ffd021;
            }
          }
        }
      }
      .mode-live{
        cursor: default;
      }
    }
    .progress-box {
      /deep/ {
        position: absolute;
        display: block;
        width: 100%;
        top: -7px;
        left: 0;
        .el-slider__bar {
          background-color: #ffd021;
          height: 4px;
        }
        .el-slider__button {
          border: 4px solid rgba(255, 208, 33, 0.5);
          background-color: #ffd021;
          width: 10px;
          height: 10px;
          box-shadow: 0 0 20px #ffd021;
        }
        .el-slider__runway {
          border-radius: 1px;
          height: 4px;
          margin: 4px 0;
          background-color: rgba(255, 255, 255, 0.5);
        }
        .el-slider__button-wrapper {
          position: relative;
          opacity: 0;
          top: -16px;
          transition: opacity 0.2s;
          &:before {
            position: absolute;
            content: '';
            display: block;
            width: 16px;
            height: 16px;
            top: 10px;
            left: 10px;
            border-radius: 50%;
            background-color: rgba(255, 208, 33, 0.3);
          }
        }
      }
      &:hover /deep/ {
        .el-slider__button-wrapper {
          opacity: 1;
        }
      }
      .propress-point {
        position: absolute;
        top: 4px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #fff;
        font-size: 14px;
        z-index: 10;
        .propress-point-tips {
          display: none;
          position: absolute;
          top: -5px;
          left: 50%;
          width: 180px;
          height: 56px;
          padding: 10px;
          line-height: 18px;
          border-radius: 4px;
          color: #FdFdFd;
          word-break: break-all;
          transform: translate(-50%, -100%);
          background-color: rgba(0, 0, 0, .8);
          box-shadow: 0 0 6px rgba(0, 0, 0, .2);
          &.tips-left {
            transform: translate(0, -100%);
          }
          &.tips-right {
            transform: translate(-100%, -100%);
          }
        }
        &:hover {
          cursor: pointer;
          width: 12px;
          height: 12px;
          top: 0px;
          transform: translateX(-2px);
          .propress-point-tips {
            display: block;
          }
        }
      }
    }
    .iconfont {
      vertical-align: middle;
      font-size: 20px;
      color: #f5f5f5;
      &:hover {
        cursor: pointer;
        color: rgb(255, 208, 33);
      }
    }
    .barrage-toggle {
      display: inline-block;
      width: 18px;
      height: 18px;
      background-size: 100%;
      vertical-align: middle;
      &.open {
        background-image: url('~assets/image/barrage_open.png');
      }
      &.close {
        background-image: url('~assets/image/barrage_close.png');
      }
    }
  }
</style>
