<template>
  <div class="img-browser-wrap">
    <span class="img-browser-quit">
      <i class="iconfont icon-close" @click="quiteImg"></i>
    </span>
    <div class="carousel-box">
      <el-carousel :autoplay="false" :initial-index="showIdx" :arrow="arrowType" ref="swipeRef">
        <el-carousel-item v-for="item in imgList" :key="item">
          <div class="carousel-box-img">
            <img :src="`${item}?x-oss-process=image/resize,m_lfit,w_2000${isWebp ? '/format,webp' : ''}`">
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  name: 'img-browser',
  data () {
    return {
      isWebp: window.webp,
      arrowType: 'hover' // always/hover/never
    }
  },
  props: {
    showIdx: {
      type: Number,
      default: 0
    },
    imgList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mounted () {
    if (this.imgList.length === 1) {
      this.arrowType = 'never'
    }
    let _this = this
    document.onkeydown = (e) => {
      if (e.keyCode === 39) { // 向右
        _this.$refs.swipeRef.next()
      } else if (e.keyCode === 37) { // 向左
        _this.$refs.swipeRef.prev()
      }
    }
  },
  methods: {
    quiteImg () {
      this.$emit('quit')
    }
  }
}
</script>
<style lang='scss' scoped>
  .img-browser-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .7);
    z-index: 99999;
    .img-browser-quit {
      position: absolute;
      top: 40px;
      right: 40px;
      width: 44px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, .5);
      color: #fff;
      z-index: 999;
      .icon-close {
        font-size: 24px;
      }
      &:hover {
        cursor: pointer;
        opacity: .8;
      }
    }
    .carousel-box /deep/ {
      height: calc(100% - 160px);
      margin-top: 80px;
      .carousel-box-img {
        position: relative;
        height: 100%;
        width: calc(100% - 200px);
        margin-left: 100px;
        img {
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 100%;
          max-height: 100%;
        }
      }
      .el-carousel {
        height: 100% !important;
        .el-carousel__container {
          height: 100% !important;
        }
        .el-carousel__arrow--right, .el-carousel__arrow--left {
          right: 40px;
          width: 44px;
          height: 44px;
          background-color: rgba(255, 255, 255, 0.5);
          color: #fff;
          .el-icon-arrow-right, .el-icon-arrow-left {
            font-size: 24px;
          }
        }
        .el-carousel__indicator{
          .el-carousel__button {
            width: 8px;
            height: 8px;
            background-color: #000;
            border-radius: 50%;
          }
          &.is-active {
            .el-carousel__button {
              background-color: #FFD021;
            }
          }
        }
      }
    }
  }
</style>
