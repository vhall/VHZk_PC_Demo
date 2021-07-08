<template>
  <ul class="rank-tabs">
    <li
      class="tab-item"
      @click="handleClick(type)"
      v-for="type of types"
      :key="type"
      :class="{ checked: type === value }"
    >
      {{ getRankTypeTitle(type) }}
    </li>
  </ul>
</template>

<script>
const typeMap = {
  share: '分享榜',
  invite: '邀请榜',
  buyer: '土豪榜',
  watch: '观看榜',
  reward: '打赏榜',
  gift: '礼物榜'
}
export default {
  name: 'rank-tabs',
  props: {
    value: {
      type: String,
      required: true
    },
    types: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      share: '分享榜',
      invite: '邀请榜',
      buyer: '土豪榜',
      watch: '观看榜',
      reward: '打赏榜',
      gift: '礼物榜'
    }
  },
  methods: {
    getRankTypeTitle(type) {
      return typeMap[type]
    },
    handleClick(type) {
      this.$emit('input', type)
    }
  },
  watch: {
    value(val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/mixin.scss';

.rank-tabs {
  display: inline-block;
  .tab-item {
    display: inline-block;
    cursor: pointer;
    vertical-align: middle;
    font-size: 14px;
    font-weight: 400;
    color: #888888;
    line-height: 1;
    width: 88px;
    height: 32px;
    padding: 8px 0;
    border-top: 1px solid #aaa;
    border-right: 1px solid #aaa;
    border-bottom: 1px solid #aaa;
    text-align: center;
    &:first-child {
      border-left: 1px solid #aaa;
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
    }
    &:last-child {
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
    }
    &.checked {
      background: $color-default;
      color: $color-font;
    }
  }
}
</style>
