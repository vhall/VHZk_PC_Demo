<template>
  <div class="is-offline">
    <dl>
      <dt></dt>
      <dd>该活动未发布</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'empty'
}
</script>
<style lang="scss" scoped>
.is-offline {
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
    width: 180px;
    height: 180px;
    background: url('~assets/image/watch_offline_icon.png') no-repeat center;
    background-size: contain;
    margin: 0 auto;
  }
  dd {
    padding-top: 50px;
    font-size: 18px;
  }
}
</style>
