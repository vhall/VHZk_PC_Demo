<template>
  <div class="watcher-box watch-box" :class="{'full-browser': isfullBrowser}">
    <div class="watcher-header">
      <watch-header :playType="playType"
                    :isShare="showShareTip"
                    :showPersonCount="showPersonCount"></watch-header>
    </div>
    <div class="watcher-content">
      <div class="watch-box-play">
        <play-content v-if="isReady"
                      @fullBrowser="fullBrowser"
                      @clickRedpack='clickRedpack'
                      @clickLottery='clickLottery'
                      :isShare="showShareTip"
                      ref="playContent" ></play-content>
      </div>
      <div class="watch-box-content fr">
        <watch-menus v-if="isReady"
                     :playType="playType"
                     :desc="activityInfo.description"></watch-menus>
      </div>
    </div>
    <!-- 红包雨 -- 降临 -->
    <message-box v-if="redBagTipShow"
        @handleClick="handleRedBagClick">
      <div slot="msgBox"
          class="red-bag-box">
        <span class="close-btn" @click="handleRedBagClick">
          <i class="iconfont icon-close"></i>
        </span>
        <div class="red-bag-content red-bag-content-mid" :style="{top:redBagInfo.condition==0 ? '150px' : '136px'}">
          <p class="red-bag-title" style="font-size: 18px;color: #ffd021;">红包雨还剩{{downTimer|fmtTimer}}到来</p>
          <p class="red-bag-info" v-if="!loginInfo.consumer_user_id">快来登录参与红包雨领取现金吧</p>
          <p class="red-bag-info" v-if="loginInfo.consumer_user_id && redBagInfo.condition==0">手速越快，抢到的红包越大哦~</p>
          <p class="red-bag-info" v-if="loginInfo.consumer_user_id && redBagInfo.condition==1">分享直播链接参与红包雨</p>
          <p class="red-bag-info" v-if="loginInfo.consumer_user_id && redBagInfo.condition==2" style="margin: -12px 0 10px 0;font-size: 12px;">发送口令参与红包雨</p>
          <p class="red-bag-info tip-info" v-if="loginInfo.consumer_user_id && redBagInfo.condition==2">
            <span class="red-bag-tip">{{redBagInfo.password}}</span>
          </p>
          <p class="red-bag-info" v-else-if="redBagInfo.condition==3">填写问卷参与红包雨</p>
          <p class="red-bag-info" v-else-if="redBagInfo.condition==4">邀请{{redBagInfo.ext}}人参与红包雨</p>
        </div>
        <span class="red-bag-info-btn" v-if="!loginInfo.consumer_user_id" @click="clickLoginUser">马上登录</span>
        <span class="red-bag-info-btn" v-if="loginInfo.consumer_user_id && redBagInfo.condition==1" @click="immShare">马上分享</span>
        <span class="red-bag-info-btn" v-if="loginInfo.consumer_user_id && redBagInfo.condition==2" @click="sendPassword(isSent)">{{isSent ? `您已成功发送口令` : `发送口令`}}</span>
        <span class="red-bag-info-btn" v-if="loginInfo.consumer_user_id && redBagInfo.condition==3" @click="immInputQuestions(redBagInfo.ext)">马上填写</span>
      </div>
    </message-box>
    <!-- 红包雨 -- 倒计时-->
    <message-box v-if="redBagTimeDownShow"
                 @handleClick="handleRedBagClick">
      <div slot="msgBox"
           class="red-bag-box">
        <span class="close-btn" @click="handleRedBagClick">
          <i class="iconfont icon-close"></i>
        </span>
        <div class="red-bag-content" style="top: 136px;left: 148px;">
          <p class="red-bag-title" style="font-size: 18px;color: #ffd021;">红包雨降临倒计时</p>
          <span class="time-down">{{timer}}</span>
          <p class="red-bag-info" style='position:relative;bottom:25px;' v-if="!loginInfo.consumer_user_id">快来登录参与红包雨领取现金吧</p>
          <p class="red-bag-info" style="width: 78%;margin: 0 auto;" v-else>点击屏幕上落下的红包手速越快红包越大！</p>
        </div>
        <span class="red-bag-info-btn" :class='{"noLogin":!loginInfo.consumer_user_id}' v-if="!loginInfo.consumer_user_id" @click="clickLoginUser">马上登录</span>
      </div>
    </message-box>
    <!-- 红包雨 -- 抢到红包 -->
    <message-box v-if="redBagShow"
                 type="noneModal"
                 style="top: -10%;"
                 @handleClick="handleRedBagClick">
      <div slot="msgBox"
           class="red-bag-box get-red-bag">
        <span class="close-btn" @click="handleRedBagClick">
          <i class="iconfont icon-close"></i>
        </span>
        <div class="red-bag-content">
          <p class="red-bag-title">恭喜您抢到</p>
          <span class="red-bag-money">￥{{redBagResultInfo.amount}}</span>
          <span class="red-bag-detail"
                style="margin-top: 88px;font-size: 18px;">超过了<span style="color: #fff;">{{redBagResultInfo.percent}}%</span>的小伙伴</span>
          <span class="red-bag-detail" style="font-size: 14px;line-height: 40px;">已收入钱包，请到个人中心提现</span>
          <span class="red-bag-bank-btn" @click="showRedBagList(redBagResultInfo.red_packet_uuid)">查看红包排行</span>
        </div>
      </div>
    </message-box>
    <!-- 红包雨 -- 未抢到红包 -->
    <message-box v-if="redBagNoneShow"
                 type="noneModal"
                 @handleClick="handleRedBagClick">
      <div slot="msgBox"
           class="red-bag-box red-bag-top"
           style="background-color: #fff;">
        <i class="iconfont icon-close"
           @click="handleRedBagClick"></i>
        <p class="red-bag-title" v-if="redBagResultInfo.amount">红包排行榜</p>
        <p class="red-bag-title" v-else>天呐，您与红包擦肩而过～</p>
        <div class="top-content">
          <p class="red-bag-title"><i class="iconfont icon-maisuizuo"></i>手气榜 TOP10<i class="iconfont icon-maisuiyou"></i></p>
          <ul class="red-bag-list">
            <li v-if="redBagrecordList.length<=0">
              <span class="none-data">暂无排行</span>
            </li>
            <li v-else
                v-for="(redBagInfo, rIdx) in redBagrecordList" :key="rIdx">
              <span class="head-icon"
                    v-if="!redBagInfo.avatar"></span>
              <span class="head-icon"
                    v-else
                    :style="{backgroundImage: `url(${redBagInfo.avatar})`}"></span>
              <span class="nick-name">{{redBagInfo.nick_name}}</span>
              <span class="red-bag-money fr">￥{{redBagInfo.amount}}</span>
            </li>
          </ul>
        </div>
      </div>
    </message-box>
    <!-- 抽奖 -- 倒计时 -->
    <message-box
      type="none"
      v-if="showDraw"
      @handleClick="showDraw = false"
      class="lottery-msg">
      <div slot="msgBox" class="lottery-box draw-box">
        <span class="close" @click="showDraw = false">
        </span>
        <div class="draw-pic">
          <img :src="lotteryPic">
        </div>
        <div class="award-info">
          <div class="award-name">{{lotteryInfo.award_name}}</div>
          <div class="award-des">{{lotteryInfo.award_desc|fmtAwardDesc}}<a v-if="lotteryInfo.link_url" :href="lotteryInfo.link_url" target="_blank">查看奖品</a></div>
        </div>
        <div class="lottery-animation-pic" :style="{backgroundImage: `url(${lotteryInfo.icon})`}"></div>
        <div class="draw-tip-txt">
          <!--立即开始 正在抽奖-->
          <p v-if="lotteryInfo.lottery_status == 0 && drawTime == 0" class="drawing">正在进行抽奖…</p>
          <!--间隔开始 等待抽奖-->
          <p v-if="drawTime > 0 && shareCondition" class="draw-down">抽奖还需<span>{{drawTime|fmtTimer}}</span>开始哦～</p>
          <!--口令-->
          <p v-if="loginInfo.mobile && drawTime > 0 && lotteryInfo.lottery_type == 8 && lottery_isSend">您已成功发送口令</p>
          <p v-if="loginInfo.mobile && drawTime > 0 && lotteryInfo.lottery_type == 8 && !lottery_isSend" class="draw-code">发送口令<span class="send-extension">"{{lotteryInfo.extension|ftmExtension}}"</span>参与抽奖吧！</p>
          <!--分享-->
          <p v-if="loginInfo.mobile && drawTime > 0 && lotteryInfo.lottery_type == 9 && !lottery_isShare">赶快分享参与抽奖吧！</p>
          <!--邀请-->
          <p v-if="loginInfo.mobile && drawTime > 0 && lotteryInfo.lottery_type == 10">赶快邀请{{lotteryInfo.invite_number}}位好友参与抽奖吧！</p>
          <p v-if="loginInfo.mobile && drawTime > 0 && lotteryInfo.lottery_type == 10" class="refresh-invite-number" @click.stop="queryInviteToLotteryUsers">刷新邀请列表</p>
          <!--发送口令-->
          <button class="primary-button send-extension-btn" v-if="loginInfo.consumer_user_id && drawTime > 0 && lotteryInfo.lottery_type == 8" :disabled="lottery_isSend" @click.stop="lotterySendChat">{{lottery_isSend ? '发送成功' : '立即发送'}}</button>
          <!--立即分享-->
          <button class="primary-button share-btn" v-if="loginInfo.consumer_user_id && drawTime > 0 && lotteryInfo.lottery_type == 9" :disabled="lottery_isShare" @click.stop="lotteryShare">{{lottery_isShare ? '分享成功' : '立即分享'}}</button>
          <!--填写问卷-->
          <button class="primary-button fill-question" v-if="loginInfo.consumer_user_id && drawTime > 0 && lotteryInfo.lottery_type == 6" @click.stop="handleFillQuestion">填写问卷</button>
          <!--立即邀请-->
          <button class="primary-button invite-btn" v-if="loginInfo.consumer_user_id && drawTime > 0 && lotteryInfo.lottery_type == 10" @click.stop="lotteryShare">立即邀请</button>
          <!--立即下单-->
          <button class="primary-button invite-btn" v-if="loginInfo.consumer_user_id && drawTime > 0 && lotteryInfo.lottery_type == 11" @click.stop="goShopping" :disabled="lottery_isShopping">{{lottery_isShopping ? '下单成功' : '立即下单'}}</button>
          <div class="not-out-link" v-if="loginInfo.consumer_user_id && drawTime > 0 && lotteryInfo.lottery_type == 11">暂不支持外链商品</div>
          <span class="invite-users-list" v-if="loginInfo.mobile && lotteryInfo.lottery_type == 10 && drawTime > 0">已成功邀请{{inviteUsers}}人</span>
          <p class="lottery-no-login" v-if="!loginInfo">快来登录参与抽奖</p>
          <button class="primary-button invite-btn" v-if="!loginInfo.consumer_user_id" @click="clickLoginUser">马上登录</button>
        </div>
      </div>
    </message-box>
    <!-- 抽奖 -- 中奖 和 未中奖  -->
    <message-box
      type="none"
      class="lottery-msg"
      v-if="showDrawResult"
      @handleClick="showDrawResult = false">
      <div slot="msgBox" class="lottery-box draw-success-box">
        <span class="close" @click="showDrawResult = false">
        </span>
        <span class="not-win-test " v-if="!isWin">很遗憾，您与大奖擦肩而过！</span>
        <!-- <span class="not-win-test" v-if="!isWin">感谢您的参与!</span> -->
        <span class="win-test" v-else>恭喜您中奖了!</span>
        <div class="award-pic">
          <img :src="lotteryPic" />
        </div>
        <div class="award-info">
          <div class="award-name">{{lotteryInfo.award_name}}</div>
          <div class="award-des">
            <div>{{lotteryInfo.award_desc|fmtAwardDesc}}<a v-if="lotteryInfo.link_url" :href="lotteryInfo.link_url" target="_blank">查看奖品</a></div>
          </div>
        </div>
        <button class="primary-button" v-if="isWin && lotteryInfo.is_address && !hasFillOutLotteryForm" @click.stop="inputDrawForm">立即领奖</button>
        <button class="primary-button" v-else @click.stop="handleShowWinsList">查看中奖名单</button>
      </div>
    </message-box>
    <!-- 抽奖 -- 填写表单-->
    <message-box
      type="noneModal"
      class="lottery-msg"
      v-if="showDrawForm"
      @handleClick="handleDrawForm">
      <div slot="msgBox" class="lottery-box draw-form-box">
        <span class="close" @click="handleDrawForm">
        </span>
        <div class="draw-pic">
          <img :src="lotteryPic">
        </div>
        <div class="award-info">
          <div class="award-name">{{lotteryInfo.award_name}}</div>
          <div class="award-des">{{lotteryInfo.award_desc|fmtAwardDesc}}<a v-if="lotteryInfo.link_url" :href="lotteryInfo.link_url" target="_blank">查看奖品</a></div>
        </div>
        <span class="form-tip">请填写您的领奖信息，方便主办方与您联系</span>
        <div class="form-box">
          <div class="form-label is-required">
            <!-- <i class="red-star">*</i> -->
            姓名:
          </div>
          <div class="form-content">
            <com-input :maxLength='10'
                       :errorTips="nameErrorTips"
                       @focus="nameErrorTips=''"
                       v-model="winnerInfo.nickname"
                       placeholder="请输入姓名"></com-input>
          </div>
        </div>
        <div class="form-box">
          <div class="form-label is-required">
            <!-- <i class="red-star">*</i> -->
            手机号码:
          </div>
          <div class="form-content">
            <com-input v-model="winnerInfo.phone"
                   :errorTips="phoneErrorTips"
                   @focus="phoneErrorTips=''"
                   class="mobile"
                   type="mobile"
                   placeholder="请输入手机号码"></com-input>
          </div>
        </div>
        <div class="form-box">
          <div class="form-label">地址:</div>
          <div class="form-content">
            <com-input class="award-desc"
                      type="textarea"
                      v-model="winnerInfo.address"
                      placeholder="请输入地址"
                      :value.sync="winnerInfo.address"
            ></com-input>
          </div>
        </div>
        <button @click.stop="handleUploadForm" class="primary-button">提交</button>
      </div>
    </message-box>
    <!-- 抽奖 -- 填写成功 -->
    <message-box
      type="noneModal"
      v-if="showDrawFormSuccess"
      class="lottery-msg"
      @handleClick="showDrawFormSuccess = false">
      <div slot="msgBox" class="lottery-box draw-form-success-box">
        <div class="draw-pic">
          <img :src="lotteryPic">
        </div>
        <span class="close" @click="showDrawFormSuccess = false">
        </span>
        <div class="award-info">
          <div class="award-name">{{lotteryInfo.award_name}}</div>
        </div>
        <div class="pic"></div>
        <span class="success-tip">信息提交成功</span>
        <button class="primary-button" @click="handleShowWinsList">查看中奖名单</button>
      </div>
    </message-box>
    <!-- 抽奖 -- 中奖列表 -->
    <message-box
      type="noneModal"
      v-if="showDrawWinnersList"
      class="lottery-msg"
      @handleClick="showDrawWinnersList = false">
      <div slot="msgBox" class="lottery-box draw-win-list">
        <div class="draw-pic">
          <img :src="lotteryPic">
        </div>
        <span class="close" @click="showDrawWinnersList = false"></span>
        <div class="award-info">
          <div class="award-name">{{lotteryInfo.award_name}}</div>
        </div>
        <div class="win-warp" v-if="winLotteryLists.data && winLotteryLists.data.length > 0">
          <div class="win-wrap-header">
            <div class="title">序号</div>
            <div class="name">昵称</div>
            <div class="phone">手机号</div>
          </div>
          <div class="win-wrap-content">
            <div class="winner-item" v-for="(item, index) in winLotteryLists.data" :key="index">
              <div class="title">{{index >= 9 ? index + 1 : '0' + (index + 1)}}</div>
              <div class="name">
                <!--<img v-if="item.logo" :src="item.logo">-->
                <span v-if="item.logo"
                      class="img_header"
                      :style="{backgroundImage: `url(${item.logo}?x-oss-process=image/resize,m_lfit,w_100${isWebp ? '/format,webp' : ''})`}"></span>
                <span class="no-logo" v-else>{{item.lottery_user_nickname.substring(0, 1)}}</span>
                <span>{{item.lottery_user_nickname|fmtWinnerName}}</span>
              </div>
              <div class="phone">{{item.lottery_user_phone}}</div>
            </div>
          </div>
        </div>
        <div v-else class="none-data">暂无中奖者</div>
      </div>
    </message-box>

    <!-- 抽奖浏览器分享 -->
    <div class="share-link" v-if="showLotteruWindowsShow" @click="showLotteruWindowsShow=false"></div>
    <red-bag-rain v-if="showRedBagRain"
                  @endRain="endRainHandler"
                  @selectOk="selectRedBag"></red-bag-rain>
    <login-sdk v-if="loginSdk" @complete="initPage"/>
  </div>
</template>

<script>
import { BusTool, RedBagTool, LocalKey, DrawTool } from 'src/utils/ConfigTool'
import EventBus from 'src/utils/eventBus.js'
import WatchHeader from './watch-header'
import WatchMenus from './watch-menus'
import PlayContent from './play-content'
import Empty from './empty'
import { mapMutations, mapState } from 'vuex'
import * as types from '../../../store/mutation-types'
import RedBagRain from './red-bag-rain' // 红包雨
import { ajax } from 'src/utils/ajax'
import LoginSdk from 'src/components/login-sdk'
const playTypes = {
  'PREPARE': 'pre',
  'LIVING': 'live',
  'FINISH': 'end',
  'PLAYBACK': 'vod'
}
const playStatuTypes = {
  'PREPARE': '预告',
  'LIVING': '直播中',
  'FINISH': '结束',
  'PLAYBACK': '回放'
}
export default {
  name: 'watch',
  components: { WatchHeader, WatchMenus, RedBagRain, PlayContent, LoginSdk },
  data () {
    return {
      isWebp: window.webp,
      PC_HOST: process.env.PC_HOST,
      activity_id: this.$route.params.id,
      red_packet_uuid: '',
      chat_red_packet_uuid: '',
      currentView: Empty,
      isfullBrowser: false,
      loginSdk: true,
      bgImg: '',
      logImg: '',
      content: '',
      redBagTipShow: false,
      redBagTimeDownShow: false,
      redBagShow: false,
      redBagNoneShow: false,
      timer: 10,
      timerInterval: 0,
      redBagResultInfo: {
        red_packet_uuid: '',
        avatar: '',
        nick_name: '',
        amount: '',
        amount_ranking: '',
        percent: ''
      },
      redBagInfoing: {},
      redBagInfo: {
        condition: '0',
        password: '',
        ext: ''
      },
      showRedBagRain: false,
      autoTime: 0,
      redBagrecordList: [],
      redBagStartTimer: 0,
      redBagStartTimerInterval: 0,
      playType: 'vod',
      isReady: false, // 必要数据是否加载完成
      isSent: false,
      showDraw: false, // 显示抽奖等待等弹窗
      showDrawResult: false, // 抽奖结果
      showDrawForm: false, // 中奖信息填报
      showDrawWinnersList: false, // 抽奖中奖人信息
      showDrawFormSuccess: false, // 中奖信息填报成功
      lottery_id: '',
      chat_lottery_id: '',
      hasFillOutLotteryForm: false, // 是否提交中奖表单
      drawTime: 0, // 抽奖倒计时
      drawCountTimer: null,
      showShareTipTimer: null,
      lottery_isSend: false, // 是否发送口令
      lottery_isShopping: false, // 手否下过单
      lottery_isShare: false, // 是否分享
      showLotteruWindowsShow: false, // 移动端浏览器提示
      showShareTip: false, // 是否显示分享提示
      lotteryInfo: {
        lottery_type: '', // 参与条件 4->全体观众（无限制），6->填写问卷，8->口令参与，9->分享参与，10->邀请人数，11->下单用户
        lottery_status: 1, // 1 抽奖结束 0 正在抽奖
        extension: '', // 口令 问卷id 邀请人数 根据类型判断
        award_name: '',
        image_url: '', // 奖品封面
        link_url: '', // 奖品链接地址 有连接显示简介
        award_desc: '', // 奖品描述
        invite_number: '', // 邀请人数
        is_address: true,
        icon: '' // 抽奖转盘图片url
      },
      winnerInfo: {
        nickname: '',
        phone: '',
        address: ''
      },
      nameErrorTips: '',
      phoneErrorTips: '',
      refreshInviteToLottery: null,
      isWin: false, // 当期账号是否中奖
      inviteUsers: 0, // 所有被邀请参与抽奖用户信息
      winLotteryLists: {
        data: [],
        page: 1,
        page_size: 10,
        total: 0
      },
      onlinePerson: {
        visit_num: 0, // 真实浏览人数
        online_num: 0, // 真实在线人数
        init_online_num: 0 // 虚拟在线人数
      },
      live_delay: 5000,
      showPersonCount: 0
    }
  },
  filters: {
    fmtTimer (value) {
      let m = ((value / 60 % 60 >> 0) + '').padStart(2, 0)
      let s = ((value % 60 >> 0) + '').padStart(2, 0)
      return `${m}:${s}`
    },
    fmtAwardDesc (value) {
      if (value.length > 51) {
        return value.substring(0, 51) + '...'
      } else {
        return value
      }
    },
    ftmExtension (value) {
      if (value.length > 4) {
        return value.substring(0, 4) + '...'
      } else {
        return value
      }
    },
    fmtWinnerName (value) {
      if (value.length > 5) {
        return value.substring(0, 5) + '...'
      } else {
        return value
      }
    }
  },
  computed: {
    ...mapState('liveMager', {
      activityInfo: state => state.activityInfo,
      downTimer: state => state.downTimer
    }),
    ...mapState('login', {
      loginInfo: state => state.loginInfo
    }),
    defaultImg () {
      let avatar = this.loginInfo.avatar
      if (avatar && avatar.indexOf('//') !== 0 && avatar.indexOf('http') !== 0) {
        avatar = avatar ? `${this.$imgHost}/${avatar}` : ''
      }
      return avatar
    },
    lotteryPic () {
      return this.lotteryInfo.image_url ? `${this.$imgHost}/${this.lotteryInfo.image_url}` : ''
    },
    shareCondition () {
      let bool = false
      if ((this.lotteryInfo.lottery_type == 9 && !this.lottery_isShare) ||
        (this.lotteryInfo.lottery_type == 8 && !this.lottery_isSend) ||
        (this.lotteryInfo.lottery_type == 10 && this.inviteUsers <= 0) ||
        (this.lotteryInfo.lottery_type == 11 && !this.lottery_isShopping)
      ) {
        bool = false
      } else {
        bool = true
      }
      return bool
    }
  },
  beforeRouteLeave (to, from, next) {
    document.querySelector('title').innerText = '微吼知客'
    next()
  },
  beforeDestroy () {
    clearInterval(this.timerInterval)
    clearInterval(this.redBagStartTimerInterval)
    this.handleClearDrawProcess()
  },
  created () {
    if (!this.activity_id) {
      this.$router.go(-1)
    }
    // this.initPage()
    this.initEventBus()
  },
  methods: {
    ...mapMutations('login', {
      storeLoginInfo: types.LOGIN_INFO
    }),
    ...mapMutations('liveMager', {
      storeActivityInfo: types.ACTIVITY_INFO,
      storeCustomTheme: types.CUSTOM_THEME,
      storeDownTimer: types.DOWN_TIMER,
      storeLotteryDownTimer: types.LOTTERY_DOWN_TIMER,
      storeRedBagInfo: types.RED_BAG_INFO,
      storeVisiteInfo: types.VISITE_INFO,
      storeBarrageSettings: types.BARRAGE_SETTINGS,
      storeButtonSettings: types.BUTTON_SETTINGS
    }),
    async initPage (params) {
      window.VHALL_ZK.init({
        app_id: params.app_id,
        activity_id: params.activity_id,
        sign: params.sign,
        account: params.account,
        signed_at: params.signed_at,
        refer: this.$route.query.refer || '', // 非必传, 渠道来源: 0邮件，1微信，2短信
        share_id: this.$route.query.share_id || '' // 非必传, 分享人id
      })
      window.VHALL_ZK.$event.on(window.VHALL_ZK.EVENTS.initReady, () => {
        this.loginSdk = false
        this.sdkInitReady()
      })
      window.VHALL_ZK.$event.on(window.VHALL_ZK.EVENTS.ERROR, (e) => {
        console.error(e)
        if (e.code === 50000) { // 套餐用尽
          if (e.data.can_login === 'N') {
            let type = e.data.package === 'FLOW' ? 'off' : 'over'
            window.location.href = `${this.PC_HOST}other/${type}`
          }
        }
      })
      window.VHALL_ZK.$event.on(window.VHALL_ZK.EVENTS.KICK, () => { // 当前用户被踢出
        this.$router.replace('/kicked')
      })
    },
    async sdkInitReady () {
      /* 获取用户详情 */
      let login = window.VHALL_ZK.$api.getUser()
      this.storeLoginInfo(login)
      /* 获取用户绑定的游客信息 */
      let visitorInfo = window.VHALL_ZK.$api.visitorInfo()
      this.storeVisiteInfo(visitorInfo)
      /* 监听消息通知 */
      this.initMsgServe()
      /* 获取活动观看页配置 */
      this.initWatchPageSetting()
      /* 初始化在线人数 */
      this.currentOnlineNum()
      /* 查询活动详情 */
      let activityInfo = window.VHALL_ZK.$api.getActivityInfo()
      activityInfo.status_name = playStatuTypes[activityInfo.status]
      /* 把活动详情存储到vuex */
      this.storeActivityInfo(activityInfo)
      // 匹配
      this.playType = playTypes[activityInfo.status]
      // 如果是预告状态
      if (activityInfo.status === 'PREPARE') {
        /* 查询暖场信息 */
        await window.VHALL_ZK.$api.getWarmInfo().then((res) => {
          activityInfo.warm = res.data
          this.storeActivityInfo(activityInfo)
        })
      }
      this.isReady = true
      /* 邀请卡数据上报 */
      let query = this.$route.query
      if (query.log_type === 'card' && query.card_id) {
        window.VHALL_ZK.$api.logInviteCard({
          business_uid: query.business_uid, // b端用户id
          inviter_type: query.inviter_type, // 邀请人类型，1：主办方，2：c端用户
          invitation_card_id: query.card_id, // 邀请卡id
          inviter_id: query.inviter_consumer_id || query.inviter_visitor_id // 邀请人用户id
        }).then((res) => {
          console.log(res)
        })
      }
    },
    currentOnlineNum () {
      // 通过定时器获取纠正当前在线人数，谨防误差太大
      window.VHALL_ZK.$api.getOnlineNum().then((res) => {
        if (res.data) {
          // 真实浏览人数 res.data.visit_num
          // 真实在线人数 res.data.online_num
          // 虚拟在线人数 res.data.init_online_num
          this.onlinePerson = res.data
          this.showPersonCount = ~~res.data.init_online_num + ~~res.data.visit_num
        }
      })
    },
    initEventBus () {
      EventBus.$on(BusTool.DO_LOGIN, () => {
        if (!this.loginInfo || !this.loginInfo.consumer_user_id) {
          this.doLogin()
        }
      })
      EventBus.$on(BusTool.LIVE_DELAY, (time) => {
        // 直播延迟时间
        this.live_delay = Math.round(time + 3) * 1000
      })
      EventBus.$on(BusTool.RED_PACKET_PUSH, (msg) => { // 点击聊天区域红包
        // 防止快速点击导致的问题
        if (this.red_si) return
        this.red_si = setTimeout(() => {
          clearTimeout(this.red_si)
          this.red_si = null
        }, 1000)
        console.log('----chat-red-bag----')
        console.log(this.timer, this.red_packet_uuid, msg.red_packet_uuid)
        if (this.red_packet_uuid === msg.red_packet_uuid) { // 当前有正在进行的红包
          console.log('push-redBagStartTimer', this.redBagStartTimer)
          if (this.redBagStartTimer > 10) {
            this.redBagTipShow = true
          } else {
            if (this.timer > 0 && this.timer < 10) {
              this.redBagTimeDownShow = true
            } else {
              this.chat_red_packet_uuid = msg.red_packet_uuid
              this.dealWithRedBag(false)
            }
          }
        } else {
          console.log('history-chat')
          this.chat_red_packet_uuid = msg.red_packet_uuid
          this.dealWithRedBag(false)
        }
      })
      EventBus.$on(BusTool.red_packet, (data) => {
        /* 解决聊天时频繁调用红包解锁接口
       * 优化后红包解锁逻辑：
       * 1,当前有红包在进行中
       * 2,红包为口令红包
       * 3,聊天内容符合口令内容
       * 4,没有触发过解锁
       * 5,符合上述4个条件之后每次发起红包，解锁接口将只触发一次 */
        if (this.downTimer || this.timer || this.showRedBagRain) { // 当前有红包活动正在进行
          /*
          * this.isSent==false 没有发送过口令
          * 聊天内容符合红包口令
          */
          if (!this.isSent && this.redBagInfo && ~~this.redBagInfo.condition === 2 && this.redBagInfo.password === data.password) {
            window.VHALL_ZK.$api.unLockRedBag({
              red_packet_uuid: this.red_packet_uuid,
              condition: data.condition,
              password: data.password
            }).then(() => {
              this.isSent = true // 已经发送过口令
            })
          }
        }
        if (data && ~~data.condition === 1) {
          this.sendUserShare()
        }
        if (this.lotteryInfo.lottery_type == 9 && this.lotteryInfo.lottery_status == 0) {
          VHALL_ZK.$log.userShareLog().then(() => {
            this.lottery_isShare = true
          })
        }
      })
      EventBus.$on(BusTool.lottery_send, (msg) => { // 抽奖发送口令
        if (this.lotteryInfo.lottery_status == 0) {
          if (this.lotteryInfo.lottery_type == 8 && !this.lottery_isSend) {
            window.VHALL_ZK.$api.unLockLottery({
              lottery_id: this.lottery_id,
              password: msg.password
            }).then((res) => {
              this.lottery_isSend = true
            })
          }
        }
      })
      EventBus.$on(BusTool.LOTTERY_PUSH, (msg) => { // 点击聊天区域抽奖
        if (this.lotteryInfo.lottery_status == 0 && msg.lottery_id == this.lottery_id) {
          this.showDraw = true
          this.showDrawResult = false
          if (this.lotteryInfo.lottery_type == 11) {
            this.checkIsShopping()
          }
        } else if (this.lotteryInfo.lottery_status == 0 && msg.lottery_id != this.lottery_id) {
          // 获取当前是否中奖
          this.getIsWinLottery(msg.lottery_id)
        } else if (this.lotteryInfo.lottery_status == 1) {
          this.chat_lottery_id = msg.lottery_id
          this.handleClearDrawProcess()
          // 获取当前是否中奖
          this.getIsWinLottery(msg.lottery_id)
        }
      })
      // 我的排行榜,去分享
      EventBus.$on('MY-RANK', (type) => {
        if (type === 'share') {
          this.lotteryShare()
        }
      })
    },
    sendUserShare () {
      VHALL_ZK.$log.userShareLog().then((res) => {
        console.log('用户分享')
      })
    },
    initMsgServe () {
      /* 监听直播结束 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.FINISH_LIVE, () => {
        // 结束直播--消息之后--中断红包雨
        this.stopRedBag()
        this.handleClearDrawProcess()
        this.playType = 'end'
      })
      /* 监听直播开始 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.BEGIN_LIVE, () => {
        this.playType = 'live'
      })
      /* 监听虚拟在线人数 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.INCREMENT_ONLINE, (msg) => {
        console.log('--在线人数--消息--', msg)
        this.onlinePerson.init_online_num = msg.num
        this.showPersonCount = ~~this.onlinePerson.init_online_num + ~~this.onlinePerson.visit_num
      })
      /* 监听真实人员进入直播间 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.JOIN, () => {
        console.log('--进入房间--消息--')
        this.showPersonCount += 1
        this.onlinePerson.online_num += 1
      })
      /* 监听红包，抽奖通知消息 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.MARKET_TOOL, (msg) => {
        let sTime = setTimeout(() => {
          clearTimeout(sTime)
          this.delayMarketTool(msg)
        }, this.live_delay)
      })
      this.initRedBagInfo()
      this.initLotteryInfo()
      this.checkIsShopping()
    },
    delayMarketTool (msg) {
      switch (msg.type) {
        case RedBagTool.createRedBag:
          console.log('--红包消息--消息--')
          this.stopRedBag()
          this.autoTime = msg.time ? parseFloat(msg.time) : 0
          this.red_packet_uuid = msg.red_packet_uuid
          ajax({ method: 'get', abPath: msg.url }).then((data) => {
            this.dealWithRedBag(true, data)
          })
          break
        case DrawTool.createDraw: // 监听创建抽奖通知消息
          console.log('--创建抽奖通知--消息--')
          this.handleClearDrawProcess()
          // 获取当前抽奖信息
          ajax({ method: 'get', abPath: msg.url }).then((data) => {
            this.dealWithLottery(data)
          })
          break
        case DrawTool.endLottery: // 监听抽奖结束
          this.handleClearDrawProcess()
          // 获取当前是否中奖
          this.getIsWinLottery(msg.lottery_id)
          break
      }
    },
    initWatchPageSetting () {
      /* 获取活动观看页配置 */
      window.VHALL_ZK.$api.getWatchPageSetting().then((res) => {
        this.storeCustomTheme({
          bgImg: res.data.background_url,
          logoImg: res.data.logo_url,
          chatImg: res.data.chat_url
        })
        this.storeButtonSettings({
          showPlaySpeed: res.data.show_play_speed == 1,
          showResolution: res.data.show_video_resolution == 1,
          showInviteCard: res.data.show_invite_card == 1,
          showSubscribe: res.data.show_sub == 1,
          showViewCount: res.data.show_view_count == 1 // 是否显示观看人数1.开启 2.关闭
        })
        const barrageSettings = {
          useBarrage: res.data.video_tip == 1,
          barrageFontSize: res.data.video_tip_size,
          barrageFontColor: res.data.video_tip_color
        }
        this.storeBarrageSettings(barrageSettings)
      })
    },
    clickLoginUser () { // 红包登录
      this.showDraw = false
      this.redBagTimeDownShow = false
      this.redBagTipShow = false
    },
    fullBrowser (isFull) { /* 全屏控制 */
      this.isfullBrowser = isFull
    },
    immInputQuestions (id) { // 填写问卷
      this.handleRedBagClick()
      EventBus.$emit(BusTool.showQuestion, id)
    },
    sendPassword (arg) { // 复制口令
      console.log('----sendPassword---')
      if (arg) return
      this.redBagTipShow = false
      EventBus.$emit(BusTool.sendPassword, this.redBagInfo.password)
      this.isSent = true
    },
    immShare () {
      console.log('----immShare---')
      this.handleRedBagClick()
    },
    handleRedBagClick (e) {
      this.redBagTipShow = false
      this.redBagTimeDownShow = false
      this.redBagShow = false
      this.redBagNoneShow = false
      this.redBagrecordList = []
      this.redBagInfo = { ...this.redBagInfoing }
    },
    selectRedBag (count) { // 选中红包雨红包
      if (this.red_packet_uuid && count === 1) {
        this.joinRedBag()
      }
    },
    /* 抢红包接口 */
    joinRedBag () {
      window.VHALL_ZK.$api.grabRedBag(this.red_packet_uuid).then((res) => {
        this.redBagResultInfo = res.data
        this.redBagResultInfo.red_packet_uuid = this.red_packet_uuid
      }).catch((e) => {
        console.warn(e)
      })
    },
    /* 红包雨结束 */
    async endRainHandler (count) {
      console.log('----endRainHandler-1----')
      this.showRedBagRain = false
      /* 延迟1.5秒，防止红包接口过慢导致问题 */
      let s = setTimeout(() => {
        clearTimeout(s)
        if (count) {
          if (this.redBagResultInfo && this.redBagResultInfo.amount) {
            console.log('----endRainHandler-2----')
            // 抢到红包
            this.redBagShow = true
          } else {
            console.log('----endRainHandler-3----')
            /* 重新查询，看看是否抽中红包 */
            window.VHALL_ZK.$api.grabRedBag(this.red_packet_uuid).then(res => {
              console.log(res)
              if (res.data && res.data.amount) {
                // 抢到红包
                this.redBagShow = true
                this.redBagResultInfo = res.data
              } else { // 没有抢到红包
                // 延迟1秒执行，保证本次红包活动已经结束
                let st = setTimeout(() => {
                  clearTimeout(st)
                  this.queryRedBagrecordList(true)
                }, 1000)
              }
            }).catch(() => {
              // 延迟1秒执行，保证本次红包活动已经结束
              let st = setTimeout(() => {
                clearTimeout(st)
                this.queryRedBagrecordList(true)
              }, 1000)
            })
          }
        } else {
          let st = setTimeout(() => {
            clearTimeout(st)
            this.queryRedBagrecordList(true)
          }, 1000)
        }
      }, 1500)
    },
    /* 停止红包操作 */
    stopRedBag () {
      console.log('----stopRedBag----')
      clearInterval(this.timerInterval)
      clearInterval(this.redBagStartTimerInterval)
      this.timerInterval = 0
      this.redBagStartTimerInterval = 0
      this.redBagTimeDownShow = false
      this.redBagTipShow = false
      this.redBagResultInfo = {
        red_packet_uuid: '',
        avatar: '',
        nick_name: '',
        amount: '',
        amount_ranking: '',
        percent: ''
      }
      this.redBagInfo = {
        condition: '0',
        password: '',
        ext: ''
      }
      this.timer = 0
      this.redBagStartTimer = 0
      this.storeDownTimer(0)
      this.autoTime = 0
      this.handleRedBagClick()
    },
    /* 刷新页面或者后进入时 */
    initRedBagInfo () {
      console.log('----initRedBagInfo----')
      window.VHALL_ZK.$api.getNowRedBagInfo().then(res => {
        if (res.data) {
          this.red_packet_uuid = res.data.red_packet_uuid
          this.redBagInfo = { condition: res.data.condition, password: res.data.password, ext: res.data.ext }
          this.redBagInfoing = { ...this.redBagInfo }
          this.storeRedBagInfo({ condition: res.data.condition, password: res.data.password, ext: res.data.ext })
          if (res.data.time) {
            // 减去1秒纠正查询接口时间误差
            this.autoTime = (res.data.time - 1) / 60
            this.initRedBagDownTimer()
          } else if (res.data.valid_time) {
            if (res.data.valid_time > 20) {
              this.redBagTimeDownShow = true
              this.initRedBayRainTimer(res.data.valid_time - 20)
            } else if (res.data.valid_time >= 10) {
              this.queryRedBagrecordList(true)
            }
          }
        }
      }).catch((error) => {
        console.warn(error)
      })
    },
    dealWithRedBag (immediately, data) {
      console.log('----dealWithRedBag----')
      if (data) {
        this.dealWithRedBagData(immediately, data)
      } else {
        let uuid = immediately ? this.red_packet_uuid : this.chat_red_packet_uuid
        window.VHALL_ZK.$api.getRedBagInfo(uuid).then((res) => {
          if (res.data) {
            this.dealWithRedBagData(immediately, res.data)
          }
        }).catch((error) => {
          this.$messageBox({
            header: '提示',
            content: error.msg,
            autoClose: 5,
            confirmText: '确定'
          })
        })
      }
    },
    dealWithRedBagData (immediately, data) {
      console.log('----dealWithRedBagData----')
      this.redBagInfo = { condition: data.condition, password: data.password, ext: data.ext }
      if (immediately) {
        this.storeRedBagInfo({ condition: data.condition, password: data.password })
        // 临时存放，解决点击聊天区域和正在进行红包互串
        this.redBagInfoing = { ...this.redBagInfo }
        this.initRedBagDownTimer()
      } else {
        console.log('----data.valid_time----:', data.valid_time)
        if (data.valid_time) {
          if (data.valid_time > 60) { // 大于60秒显示倒计时
            this.autoTime = (data.time - 1) / 60
            this.initRedBagDownTimer()
          } else if (data.valid_time > 20) { // 大于20秒进行10秒倒计时
            this.autoTime = 0
            this.initRedBagDownTimer()
          } else {
            console.log('--redBagRecord--')
            this.redBagRecord(data.red_packet_uuid)
          }
        }
      }
    },
    initRedBagDownTimer () {
      console.log('----initRedBagDownTimer----:1')
      if (this.autoTime === 0) { // 立即开始
        this.redBagTimeDownShow = true
        this.initRedBayRainTimer(10)
      } else {
        console.log('----initRedBagDownTimer----:2')
        // 红包雨活动已推送,倒计时
        this.redBagTipShow = true
        this.isSent = false
        this.redBagStartTimer = Math.round(this.autoTime * 60)
        if (this.redBagStartTimerInterval) return
        console.log('----initRedBagDownTimer----:3')
        this.redBagStartTimerInterval = setInterval(() => {
          this.storeDownTimer(this.redBagStartTimer)
          if (this.redBagStartTimer === 10) {
            console.log('----initRedBagDownTimer----:4')
            clearInterval(this.redBagStartTimerInterval)
            this.redBagStartTimerInterval = null
            this.redBagStartTimer = 0
            this.storeDownTimer(0)
            this.redBagTipShow = false
            // 10秒倒计时
            this.redBagTimeDownShow = true
            this.initRedBayRainTimer(10)
            return
          }
          this.redBagStartTimer = this.redBagStartTimer - 1
          if (this.redBagStartTimer < 0) {
            clearInterval(this.redBagStartTimerInterval)
            this.redBagStartTimerInterval = null
          }
        }, 1000)
      }
    },
    /* 控制红包雨倒计时 */
    initRedBayRainTimer (time) {
      console.log('----initRedBayRainTimer----:1')
      this.timer = time
      if (this.timerInterval) return
      console.log('----initRedBayRainTimer----:2')
      this.timerInterval = setInterval(() => {
        if (this.timer <= 0) {
          console.log('----initRedBayRainTimer----:3')
          clearInterval(this.timerInterval)
          this.timerInterval = null
          this.redBagTimeDownShow = false
          this.showRedBagRain = true
          return
        }
        this.timer--
      }, 1000)
    },
    /* 我抢红包结果信息 */
    redBagRecord (id) {
      let uuid = id || this.red_packet_uuid
      return window.VHALL_ZK.$api.getRedBagRecord(uuid).then((res) => {
        if (res.data && res.data.amount) {
          this.redBagShow = true
          this.redBagResultInfo = res.data
          this.redBagResultInfo.red_packet_uuid = uuid
        } else {
          this.queryRedBagrecordList(false)
        }
      }).catch((error) => {
        this.$messageBox({
          header: '提示',
          content: error.msg,
          autoClose: 5,
          confirmText: '确定'
        })
      })
    },
    showRedBagList (uuid) {
      this.redBagShow = false
      this.getRedBagList(uuid)
    },
    queryRedBagrecordList (immediately) {
      let uuid = immediately ? this.red_packet_uuid : this.chat_red_packet_uuid
      this.getRedBagList(uuid)
    },
    getRedBagList (uuid) {
      if (!uuid) return
      return window.VHALL_ZK.$api.getRedBagList(uuid).then((res) => {
        this.redBagNoneShow = true
        this.redBagrecordList = res.data.list.map(item => {
          if (item.avatar && item.avatar.indexOf('http') !== 0) {
            item.avatar = `${this.$imgHost}/${item.avatar}?x-oss-process=image/resize,m_lfit,w_100${this.isWebp ? '/format,webp' : ''}`
          }
          return item
        })
      }).catch((error) => {
        this.$messageBox({
          header: '提示',
          content: error.msg,
          autoClose: 5,
          confirmText: '确定'
        })
      })
    },
    clickRedpack () {
      this.redBagTipShow = true
    },
    clickLottery () {
      this.checkIsShopping()
      this.showDraw = true
      this.showDrawResult = false
    },
    // 获取当期抽奖信息
    initLotteryInfo (id = '', type = '') {
      window.VHALL_ZK.$api.getLotteryInfo(id).then((res) => {
        if (res.data) {
          this.dealWidthLotteryData(res.data, type)
          // 判断是否分享过抽奖
          if (res.data.lottery_type == 9) {
            this.checkIsShare()
          }
        }
      }).catch((error) => {
        this.$messageBox({
          header: '提示',
          content: error.msg,
          autoClose: 5,
          confirmText: '确定'
        })
      })
    },
    /***
     * 处理当前抽奖信息
     * @params: immediately true 主持人操作 false 聊天区点击操作
     * @params: data 抽奖信息
    */
    dealWithLottery (data) {
      if (data) {
        this.dealWidthLotteryData(data)
      } else {
        return window.VHALL_ZK.$api.getLotteryInfo().then(res => {
          if (res.data) {
            this.dealWidthLotteryData(res.data)
          }
        })
      }
    },
    dealWidthLotteryData (data, type) {
      if (!data) return
      this.lottery_id = data.id
      this.drawTime = data.left_seconds ? parseInt(data.left_seconds) : 0 // 距离开始抽奖剩余时间
      this.lotteryInfo = {
        lottery_type: data.lottery_type,
        // lottery_status: data.lottery_status == 0 ? data.lottery_status : 1,
        extension: data.extension, // 口令 问卷id 邀请人数 根据类型判断
        award_name: data.award_snapshoot.award_name,
        image_url: data.award_snapshoot.image_url, // 奖品封面
        link_url: data.award_snapshoot.link_url, // 奖品链接地址
        award_desc: data.award_snapshoot.award_desc, // 奖品描述
        invite_number: data.invite_number,
        lotteryCount: data.lottery_users ? data.lottery_users.length : 0,
        is_address: data.write_address === 'Y', // 是否填写领奖信息: Y=>是，N=>否
        icon: data.icon // 抽奖转盘图片url
      }
      if (type === 'end') {
        this.lotteryInfo.lottery_status = 1
      } else {
        this.lotteryInfo.lottery_status = data.lottery_status == 0 ? data.lottery_status : 1
      }
      if (this.lotteryInfo.lottery_status == 0) this.initLotteryTimer()
    },
    // 设置抽奖时间
    initLotteryTimer () {
      this.queryInviteToLotteryUsers()
      if (this.lotteryInfo.lottery_status == 0) {
        this.showDraw = true
        this.showDrawResult = false
        if (this.drawTime > 0) { // 抽奖倒计时
          this.lotteryDownTime()
        }
      } else if (this.lotteryInfo.lottery_status == 1) { // 抽奖结束
        this.handleClearDrawProcess()
      }
    },
    // 抽奖倒计时计时器
    lotteryDownTime () {
      if (this.drawCountTimer) clearInterval(this.drawCountTimer)
      this.drawCountTimer = setInterval(() => {
        if (this.drawTime == 0) {
          clearInterval(this.drawCountTimer)
          this.storeLotteryDownTimer(0)
          return
        }
        this.drawTime--
        this.storeLotteryDownTimer(this.drawTime)
      }, 1000)
    },
    // 判断当前用户是否领奖
    getIsReceiveAward(id) {
      // 判断是否中奖
      // 未中奖显示未中页面 并 可查看列表。
      // 中奖用户 请求接口判断是否领奖
      // 未领奖 显示领奖操作
      // 领奖 显示中奖列表
      return window.VHALL_ZK.$api.checkLotteryAddress(id).then((res) => {
        if (res.data) { // 提交
          this.hasFillOutLotteryForm = true
        } else {
          this.hasFillOutLotteryForm = false
        }
      }).catch((error) => {
        this.$messageBox({
          header: '提示',
          content: error.msg,
          autoClose: 5,
          confirmText: '确定'
        })
      })
    },
    // 判断当前是否中奖
    async getIsWinLottery (id) {
      if (this.lotteryInfo.lottery_status == 1) {
        await this.initLotteryInfo(id, 'end')
      }
      if (!this.loginInfo) {
        // 如果未登录,直接提示未中奖
        this.showDrawResult = true
        this.isWin = false
        return
      }
      await this.getIsReceiveAward(id)
      window.VHALL_ZK.$api.checkIsLottery(id).then((res) => {
        // 判断是否有提交过表单
        this.showDraw = false
        if (res.data) { // 中奖
          this.showDrawResult = true
          this.isWin = true
        } else { // 未中奖
          this.showDrawResult = true
          this.isWin = false
        }
      }).catch(() => {
        this.showDraw = false
      })
    },
    // 获取所有被邀请抽奖人
    queryInviteToLotteryUsers () {
      if (this.refreshInviteToLottery) clearTimeout(this.refreshInviteToLottery)
      this.refreshInviteToLottery = setTimeout(() => {
        window.VHALL_ZK.$api.getAllInviteLotteryUsers({
          activity_id: this.activity_id
        }).then((res) => {
          this.inviteUsers = res.data ? res.data.inviter_count : 0
        })
      }, 500)
    },
    inputDrawForm () {
      this.showDrawForm = true
      let info = localStorage.getItem(LocalKey.WINNER_INFO)
      if (info) {
        this.winnerInfo = JSON.parse(info)
      }
    },
    // 获取中奖列表
    handleShowWinsList () {
      window.VHALL_ZK.$api.getWinLotteryList({
        lottery_id: this.lottery_id ? this.lottery_id : this.chat_lottery_id,
        page: this.winLotteryLists.page,
        page_size: 10
      }).then((res) => {
        res.data.list = res.data.list || []
        this.winLotteryLists.data = res.data.list.map((item) => {
          item.logo = item.lottery_user_avatar ? `${this.$imgHost}/${item.lottery_user_avatar}` : ''
          return item
        })
        this.winLotteryLists.page = res.data.page
        this.winLotteryLists.page_size = res.data.page_size
        this.winLotteryLists.total = res.data.total
        this.showDrawFormSuccess = false
        this.showDrawResult = false
        this.showDrawWinnersList = true
      }).catch((e) => {
        this.showDrawFormSuccess = false
        this.showDrawResult = false
      })
    },
    handleDrawForm (e) {
      this.showDrawForm = false
      this.nameErrorTips = ''
      this.phoneErrorTips = ''
    },
    // 抽奖分享
    lotteryShare () {
      this.showDraw = false
      this.showShareTip = true
      if (this.showShareTipTimer) clearTimeout(this.showShareTipTimer)
      this.showShareTipTimer = setTimeout(() => {
        this.showShareTip = false
      }, 3000)
    },
    // 检查是否分享过抽奖
    checkIsShare () {
      window.VHALL_ZK.$api.getShareCount().then((res) => {
        if (res.data && res.data > 0) {
          this.lottery_isShare = true
        } else {
          this.lottery_isShare = false
        }
      })
    },
    // 检查是否下过单
    checkIsShopping () {
      window.VHALL_ZK.$api.checkHasOrder().then((res) => {
        if (res.data) {
          this.lottery_isShopping = true
        } else {
          this.lottery_isShopping = false
        }
      })
    },
    // 发送口令
    lotterySendChat () {
      if (this.lottery_isSend) return
      this.showDraw = false
      EventBus.$emit(BusTool.sendLotteryPassword, this.lotteryInfo.extension)
      this.lottery_isSend = true
    },
    // 抽奖填写问卷
    handleFillQuestion () {
      this.showDraw = false
      EventBus.$emit(BusTool.showQuestion, this.lotteryInfo.extension)
    },
    checkFormContent () {
      if (!this.winnerInfo.nickname) {
        this.nameErrorTips = '联系人不能为空'
        return false
      }
      if (!this.winnerInfo.phone) {
        this.phoneErrorTips = '手机号不能为空'
        return false
      }
      let PHONE_RegExp = /^([0-9-]+)$/
      if (!PHONE_RegExp.test(this.winnerInfo.phone)) {
        this.phoneErrorTips = '手机号格式不正确'
        return
      }
      return true
    },
    // 提交中奖表单
    handleUploadForm () {
      if (!this.checkFormContent()) return
      localStorage.setItem(LocalKey.WINNER_INFO, JSON.stringify(this.winnerInfo))
      window.VHALL_ZK.$api.submitLotteryAddress({
        lottery_id: this.lottery_id,
        name: this.winnerInfo.nickname,
        phone: this.winnerInfo.phone,
        address: this.winnerInfo.address
      }).then((res) => {
        this.showDrawForm = false
        this.showDrawResult = false
        this.showDrawFormSuccess = true
      })
    },
    // 立即下单
    goShopping () {
      this.showDraw = false
      this.$refs.playContent.clickGood()
    },
    // 清理上一个抽奖流程
    handleClearDrawProcess () {
      this.showDraw = false // 显示抽奖等待等弹窗
      this.showDrawResult = false // 抽奖结果
      this.showDrawForm = false // 中奖信息填报
      this.showDrawFormSuccess = false // 中奖信息填报成功
      this.showDrawWinnersList = false // 抽奖中奖人信息
      this.hasFillOutLotteryForm = false
      this.lottery_isSend = false
      this.lottery_isShare = false
      this.lottery_isShopping = false
      this.drawTime = 0
      this.storeLotteryDownTimer(0)
      this.isWin = false
      this.inviteUsers = 0
      this.winnerInfo = {
        nickname: '',
        phone: '',
        address: ''
      }
      this.lotteryInfo.lottery_status = 1
      this.winLotteryLists = {
        data: [],
        page: 1,
        page_size: 10,
        total: 0
      }
      if (this.drawCountTimer) clearInterval(this.drawCountTimer)
    }
  }
}
</script>
<style scoped lang="scss" src="../css/watch.scss"></style>
<style scoped lang="scss">
  @import "assets/css/mixin.scss";
  .watch-box{
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    &.full-browser {
      .watcher-header {
        display: none;
      }
      .watcher-content {
        height: 100%;
      }
    }
    .watcher-header {
      position: relative;
      width: 100%;
      height: 72px;
      z-index: 101;
    }
    .watcher-content {
      position: relative;
      width: 100%;
      height: calc(100% - 72px);
      .watch-box-play{
        height: 100%;
        margin-right: 400px;
        background-color: rgba(20, 20, 20, 0.8);
        /deep/{
          .watcher-box .watcher .master-box .master-play-box .master-box-left{
            margin-right: 0px !important;
          }
        }
      }
      .watch-box-content {
        position: absolute;
        top: 0;
        right: 0;
        width: 400px;
        height: 100%;
        background-color: #fff;
        overflow: hidden;
        .watch-chat-content{
          height: calc(100% - 50px);
        }
        .watch-menu {
          height: 50px;
          background-color: #fff;
          .head-tool {
            position: relative;
            line-height: 64px;
            color: #fff;
            font-size: 14px;
            margin-right: 8px;
            user-select: none;
            opacity: .8;
            span{
              padding: 6px;
              &:hover {
                cursor: pointer;
                opacity: .9;
              }
            }
            &:after {
              display: block;
              content: '';
              position: absolute;
              top: 25px;
              right: 41px;
              width: 1px;
              height: 14px;
              background-color: #fff;
            }
          }
        }
      }
    }
  }
</style>
