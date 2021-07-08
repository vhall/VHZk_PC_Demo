<template>
  <div class="chat-wrap is-watch"
       @click="boxClick"
       :class="{'no-send': !isLogin || mute || allMuted}">
    <div class="bscroll"
        ref="bscroll"
         @mouseover="mouseOverChat"
         @mouseout="mouseOutChat"
        :class="type !== 'live' && statusType !=='PREPARE' ? 'vod' : 'live'"
        :style="{ backgroundImage: customTheme.chatImg ? `url(${this.$imgHost}/${customTheme.chatImg})` : '' }">
      <ol class='chat-list bscroll-container'>
        <template v-for='(item,idx) in filterChat'>
          <li :data-joinId="item.id"
              :data-msgId="item.msg_id"
              :key="idx"
              v-if="item.eventType !== 'RED_PACKET_JOIN'">
            <template v-if='item.msgType === "chat" || item.msgType === "imgChat"'>
              <dl class='clearfix'>
                <dt v-if="item.avatar && item.avatar !== '' && item.avatar.search('null') < 0">
                  <span class="img" :style="{backgroundImage: `url(${item.avatar}?x-oss-process=image/resize,m_lfit,w_50)`}"></span>
                </dt>
                <dt class='avatar' v-else>{{item.name&&item.name.substr(0,1)}}</dt>
                <dd>
                  <div class="name">
                    <span class='nick_name' :class="{'send-person': item.id==(loginInfo.consumer_user_id || loginInfo.visitId)}">
                    <em v-if="item.role==='host'">主持人</em>
                    <em class="assistant" v-if="item.role=='assistant'">助理</em>
                    <span class="user-name" :title="item.name">{{item.name | overHidden(10)}}</span>
                    <i v-if="item.is_gag === 'Y' && item.role !== 'host'" class='iconfont icon-tubiaoku- muted'></i>
                    <template v-if="item.role=='host' || item.role=='assistant'">
                      <span class="been-at" :key="atPerson.user_id" v-for="atPerson of item.at_list">@{{ atPerson.nick_name | overHidden(10) }}</span>
                    </template>
                  </span>
                  </div>
                  <span class="txt" v-html="item.txt"></span>
                  <div v-if="item.msgType === 'imgChat'">
                    <div class="chat-img-list">
                      <div class="chat-img-item"
                           v-for="(imgUrl, imgIdx) in item.img_list"
                           :key="imgIdx"
                           :style="{backgroundImage: `url(${imgUrl}?x-oss-process=image/resize,m_lfit,w_100${isWebp ? '/format,webp' : ''})`}"
                           @click="showImgBrowser(imgIdx, item.img_list)"></div>
                    </div>
                  </div>
                </dd>
              </dl>
            </template>
            <template v-else-if='item.msgType === "marketTool"'>
              <div :class='item.eventType'
                   @click="clickSaleToolItem(item)"
                   class="sales-tool-box">
                <div class='name'>{{item.name}}</div>
                <span v-if="item.eventType === 'LOTTERY_PUSH'">开启了 <em @click='moreInfo("lottery",item)'>抽奖</em>，赶快参加吧</span>
                <span v-if="item.eventType === 'GOODS_PUSH'">推送了 <em @click='moreInfo("goods",item.detail.goods_id)'>商品</em>，赶快看看吧</span>
                <span v-if="item.eventType === 'RECOMMEND_CARD_PUSH'">推送了 <em @click='moreInfo("cards",item.detail.recommend_card_id)'>卡片</em>，赶快看看吧</span>
                <span v-if="item.eventType === 'NAIRE'">推送了 <em @click='moreInfo("ques",item.detail.id)'>问卷</em>，赶快参与吧</span>
                <span v-if="item.eventType === 'RED_PACKET_PUSH'">推送了 <em @click='moreInfo("redpack",item.detail.red_packet_uuid)'>红包雨</em>，赶快去抢吧</span>
              </div>
            </template>
            <!-- 礼物和打赏的聊天 -->
            <template v-else-if='item.msgType === "rewardTool"'>
              <!-- 礼物 -->
              <div class="reward-tool-box" v-if="item.detail.type === 'gift'">
                <p class="nick-name">{{ item.detail.nickname | overHidden(16) }}:</p>
                <p class="gift-name">赠送{{ item.detail.name | overHidden(16) }}</p>
                <div class="gift-info">
                  <span class="gift-img cover-img"
                  :class="[item.detail.system_status === '0' ? 'cover-img' : 'contain-img']"
                  :style="{backgroundImage: `url(${$imgHost}/${item.detail.image_url}?x-oss-process=image/resize,m_lfit,w_100)`}"></span>
                  <span class="gift-num">
                    x<span class="num">{{item.detail.num}}</span>
                  </span>
                </div>
              </div>
              <!-- 打赏 -->
              <div class="reward-tool-box" v-if="item.detail.type === 'reward'">
                <p class="nick-name">{{ item.detail.nickname | overHidden(16) }}:</p>
                <p class="price">{{ `打赏 ${ item.detail.money }元` }}</p>
                <div class="money-img cover-img"></div>
              </div>
            </template>
          </li>
        </template>
      </ol>
      <dl class='empty' v-if='filterChat.length <=0 && historyLoadingEnd'>
        <dt></dt>
        <dd>暂时没有聊天哦～</dd>
      </dl>
      <transition v-if="tipsShow && tipsCount > 0">
        <span class="msg-tips"
              @click='scrollBtm'>有{{tipsCount}}条新消息<i class="iconfont icon-down"></i></span>
      </transition>
      <transition mode="out-in">
        <div class="announce-box" v-if="announceShow">
          <i class='iconfont icon-xiaoxi'></i>
          <com-marquee @over="announceShow = false"
            class="marquee"
            :content="receiveAnnounce"></com-marquee>
          <span class="iconfont icon-close close" @click='announceShow = false'></span>
        </div>
      </transition>
      <transition name="left-right" mode="out-in">
        <div class="atperson-box" v-if="atContent.show">
          <dl class='clearfix at-person-content'>
            <dt v-if="atContent.avatar">
              <span class="img" :style="{backgroundImage: `url(${atContent.avatar}?x-oss-process=image/resize,m_lfit,w_50)`}"></span>
            </dt>
            <dt class='avatar' v-else>{{atContent.nick_name&&atContent.nick_name.substr(0,1)}}</dt>
            <dd>
              <div class="name">
                <span class='nick_name send-person'>
                  <em v-if="atContent.role=='host'">主持人</em>
                  <em class="assistant" v-if="atContent.role=='assistant'">助理</em>
                  <span class="user-name" :title="atContent.nick_name">{{atContent.nick_name | overHidden(10)}}</span>
                  <span class="been-at"> @了你</span>
                </span>
              </div>
              <div class="txt" v-if="atContent.stretch" v-html="atContent.text_content"></div>
            </dd>
          </dl>
          <span v-if="atContent.stretch || atContent.text_content == ''" class="iconfont icon-close close" @click='atContent.show = false'></span>
          <span v-else class="iconfont icon-wenjuan_xialatixialajiantou- stretch" @click='atContent.stretch = true'></span>
        </div>
      </transition>
    </div>
    <!-- 观看端输入框 -->
    <div class="watch-input-zone"
      v-if="role === 'watch' && (type === 'live' || type==='warm' || type==='pre')">
      <!-- 表情 -->
      <transition name="right-left" mode="out-in">
        <div class="face-box"
            @click.stop=""
            v-if='faceOpen'>
          <img :src="`//cnstatic01.e.vhall.com/static/img/arclist/Expression_${index+1}@2x.png`"
              @click.stop="inFace(index)"
              v-for="(item,index) in faceArr"
              :key="index">
        </div>
      </transition>
      <!-- 聊天过滤 -->
      <transition name="fade" mode="out-in">
        <div class="condition-box cur-pt" v-show="filterOpen">
          <div
            class="condition-item"
            :class="{ checked: chatOnlyHost }"
            @click.stop="chatOnlyHost = !chatOnlyHost"
          >
            <span class="check-box">
              <i
                class="iconfont icon-icon-duigou abs-c"
                v-if="chatOnlyHost"
              ></i
            ></span>
            只看主办方
          </div>
          <div
            v-if="hasGiftModule || hasRewardModule"
            class="condition-item"
            :class="{ checked: hideFullScreenEffect }"
            @click.stop="hideFullScreenEffect = !hideFullScreenEffect"
          >
            <span class="check-box">
              <i
                class="iconfont icon-icon-duigou abs-c"
                v-if="hideFullScreenEffect"
              ></i></span
            >屏蔽全屏特效
          </div>
        </div>
      </transition>
      <div class="tool-bar">
        <i class="iconfont icon-biaoqing icon-emoji"
          title='表情'
          :class="{disabled: !isLogin || mute || allMuted }"
          @click='faceOpen = !faceOpen'></i>
        <i class="iconfont icon-gengduo2"
          title='聊天选择'
          @click='filterOpen = !filterOpen'
          ></i>
      </div>
      <div class="watch-send"
          :class="{'no-send': !isLogin || mute || allMuted}">
        <!-- 未登录 -->
        <div v-if="!isLogin" class="none-login-tip"><span @click='loginHandler' class="login">「登录」</span> 参与</div>
        <!-- 禁言 -->
        <template v-else-if='mute || allMuted'>
          <div class='mute-box'>当前禁止发言</div>
        </template>
        <!-- 正常可输入 -->
        <template v-else>
          <textarea class='inp chat'
                    v-model="value"
                    ref="sendBox"
                    @keydown.prevent.13='sendAction'
                    :placeholder="chatPlaceholder">
          </textarea>
        </template>
        <button class='send-btn' :class="{disabled: !isLogin || mute || allMuted}" @click='sendAction'>发送</button>
      </div>
    </div>
    <transition name='fade'>
      <div class="user-join-tips" v-if="tipUserList.length > 0">
        <template v-for="(tip, idx) in tipUserList">
          <div class="user-join-tips-item" v-if="tip.name" :key="idx">
            <div class="user-join-tips-con">
              <span class="join-tips-name">
                {{ tip.name | overHidden(10) }}
              </span>
              <span v-if="tip.type === 'join'">来了</span>
              <span v-else>购买了商品</span>
            </div>
          </div>
        </template>
      </div>
    </transition>
    <transition name='right-left'>
      <template v-if="rewardEffectInfo">
        <div class="reward-effect-box">
          <span class="money-img cover-img" v-if="rewardEffectInfo.type=='reward'"></span>
          <span class="gift-img cover-img" v-if="rewardEffectInfo.type=='gift'"
              :class="{custom: rewardEffectInfo.system_status != 0, 'cover-img': rewardEffectInfo.system_status == '0', 'contain-img': rewardEffectInfo.system_status != '0'}"
            :style="{backgroundImage: `url(${$imgHost}/${rewardEffectInfo.image_url}?x-oss-process=image/resize,m_lfit,w_100)`}">
          </span>
          <span class="nick_name">{{rewardEffectInfo.nickname | overHidden(7)}}</span>
          <span v-if="rewardEffectInfo.type=='reward'">
            打赏
            <span class="money">{{rewardEffectInfo.money}}</span>
            元
          </span>
          <span v-if="rewardEffectInfo.type=='gift'">
            赠送{{rewardEffectInfo.name}}
            <span class="count">
              <span class="multiple">x</span>{{rewardEffectInfo.num}}
            </span>
          </span>
        </div>
      </template>
    </transition>
    <img-browser
      v-if="imgBrowserShow"
      :showIdx="browserIdx"
      :img-list="browserImgList"
      @quit="quitImgBrowser"></img-browser>
  </div>
</template>

<script>
import { ActivityTool, BusTool } from 'src/utils/ConfigTool'
import EventBus from 'src/utils/eventBus.js'
import { mapMutations, mapState, mapGetters } from 'vuex'
import * as types from 'src/store/mutation-types'
import BScroll from 'better-scroll'
import ImgBrowser from 'src/components/img-browser/index'
import WorkerChat from './worker-chat'
export default {
  name: 'chat',
  components: { ImgBrowser },
  data () {
    return {
      isWebp: window.webp,
      activity_id: this.$route.params.id,
      value: '',
      showUploadImg: false,
      imgBrowserShow: false,
      initFinishGroup: false,
      imgList: [],
      browserImgList: [],
      browserIdx: 0,
      valueAnnounce: '',
      receiveAnnounce: '',
      atContent: {
        show: false,
        stretch: false, // 伸展状态
        avatar: '',
        role: '',
        nick_name: '',
        text_content: ''
      },
      service: null,
      chatData: [],
      tipsShow: false,
      announceShow: false,
      faceOpen: false,
      mute: false,
      allMuted: false,
      tipsCount: 0,
      wrapHeight: 0,
      timer: null,
      isLogin: false,
      stopScroll: false,
      newPrivateTip: false,
      maxLength: 100,
      chatPlaceholder: '请输入聊天内容',
      announcePlaceholder: '请输入公告内容',
      imgHost: this.imgHost + '/',
      faceArr: [],
      setWarm: false,
      historyPage: 1,
      pageSize: 40,
      srollLoadmoreDis: 100,
      isEmpty: false,
      firstLoaded: false,
      loadFinish: true,
      msgDistance: 1,
      tipUserList: [],
      historyParams: {},
      historyLoadingEnd: false, // 读取历史记录是否完成
      statusType: '',
      realOnlineNum: 0,
      authChatSwitch: false, // 是否开启聊天审核
      chatGap: 0,
      timeLong: 5000,
      chatFrequency: 0, // 聊天频率
      chatFrequencyLevel: 'low', // 频率等级:low低，mid中，high高， maxHigh
      atPersonList: [], // @用户的操作集合
      live_delay: 5000,
      rewardEffectInfo: null,
      filterOpen: false,
      hideRewardChat: false, // 屏蔽礼物打赏消息(发起端)
      hideFullScreenEffect: false, // 屏蔽礼物打赏全屏特效(观看端)
      chatOnlyHost: false // 只看主办方
    }
  },
  props: {
    type: { // 活动状态 live直播 vod回放
      type: String,
      default: 'live'
    },
    role: {
      type: String,
      default: 'watch'
    },
    isActive: {
      type: Boolean,
      default: false
    },
    showPrivateChat: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      hasRewardModule: 'liveMager/hasRewardModule',
      hasGiftModule: 'liveMager/hasGiftModule'
    }),
    ...mapState('liveMager', {
      activityInfo: state => state.activityInfo, // 活动信息
      visiteInfo: state => state.visiteInfo, // 参会信息
      barrageSettings: state => state.barrageSettings,
      customTheme: state => state.customTheme
    }),
    ...mapState('login', {
      loginInfo: (state) => state.loginInfo
    }),
    filterChat() {
      if (this.chatOnlyHost) {
        return this.chatData.filter(msg => {
          return msg.role === 'host' || msg.role === 'assistant' || msg.msgType === 'marketTool'
        })
      } else if (this.hideRewardChat) {
        return this.chatData.filter(msg => {
          return msg.msgType !== 'rewardTool'
        })
      } else {
        return this.chatData
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.gapInterval)
    this.gapInterval = null
  },
  mounted () {
    this.statusType = this.activityInfo.status
    if (this.activityInfo.warm) {
      this.setWarm = this.activityInfo.warm.enabled === 'Y'
    }
    if (this.role === 'watch') {
      // 初始化真实在线人数
      this.realOnlineNum = this.activityInfo.true_online_num
    }
    this.intPage()
  },
  methods: {
    ...mapMutations('chatLimit', {
      storeMute: types.CHAT_MUTE,
      storeAllMute: types.CHAT_AllMUTE
    }),
    async intPage () {
      if (this.activityInfo.all_gag === 'Y') {
        this.allMuted = true
      }
      this.storeAllMute(this.allMuted)
      this.initWebWorker()
      this.initEvent()
      // 拉取最近聊天记录
      this.getHistroy(this.historyPage)
      // 聊天审核状态
      this.initAuthInfo()
      this.initSdk()
      this.initScroll()
    },
    initWebWorker () {
      if (typeof Worker !== 'undefined') {
        /* 如果支持Worker就创建worker对象 */
        this.webWorker = new Worker(
          URL.createObjectURL(new Blob([`(${WorkerChat.toString()})()`]))
        )
        this.webWorker.onmessage = (e) => {
          /* 接收到处理好的消息 */
          this.chatData = e.data.chatList
          this.scrollBottom()
        }
      } else {
        /* 如果支持Worker就创建WorkerChat对象 */
        this.runWorker = new WorkerChat()
      }
    },
    initEvent () {
      EventBus.$on('GROUP_SUCCESS', () => {
        this.initFinishGroup = true
      })
      EventBus.$on('newPrivateTip', (b) => {
        this.newPrivateTip = b
      })
      EventBus.$on('member-mute', user => { // 通过成员列表禁言
        this.chatData.forEach((chat) => {
          if (chat.id === user.activity_user_id) {
            chat.is_gag = user.is_gag
          }
        })
      })
      EventBus.$on(BusTool.realOnlineNum, (num) => {
        // 初始化真实在线人数
        this.realOnlineNum = num
      })
      // 发送口令
      EventBus.$on(BusTool.sendPassword, (msg) => {
        this.value = msg
        this.sendAction('redBag')
      })
      // 发送抽奖口令
      EventBus.$on(BusTool.sendLotteryPassword, (msg) => {
        this.value = msg
        this.sendAction('lottery')
      })
      EventBus.$on(BusTool.LIVE_DELAY, (time) => {
        // 直播延迟时间
        this.live_delay = Math.round(time + 3) * 1000
      })
    },
    async initSdk () {
      const VhallSdk = window.VHALL_ZK
      this.faceArr = VhallSdk.$chat.getEmojiArr()
      VhallSdk.$chat.onChat(this.listenChat)
      VhallSdk.$event.on(VhallSdk.EVENTS.JOIN, this.userJoin)
      VhallSdk.$event.on(VhallSdk.EVENTS.LEAVE, this.userLeave)
      VhallSdk.$event.on(VhallSdk.EVENTS.ANNOUNCEMENT, this.listenAnnounce)
      VhallSdk.$event.on(VhallSdk.EVENTS.KICK, this.listenKick) // 踢出
      VhallSdk.$event.on(VhallSdk.EVENTS.KICK_BATCH, this.listenBatchKick)
      VhallSdk.$event.on(VhallSdk.EVENTS.DISABLE_KICK, this.listenCancelkick)
      VhallSdk.$event.on(VhallSdk.EVENTS.GAG, this.listenMute) // 禁言
      VhallSdk.$event.on(VhallSdk.EVENTS.DISABLE_GAG, this.listenCancelmute)
      VhallSdk.$event.on(VhallSdk.EVENTS.GAG_ALL, this.listenAllmute)
      VhallSdk.$event.on(VhallSdk.EVENTS.DISABLE_GAG_ALL, this.listenCancelallmute)
      VhallSdk.$event.on(VhallSdk.EVENTS.DELETE_MESSAGE, this.delChartByMsgId)
      VhallSdk.$event.on(VhallSdk.EVENTS.CHAT_ADGED, this.initAuthInfo)
    },
    initAuthInfo () {
      let timeOut = 0
      if (this.authChatSwitch) {
        timeOut = 2000
      }
      let s = setTimeout(() => {
        clearTimeout(s)
        window.VHALL_ZK.$api.getChatSetting().then((res) => {
          this.authChatSwitch = res.data.auth_chat === 1 // 自动审核：1.开启 2.关闭
        })
      }, timeOut)
    },
    clickSaleToolItem (item) {
      let detailItem = { ...item.detail }
      EventBus.$emit(detailItem.type, detailItem)
    },
    async sendAction (type) {
      /* 1，校验聊天内容,有@人时可以不输入内容, 发送图片时可以不输入内容 */
      if (!this.value.replace(/\n|\s/g, '').length && !this.atPersonList.length && !this.imgList.length) {
        this.chatPlaceholder = '聊天内容不能为空'
        let st = setTimeout(() => {
          clearTimeout(st)
          if (this.value.length <= 0) {
            this.chatPlaceholder = '请输入聊天内容'
          }
        }, 3000)
        return false
      } else if (this.value.length > 115) {
        this.$toast({
          content: '聊天内容太长 请重新输入',
          position: 'top-center'
        })
        return false
      }
      /* 2，确定角色 */
      let role = 'watch'
      /* 3，组织内容进行聊天发送 */
      const obj = {
        txt: this.value.trim() // 输入内容
      }
      if (!(type === 'redBag' || type === 'lottery')) { // 不是红包和抽奖
        /* 4，根据在线人数,对观众进行聊天频次限制 */
        if (this.chatGap > 0) {
          this.$toast(`您的手速过快，请${this.chatGap}秒后重试`)
          return
        }
        if (role === 'watch') {
          this.chatGap = this.delayTime(this.realOnlineNum)
        } else {
          // 主持人，助理 永远 0秒
          this.chatGap = 0
        }
        this.gapInterval = setInterval(() => {
          this.chatGap--
          if (this.chatGap <= 0) {
            clearInterval(this.gapInterval)
            this.gapInterval = null
            this.chatGap = 0
          }
        }, 1000)
      }
      if (type === 'redBag' || type === 'lottery') {
        if (type === 'redBag') {
          EventBus.$emit(BusTool.red_packet, {
            condition: 2,
            password: this.value
          })
        } else if (type === 'lottery') {
          EventBus.$emit(BusTool.lottery_send, {
            password: this.value
          })
        }
        obj.passbarrage = 'Y'
        obj.auditStatus = 1 // 自动绕过聊天审核
      }
      let chat = await window.VHALL_ZK.$chat.sendChat(obj, 'chat')
      if (this.authChatSwitch) { // 聊天审核打开
        this.listenChat({
          msgId: chat.msgId,
          data: {
            text_content: obj.txt,
            type: 'text'
          },
          context: {
            role: 'watch',
            consumer_user_id: this.loginInfo.consumer_user_id || this.loginInfo.visit_id,
            nick_name: this.loginInfo.nick_name,
            avatar: this.loginInfo.avatar
          },
          msgType: 'self'
        })
      }
      /* 7，回归数据 */
      this.value = ''
      this.chatPlaceholder = '请输入聊天内容'
      this.faceOpen = false
      this.atPersonList = []
      this.imgList = []
      this.showUploadImg = false
    },
    quitImgBrowser () {
      this.imgBrowserShow = false
      this.browserIdx = 0
      this.browserImgList = []
    },
    showImgBrowser (idx, imgList) {
      this.imgBrowserShow = true
      this.browserIdx = idx
      this.browserImgList = imgList
    },
    autoAnalysis () {
      this.chatFrequency++
      if (!this.freqTime) {
        this.freqTime = setTimeout(() => {
          clearTimeout(this.freqTime)
          this.freqTime = null
          if (this.chatFrequency > 80) {
            this.chatFrequencyLevel = 'maxHigh'
          } else if (this.chatFrequency > 40) {
            this.chatFrequencyLevel = 'high'
          } else if (this.chatFrequency > 30) {
            this.chatFrequencyLevel = 'mid'
          } else {
            this.chatFrequencyLevel = 'low'
          }
          // console.log(`count=${this.chatFrequency},  level=${this.chatFrequencyLevel}`)
          this.chatFrequency = 0
        }, 5000)
      }
    },
    listenChat (msg) {
      /* 1，如果开启聊天审核, 不接收自己消息 */
      if (msg.context.role === 'watch' && this.authChatSwitch && msg.context.UUID === window.$uuid && (msg.msgType !== 'self' && msg.data.zkType !== 'GIFT_CHAT' && msg.data.zkType !== 'REWARD_CHAT')) {
        return
      }
      if (msg.msgType !== 'chat' && msg.msgType !== 'self') { // 不是聊天消息直接拒绝接收
        /* disable 禁言频道内某个用户的聊天（频道内单个用户的禁言）
        disable_all 禁言整个频道的聊天（全员禁言）
        permit 取消禁言频道内某个用户的聊天（取消频道内单个用户的禁言）
        permit_all 取消禁言整个频道的聊天 （取消全员禁言）
        * */
        return
      }
      /* 自动分析聊天 */
      this.autoAnalysis()
      if (msg.data.zkType === 'MARKET_TOOL') {
        /* 根据直播延迟时间延迟处理营销工具推送消息 */
        let sTime = setTimeout(() => {
          clearTimeout(sTime)
          this.nextListenChat(msg)
        }, this.live_delay)
      } else {
        this.nextListenChat(msg)
      }
    },
    nextListenChat (msg) {
      /* 2，格式化聊天内容 */
      this.reArrange(msg, 'push')
      /* 3，滚动和聊天计数 */
      if (this.tipsShow && msg.msgType === 'chat') {
        this.tipsCount++
      }
      /* 4，@聊天提醒 */
      if (msg.data.zkType === 'at' && msg.data.at_list.length) {
        const atSelf = msg.data.at_list.find(atPerson => {
          return atPerson.user_id == this.loginInfo.consumer_user_id || atPerson.user_id == this.visiteInfo.visit_id
        })
        if (atSelf) {
          this.atPersonTip(msg)
        }
      }
      /* 5，发弹幕 */
      if (!['MARKET_TOOL', 'REWARD_CHAT', 'GIFT_CHAT'].includes(msg.data.zkType)) {
        const text = msg.data.text_content
        if (!msg.data.passbarrage && text !== '') { // 过滤掉口令的绕过弹幕标识和发送@消息-图片消息的空信息
          this.sendBarrage(text)
        }
      }
      if (!this.webWorker) {
        this.scrollBottom()
      }
    },
    reArrange (msg, type) {
      msg.data = msg.data || msg.msg_data
      msg.msg_id = msg.msgId || msg.msg_id
      let params = {
        msg: msg,
        type: type,
        faceArr: this.faceArr,
        chatFrequencyLevel: this.chatFrequencyLevel,
        host: this.$imgHost,
        watch_type: this.type
      }
      if (this.webWorker) {
        /* 浏览器支持Worker */
        this.webWorker.postMessage({
          type: 'chat',
          params: params
        })
      } else {
        /* 不支持Worker，使用formatChat方法处理 */
        this.runWorker.formatChat(params)
        this.chatData = this.runWorker.chatData
      }
    },
    listenAnnounce (msg) {
      // 如果是发起端 则弹窗公告
      this.announceShow = true
      this.receiveAnnounce = msg.content
    },
    listenBatchKick (msg) { // 批量踢出
      console.log('--------批量踢出---------')
      let userList = msg.activity_user_id.join(',')
      userList.every((user_id) => {
        if (this.isSelf(user_id)) {
          this.$router.push('/kicked')
          return false
        }
        this.refreshList(user_id, 'is_kick', 'Y')
        return true
      })
    },
    listenKick (msg) {
      if (this.isSelf(msg.activity_user_id)) {
        this.$router.push('/kicked')
      } else {
        this.refreshList(msg.activity_user_id, 'is_kick', 'Y')
      }
    },
    listenCancelkick (msg) {
      this.refreshList(msg.activity_user_id, 'is_kick', 'N')
    },
    listenMute (msg) {
      if (this.isSelf(msg.activity_user_id)) {
        this.mute = true
      }
      this.refreshList(msg.activity_user_id, 'is_gag', 'Y')
      this.storeMute(this.mute)
    },
    listenCancelmute (msg) {
      // 如果是自己 的相关操作
      if (this.isSelf(msg.activity_user_id)) {
        this.mute = false
      }
      this.refreshList(msg.activity_user_id, 'is_gag', 'N')
      this.storeMute(this.mute)
    },
    listenAllmute () {
      this.allMuted = true
      this.storeAllMute(this.allMuted)
      this.$toast({
        content: '已开启全体禁言',
        position: 'top-center'
      })
    },
    listenCancelallmute () {
      this.allMuted = false
      this.storeAllMute(this.allMuted)
      this.$toast({
        content: '已取消全体禁言',
        position: 'top-center'
      })
    },
    delChartByMsgId (msg) {
      this.chatData.every((chartItem, idx) => {
        if (chartItem.msg_id === msg.msg_id) {
          this.chatData.splice(idx, 1)
          return false
        }
        return true
      })
      if (this.webWorker) {
        this.webWorker.postMessage({
          type: 'reset_chat_data',
          chatData: this.chatData
        })
      }
    },
    isSelf (id) {
      const compareId = this.loginInfo.consumer_user_id || this.visiteInfo.visit_id
      if (compareId === id) {
        return true
      } else {
        return false
      }
    },
    refreshList (id, type, status) {
      this.chatData.forEach(item => {
        if (item.id * 1 === id * 1) {
          item[type] = status
        }
      })
    },
    userLeave () {
      if (this.role === 'watch') {
        this.realOnlineNum -= 1
      }
    },
    userJoin (msg) {
      if (this.role === 'watch') {
        this.realOnlineNum += 1
      }
      if (this.loginInfo && this.loginInfo.consumer_user_id === msg.context.consumer_user_id) {
        // 当前用户
        return
      }
      let obj = {
        msg_id: msg.msgId || msg.msg_id,
        type: 'join',
        name: msg.context.nick_name
      }
      // this.pushTipData(obj)
      this.pushTipDataOne(obj)
    },
    atPersonTip (msg) {
      this.atContent.show = true
      this.atContent.stretch = false
      this.atContent.text_content = msg.data.text_content
      this.atContent.avatar = msg.context.avatar
      this.atContent.role = msg.context.role
      this.atContent.nick_name = msg.context.nick_name
      // 与消息处理相同的表情和头像处理
      this.atContent.avatar = msg.avatar
      if (this.atContent.avatar && this.atContent.avatar.indexOf('//') !== 0 && this.atContent.avatar.indexOf('https') !== 0) {
        this.atContent.avatar = this.atContent.avatar ? `${this.$imgHost}/${this.atContent.avatar}` : ''
      }
      /* 替换表情图片 */
      for (let i = 0; i < this.faceArr.length; i++) {
        for (let key in this.faceArr[i]) {
          let test = key.replace(/\[/, '\\[').replace(/\]/, '\\]')
          let reg = new RegExp(test, 'g')
          this.atContent.text_content = this.atContent.text_content.replace(
            reg,
            "<img src='//cnstatic01.e.vhall.com/static/img/arclist/Expression_" +
            this.faceArr[i][key] +
            "@2x.png'>"
          )
        }
      }
    },
    pushTipDataOne (obj) {
      this.tipUserList = [obj]
      clearTimeout(this.ts)
      this.ts = setTimeout(() => {
        clearTimeout(this.ts)
        this.tipUserList = []
      }, this.timeLong)
    },
    pushTipData (obj) {
      this.tipUserList.push(obj)
      this.timeOutMap = this.timeOutMap || new Map()
      let st = setTimeout(() => {
        clearTimeout(st)
        let idx = this.tipUserList.indexOf(obj)
        if (idx > -1) {
          this.tipUserList.splice(idx, 1)
          this.timeOutMap.delete(obj.msg_id)
        }
      }, 5000)
      this.timeOutMap.set(obj.msg_id, st)
      if (this.tipUserList.length > 3) {
        let delObj = this.tipUserList.shift()
        let timeOutVal = this.timeOutMap.get(delObj.msg_id)
        clearTimeout(timeOutVal)
        this.timeOutMap.delete(delObj.msg_id)
      }
    },
    scrollBottom () {
      this.$nextTick(() => {
        this.aBScroll.refresh()
        this.loadFinish = true
        if (!this.tipsShow && !this.stopScroll) {
          if (this.type === 'live') {
            this.scrollBtm()
          } else {
            let st = setTimeout(() => {
              clearTimeout(st)
              this.scrollBtm()
            }, 200)
          }
        }
      })
    },
    scrollBtm () {
      if (this.historyPage === 1) { // 解决初始化页面时聊天信息加载两页的问题
        let st = setTimeout(() => {
          clearTimeout(st)
          this.firstLoaded = true
        }, 1000)
      }
      if (this.type === 'live') {
        /* 直播时去掉弹性滚动效果，增加性能 */
        this.aBScroll.scrollTo(0, this.aBScroll.maxScrollY)
        this.tipsCount = 0
      } else {
        this.aBScroll.scrollTo(0, this.aBScroll.maxScrollY, 300, 'bounce')
        let st2 = setTimeout(() => {
          clearTimeout(st2)
          this.tipsCount = 0
        }, 300)
      }
    },
    /* 选择表情 */
    inFace (index) {
      for (let key in this.faceArr[index]) {
        this.value += key
      }
      this.$nextTick(() => {
        this.$refs.sendBox.focus()
      })
    },
    mouseOutChat () {
      this.stopScroll = false
    },
    mouseOverChat () {
      this.stopScroll = true
    },
    // 点击关闭聊天区域
    boxClick (e) {
      if (e.target.className.indexOf('icon-emoji') === -1) {
        this.faceOpen = false
      }
      if (e.target.className.indexOf('icon-gengduo2') === -1) {
        this.filterOpen = false
      }
    },
    getHistroy (page) {
      if (this.activityInfo.status === ActivityTool.status.PLAYBACK || this.activityInfo.status === ActivityTool.status.FINISH) { // 回放拉取所有的 并分页
        this.historyParams = {
          activity_id: this.activity_id,
          page: page,
          page_size: this.pageSize
        }
      } else {
        this.historyParams = {
          activity_id: this.activity_id
        }
      }
      if (!this.isEmpty) {
        window.VHALL_ZK.$chat.getChatHistroy(this.historyParams).then((res) => {
          if (res.data.list.length <= 0) {
            this.historyLoadingEnd = true
            this.isEmpty = true
            return
          }
          if (this.role === 'watch' && (this.activityInfo.status === ActivityTool.status.PLAYBACK || this.activityInfo.status === ActivityTool.status.FINISH)) {
            res.data.list.forEach(item => {
              this.reArrange(item)
            })
          } else {
            res.data.list.reverse().forEach(item => {
              this.reArrange(item)
            })
          }
          this.aBScroll.finishPullDown()
          this.$nextTick(() => {
            this.aBScroll.refresh()
            this.loadFinish = true
          })
          if (!this.tipsShow && !this.stopScroll) {
            let st1 = setTimeout(() => {
              clearTimeout(st1)
              this.scrollBtm()
            }, 200)
          }
          if (this.stopScroll) {
            this.tipsShow = true
          }
          this.$nextTick(() => {
            this.historyLoadingEnd = true
            if (page !== 1) { // 不是第一页
              this.aBScroll.scrollTo(0, -1600)
            }
          })
        })
      }
    },
    initScroll () {
      this.$nextTick(() => {
        let bscrollDom = this.$refs.bscroll
        this.aBScroll = new BScroll(bscrollDom, {
          pullDownRefresh: {
            threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
            stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
          },
          scrollbar: {
            fade: false,
            interactive: true
          },
          click: true,
          mouseWheel: true,
          preventDefault: false,
          probeType: 3
        })
        // 滚动结束触发
        this.aBScroll.on('scrollEnd', (pos) => {
          // scrollY接收变量
          if (document.getElementsByClassName('chat-list')[0]) {
            let height = document.getElementsByClassName('chat-list')[0].offsetHeight
            let wrapHeight = document.getElementsByClassName('bscroll')[0].offsetHeight
            this.wrapHeight = wrapHeight
            if ((height * 0.5 > wrapHeight) && (height * 0.5 > pos.y * -1)) {
              this.tipsShow = true
            } else {
              this.tipsShow = false
            }
            if (height * 1 - wrapHeight * 1 <= pos.y * -1) {
              this.tipsCount = 0
            }
          }
          this.aBScroll.refresh()
        })
        if (this.activityInfo.status === ActivityTool.status.PLAYBACK || this.activityInfo.status === ActivityTool.status.FINISH) {
          this.aBScroll.on('scroll', (res) => {
            if (this.loadFinish && !this.isEmpty && this.firstLoaded) {
              if (Math.abs(res.y) <= this.srollLoadmoreDis) {
                this.loadFinish = false
                this.getHistroy(this.historyPage += 1)
              }
            }
          })
        }
      })
    },
    loginHandler () {
      this.$emit('showLogin')
    },
    moreInfo (type, id) {
      this.$emit('clickTools', { 'type': type, 'id': id })
    },
    /**
     * 获取根据人数和系数获取延迟时间
     * @param n 人数
     * @param o 非必传，系数，不传递默认为1
     * @returns {number}
     */
    delayTime (n, o) {
      n = n || 0
      o = o || 1
      let result = 0
      if (n <= 500) {
        result = 3
      } else if (n <= 1000) { // 大于500，小于1000
        result = 10
      } else if (n <= 2000) { // 大于1000，小于2000
        result = 15
      } else if (n <= 5000) { // 大于2000，小于5000
        result = 30
      } else if (n > 5000) { // 大于5000
        result = 60
      }
      return result
    },
    sendBarrage(content) {
      if (!this.barrageSettings.useBarrage) return
      EventBus.$emit('send_barrage', content)
    }
  },
  watch: {
    isActive (newVal) {
      if (newVal) {
        this.aBScroll && this.aBScroll.refresh()
      }
    },
    value (value) {
      if (value.gbLength() > this.maxLength) {
        this.value = value.substring(0, value.gbIndex(this.maxLength) + 1)
      }
    },
    valueAnnounce (value) {
      if (value.gbLength() > this.maxLength) {
        this.valueAnnounce = value.substring(0, value.gbIndex(this.maxLength) + 1)
      }
    },
    'loginInfo.consumer_user_id': {// 观看端 是否已登陆
      handler (newValue) {
        if (newValue) {
          this.isLogin = true
        }
      },
      deep: true,
      immediate: true
    },
    hideRewardChat() { // 切换是否屏蔽礼物消息时,聊天列表滚动到底部
      const st = setTimeout(() => {
        clearTimeout(st)
        this.scrollBtm()
      }, 100)
    },
    hideFullScreenEffect(val) {
      if (val) {
        EventBus.$emit('HIDE_FULL_SCREEN_EFFECT')
      }
    }
  }
}
</script>

<style lang='scss' scoped src="./chat.scss">
</style>
