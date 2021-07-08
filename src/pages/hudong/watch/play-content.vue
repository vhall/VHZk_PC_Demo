<template>
  <div class="watcher" :class="{custom:customBg}">
    <div class="master-box">
      <div class="watch-main-box" :class="{'cover-bg':customBg}" :style="{backgroundImage:`url(${customBg})`}">
        <div class="play-main-box" ref="playMain"
             :style="{overflow: isfullBrowser ? 'hidden' : 'auto', zIndex: isfullBrowser ? 10:2}">
          <div class="main-box-item master-play-box" :style="{width: `${mainItem.width}px`, height: `${mainItem.height}px`}" ref="shoppingArea"
               :class="{'full-browser':isfullBrowser, 'full-watch-screen':isfullScreen, 'full-doc-watch-screen':isDocFullScreen}">
            <div class="master-box-left video-play-item">
              <div class="play-video-box" :class="{'play-doc-box': isDoc, 'doc-layout': layoutDoc}">
                <div class="doc-watch-warp" v-if="isDoc">
                  <doc-watch ref="docWatch"
                             :smallWindow="layoutDoc"
                             :play-type="playType"></doc-watch>
                </div>
                <div class="video-watch-warp">
                  <play-video role="watcher"
                              :smallWindow="!layoutDoc && isDoc"
                              :is-doc="isDoc"
                              :play-type="playType"
                              :startInit="startInit"
                              @fullScreen="fullScreen"
                              @fullBrowser="fullBrowser"></play-video>
                </div>
              </div>
              <div class="zan-box"></div>
            </div>
            <div class="play-bottom">
              <ul class="spread-tool fr">
                <li class="download-doc-file" title='资料下载' v-if="showDownloadSetting" @click="sharePhone('file')"></li>
                <template v-if="playType!=='end'">
                  <li class="ques-btn" v-if="questionStatus.iconShow" title='问卷' @click='clickQues'>
                    <em v-if="questionStatus.redIcon"></em>
                  </li>
                  <li class="red-bag-btn" v-if="downTimer" title="红包雨" @click='clickRedpack'>
                    <em></em>
                    <span class="red-bag-btn-timer">{{downTimer|fmtTimer}}</span>
                    <div class="btn-tip clearfix">
                      <div class="btn-tip-red-bg fl">
                        <img src="../../../assets/image/red-bag-btn-bg.png">
                      </div>
                      <div  class="btn-tip-content fr">
                        <span>红包雨即将来临</span>
                        <span>还剩<span class="timer">{{downTimer|fmtTimer}}</span>到来</span>
                        <span v-if="redBagInfo.condition==0">手速越快，红包可能越大哦~</span>
                        <span v-else-if="redBagInfo.condition==1">开奖前分享直播间参与红包雨活动</span>
                        <span v-else-if="redBagInfo.condition==2">开奖前发送口令参与红包雨活动</span>
                        <span v-else-if="redBagInfo.condition==3">开奖前填写问卷调查参与红包雨活动</span>
                        <span v-if="redBagInfo.condition==2">口令：{{redBagInfo.password}}</span>
                      </div>
                    </div>
                  </li>
                  <li class="award-btn" v-if="lotteryDownTimer" title="抽奖" @click='clickLottery'>
                    <span class="red-bag-btn-timer">{{lotteryDownTimer|fmtTimer}}</span>
                  </li>
                  <li v-if="buttonSettings.showInviteCard && activityInfo.invite_card" class="invita-card-btn" title='邀请卡' @click="inviteCardShow=true"></li>
                  <li class="tool-zan" title='点赞' @click="clickZan()">
                    <em :class="{'zan-w': zan_num > 10000, 'zan-sw': zan_num > 100000}" v-if="zanNumShow">{{zanNumShow}}</em>
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <div class="main-box-item main-menu" :style="{width: `${mainItem.width}px`}" v-if="showBottomMenu">
            <div class="main-menu-header">
              <template v-for="(menu, idx) in bottomMenus">
                <span class="main-menu-item"
                      v-if="menu.show === 1"
                      :class="{active: selectBottomMenuType===menu.inside}"
                      :key="idx"
                      @click="selectBottomMenuType=menu.inside">{{menu.name}}</span>
              </template>
            </div>
            <div class="menu-content activityInfo-detail"
                 v-if="selectBottomMenuType==='des'"
                 v-html="activityInfo.description"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐卡片 -->
    <com-cards v-if="cardData.show" :cardData="cardData" @closeCards='closeCards'></com-cards>
    <message-box v-if="questionsShow"
                 width="700px"
                 header=''
                 confirmText='提交'
                 class="v-questions-box questions-padding"
                 @handleClick="saveQuestions">
      <div class="v-content">
        <div class="v-hearder">
          <div v-if="defaultImg" class="v-question-img" :style="{'background-image': `url(${defaultImg})`}"></div>
          <div v-else class="v-question-img"></div>
          <p class="v-title">
            {{questions.title}}
          </p>
          <p class="v-summary">
            {{questions.description}}
          </p>
        </div>
        <questions ref="tt"
                   :dragData="dragData"
                   :phoneData="phoneData"></questions>
      </div>
    </message-box>
    <message-box v-if="questionsSubmissionShow"
                 width="340px"
                 header=''
                 confirmText='提交'
                 class="v-questions-submission-box"
                 @handleClick="hiddenQuestions">
      <div class="v-content">
        <img src="../../../assets/image/success@2x.png"
             alt="">
        <p>已提交问卷，感谢您的参与</p>
      </div>
    </message-box>
    <message-box v-if="docCodeShow"
                 type="none"
                 width="300px"
                 class="share-wx"
                 header=""
                 @handleClick="docCodeShow=false">
      <div class="wx-watch-box">
        <span class="top-title">请使用微信扫描下载</span>
        <div class="wx-img">
          <img :src="linkArry.watchSrc">
        </div>
      </div>
    </message-box>
    <!-- 邀请卡 -->
    <message-box v-if="inviteCardShow"
                 type="none"
                 width="300px"
                 class="share-wx"
                 header=""
                 @handleClick="inviteCardShow=false">
      <div class="wx-watch-box">
        <span class="top-title">邀请卡</span>
        <div class="wx-img">
          <img :src="inviteCardImg">
        </div>
        <span>手机扫码生成活动邀请卡</span>
      </div>
    </message-box>
    <!-- 手机观看 -->
    <message-box v-if="wxWatchShow"
                 type="none"
                 width="300px"
                 class="share-wx"
                 header=""
                 @handleClick="wxWatchShow=false;wxfriend=false">
      <div class="wx-watch-box">
        <span class="top-title">{{wxfriend ? '分享到微信' : '微信扫描二维码观看直播'}}</span>
        <div class="wx-img">
          <img :src="linkArry.watchSrc">
        </div>
        <span>微信扫码后即可分享网页</span>
      </div>
    </message-box>
    <message-box v-if="wxLinkShow"
                 type="none"
                 width="300px"
                 header=""
                 confirmText=""
                 @handleClick="wxLinkShow = false">
      <div class="wx-content">
        <span>请使用微信扫描查看</span>
        <div class="wx-link">
          <img :src="linkUrl">
        </div>
      </div>
    </message-box>
  </div>
</template>

<script>
import PlayVideo from '../video/index' // 直播推流回放组件
import { mapMutations, mapState } from 'vuex'
import * as types from '../../../store/mutation-types'
import comCards from './sales-t/com-cards'
import questions from './sales-t/questions'
import EventBus from 'src/utils/eventBus.js'
import DocWatch from './doc-watch'
import { SaleTool, ActivityTool, BusTool } from 'src/utils/ConfigTool'
import { ajax } from 'src/utils/ajax'
export default {
  name: 'play-content',
  components: { PlayVideo, comCards, questions, DocWatch },
  data () {
    return {
      isWebP: window.webp,
      activity_id: this.$route.params.id,
      playType: '', // 直播(live), 回放(vod), 暖场(warm), 结束(end)，预告(pre)
      startInit: false,
      isfullBrowser: false,
      isfullScreen: false,
      isDocFullScreen: false,
      templateEnabled: false,
      redBagRainShow: false,
      wxWatchShow: false,
      inviteCardShow: false,
      wxLinkShow: false,
      good_info_url: '',
      wxfriend: false,
      layoutDoc: false,
      showDownloadSetting: false,
      showBottomGoods: false,
      showBottomDesc: false,
      mainItem: {
        width: 740,
        height: 466
      },
      cardData: {
        show: false,
        btn_display: 'Y',
        btn_link: '',
        btn_text: '',
        desc: '',
        pic: 'mp-test/9c/10/9c10d12e6f417d6bd29a911159420290.png',
        push_num: '0',
        recommend_card_id: '0',
        title: '',
        view_num: '0',
        visit_num: '0'
      },
      dragData: [],
      phoneData: [],
      questionsShow: false,
      questions: {
        img_url: '',
        title: '',
        description: ''
      },
      questionStatus: {
        iconShow: false,
        redIcon: false
      },
      showBottomMenu: false,
      selectBottomMenuType: '',
      bottomMenus: [],
      questionsSubmissionShow: false,
      goodsSmallPopoverShow: false, // 弹框显示
      forceShowPush: false, // 是否强制显示
      goodsLen: 0,
      zan_num: 0,
      showQuestion: false,
      docCodeShow: false,
      timerScroll: null,
      stock_status: 'N', // 是否开启库存
      isDoc: false,
      live_delay: 5000,
      MOBILE_HOST: process.env.MOBILE_HOST
    }
  },
  computed: {
    ...mapState('liveMager', {
      activityInfo: state => state.activityInfo,
      roomPaas: state => state.roomPaas,
      customTheme: state => state.customTheme,
      downTimer: state => state.downTimer,
      lotteryDownTimer: state => state.lotteryDownTimer,
      redBagInfo: state => state.redBagInfo,
      visiteInfo: state => state.visiteInfo,
      buttonSettings: state => state.buttonSettings
    }),
    ...mapState('login', {
      loginInfo: state => state.loginInfo
    }),
    linkUrl () {
      let url = `https:${this.MOBILE_HOST}subscribe/${this.activity_id}`
      return `https://aliqr.e.vhall.com/qr.png?t=${encodeURIComponent(url)}`
    },
    zanNumShow () {
      if (this.zan_num < 10000) {
        return this.zan_num
      } else if (this.zan_num < 100000) {
        return parseFloat(this.zan_num / 10000).toFixed(1) + '万'
      } else {
        return '10万+'
      }
    },
    linkArry () {
      let shareId = this.loginInfo.consumer_user_id ? this.loginInfo.consumer_user_id : ''
      shareId = shareId || ''
      let link = encodeURIComponent(`https:${this.MOBILE_HOST}watch/${this.activity_id}?shareId=${shareId}`)
      const linkObj = {
        watchSrc: `https://aliqr.e.vhall.com/qr.png?t=${link}`
      }
      return linkObj
    },
    customBg () {
      const bg = this.customTheme.bgImg
      return bg ? `${this.$imgHost}/${bg}?x-oss-process=image/resize,m_lfit,w_2000${window.webp ? '/format,webp' : ''}` : ''
    },
    defaultImg () {
      return this.questions.img_url ? this.$imgHost + '/' + this.questions.img_url : ''
    },
    inviteCardImg () {
      let userName = this.visiteInfo.visitor_name
      let avatar = ''
      if (this.loginInfo.nick_name) {
        userName = this.loginInfo.nick_name
        avatar = this.loginInfo.avatar ? `${this.$imgHost}/${this.loginInfo.avatar}` : ''
      }
      let params = `user_name=${userName}&avatar=${avatar}&inviter_type=2&business_uid=${this.activityInfo.business_account_id}&inviter_visitor_id=${this.visiteInfo.visitor_id}&inviter_consumer_id=${this.loginInfo.consumer_user_id || ''}`
      return `https://aliqr.e.vhall.com/qr.png?t=${encodeURIComponent(`https:${process.env.MOBILE_HOST}invite-card/${this.activity_id}?${params}`)}`
    }
  },
  filters: {
    fmtTimer (value) {
      let m = ((value / 60 % 60 >> 0) + '').padStart(2, 0)
      let s = ((value % 60 >> 0) + '').padStart(2, 0)
      return `${m}:${s}`
    }
  },
  beforeDestroy () {
    clearInterval(this.publicInterval)
  },
  created () {
    this.initResize()
    this.initEventBus()
  },
  mounted () {
    this.initPage()
  },
  methods: {
    ...mapMutations('login', {
      storeLoginInfo: types.LOGIN_INFO
    }),
    ...mapMutations('liveMager', {
      storeActivityInfo: types.ACTIVITY_INFO,
      storeGoodsVisInfo: types.GOODS_VIS_INFO,
      switchReward: types.REWARD_SWITCH,
      switchGift: types.GIFT_SWITCH
    }),
    initPage () {
      if (!this.activityInfo.business_account_id) {
        return
      }
      if (this.activityInfo.status === 'PREPARE') {
        if (this.activityInfo.warm && this.activityInfo.warm.enabled === 'Y') {
          this.playType = 'warm'
        } else {
          this.playType = 'pre'
        }
      } else if (this.activityInfo.status === 'FINISH') {
        this.playType = 'end'
      } else if (this.activityInfo.status === 'PLAYBACK') {
        this.playType = 'vod'
      } else {
        this.playType = 'live'
      }
      this.startInit = true
      this.zan_num = this.activityInfo.zan_num
      /* 文档初始处理 */
      this.docVideoDealWith()
      this.initMsgServe()
      this.getQuestionsStatus()
      this.getDownloadSetting()
    },
    getDownloadSetting (msg) {
      this.showDownloadSetting = false
      if (msg) {
        let setting = msg.data
        // 开启下载设置
        if (setting.status == 1) {
          if (setting.open_status == 1 || (setting.open_status == 2 && this.playType === 'live') || (setting.open_status == 3 && this.playType === 'vod')) {
            this.showDownloadSetting = true
          }
        }
      } else {
        VHALL_ZK.$api.getDocDownloadSetting().then((res) => {
          let { setting } = res.data
          // 开启下载设置
          if (setting.status == 1) {
            if (setting.open_status == 1 || (setting.open_status == 2 && this.playType === 'live') || (setting.open_status == 3 && this.playType === 'vod')) {
              this.showDownloadSetting = true
            }
          }
        })
      }
    },
    fullScreen (isFull) {
      this.isfullScreen = isFull
    },
    /* 全屏控制 */
    fullBrowser (isFull) {
      this.isfullBrowser = isFull
      this.$emit('fullBrowser', isFull)
    },
    async initMsgServe () {
      const VHALL_ZK = window.VHALL_ZK
      /* 监听开始直播 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.BEGIN_LIVE, (msg) => {
        console.log('--开始直播--消息--')
        const st = setTimeout(() => {
          clearTimeout(st)
          let msgList = document.querySelectorAll('.ve-message-box__wrapper')
          if (msgList && msgList.length) {
            let dom = msgList[msgList.length - 1]
            dom.parentNode.removeChild(dom)
          }
          this.$messageBox({
            header: '提示',
            content: '直播已经开始，马上观看吧',
            type: 'noneClose',
            confirmText: '立即观看',
            handleClick: (e) => {
              if (e.action === 'confirm') {
                this.playType = 'live'
                let temp = JSON.parse(JSON.stringify(this.activityInfo))
                temp.status = ActivityTool.status.LIVING
                temp.status_name = '直播中'
                this.storeActivityInfo(temp)
                this.$nextTick(() => {
                  this.docVideoDealWith()
                  EventBus.$emit('start_live')
                })
              }
            }
          })
        }, 5000)
      })
      /* 监听直播结束 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.FINISH_LIVE, (msg) => {
        console.log('--结束直播--消息--')
        const st = setTimeout(() => {
          EventBus.$emit('end_live')
          this.addEventLiveEnd()
          clearTimeout(st)
        }, 2000)
      })
      /* 监听营销工具消息 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.MARKET_TOOL, (msg) => {
        switch (msg.type) {
          case SaleTool.TOAST_NUM: // 点赞消息
            this.zan_num = msg.toast_num
            this.$zan({ el: '.zan-box' })
            break
          case SaleTool.DOC_DOWNLOAD_SWITCH: // 资料下载开关
            this.getDownloadSetting(msg)
            break
        }
        /* 根据直播延迟时间延迟处理营销工具推送消息 */
        let tTime = setTimeout(() => {
          clearTimeout(tTime)
          // 处理营销工具推送消息
          this.marketTool(msg)
        }, this.live_delay)
      })
    },
    marketTool (msg) {
      switch (msg.type) {
        case SaleTool.RECOMMEND_CARD_PUSH:
          console.log('--推荐卡片--消息--')
          ajax({ method: 'get', abPath: msg.url }).then((data) => {
            this.cardData = { ...data, show: true }
          })
          break
        case SaleTool.NAIRE:
          console.log('--发送问卷--消息--')
          this.showQuestion = false
          if (this.currentQuestionId === msg.id && this.questionsShow) {
          } else {
            this.currentQuestionId = msg.id
            this.questionsShow = false
            this.questionsSubmissionShow = false
            ajax({ method: 'get', abPath: msg.url }).then((data) => {
              let userId = this.loginInfo.consumer_user_id || this.visiteInfo.visitor_id
              const result = data.commit_user_list.every((itemId) => {
                if (itemId.toString() === userId.toString()) {
                  return false
                }
                return true
              })
              if (result) { // 没有提交过问卷
                this.dealWithGetQuestions(data)
              } else {
                this.questionsSubmissionShow = true
                this.questionStatus.iconShow = true
                this.questionStatus.redIcon = false
              }
            })
          }
          break
      }
    },
    initResize () {
      this.resizeWarp()
      window.addEventListener('resize', () => {
        this.resizeWarp()
      }, false)
    },
    resizeWarp () {
      if (document.body.scrollWidth >= 1200) {
        let width = document.body.scrollWidth - 400 - 60
        width = width > 1300 ? 1300 : width
        this.mainItem = {
          width: width,
          height: 9 * width / 16 + 50// 按照16：9计算出高度
        }
      } else {
        this.mainItem = {
          width: 740,
          height: 466
        }
      }
      this.$nextTick(() => {
        VHALL_ZK.$doc.resize()
      })
    },
    initEventBus () {
      EventBus.$on(SaleTool.WXLinkShow, () => {
        this.wxLinkShow = true
      })
      EventBus.$on(BusTool.FOOTER_MENUS, (msg) => {
        this.dealBottomMenus(msg)
      })
      EventBus.$on(BusTool.LIVE_DELAY, (time) => {
        // 直播延迟时间
        this.live_delay = Math.round(time + 3) * 1000
      })
      EventBus.$on('DOC_FULL_SCREEN', (isFull) => {
        this.isDocFullScreen = isFull
      })
      EventBus.$on(BusTool.showQuestion, (id) => {
        this.showQuestion = true
        this.getQuestions(id) // 第二个参数不可重复提交问卷
      })
      EventBus.$on(BusTool.RECOMMEND_CARD_PUSH, (msg) => {
        this.getCardDetails(msg.recommend_card_id)
      })
      EventBus.$on(BusTool.GOODS_PUSH, (msg) => {
        // this.getGoodsDetails(msg.goods_id)
      })
      EventBus.$on(BusTool.NAIRE, (msg) => {
        this.currentQuestionId = msg.naire_id
        this.getQuestions(msg.naire_id) // 第二个参数不可重复提交问卷
      })
      EventBus.$on('changeLayoutView', () => {
        this.layoutDoc = !this.layoutDoc
        this.$nextTick(() => {
          // 重置文档大小
          this.$refs.docWatch.resetDoc()
        })
      })
      // 我的排行榜,去购物
      EventBus.$on('MY-RANK', (type) => {
        if (type === 'share') {
          // 去分享此处借助refs做dom滚动
          this.$refs.playMain.scrollTop = 0
        }
      })
    },
    dealBottomMenus (msg) {
      let isHave = false
      this.bottomMenus.forEach((menu) => {
        if (menu.menu_id === msg.menu_id) {
          menu.show = msg.show
          isHave = true
        }
      })
      if (!isHave) { // 如果没有此菜单
        this.bottomMenus.push({
          ...msg
        })
        this.selectFirstMenu()
      } else {
        // 变动菜单为当前选中菜单
        if (this.selectBottomMenuType === msg.inside) {
          this.selectFirstMenu()
        }
      }
      this.showBottomMenu = false
      // 是否显示底部菜单
      this.bottomMenus.forEach((menu) => {
        // 如果没有简介内容就隐藏此菜单
        if (menu.inside === 'des' && !this.activityInfo.description) {
          menu.show = 2
        }
        if (menu.show === 1) {
          this.showBottomMenu = true
        }
      })
    },
    selectFirstMenu () {
      this.bottomMenus.every((menu) => {
        if (menu.show === 1) {
          this.selectBottomMenuType = menu.inside
          return false
        }
        return true
      })
    },
    addEventLiveEnd () { // 直播结束
      this.playType = 'end'
      let temp = JSON.parse(JSON.stringify(this.activityInfo))
      temp.status = ActivityTool.status.FINISH
      temp.status_name = '结束'
      this.storeActivityInfo(temp)
      if (this.loginInfo && this.loginInfo.consumer_user_id) {
        // 用户已经登录
        if (this.loginInfo.email) { // 有邮箱
          this.$messageBox({
            header: '提示',
            content: '当前直播已结束',
            cancelText: '',
            confirmText: '确定'
          })
        } else { // 没有邮箱
          this.$messageBox({
            header: '提示',
            content: '当前直播已结束，订阅主办方可接收相关活动信息',
            cancelText: '',
            confirmText: '订阅',
            handleClick: (e) => {
              if (e.action === 'confirm') {
                EventBus.$emit('clickSubScribe')
              }
            }
          })
        }
      } else {
        // 用户未登陆
        this.$messageBox({
          header: '提示',
          content: '当前直播已结束',
          cancelText: '',
          confirmText: '确定'
        })
      }
    },
    closeCards () {
      this.cardData.show = false
    },
    saveQuestions (e) {
      if (e.action === 'cancel') {
        this.questionsShow = false
      } else if (e.action === 'confirm') { // 点击确定
        let result = true
        let refs = this.$refs.tt.$refs
        let data = {}
        data.naire_id = this.naireId
        data.ext_data = {}
        data.naire_data = {}
        Object.keys(refs).forEach(key => {
          if (result) {
            let returnData = refs[key][0].check()
            if (!returnData) {
              result = false
            } else {
              data.naire_data[returnData.id] = returnData.value
              switch (returnData.type) {
                case 'phone':
                  data.ext_data.phone = returnData.value
                  data.ext_data.verify_code = returnData.code
                  break
                case 'name':
                  data.ext_data.real_name = returnData.value
                  break
                case 'edu':
                  returnData.list.forEach((item) => {
                    if (returnData.value === item.key) {
                      data.ext_data['education_level'] = item.value
                    }
                  })
                  break
                case 'birth':
                  data.ext_data.birthday = returnData.value
                  break
                case 'area':
                  data.ext_data.address = returnData.value
                  break
                case 'sex':
                  returnData.list.forEach((item) => {
                    if (returnData.value === item.key) {
                      data.ext_data[returnData.type] = item.value === '男' ? 'M' : 'W'
                    }
                  })
                  break
                case 'industry':
                  returnData.list.forEach((item) => {
                    if (returnData.value === item.key) {
                      data.ext_data[returnData.type] = item.value
                    }
                  })
                  break
                case 'email':
                case 'position':
                  data.ext_data[returnData.type] = returnData.value
                  break
                case 'company':
                  data.ext_data[returnData.type] = returnData.value
                  break
              }
            }
          }
        })
        if (result) {
          data.ext_data = JSON.stringify(data.ext_data)
          data.naire_data = JSON.stringify(data.naire_data)
          VHALL_ZK.$api.submitNaire(data).then((res) => {
            this.questionsShow = false
            this.questionStatus.redIcon = false
            EventBus.$emit('red_packet', {
              condition: 3
            })
            this.$toast({
              content: '提交成功',
              position: 'top-center'
            })
          }).catch((err) => {
            if (err.code === 10020) {
              let refs = this.$refs.tt.$refs
              let len = Object.keys(refs).length - 1
              refs[`com${len}`][0].$refs.content.errorTip = '验证码不正确'
            } else if (err.code === 15110) {
              this.questionsShow = false
              this.questionStatus.redIcon = false
              this.$toast({
                content: err.msg,
                position: 'top-center'
              })
            } else {
              this.$messageBox({
                header: '提示',
                content: err.msg,
                confirmText: '确定'
              })
            }
          })
        } else {
          this.$nextTick(() => {
            this.focusInput('.error-msg', '.v-content')
          })
        }
      }
    },
    focusInput (querySelector, pQuerySelector) {
      let qDom = document.querySelectorAll(querySelector)[0]
      let isFlag = true
      while (isFlag) {
        qDom = qDom.parentNode
        if (qDom.className.indexOf('single-select-wrap') !== -1) {
          isFlag = false
        }
      }
      let countHeight = function () {
        let pBox = document.querySelectorAll(pQuerySelector)[0]
        let scrollHeith = qDom.offsetTop - pBox.offsetTop
        return scrollHeith
      }
      if (qDom) {
        let pBox = document.querySelectorAll(pQuerySelector)[0]
        pBox.scrollTop = 0
        let scrollHeith = countHeight() - 20
        let sContTop = 0
        let raF = setInterval(() => {
          sContTop += 5
          pBox.scrollTop = sContTop
          if (sContTop >= scrollHeith) {
            clearInterval(raF)
            // qDom.querySelectorAll('input')[0].focus()
          }
        }, 0)
      }
    },
    hiddenQuestions (e) {
      if (e.action === 'cancel') {
        this.questionsSubmissionShow = false
      }
    },
    getQuestionsStatus () {
      window.VHALL_ZK.$api.getNaireDetail().then((res) => {
        if (res.data && res.data.id) {
          this.questionStatus.iconShow = true
          this.questionStatus.redIcon = true
        }
      }).catch((e) => {})
    },
    getQuestions (id) {
      this.questionsShow = false
      this.questionsSubmissionShow = false
      window.VHALL_ZK.$api.getNaireDetail(id || '').then((res) => {
        this.dealWithGetQuestions(res.data)
      }).catch((error) => {
        if (error.code === 15110) {
          this.questionsSubmissionShow = true
          this.questionStatus.iconShow = true
          this.questionStatus.redIcon = false
        } else {
          this.showQuestion = false
          this.$messageBox({
            header: '提示',
            content: error.msg,
            autoClose: 5,
            confirmText: '确定'
          })
        }
      })
    },
    dealWithGetQuestions (data) {
      this.questionStatus.redIcon = true
      this.questions.img_url = data.img_url
      this.questions.title = data.title
      this.questions.description = data.description
      this.naireId = data.id
      // 兼容detail为空的情况
      this.dragData = []
      data.detail.forEach((item) => {
        item.ext = JSON.parse(item.ext)
        item.detail = item.detail || { is_answer: null, format: '', min: null, max: 0 }
        this.dragData.push(item)
      })
      this.questionStatus.iconShow = true
      this.questionsShow = true
      this.showQuestion = false
      this.$nextTick(() => {
        // 处理select滚动时滚出屏幕外问题
        let s = setTimeout(() => {
          clearTimeout(s)
          let qListDom = document.querySelectorAll('.v-content')[0]
          qListDom.onscroll = () => {
            let inputList = document.querySelectorAll('.el-select .is-focus input')
            inputList.forEach((item) => {
              console.log(item)
              item.click()
            })
          }
        }, 1000)
      })
    },
    clickZan () {
      if (this.countSt) {
        this.$zan({ el: '.zan-box' })
        return
      }
      // 发送点赞
      window.VHALL_ZK.$api.sendZan()
      this.countSt = setTimeout(() => {
        clearTimeout(this.countSt)
        this.countSt = null
      }, 5000)
    },
    getCardDetails (id) {
      window.VHALL_ZK.$api.getCardDetail(id).then((res) => {
        this.cardData = { ...res.data, show: true }
      })
    },
    clickQues () {
      this.showQuestion = true
      this.getQuestions()
    },
    clickRedpack () {
      this.$emit(BusTool.clickRedpack)
    },
    clickLottery () {
      this.$emit(BusTool.clickLottery)
    },
    sharePhone (type) {
      if (type === 'file') {
        this.docCodeShow = true
      } else if (type === 'red') {
        this.wxWatchShow = true
        EventBus.$emit(BusTool.red_packet, {
          condition: 1
        })
      }
      window.VHALL_ZK.$log.userShareLog()
    },
    downEvent(e) {
      console.log('---downEvent---')
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
      console.log('---upEvent---')
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
      left = left <= -150 ? -150 : (left >= window.screen.width - 150 ? window.screen.width - 150 : left)
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
          console.error(docBar.offsetLeft)
          console.error(docBar.offsetTop)
          docBar.style.left = docBar.offsetLeft + 'px'
          if (docBar.style.position === 'fixed') {
            docBar.style.top = docBar.offsetTop + 'px'
          } else {
            docBar.style.top = docBar.offsetTop + 170 + 'px'
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
    },
    docVideoDealWith () {
      this.isDoc = this.activityInfo.layout === 2
      this.$nextTick(() => {
        this.$refs.docWatch && this.$refs.docWatch.initDoc()
      })
    }
  }
}
</script>
<style scoped lang="scss" src="../css/watch.scss"></style>
<style lang="scss">
  @import '~assets/css/mixin.scss';
  .master-box {
    overflow: auto !important;
  }
  .wx-content {
    text-align: center;
    font-size: 16px;
    span {
      display: block;
      margin: 20px 0 16px 0;
    }
    .wx-link{
      margin: 0 auto;
      width: 180px;
      height: 180px;
      padding: 2px;
      border: solid 1px #e2e2e2;
      img{
        width: 100%;
      }
    }
  }
  .goods_small_popover {
    overflow: hidden;
    position: absolute;
    bottom: 55px;
    right: 22px;
    border-radius: 4px;
    z-index: 1000;
    width: 340px;
    height: 110px;
    background-color: white;
    padding-right: 2px;
    cursor: pointer;
    font-size: 0;
    .cover_img {
      display: inline-block;
      position: relative;
      width: 110px;
      height: 110px;
      margin-right: 12px;
      border-radius: 4px 0 0 4px;
      background: no-repeat center;
      background-size: contain;
      vertical-align: middle;
      .brand-name{
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        height: 24px;
        width: 100%;
        line-height: 24px;
        text-align: center;
        background-color: rgba(0, 0, 0, .6);
        color: #fff;
        font-size: 14px;
        word-break: break-all;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .el-icon-close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 20px;
    }
  }
  .questions-padding /deep/ {
    .ve-message-box__container {
      padding-right: 4px !important;
    }
    .ve-message-box__btns {
      text-align: center !important;
    }
  }
  .custom{
    background-color: #fff;
  }
  .share-wx{
    /deep/{
      .ve-message-box__title{
        text-align: center;
      }
    }
  }
</style>
