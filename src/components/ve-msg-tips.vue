<template>
  <div class="msg-tip-box" :class='type'>
    <i class="iconfont icon-wenhao1"></i>
    <span v-if="tipType!=='html'" :style="{width: width}">{{tip}}</span>
    <span v-else v-html="tip" :style="{width: width}"></span>
  </div>
</template>

<script>
export default {
  name: 've-msg-tips',
  data () {
    return {
    }
  },
  props: {
    width: {
      type: String,
      default: '300px'
    },
    tip: {
      type: String,
      default: ''
    },
    tipType: {
      type: String,
      default: 'text'
    },
    type: {
      type: String,
      default: '' // left
    }
  }
}
</script>

<style lang="scss" scoped>
  .msg-tip-box {
    display: inline-block;
    position: relative;
    font-size: 12px;
    height: 16px;
    line-height: 16px;
    vertical-align: middle;
    i {
      display: inline-block;
      width: 16px;
      height: 16px;
      text-align: center;
      font-style: normal;
      color: #888;
      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
    }
    span {
      position: relative;
      display: inline-block;
      max-width: 500px;
      transform: translateY(-50%);
      margin-top: 10px;
      top: -2px;
      left: 8px;
      padding: 10px;
      vertical-align: top;
      border-radius: 3px;
      color: #fff;
      opacity: 0;
      word-wrap: break-word;
      word-break: break-all;
      z-index: 10;
      background-color: rgba(49, 49, 49, 1);
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
      line-height: 20px;
      text-align: justify;
      &:after {
        display: block;
        position: absolute;
        content: '';
        height: 0px;
        width: 0px;
        top: 50%;
        left: -4px;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        border-top: 4px solid transparent;
        border-right: 4px solid #313131;
        border-bottom: 5px solid transparent;
      }
    }
    i:hover + span {
      opacity: 0.9;
    }
    &.left {
      width: 20px;
      float: right;
      margin-left: 10px;
      span {
        left: -274px;
        width: 260px;
        margin-top: -9px;
        &:after {
          display: none;
        }
        &:before {
          display: block;
          position: absolute;
          content: '';
          height: 0px;
          width: 0px;
          top: 50%;
          right: -4px;
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
          border-top: 4px solid transparent;
          border-left: 4px solid #313131;
          border-bottom: 5px solid transparent;
        }
      }
    }
    &.bottom {
      width: 20px;
      margin-left: 10px;
      i:hover + span{
        display: block;
      }
      span {
        display: none;
        width: 300px;
        transform: translate(-50%, 0);
        &:after {
          display: none;
        }
        &:before {
          display: block;
          position: absolute;
          content: '';
          height: 0px;
          width: 0px;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          border-left:5px solid transparent;
          border-right:5px solid transparent;
          border-bottom:4px solid #313131;
        }
      }
    }
    &.top {
      width: 20px;
      margin-left: 10px;
      i:hover + span{
        display: block;
        left: 10px;
      }
      span {
        display: none;
        width: 300px;
        transform: translate(-50%, -140%);
        &:after {
          display: none;
        }
        &:before {
          display: block;
          position: absolute;
          content: '';
          height: 0px;
          width: 0px;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          border-left:5px solid transparent;
          border-right:5px solid transparent;
          border-top:4px solid #313131;
        }
      }
    }
  }
</style>
