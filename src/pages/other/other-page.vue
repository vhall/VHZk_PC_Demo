<template>
  <div class="is-page">
    <dl :class="{offline: type=='off', over: type=='over'}">
      <dt></dt>
      <dd v-if="type=='off'">此活动已下线～</dd>
      <dd v-if="type=='over'">此活动太过火爆，请稍候重试～</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'other',
  data () {
    return {
      type: 'off'
    }
  },
  created () {
    this.type = this.$route.params.type
  }
}
</script>
<style lang="scss" scoped>
.is-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  dl {
    width: 200px;
    height: 260px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -130px;
    margin-left: -100px;
  }
  dt {
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }
  dd {
    padding-top: 20px;
    font-size: 14px;
    color: #555;
  }
  .offline{
    dt {
      background: url('~assets/image/off-icon.png') no-repeat center;
      background-size: contain;
    }
  }
  .over{
    dt {
      background: url('~assets/image/over-icon.png') no-repeat center;
      background-size: contain;
    }
  }
}
</style>
