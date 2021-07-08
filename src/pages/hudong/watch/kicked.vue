<template>
  <div class="iskicked">
    <div class="img"></div>
    <p v-if="type==='audit'">
      抱歉，由于报名审核没有通过
      <br/>
      您已被禁止进入活动
    </p>
    <p v-else>
      抱歉，您已被主持人踢出房间
      <br/>
      如有疑问请联系活动主办方
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: this.$route.query.type
    }
  }
}
</script>

<style lang='scss' scoped>
.iskicked {
  height: 100%;
  overflow: hidden;
  .img {
    display: inline-block;
    width: 218px;
    height: 218px;
    display: block;
    margin: 100px auto 0;
    background: url('~assets/image/kicied@2x.png') no-repeat center;
    background-size: contain;
  }
  p {
    font-size: 32px;
    color: #222222;
    text-align: center;
    margin: 60px auto;
  }
}
</style>
