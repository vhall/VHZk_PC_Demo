<template>
  <div class="watcher-menus">
    <div class="menus-box">
      <span class="menu-btn menu-btn-left"
            :class="{'hide-btn': list_width <= 360}"
            @click="prev"><i class="iconfont icon-zuofanye"></i></span>
      <div class="menus-list-box">
        <div class="menus-list" :style="{width:`${list_width}px`, left: `${translateX}px`}" ref="menusRef">
          <template v-for="(menu, idx) in openedMenu">
            <span class="menus-list-item"
                  :class="{active: activeIdx===idx}"
                  :key="idx"
                  @click="selectMenu(idx)">{{menu.name}}
              <em class="news-tip" v-if="menu.news"></em>
              <!--<em class="nums-tip" v-if="menu.nums">{{menu.nums > 99 ? '99+' : menu.nums}}</em>-->
            </span>
          </template>
        </div>
      </div>
      <span class="menu-btn menu-btn-right"
            :class="{'hide-btn': list_width <= 360}"
            @click="next"><i class="iconfont icon-youfanye"></i></span>
    </div>
    <div class="menus-content">
      <div v-if="selectMenuType==='des'" class="content-info" v-html="desc"></div>
      <div v-if="selectMenuType==='manul'" class="content-info" v-html="selectMenuObj.content"></div>
      <!-- 借用 -->
      <div v-show="selectMenuType==='chat'" class="chat-content">
        <chating :type="playType"
                 role="watch"
                 :isWatch='true'
                 :isActive="selectMenuType==='chat'"
                 ref="chatRef"
                 @showLogin='doLogin'></chating>
      </div>
      <rank-menu v-if="selectMenuType==='list'"
                 :isActive="selectMenuType==='list'"
                 :menu="selectMenuObj"/>
      <live-menu v-if="selectMenuType==='live'"
                 :isActive="selectMenuType==='live'"
                 :menu="selectMenuObj"/>
      <promote-menu v-if="selectMenuType==='promote'"
                 :isActive="selectMenuType==='promote'"
                 :menu="selectMenuObj"/>
    </div>
  </div>
</template>

<script>
import { BusTool, RankListTool } from 'src/utils/ConfigTool'
import { isEleInViewport } from 'src/utils/dom-tool'
import { mapState } from 'vuex'
import EventBus from 'src/utils/eventBus.js'
import Chating from 'components/chat'
import RankMenu from './custom-menu/rank-menu'
import LiveMenu from './custom-menu/live-menu'
import PromoteMenu from './custom-menu/promote-menu'
export default {
  name: 'watch-menus',
  components: { Chating, RankMenu, LiveMenu, PromoteMenu },
  data() {
    return {
      activity_id: this.$route.params.id,
      selectMenuType: '',
      selectMenuObj: {},
      customMenus: [],
      baseWidth: 360,
      list_width: 360,
      activeIdx: '',
      translateX: 0,
      firstClientX: 0,
      moveX: 0,
      mouseDownClentX: 0,
      maxDisX: 0,
      moveEvent: null,
      isClick: true,
      leftDisable: true,
      rightDisable: false
    }
  },
  props: {
    playType: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('liveMager', {
      activityInfo: state => state.activityInfo
    }),
    openedMenu () {
      return this.customMenus.filter(menu => {
        return menu.show === 1
      })
    }
  },
  created () {
    this.initPage()
  },
  mounted () {
    this.touchMenuMove()
  },
  methods: {
    initPage () {
      this.initEvent()
      this.initMsgServe()
      this.getCustomMenu()
    },
    touchMenuMove () {
      let menuEle = this.$refs.menusRef
      menuEle.addEventListener('mousedown', (e) => {
        if (e && e.changedTouches && e.changedTouches.length >= 1) {
          e = e.changedTouches[0]
        }
        this.mouseDownClentX = e.clientX
        this.moveEvent = e
        this.isClick = true
        document.addEventListener('mousemove', this.menuMouseMove, false)
      }, false)
      document.addEventListener('mouseup', (e) => {
        document.removeEventListener('mousemove', this.menuMouseMove, false)
        let s = setTimeout(() => {
          clearTimeout(s)
          this.isClick = true
          this.$refs.menusRef.style.transition = 'left .3s'
        }, 100)
      })
    },
    menuMouseMove (e) {
      if (this.list_width > this.baseWidth) {
        if (e && e.changedTouches && e.changedTouches.length >= 1) {
          e = e.changedTouches[0]
        }
        if (Math.abs(e.clientX - this.mouseDownClentX) < 5) { // 移动距离小于5像素，表示点击事件
          this.isClick = true
          this.$refs.menusRef.style.transition = 'left .3s'
        } else {
          this.isClick = false
          this.$refs.menusRef.style.transition = 'none'
        }
        const moveDisX = e.clientX - this.moveEvent.clientX
        this.moveEvent = e
        this.translateX += moveDisX
        if (moveDisX < 0) { // 鼠标左移动
          if (-this.translateX > this.list_width - this.baseWidth) {
            this.translateX = -(this.list_width - this.baseWidth)
            this.leftDisable = true
            this.rightDisable = false
          }
        } else {
          if (this.translateX > 0) {
            this.translateX = 0
            this.leftDisable = false
            this.rightDisable = true
          }
        }
      }
    },
    initListWidth() {
      let width = 0
      const titleList = document.querySelectorAll('.watcher-menus .menus-list-item')
      titleList.forEach((item) => {
        width += item.offsetWidth
      })
      this.list_width = width + 20
    },
    initEvent () {
      EventBus.$on('MY-RANK', (type) => {
        if (type === RankListTool.BUYER) {
          this.customMenus.every((item, idx) => {
            if (item.inside === 'goods' && item.show === 1) {
              this.selectMenu(idx)
              return false
            }
            return true
          })
        }
      })
    },
    initMsgServe () {
      /* 自定义菜单变动 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.MENU_PUSH, (msg) => {
        if (msg.extra === 2) {
          EventBus.$emit(BusTool.FOOTER_MENUS, msg)
        }
        this.customMenus.every((menu) => {
          if (menu.menu_id === msg.menu_id) {
            menu.show = msg.show
            if (this.selectMenuObj.menu_id === msg.menu_id) { // 变动菜单为当前选中菜单
              this.selectFirstMenu()
            }
            return false
          }
          return true
        })
      })
      VHALL_ZK.$chat.onChat(() => {
        this.newsMsg('chat')
      })
    },
    selectFirstMenu () {
      this.customMenus.every((menu, idx) => {
        if (menu.show === 1) {
          this.selectMenu(idx)
          return false
        }
        return true
      })
    },
    prev() {
      if (this.activeIdx === 0) return
      const idx = this.activeIdx - 1
      this.rightDisable = false
      this.selectMenu(idx)
    },
    next() {
      if (this.activeIdx === (this.openedMenu.length - 1)) return
      const idx = this.activeIdx + 1
      this.leftDisable = false
      this.selectMenu(idx)
    },
    selectMenu (idx) {
      if (!this.isClick) return
      this.activeIdx = idx
      this.customMenus[idx].news = false
      this.selectMenuObj = this.openedMenu[idx]
      this.selectMenuType = this.selectMenuObj.inside
      if (idx === (this.openedMenu.length - 1)) {
        this.rightDisable = true
        this.leftDisable = false
      } else if (idx === 0) {
        this.leftDisable = true
        this.rightDisable = false
      }
      if (this.selectMenuType === 'chat') { // 聊天
        this.$nextTick(() => {
          this.$refs.chatRef.scrollBtm()
        })
      }
      this.$nextTick(() => {
        let activeMenu = document.querySelector('.menus-list .menus-list-item.active')
        this.translateX = this.translateX - isEleInViewport(activeMenu)
      })
    },
    getCustomMenu () {
      window.VHALL_ZK.$api.getActivityMenuList().then(res => {
        let arr = []
        res.data.forEach((item) => {
          if (item.inside !== 'doc') {
            if (item.extra === 2) {
              EventBus.$emit(BusTool.FOOTER_MENUS, item)
              return // 屏蔽底部布局烦死
            }
            item.news = false
            if (item.inside === 'des' && this.desc) {
              arr.push(item)
            } else if (item.inside !== 'des') {
              arr.push(item)
            }
          }
        })
        this.customMenus = [...this.customMenus, ...arr]
        this.selectFirstMenu()
      })
    },
    slipeX (type) {
      this.leftDisable = false
      this.rightDisable = false
      if (type === 'left') {
        let len = this.list_width - this.baseWidth - Math.abs(this.translateX)
        if (len <= 0) {
          this.rightDisable = true
        } else {
          if (len > 50) {
            this.translateX -= 50
          } else {
            this.translateX -= len
          }
        }
      } else {
        if (this.translateX < -50) {
          this.translateX += 50
        } else {
          this.translateX = 0
          this.leftDisable = true
        }
      }
    },
    doLogin () {
      EventBus.$emit(BusTool.DO_LOGIN)
    },
    newsMsg (type) {
      if (this.selectMenuType !== type) {
        this.customMenus.every((item) => {
          if (item.inside === type) {
            item.news = true
            return false
          }
          return true
        })
      }
    }
  },
  watch: {
    openedMenu: {
      handler () {
        this.$nextTick(() => {
          this.initListWidth()
          let s = setTimeout(() => {
            clearTimeout(s)
            this.initListWidth()
          }, 100)
        })
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
  @import "assets/css/mixin.scss";
  .watcher-menus {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .menus-box {
      position: relative;
      width: 100%;
      height: 44px;
      line-height: 44px;
      border-bottom: solid 1px #e2e2e2;
      font-size: 0;
      overflow: hidden;
      .menu-btn {
        position: relative;
        display: inline-block;
        width: 20px;
        height: 100%;
        background-color: #fff;
        text-align: center;
        font-size: 14px;
        vertical-align: middle;
        opacity: 1 !important;
        z-index: 2;
        &.hide-btn {
          visibility: hidden;
        }
        &:hover {
          cursor: pointer;
          color: $color-default-hover;
        }
        &.menu-btn-left {
          left: 6px;
        }
        &.menu-btn-right {
          right: 6px;
        }
        &.disabled {
          color: #ccc;
        }
        .iconfont {
          font-size: 14px;
        }
      }
      .menus-list-box {
        position: relative;
        display: inline-block;
        width: calc(100% - 40px);
        height: 100%;
        font-size: 14px;
        vertical-align: middle;
        overflow: hidden;
        .menus-list {
          position: absolute;
          top: 0;
          left: 0;
          font-size: 14px;
          user-select: none;
          transition: left .3s;
          .menus-list-item {
            position: relative;
            display: inline-block;
            padding: 0 10px;
            font-weight: 600;
            color: #555;
            &:hover {
              cursor: pointer;
              opacity: .9;
            }
            &.active {
              color: $color-default;
              &:after {
                display: block;
                content: '';
              }
            }
            &:after {
              display: none;
              position: absolute;
              bottom: 2px;
              left: 50%;
              width: 34px;
              transform: translateX(-50%);
              height: 3px;
              border-radius: 2px 2px 0 0;
              background-color: $color-default;
            }
            .news-tip {
              width: 10px;
              height: 10px;
              position: absolute;
              right: 5px;
              top: 10px;
              border-radius: 50%;
              background: $color-red;
            }
            .nums-tip {
              display: inline-block;
              position: absolute;
              top: 4px;
              right: -2px;
              height: 14px;
              line-height: 14px;
              padding: 0 4px;
              border-radius: 14px;
              font-size: 12px;
              background-color: $color-red;
              color: #fff;
            }
          }
        }
      }
    }
    .menus-content {
      width: 100%;
      height: calc(100% - 40px);
      .chat-content {
        display: block;
        width: 100%;
        height: 100%
      }
      .content-info /deep/ {
        height: 100%;
        padding: 15px;
        font-size: 14px;
        overflow: auto;
        text-align: justify;
        word-break: break-all;
        img {
          max-width: 100%;
        }
      }
    }
  }
</style>
