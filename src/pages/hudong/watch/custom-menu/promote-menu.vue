<template>
  <div class="promote-menu" v-loading="loading">
    <div class="promote-list">
      <a
        class="promote-item"
        :href="item.link"
        v-for="(item, idx) of promoteList"
        :key="idx"
        target="_blank">
        <div class="cover-img" :style="{backgroundImage: activityImg(item)}"></div>
        <div class="tip-info">
          <div class="tip-title">{{ item.title }}</div>
          <div class="tip-time">{{ item.created_at }}</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'promote-menu',
  mixins: [mixin],
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  created() {
    this.getMenuPromote()
  },
  data() {
    return {
      loading: false,
      promoteList: []
    }
  },
  methods: {
    getMenuPromote() {
      this.loading = true
      window.VHALL_ZK.$api.getMenuPromote(this.menu.menu_id).then(res => {
        if (res.code === 200) {
          this.promoteList = res.data
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
.promote-menu {
  height: 100%;
  overflow: hidden;
}
.promote-list {
  padding: 20px 16px;
  height: 100%;
  width: 100%;
  overflow: auto;
  .promote-item {
    display: block;
    width: 100%;
    margin-bottom: 24px;
    font-size: 0;
    .cover-img {
      display: inline-block;
      width: 168px;
      height: 96px;
      font-size: 12px;
      border-radius: 4px;
      vertical-align: top;
      border: solid 1px $color-bd;
    }
    .tip-info {
      display: inline-block;
      width: calc(100% - 168px);
      margin-top: 0;
      padding-left: 10px;
      font-size: 14px;
      vertical-align: top;
      .tip-title {
        max-height: 44px;
        line-height: 22px;
        display: block;
      }
      .tip-time {
        display: block;
        margin-top: 10px;
        color: #888;
      }
    }
  }
}
</style>
