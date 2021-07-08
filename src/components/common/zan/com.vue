<template>
  <div class="com-zan">
    <span v-if="showIdx==0" class="com-zan-icon com-zan-icon-01 zan-animation-01"></span>
    <span v-if="showIdx==1" class="com-zan-icon com-zan-icon-02 zan-animation-01"></span>
    <span v-if="showIdx==2" class="com-zan-icon com-zan-icon-03 zan-animation-01"></span>
    <span v-if="showIdx==3" class="com-zan-icon com-zan-icon-04 zan-animation-01"></span>
    <span v-if="showIdx==4" class="com-zan-icon com-zan-icon-05 zan-animation-01"></span>
    <span v-if="showIdx==5" class="com-zan-icon com-zan-icon-06 zan-animation-01"></span>
    <span v-if="showIdx==6" class="com-zan-icon com-zan-icon-07 zan-animation-01"></span>
    <span v-if="showIdx==7" class="com-zan-icon com-zan-icon-08 zan-animation-01"></span>
  </div>
</template>

<script>
export default {
  name: 'com-zan',
  props: {
    showIdx: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .com-zan{
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 9999;
    .com-zan-icon {
      position: absolute;
      top: -100%;
      left: 0;
      display: block;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      opacity: 0;
      background-size: cover;
    }
    .zan-animation-01 {
      animation: topFrame1 2s linear 0s;
    }
    .zan-animation-02 {
      animation: topFrame2 2s linear 0s;
    }
    .com-zan-icon-01 {
      background-image: url('./img/zan-con01.png');
      width: 50px;
      height: 50px;
    }
    .com-zan-icon-02 {
      background-image: url('./img/zan-con02.png');
    }
    .com-zan-icon-03 {
      width: 40px;
      height: 40px;
      background-image: url('./img/zan-con03.png');
    }
    .com-zan-icon-04 {
      width: 20px;
      height: 20px;
      background-image: url('./img/zan-con04.png');
    }
    .com-zan-icon-05 {
      background-image: url('./img/zan-con05.png');
    }
    .com-zan-icon-06 {
      width: 40px;
      height: 40px;
      background-image: url('./img/zan-con06.png');
    }
    .com-zan-icon-07 {
      width: 30px;
      height: 30px;
      background-image: url('./img/zan-con-07.png');
    }
    .com-zan-icon-08 {
      width: 40px;
      height: 40px;
      background-image: url('./img/zan-con03.png');
    }
  }
  @keyframes topFrame1 {
    0% {
      top: -30px;
      opacity: 1;
    }
    10% {
      top: -60px;
      left: -30px;
    }
    20% {
      top: -90px;
      left: 0px;
    }
    30% {
      top: -120px;
      right: -30px;
    }
    40% {
      top: -150px;
      right: 0;
    }
    50% {
      top: -180px;
      left: -30px;
    }
    60% {
      top: -210px;
      left: 0;
    }
    70% {
      top: -240px;
      right: -30px;
    }
    80% {
      top: -270px;
      right: 0;
      opacity: .8;
    }
    90% {
      top: -300px;
      left: -30px;
    }
    100% {
      top: -330px;
      left: 0;
      opacity: 0;
    }
  }
</style>
