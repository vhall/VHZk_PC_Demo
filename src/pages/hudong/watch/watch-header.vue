<template>
  <div class="watch-header">
    <img class="header-logo" v-if="customLogo" :src="customLogo">
    <img class="header-logo" v-else-if="isWebP" src="../../../assets/image/logo_pc.webp">
    <img class="header-logo" v-else src="../../../assets/image/logo_pc.png">
    <div class="header-info">
      <h3>
        <div class="title">{{activityInfo.title}}</div>
        <span v-if="playType=='live'" class="activity-status live-status">{{activityInfo.status_name}}</span>
        <span v-else-if="playType=='end'" class="activity-status">{{activityInfo.status_name}}</span>
        <span v-else-if="playType=='vod'" class="activity-status play-back-status">{{activityInfo.status_name}}</span>
        <span v-else class="activity-status pre-status">{{activityInfo.status_name}}</span>
      </h3>
      <ul>
        <li title="主办方">
          <i class="iconfont icon-zhubanfang_icon"></i>
          <span style="max-width: 33vw;vertical-align: bottom;margin-right: 0;">{{activityInfo.sponsor}}</span>
        </li>
        <li title="直播时间">
          <i class="iconfont icon-shijian_icon"></i>
          <span style="vertical-align: bottom;">{{activityInfo.start_time}}</span>
        </li>
        <li>
          <span v-if="buttonSettings.showViewCount" style="vertical-align: bottom;color: #666;">
            <i class="iconfont icon-faxian-yanjing" style="color: #999;"></i> {{showPersonCount}}次观看</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import * as types from '../../../store/mutation-types'
export default {
  name: 'watch-header',
  data() {
    return {
      isWebP: window.webp,
      activity_id: this.$route.params.id,
      wxfriend: false,
      emailInput: '',
      emailErrorTips: ''
    }
  },
  props: {
    playType: {
      type: String,
      default: '' // 直播(live), 回放(vod), 暖场(warm), 结束(end), 第三方(third)
    },
    showPersonCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapState('liveMager', {
      activityInfo: state => state.activityInfo,
      customTheme: state => state.customTheme,
      buttonSettings: state => state.buttonSettings
    }),
    ...mapState('login', {
      loginInfo: state => state.loginInfo
    }),
    customLogo() {
      const logo = this.customTheme.logoImg
      return logo ? `${this.$imgHost}/${logo}?x-oss-process=image/resize,m_lfit,w_1000${window.webp ? '/format,webp' : ''}` : ''
    },
    defaultImg () {
      let avatar = this.loginInfo.avatar
      if (avatar && avatar.indexOf('//') !== 0 && avatar.indexOf('http') !== 0) {
        avatar = avatar ? `${this.$imgHost}/${avatar}` : ''
      }
      return avatar
    }
  },
  methods: {
    ...mapMutations('login', {
      storeLoginInfo: types.LOGIN_INFO
    })
  }
}
</script>

<style scoped lang="scss">
  @import "assets/css/mixin.scss";
  .watch-header {
    position: relative;
    height: 100%;
    padding: 0 20px;
    background-color: #fff;
    box-shadow: 0 0 8px #ddd;
    z-index: 2;
    .header-logo {
      margin-top: 36px;
      transform: translateY(-50%);
      max-width: 140px;
      max-height: 50px;
      border-radius: 2px;
    }
    .logo-title {
      display: inline-block;
      height: 80px;
      line-height: 80px;
      margin-top: 2px;
      padding: 0 20px;
      font-size: 20px;
      font-weight: 600;
    }
    .header-info {
      display: inline-block;
      vertical-align: top;
      line-height: 1;
      margin-left: 10px;
      font-size: 14px;
      .title{
        display: inline-block;
        max-width: 40vw;
        vertical-align: middle;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        font-size: 20px;
      }
      li {
        float: left;
        margin-top: 5px;
        margin-right: 10px;
        color: #999;
        .iconfont {
          font-size: 16px;
          vertical-align: bottom;
        }
      }
      h3 {
        margin-top: 5px;
        margin-bottom: 2px;
        line-height: 30px;
        font-size: 24px;
        .activity-status {
          height: 20px;
          line-height: 20px;
          padding: 0 10px;
          vertical-align: 2px;
          border-radius: 10px;
          color: #fff;
          background-color: #888;
          font-weight: 400;
          font-size: 12px;

          .red-point {
            display: inline-block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: $color-red;
            vertical-align: 1px;
          }
        }
        .live-status {
          background-color: $color-red;
          &:before {
            display: inline-block;
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #fff;
            vertical-align: middle;
            margin-right: 3px;
          }
        }
        .pre-status {
          background-color: $color-blue;
        }
        .play-back-status {
          background-color: #975BD5;
        }
      }
      span {
        display: inline-block;
        font-size: 14px;
      }
    }
  }
</style>
