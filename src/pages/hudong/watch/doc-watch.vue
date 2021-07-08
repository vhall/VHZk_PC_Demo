<template>
  <div class="doc-warp" :class="{'small-window': smallWindow}" v-ComLoading="loading">
    <div class="pop-water-cover" v-if="smallWindow">
      <span class="pop-icon" title="点击拖拽" type="drag" v-if="!isMoveing"><i type="drag" class="iconfont icon-tuodong"></i></span>
      <span class="pop-icon" title="还原" type="reset" v-else><i type="reset" class="iconfont icon-yuanwei"></i></span>
      <span class="pop-icon" title="切换" type="changeLayout"><i type="changeLayout" class="iconfont icon-qiehuan"></i></span>
    </div>
    <div class="vh-doc-warp">
      <div class="vh-doc" id="watch_doc_id"></div>
      <div class="none-data" v-if="!loading && !currentDocId">
        <div class="doc-none-img"></div>
        暂未演示文档
      </div>
      <div class="doc-handle" v-if="playType==='live' && !fullScreen && currentDocId && !smallWindow">
        <span title="放大" class="doc-handle-item iconfont icon-fangda1"
              :class="{ active: docToolActive == 'zoomIn' }"
              @click="handlePage('zoomIn')"></span>
        <span title="缩小" class="doc-handle-item iconfont icon-suoxiao"
              :class="{ active: docToolActive == 'zoomOut' }"
              @click="handlePage('zoomOut')"></span>
        <span title="还原" class="doc-handle-item iconfont icon-huanyuan"
              :class="{ active: docToolActive == 'zoomReset' }"
              @click="handlePage('zoomReset')"></span>
        <span title="移动" class="doc-handle-item iconfont icon-yidong1"
              :class="{ active: docToolActive == 'move' }"
              @click="handlePage('move')"></span>
        <span title="全屏" class="doc-handle-item iconfont icon-quanping"
              @click="handlePage('docFull')"></span>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from 'src/utils/eventBus.js'
export default {
  name: 'doc-watch',
  data() {
    return {
      showDoc: false,
      isVod: false,
      isMoveing: false,
      isVideoFullscreen: false,
      docToolActive: '',
      docReady: false,
      fullScreen: false,
      loading: false,
      currentDocId: ''
    }
  },
  props: {
    smallWindow: {
      type: Boolean,
      default: false
    },
    playType: {
      type: String,
      default: '' // 直播(live), 回放(vod), 暖场(warm), 结束(end), 第三方(third)
    }
  },
  beforeDestroy () {
    let docDoc = document.querySelector('.doc-watch-warp')
    if (docDoc) {
      docDoc.removeEventListener('mousedown', this.docWatchDown, false)
    }
  },
  mounted () {
    EventBus.$on('FullScreen', e => {
      this.isVideoFullscreen = e
    })
    this.initDocMove()
    const setFullscreen = () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement
      if (fullscreenElement) {
        this.fullScreen = true
      } else {
        this.fullScreen = false
        EventBus.$emit('DOC_FULL_SCREEN', false)
      }
      this.$nextTick(() => {
        VHALL_ZK.$doc.resize()
      })
    }
    window.addEventListener('fullscreenchange', setFullscreen)
    window.addEventListener('webkitfullscreenchange', setFullscreen)
  },
  methods: {
    initDoc () {
      this.showDoc = true
      this.loading = true
      let s = setTimeout(() => {
        clearTimeout(s)
        this.loading = false
      }, 5000)
      this.$nextTick(() => {
        VHALL_ZK.$doc.init('watch_doc_id')
        /* 当前正在演示文档id */
        VHALL_ZK.$doc.on(VHALL_ZK.EVENTS.DOC_CURRENT_ID, (res) => {
          this.currentDocId = res.id || ''
          this.resetDoc()
        })
        /* 回放正在使用文档id */
        VHALL_ZK.$doc.on(VHALL_ZK.EVENTS.VOD_TIME_UPDATE, (res) => {
          if (this.playType !== 'live') {
            this.currentDocId = res.id || ''
          }
        })
        /* 当前文档加载完成 */
        VHALL_ZK.$doc.on(VHALL_ZK.EVENTS.DOC_LOAD_COMPLETE, () => {
          this.loading = false
        })
        /* 所有文档加载完成 */
        VHALL_ZK.$doc.on(VHALL_ZK.EVENTS.DOC_ALL_COMPLETE, () => {
          this.loading = false
          this.resetDoc()
        })
        /* 回放文件加载完成 */
        VHALL_ZK.$doc.on(VHALL_ZK.EVENTS.DOC_VOD_LOAD_COMPLETE, () => {
          this.loading = false
        })
      })
    },
    changeLayoutView () {
      EventBus.$emit('changeLayoutView')
    },
    resetDoc () {
      VHALL_ZK.$doc.resize()
    },
    initDocMove () {
      let docDoc = document.querySelector('.doc-watch-warp')
      docDoc.addEventListener('mousedown', this.docWatchDown, false)
    },
    handlePage (type) {
      if (['zoomIn', 'zoomOut', 'zoomReset', 'move'].includes(type)) {
        this.docToolActive = type
        VHALL_ZK.$doc[type]()
      } else {
        this.docFullScreen()
      }
    },
    docFullScreen() {
      let element = document.querySelector('.play-video-box')
      // 判断是否已经是全屏
      // 如果是全屏，退出
      if (this.fullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        console.log('已还原！')
      } else {
        // 否则，进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
        EventBus.$emit('DOC_FULL_SCREEN', true)
        console.log('已全屏！')
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
      let docBar = document.querySelector('.doc-watch-warp')
      if (!docBar) return
      if (e.pageY < 200) {
        docBar.setAttribute('class', 'doc-watch-warp long-touch top-sector')
      } else {
        docBar.setAttribute('class', 'doc-watch-warp long-touch')
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
      let docBar = document.querySelector('.doc-watch-warp')
      if (e && e.clientY < 200) {
        docBar.setAttribute('class', 'doc-watch-warp top-sector')
      } else {
        docBar.setAttribute('class', 'doc-watch-warp')
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
      let docBar = document.querySelector('.doc-watch-warp')
      let left = e.clientX - this.disX
      // 计算左右边界
      left = left <= -150 ? -150 : (left >= document.body.clientWidth - 150 ? document.body.clientWidth - 150 : left)
      if (left + 60 + 400 >= document.body.clientWidth) {
        left = document.body.clientWidth - 400 - 60 - 10
      }
      let top = e.clientY - this.disY
      // 计算上下边界
      top = top < 0 ? 0 : (top >= window.screen.height - 50 ? window.screen.height - 50 : top)
      docBar.style.left = left + 'px'
      docBar.style.top = top + 'px'
      if (e && e.pageY < 200) {
        docBar.setAttribute('class', 'doc-watch-warp long-touch')
      } else {
        docBar.setAttribute('class', 'doc-watch-warp long-touch')
      }
    },
    moveTool () {
      this.$nextTick(() => {
        if (!this.isMove) {
          this.isMove = true
          let docBar = document.querySelector('.doc-watch-warp')
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
      console.log('----resetPosition----')
      this.isMove = false
      let docBar = document.querySelector('.doc-watch-warp')
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

<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';
  .doc-warp {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #222;
    &.small-window {
      .vh-doc-warp {
        .none-data {
          margin-top: -50px;
          font-size: 12px;
          user-select: none;
          .doc-none-img {
            width: 60px;
            height: 60px;
            margin-bottom: 10px;
          }
        }
      }
      &:hover {
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
        z-index: 3;
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
          .iconfont {
            font-size: 18px;
          }
          &:hover {
            cursor: pointer;
            color: #FFD021;
          }
        }
      }
    }
    .vh-doc-warp {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .none-data {
        position: absolute;
        width: 100%;
        top: 50%;
        margin-top: -100px;
        text-align: center;
        color: #888;
        font-size: 16px;
        z-index: 2;
        &:before {
          display: none;
        }
        .doc-none-img {
          width: 150px;
          height: 150px;
          margin: 0 auto 20px auto;
          background-image: url("~assets/image/doc-default.png");
          background-size: cover;
        }
      }
      .vh-doc /deep/ {
        width: 100%;
        height: 100%;
        #VHALL_ZK_DOC_WATCH_ID {
          overflow: hidden !important;
        }
      }
      &:hover .doc-handle {
        display: flex;
      }
      .doc-handle {
        display: none;
        position: absolute;
        left: 50%;
        transform: translate3d(-50%,0,0);
        bottom: 10px;
        padding: 3px 16px;
        background: rgba(0,0,0,.6);
        border-radius: 30px;
        justify-content: space-between;
        align-items: center;
        color: #f7f7f7;
        line-height: 1;
        font-size: 14px;
        user-select: none;
        z-index: 2;
        .doc-handle-item {
          display: inline-block;
          font-size: 18px;
          color: #f7f7f7;
          padding: 7px 10px;
          cursor: pointer;
          &.active {
            color: $color-default-active;
          }
          &:hover {
            color: $color-default-hover;
          }
          &:active {
            color: $color-default-active;
          }
        }
      }
    }
    .doc-cover {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: transparent;
      z-index: 2;
      &:hover {
        background-color: rgba(0, 0, 0, .7);
        .doc-pop-row {
          display: block;
        }
      }
      .doc-pop-row {
        display: none;
        line-height: 32px;
        font-size: 14px;
        text-align: center;
        padding: 5px 0;
        color: #fff;
        &:nth-child(1) {
          margin-top: 70px;
        }
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
</style>
