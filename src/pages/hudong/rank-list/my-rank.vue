<template>
  <div class="my-rank">
    <div class="ranking" v-if="rankItem.rank > 0">
      <div
        class="img cover-img abs-c"
        v-if="rankItem.rank && rankItem.rank > 0 && rankItem.rank <= 3"
        :class="[`top-${rankItem.rank}`]"
      ></div>
      <div v-else class="ranking-num">{{ rankItem.rank | fmtRank }}</div>
    </div>
    <div class="watcher" :style="{marginLeft: rankItem.rank > 0 ? '16px' : '0'}">
      <div class="avatar">
        <div
          class="img cover-img abs-c"
          v-if="rankItem.avatar"
          :style="
            `background-image: url(${$imgHost +
              '/' +
              rankItem.avatar}?x-oss-process=image/resize,m_lfit,w_60${
              webp ? '/format,webp' : ''
            })`
          "
        >
          <div class="border-circle" :class="[`rank-${rankItem.rank}`]"></div>
        </div>
        <span class="no-logo" v-else>{{ rankItem.name.substring(0, 1) }}</span>
      </div>
      <div class="content">
        <div class="name">
          {{ rankItem.name | overHidden(10) }}
        </div>
        <div class="num">
          {{ rankMsg }}
        </div>
      </div>
    </div>
    <div class="button">
      <button
        v-if="rankType == 'share'"
        class="default-button primary-button mini-button"
        @click.stop="toShare"
      >
        分享
      </button>
      <button
        v-if="rankType == 'buyer'"
        class="default-button primary-button mini-button"
        @click.stop="toShop"
      >
        购买
      </button>
    </div>
  </div>
</template>

<script>
import { RankListTool } from 'src/utils/ConfigTool'
import EventBus from 'src/utils/eventBus.js'
// 我的分享,邀请,购买,观看
export default {
  name: 'my-rank',
  filters: {
    fmtRank(rank) {
      if (!rank || rank < 0) {
        return ''
      } else if (rank <= 100) {
        return rank
      } else {
        return '100+'
      }
    }
  },
  props: {
    rankType: {
      type: String,
      required: true
    },
    rankItem: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      webp: window.webp
    }
  },
  computed: {
    rankMsg() {
      let msg
      let num = this.rankItem.num
      switch (this.rankType) {
        case RankListTool.SHARE:
          if (!num || num == 0) {
            msg = '未分享'
          } else {
            msg = `分享  ${num}次`
          }
          break
        case RankListTool.INVITE:
          if (!num || num == 0) {
            msg = '未邀请'
          } else {
            msg = `邀请  ${num}次`
          }
          break
        case RankListTool.BUYER:
          if (!num || num == -1) {
            msg = '未消费'
          } else {
            msg = `消费  ${num}元`
          }
          break
        case RankListTool.WATCH:
          if (!num) {
            num = 0
          }
          const hours = Math.floor(num / 60)
          if (hours > 0) {
            const mins = num % 60
            msg = `观看  ${hours}时${mins}分`
          } else {
            msg = `观看  ${num}分`
          }
          break
        case RankListTool.REWARD:
        case RankListTool.GIFT:
          msg = `${this.rankItem.money}元`
          break
      }
      return msg
    }
  },
  methods: {
    toShare() {
      EventBus.$emit('MY-RANK', RankListTool.SHARE)
    },
    toShop() {
      EventBus.$emit('MY-RANK', RankListTool.BUYER)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/css/mixin.scss';

$itemHeight: 56px;
.my-rank {
  @include flex();
  position: absolute;
  padding: 0 16px;
  left: 0;
  right: 0;
  bottom: 0;
  height: 56px;
  box-shadow: 0px -4px 6px 0px rgba(0, 0, 0, 0.1);
  background: #fff;
  justify-content: space-around;
  width: 100%;
  .ranking {
    width: 25px;
    text-align: center;
    position: relative;
    color: #aaaaaa;
    .img {
      width: 20px;
      height: 25px;
      &.top-1 {
        background-image: url('~assets/image/rank_gold_medal.png');
      }
      &.top-2 {
        background-image: url('~assets/image/rank_silver_medal.png');
      }
      &.top-3 {
        background-image: url('~assets/image/rank_bronze_medal.png');
      }
    }
    .ranking-num {
      font-size: 15px;
      font-weight: 800;
    }
  }
  .watcher {
    flex: 1;
    text-align: start;
    @include flex();
    height: $itemHeight;
    margin-left: 16px;
    .avatar {
      margin-right: 10px;
      position: relative;
      width: 36px;
      height: $itemHeight;
      line-height: $itemHeight;
      display: inline-block;
      .img,
      .no-logo {
        display: inline-block;
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
      .img .border-circle {
        border-radius: 50%;
        height: 100%;
        width: 100%;
        border-width: 2px; /*no*/
        border-style: solid;
        border-color: transparent;
        &.rank-1 {
          border-color: #ffd343;
        }
        &.rank-2 {
          border-color: #afbfc2;
        }
        &.rank-3 {
          border-color: #ffb480;
        }
      }
      .no-logo {
        vertical-align: middle;
        background: #ffd021;
        text-align: center;
        line-height: 36px;
        color: $color-fff;
      }
    }
    .content {
      margin-top: -4px;
      .name {
        display: inline-block;
        line-height: 14px;
        font-size: $fz-sm;
        font-weight: 500;
        color: $color-font;
      }
      .num {
        line-height: 14px;
        text-align: start;
        width: 140px;
        margin-top: 4px;
        margin-right: 5px;
        font-size: $fz-sm;
        font-weight: 400;
        color: $color-gray;
      }
    }
  }
  .mini-button {
    width: 80px;
    height: 26px !important;
    border-radius: 22px !important;
    font-size: 14px;
  }
}
</style>
