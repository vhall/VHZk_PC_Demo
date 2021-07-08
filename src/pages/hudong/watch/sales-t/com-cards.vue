<template>
  <div class="cards-box">
    <div class="wrap-cover"></div>
    <div class="cards-wrap" :class="{'closeing':isCloseing}">
      <img class="cov_img" :src="`${imgHost}/${cardData.pic}?x-oss-process=image/resize,m_lfit,w_400${isWebp ? '/format,webp' : ''}`">
      <div class="desc">{{cardData.desc}}</div>
      <a v-if="cardData.btn_display === 'Y'" :href="cardData.btn_link" target="_blank"><el-button  round class='btn primary-button' @click='view(cardData.recommend_card_id)'>{{cardData.btn_text}}</el-button></a>
      <i class="close" @click='close'></i>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isWebp: window.webp,
      activity_id: this.$route.params.id,
      imgHost: this.$imgHost + '/',
      isCloseing: false
    }
  },
  props: {
    cardData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    view (id) {
      window.VHALL_ZK.$api.viewCard(id).then((res) => {
        console.log(res)
      })
    },
    close () {
      // this.isCloseing = true
      setTimeout((res) => {
        this.$emit('closeCards')
      }, 300)
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~assets/css/mixin.scss';
@keyframes showCards {
  0% {
    transform: translateY(750px);
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes hideCards {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(750px);
  }
}
.cards-box{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3001;
  .wrap-cover{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 3001;
    background: rgba(0, 0, 0, 0.7);
  }
  .cards-wrap {
    text-align: center;
    width: 340px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    height: auto;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -170px;
    transform: translateY(-56%);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(34, 34, 34, 0.5);
    z-index: 9999;
    padding-bottom: 30px;
    .cov_img {
      width: 100%;
      max-height: 340px;
      border-radius: 5px 5px 0 0px;
    }
    a {
      display: inline-block;
    }
    .desc {
      word-break: break-all;
      color: $color-font-sub;
      padding: 20px;
      font-size: 14px;
      text-align: justify;
    }
    .btn {
      padding: 0;
      width: 180px;
      height: 32px;
      line-height: 32px;
    }
    .close {
      cursor: pointer;
      z-index: 99;
      width: 30px;
      height: 30px;
      border-radius: 200px;
      position: absolute;
      bottom: -50px;
      left: 50%;
      margin-left: -15px;
      background: url('~assets/image/card-close.png') no-repeat center;
      background-size: contain;
    }
    &.closeing {
      animation: hideCards 0.3s ease-in-out;
    }
  }
}
</style>
