<template>
  <transition name="fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div
      class="com-notification"
      :class="position"
      v-show="visible"
      @mouseenter="clearTask"
      @mouseleave="createTask">
      <div class="content">
        <span v-if="!this.$slots.default" >{{content}}</span>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ComNotification',
  props: {
    header: String,
    content: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      visible: true
    }
  },
  created () {
  },
  methods: {
    handleClose (e) {
      this.$emit('close')
    },
    afterEnter () { },
    afterLeave () {
      this.$emit('closed')
    },
    createTask () { },
    clearTask () { }
  }
}
</script>

<style lang="scss" scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .com-notification /deep/ {
    display: inline-block;
    position: fixed;
    background: rgba(20, 20, 20, 0.8);
    padding: 0 20px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    z-index: 9999;
    text-align: center;
    .header {
      color: rgba(0, 0, 0, 0.85);
      .title {
        display: inline-block;
        margin-bottom: 8px;
      }
      .icon-close {
        color: #fff;
        position: absolute;
        cursor: pointer;
        top: 14px;
        right: 20px;
      }
    }
    .content {
      color: #fff;
      padding: 0;
      font-size: 14px;
    }
  }
  .center{
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .top-center{
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
  }
  .bottom-center{
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
