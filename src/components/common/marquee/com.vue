<template>
  <div class="marquee-container">
    <div ref="target"
         class="content"
         v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: 'ComMarquee',
  props: {
    times: {
      type: Number,
      default: 3
    },
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      offsetX: 0,
      offsetWidth: 0,
      currentTimes: 0,
      animationId: 0
    }
  },
  methods: {
    doLoop () {
      if (this.currentTimes < this.times) {
        this.offsetX -= 1
        let targetDom = this.$refs.target
        if (targetDom) {
          targetDom.style.cssText = `transform: translateX(${this.offsetX}px);`
          if (this.offsetX < this.offsetWidth) {
            this.offsetX = 0
            this.currentTimes++
          }
          this.animationId = window.requestAnimationFrame(this.doLoop)
        } else {
          window.cancelAnimationFrame(this.animationId)
        }
      } else {
        this.$emit('over')
        this.offsetX = 0
        this.currentTimes = 0
      }
    }
  },
  watch: {
    content: {
      handler (val) {
        if (val) {
          this.$nextTick(() => {
            window.cancelAnimationFrame(this.animationId)
            this.offsetWidth = -(this.$refs.target.offsetLeft + this.$refs.target.offsetWidth) || -375
            this.currentTimes = 0
            this.offsetX = 0
            this.doLoop()
          })
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped >
.marquee-container {
  /deep/ {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: white;
    font-size: 14px;
    z-index: 100;
    background-color: #4b5afe;
    overflow: hidden;
    .content {
      position: absolute;
      left: 100%;
      width: auto;
      white-space: nowrap;
    }
  }
}
</style>
