<template>
  <div class="com-input"
       :class="type"
       v-if="type!=='textarea'">
    <i v-if="type==='search'"
       class="iconfont icon-search"></i>
    <input :type="inputType"
           :style="style"
           :class="{error:errorMsg}"
           :placeholder="placeholder"
           :disabled="disabled"
           v-model.trim="innerValue"
           :autocomplete="autocomplete"
           @focus="focusHandle"
           @blur="blurHandle"
           @keydown="keydownHandle">
    <i v-if="type==='search'"
       v-show="showDelete"
       class="iconfont icon-delete"
       @click="empty"></i>
    <i v-if="type==='password'||(type==='password'&&inputType==='text')"
       class="iconfont"
       :class="{'icon-guanbi-yanjing':inputType==='password','icon-faxian-yanjing':inputType==='text'}"
       @click="toggleShow"></i>
    <span class="limit"
          v-if="maxLength&&(type==='input'||type==='mobile')">
      <i class="length" :style="{color:limitColor}">{{isMobile||local?innerValue.length:(lenType==='B' ? innerValue.length : innerValue.gbLength())}}</i>/<i>{{maxLength}}</i>
    </span>
    <span class="error-msg"
          v-if="errorMsg">{{errorMsg}}</span>
  </div>
  <div class="com-input area"
       v-else>
    <textarea ref="tarea"
              v-model="innerValue"
              :disabled="disabled"
              :class="{error:errorMsg}"
              :placeholder="placeholder ? placeholder: '请输入内容'"
              :rows="rows"
              @focus="focusHandle"
              @blur="blurHandle"></textarea>
    <span class="limit area"
          v-if="maxLength&&type==='textarea'">
      <i class="length"
         :style="{color:limitColor}"
         v-text="lenType==='B' ? innerValue.length : innerValue.gbLength()">0</i>/<i>{{maxLength}}</i>
    </span>
    <span class="error-msg"
          v-if="errorMsg">{{errorMsg}}</span>
  </div>
</template>

<script>
export default {
  name: 'ComInput',
  props: {
    placeholder: String,
    value: String,
    lenType: {
      type: String,
      default: 'A' // A表示汉字两个字符长度， B表示汉字一个字符长度
    },
    type: {
      type: String,
      default: 'input'
    },
    maxLength: Number,
    rows: {
      type: Number,
      default: 2
    },
    autocomplete: {
      type: String,
      default: 'on'
    },
    autosize: Boolean,
    disabled: Boolean,
    errorTips: String,
    local: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isMobile: false,
      innerValue: '',
      showDelete: false,
      inputType: '',
      offsetHeight: 0,
      errorMsg: '',
      limitColor: '#4b5afe'
    }
  },
  created () {
    this.inputType = this.getType()
  },
  mounted () {
    if (this.$refs.tarea) {
      this.offsetHeight = this.$refs.tarea.offsetHeight - this.$refs.tarea.clientHeight
    }
    this.innerValue = this.value
    if (!this.value) {
      this.limitColor = '#999999'
    }
    this.inputType = this.getType()
  },
  methods: {
    focusHandle (e) {
      this.showDelete = true
      this.$emit('focus', e)
    },
    blurHandle (e) {
      this.hideDelete()
      this.$emit('blur', e)
    },
    keydownHandle (e) {
      this.$emit('keydown', e)
    },
    empty () {
      this.innerValue = ''
      this.$nextTick(() => {
        this.$emit('empty')
      })
    },
    toggleShow () {
      if (this.inputType === 'password') {
        this.inputType = 'text'
      } else {
        this.inputType = 'password'
      }
    },
    hideDelete () {
      setTimeout(() => {
        this.showDelete = false
      }, 200)
    },
    getType () {
      let type = ''
      this.isMobile = false
      switch (this.type) {
        case 'password':
          type = 'password'
          break
        case 'number':
          type = 'number'
          break
        case 'mobile':
          this.isMobile = true
          type = 'text'
          break
        default:
          type = 'text'
          break
      }
      return type
    }
  },
  watch: {
    innerValue (value) {
      if (value === undefined) {
        this.innerValue = ''
        this.$emit('update:value', this.innerValue)
        this.$emit('input', this.innerValue)
        return
      }
      let gbLength = value.gbLength()
      if (this.lenType === 'B') {
        gbLength = value.length
      }
      if (this.local) {
        if (this.maxLength && value.length > this.maxLength) {
          this.innerValue = value.substring(0, this.maxLength)
        }
      } else if (this.type === 'float') {
        let match = value.match(/\d{1,8}(\.\d{0,2})?/)
        let _value = match ? match[0] : ''
        if (this.max && _value - 0 > this.max - 0) {
          _value = this.max
        }
        this.innerValue = _value
      } else if (this.isMobile) {
        this.innerValue = value.replace(/[^\d | ^-]/g, '')
        if (this.maxLength && value.length > this.maxLength) {
          this.innerValue = value.substring(0, this.maxLength)
        }
      } else if (this.type === 'number') {
        this.innerValue = value.replace(/\D/g, '')
        if (this.maxLength && value.length > this.maxLength) {
          this.innerValue = value.substring(0, this.maxLength)
        }
      } else if (this.maxLength && gbLength > this.maxLength) {
        if (this.lenType === 'B') {
          this.innerValue = value.substring(0, this.maxLength)
        } else {
          this.innerValue = value.substring(0, value.gbIndex(this.maxLength) + 1)
        }
      }
      if (this.type === 'textarea' && this.autosize) {
        this.$refs.tarea.style.height = 'auto'
        this.$refs.tarea.style.height = `${this.$refs.tarea.scrollHeight + this.offsetHeight}px`
      }
      if (gbLength === 0) {
        this.limitColor = '#999999'
      } else {
        this.limitColor = '#4b5afe'
      }
      this.$emit('update:value', this.innerValue)
      this.$emit('input', this.innerValue)
      // if (this.maxLength && value.gbLength() > this.maxLength) {
      //   this.innerValue = value.substring(0, value.gbIndex(this.maxLength) + 1)
      // }
      // if (this.type === 'textarea' && this.autosize) {
      //   this.$refs.tarea.style.height = 'auto'
      //   this.$refs.tarea.style.height = `${this.$refs.tarea.scrollHeight + this.offsetHeight}px`
      // }
      // this.$emit('update:value', this.innerValue)
      // this.$emit('input', this.innerValue)
    },
    value: {
      handler (value) {
        this.innerValue = value || ''
        this.$emit('change')
      },
      immediate: true
    },
    type: {
      handler (value) {
        this.inputType = this.getType()
      },
      immediate: true
    },
    errorTips: {
      handler (value) {
        this.errorMsg = value
      },
      immediate: true
    }
  },
  computed: {
    style () {
      const ret = {}

      if (this.type === 'search') {
        ret.paddingLeft = '36px'
        ret.paddingRight = '30px'
      } else if (this.maxLength) {
        ret.paddingRight = '50px'
      } else if (this.type === 'password') {
        ret.paddingRight = '30px'
      }
      return ret
    }
  }
}
</script>

<style lang="scss" scoped>
  .com-input /deep/ {
    position: relative;
    display: inline-block;
    width: 200px;
    .error-msg {
      display: block;
      position: absolute;
      color: #fc5659;
      padding-left: 10px;
      font-size: 14px;
      line-height: 20px;
    }
    &.search input{
      border-radius: 30px;
      height: 34px;
      line-height: 34px;
    }
    input {
      display: inline-block;
      width: 100%;
      height: 40px;
      font-size: 14px;
      line-height: 40px;
      color: #222;
      background-color: #fff;
      background-image: none;
      border: 1px solid #cecece;
      border-radius: 4px;
      transition: all 0.3s;
      padding: 0 10px;
      &.error {
        border-color: #fc5659;
      }
      &:hover {
        border-color: #888888;
      }
      &[disabled] {
        cursor: not-allowed;
      }
    }
    .limit {
      font-size: 14px;
      color: #999999;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 10px;
      display: block;
      height: 14px;
      line-height: 14px;
      .length {
        color: #4b5afe;
      }
      &.area {
        transform: none;
        top: auto;
        bottom: 2px;
        line-height: normal;
        right: -50px;
      }
      i {
        font-style: normal !important;
      }
    }
    .icon-search {
      color: #999999;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 12px;
    }
    .icon-right-center {
      color: #999999;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 8px;
      cursor: pointer;
    }
    .icon-delete {
      @extend .icon-right-center;
    }
    .icon-guanbi-yanjing {
      @extend .icon-right-center;
    }
    .icon-faxian-yanjing {
      @extend .icon-right-center;
    }

    textarea {
      display: inline-block;
      padding: 10px;
      width: 100%;
      height: 100%;
      font-size: 14px;
      line-height: 1.5;
      color: #222;
      background-color: #fff;
      background-image: none;
      border: 1px solid #cecece;
      border-radius: 4px;
      transition: all 0.3s;
      font-family: -webkit-body;
      &.error {
        border-color: #fc5659;
      }
      &:hover {
        border-color: #888888;
      }
      &[disabled] {
        cursor: not-allowed;
      }
    }
  }
</style>
