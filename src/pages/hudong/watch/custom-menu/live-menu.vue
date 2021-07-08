<template>
  <div
    class="live-menu"
    v-loading="loading"
    customClass="custom-color">
    <div :class="{'live-list-warp':true, 'one-row': menu.type === 'one'}" >
      <div
        class="live-item"
        v-for="(item, idx) of liveList"
        :key="idx"
        @click.stop="nav2Link(item)">
        <div class="cover-img"
          :style="{backgroundImage: activityImg(item)}">
          <div class="status">{{ getPlayStatuTypes(item.status) }}</div>
        </div>
        <div class="tip">
          <span class="tip-title" :title="item.title">{{ item.title }}</span>
          <span class="tip-time">{{ item.created_at }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from './mixin'
import { ActivityTool } from 'src/utils/ConfigTool'

export default {
  name: 'live-menu',
  mixins: [mixin],
  data() {
    return {
      loading: false,
      liveList: []
    }
  },
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  created() {
    this.getMenuLive()
  },
  methods: {
    getPlayStatuTypes(staus) {
      return ActivityTool.playStatuTypes[staus]
    },
    nav2Link(live) {
      let url
      if (live.bu === 'saas') {
        // 融合sass
        url = process.env.SAASROUTE.watchPath + '/' + live.relate_activity_id
      } else {
        // 知客活动
        url = `${location.origin}${location.pathname}#watch/${live.relate_activity_id}`
      }
      window.open(url)
    },
    getMenuLive() {
      this.loading = true
      window.VHALL_ZK.$api.getMenuLive(this.menu.menu_id).then(res => {
        if (res.code === 200) {
          this.liveList = res.data
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" socped>
@import 'assets/css/mixin.scss';
.live-menu /deep/ {
  .el-loading-spinner .path {
    stroke: red !important;
  }
}
.live-menu {
  padding: 20px 16px;
  height: 100%;
  width: 100%;
  overflow: auto;
  .live-list-warp {
    width: 100%;
    font-size: 0;
    &.one-row {
      .live-item {
        width: 100%;
        height: 96px;
        font-size: 0;
        &:nth-child(2n) {
          margin-left: 0;
        }
        .cover-img {
          display: inline-block;
          width: 168px;
          height: 96px;
          font-size: 12px;
          vertical-align: top;
        }
        .tip {
          display: inline-block;
          width: calc(100% - 168px);
          margin-top: 0;
          padding-left: 10px;
          font-size: 14px;
          vertical-align: top;
          .tip-title {
            max-height: 44px;
            line-height: 22px;
          }
          .tip-time {
            margin-top: 10px;
          }
        }
      }
    }
    .live-item {
      font-size: 14px;
      display: inline-block;
      width: calc(50% - 17px);
      height: 156px;
      margin-bottom: 20px;
      vertical-align: middle;
      cursor: pointer;
      &:nth-child(2n) {
        margin-left: 30px;
      }
      .cover-img {
        display: block;
        width: 100%;
        height: 96px;
        border-radius: 4px;
        background-size: cover;
        background-position: center center;
        .status {
          display: inline-block;
          width: 40px;
          height: 18px;
          margin: 6px;
          line-height: 18px;
          background: #000;
          border-radius: 9px;
          opacity: 0.6;
          text-align: center;
          color: #fff;
          font-size: 12px;
        }
      }
      .tip {
        margin-top: 8px;
        color: #000;
        .tip-title {
          max-height: 36px;
          line-height: 18px;
          display: block;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .tip-time {
          display: block;
          margin-top: 2px;
          color: #888;
        }
      }
    }
  }
}
</style>
