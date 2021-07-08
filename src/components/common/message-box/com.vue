<template>
  <transition name="fade" v-if="visible">
    <div :class="['ve-message-box__wrapper']">
      <div v-if="this.$slots.msgBox" class="ve-message-box custom-box">
        <slot name="msgBox"></slot>
      </div>
      <div v-else class="ve-message-box" :style="{width: width}" :type="type">
        <div class="ve-message-box__header">
          <span v-if="type=='prompt'" class="prompt-title">{{header}}</span>
          <button type="button" @click.prevent="handleClick(action.cancel)" v-if="type !== 'noneClose'">
            <i class="iconfont icon-close1"></i>
          </button>
        </div>
        <div class="ve-message-box__container">
          <div class="ve-message-box__title" v-if="!this.$slots.header&&header&&type!=='prompt'">{{header}}</div>
          <slot name="header"></slot>
          <div class="ve-message-box__content" v-if="(!this.$slots.default||this.$slots.default.length==0)&&content">
            <div v-html="content"></div>
          </div>
          <slot></slot>
          <div class="ve-message-box__btns" v-if="type!=='none'">
            <div v-if="!this.$slots.bottom">
              <button class="button--primary" :type="type" @click.prevent="handleClick(action.confirm)">
                <span>{{confirmText}}<span v-if="autoClose" class="auto-close" style="display: inline-block;">({{closeTime}}s)</span></span>
              </button>
              <button class="button--cancel" :type="type" @click.prevent="handleClick(action.cancel)"
                      v-if="cancelText">
                <span>{{cancelText}}</span>
              </button>
            </div>
            <slot name="bottom"></slot>
          </div>
        </div>
      </div>
      <div class="ve-modal" v-if="type === 'noneModal' || type === 'noneClose'"></div>
      <div class="ve-modal" v-else @click.prevent="handleClick(action.cancel)"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'message-box',
  data () {
    return {
      visible: true,
      closeTime: 0,
      intervalTime: 0,
      action: {
        cancel: 'cancel',
        confirm: 'confirm'
      }
    }
  },
  props: {
    header: {
      type: String,
      default: '提示'
    },
    content: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: ''
    },
    autoClose: {
      type: Number,
      default: 0
    },
    width: {
      type: String,
      default: '400px'
    },
    type: { // prompt , error， none, noneModal, noneClose
      type: String,
      default: ''
    }
  },
  watch: {
    autoClose: {
      handler (newVal) {
        if (!newVal) return
        this.closeTime = newVal
        clearInterval(this.intervalTime)
        this.intervalTime = setInterval(() => {
          this.closeTime--
          if (!this.closeTime) {
            clearInterval(this.intervalTime)
            this.$emit('handleClick', {
              action: 'cancel'
            })
          }
        }, 1000)
      },
      immediate: true
    }
  },
  destroyed () {
    clearInterval(this.intervalTime)
  },
  methods: {
    handleClick (action) {
      this.$emit('handleClick', {
        action: action
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'assets/css/mixin.scss';

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .ve-message-box__wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 2001;
    color: #333;
    .ve-modal {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: .7;
      background: #000;
    }
    &:after{
      display: inline-block;
      content: '';
      width: 0;
      height: 100%;
      vertical-align: middle;
    }
    .ve-message-box {
      display: inline-block;
      position: relative;
      vertical-align: middle;
      padding-bottom: 10px;
      background-color: #fff;
      border-radius: 4px;
      font-size: 16px;
      overflow: hidden;
      min-width: 400px;
      z-index: 1006;
      &:before {
        display: block;
        content: '';
        position: relative;
        top: -1px;
        height: 6px;
        background-color: $color-default;
      }
      &[type='error']:before {
        background-color: $color-red;
      }
      &[type='prompt'] {
        padding-bottom: 0;
        &:before {
          display: none;
        }
        .ve-message-box__header {
          height: 40px;
          line-height: 40px;
          border-radius: 4px 4px 0 0;
          background-color: $color-default;
          button {
            color: #555;
            &:hover {
              color: #222222;
            }
            .icon-close1 {
              position: relative;
              top: -6px;
              font-size: 20px;
            }
          }
        }
        .prompt-title {
          font-size: 16px;
        }
      }
      .ve-message-box__container {
        padding: 10px 20px 20px 20px;
        font-size: 14px;
        text-align: left;
        .ve-message-box__title {
          font-size: 20px;
        }
      }
      .ve-message-box__header {
        position: relative;
        padding: 0 20px;
        padding-bottom: 19px;
        text-align: left;
        button {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 0;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          cursor: pointer;
          &:hover {
            color: #555555;
          }
        }
      }
      .ve-message-box__content {
        font-size: 14px;
        padding: 20px 0;
      }
      .ve-message-box__btns {
        text-align: right;
        margin-top: 10px;
        .auto-close {
          padding-left: 6px;
        }
        button {
          display: inline-block;
          height: 40px;
          line-height: 41px;
          white-space: nowrap;
          cursor: pointer;
          border: none;
          -webkit-appearance: none;
          text-align: center;
          box-sizing: border-box;
          outline: none;
          font-weight: 400;
          font-size: 14px;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          padding: 0 40px;
          margin: 0 10px;
          border-radius: 22px;
          color: #222222;
          background: transparent;
          transition: all 0.3s;
        }
        button:last-child {
          margin-right: 0;
        }
        .button--primary {
          background: $color-default;
          &:hover {
            background: $color-default-hover;
          }
          &:active {
            background: $color-default-active;
          }
          &[type='error'] {
            background-color: $color-red;
            &:hover {
              background: $color-red-hover;
            }
            &:active {
              background: $color-red-active;
            }
          }
        }
        .button--cancel {
          padding: 0;
          &:hover {
            color: #555;
            &[type='error'] {
              color: $color-red;
            }
          }
        }
      }
    }
    .custom-box{
      padding: 0;
      background-color: transparent;
      &:before {
        display: none;
      }
    }
  }
</style>
