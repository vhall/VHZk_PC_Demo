<template>
  <div class="q-edit-content">
    <com-input @focus="focus"
               @blur="blurFn"
               @change="inputSearch"
               :disabled="isHidden"
               :type="value.detail.format==='phone'?'mobile':value.detail.format"
               :max-length="value.detail.max?value.detail.max:0"
               :placeholder="value.placeholder||'请输入'"
               :value.sync="value.value"></com-input>
    <div v-if="errorTip" class="error-msg">{{errorTip}}</div>
    <div class="input-list" v-if="value.ext.key==='company' && companyList.length">
      <span class="input-list-item" v-for="(name,idx) in companyList" :key="idx" @click="changeInput(idx)">{{name}}</span>
      <i class="clear-input" @click="clearCompany">清空</i>
    </div>
    <div class="input-list" v-if="value.ext.key==='position' && personnelList.length">
      <span class="input-list-item" v-for="(name,idx) in personnelList" :key="idx" @click="changeInput(idx)">{{name}}</span>
      <i class="clear-input" @click="clearPersonnel">清空</i>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['publicApi'],
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mobileReg: /^1[1|2|3|4|5|6|7|8|9][0-9]\d{8}$/,
      errorTip: '',
      phoneKey: '',
      isHidden: false,
      initReady: false,
      personnelList: [],
      companyList: []
    }
  },
  mounted () {
    if (this.value.detail.format === 'phone') {
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      if (userInfo) {
        this.value.value = userInfo.mobile
        this.isHidden = true
      } else {
        this.value.detail.max = 11
      }
    }
  },
  methods: {
    verification (val, type) {
      let phoneReg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      if (type === 'phone') {
        if (phoneReg.test(val)) {
          return true
        } else {
          this.errorTip = '请正确填写手机号'
          return false
        }
      }
    },
    focus () {
      this.errorTip = ''
      this.inputSearch()
    },
    blurFn () {
      let st = setTimeout(() => {
        clearTimeout(st)
        this.companyList = []
        this.personnelList = []
      }, 200)
    },
    changeInput (idx) {
      let ext = this.value.ext.key
      if (ext === 'company') {
        this.value.value = this.companyList[idx]
      } else if (ext === 'position') {
        this.value.value = this.personnelList[idx]
      }
      this.initReady = false
      this.$nextTick(() => {
        this.companyList = []
        this.personnelList = []
      })
    },
    clearCompany () {
      this.publicApi.clearCompany()
      this.companyList = []
      this.value.value = ''
    },
    clearPersonnel () {
      this.publicApi.clearPersonnel()
      this.personnelList = []
      this.value.value = ''
    },
    inputSearch () {
      if (!this.initReady) {
        if (this.st) return
        this.st = setTimeout(() => {
          clearTimeout(this.st)
          this.st = null
          this.initReady = !this.initReady
        }, 500)
        return
      }
      let ext = this.value.ext.key
      if (ext === 'company' || ext === 'position') {
        if (this.st) {
          clearTimeout(this.st)
          this.st = null
        }
        this.st = setTimeout(() => {
          clearTimeout(this.st)
          this.st = null
          if (ext === 'company') {
            this.publicApi.queryCompanyList({
              page: 10,
              keyword: this.value.value
            }).then((res) => {
              this.companyList = res
            })
          } else if (ext === 'position') {
            this.publicApi.queryPersonnelList({
              page: 10,
              keyword: this.value.value
            }).then((res) => {
              this.personnelList = res
            })
          }
        }, 200)
      }
    },
    validate () {
      let result = true
      if (!this.value.title) {
        result = false
        this.value.error = true
        this.value.title = '请设置问卷内容'
      }

      return result
    },
    check () {
      if (this.value.required === 'Y' && !this.value.value && this.value.detail.format !== 'phone') {
        this.errorTip = '此项为必填项'
        return false
      } else if (this.value.detail.format === 'email' && this.value.value) {
        var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        if (!re.test(this.value.value)) {
          this.errorTip = '请输入正确的邮箱格式'
          return false
        }
      } else if (this.value.detail.format === 'phone') {
        if (!this.value.value || this.value.value.length < 11) {
          this.errorTip = '请输入正确的手机号'
          return false
        }
        if (!this.verification(this.value.value, 'phone')) return false
        let ext = this.value.ext
        return { id: this.value.id, value: this.value.value, code: '', type: ext.key }
      }
      let ext = this.value.ext
      return { id: this.value.id, value: this.value.value, type: ext.key }
    }
  }
}
</script>

<style scoped lang="scss">
.q-edit-content {
  position: relative;
  width: 90%;
  .input-list{
    position: absolute;
    top: 44px;
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    padding: 5px 0;
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0,0,0,.2);
    font-size: 14px;
    background-color: #fff;
    margin-bottom: 4px;
    z-index: 10;
    .clear-input{
      display: inline-block;
      position: absolute;
      bottom: 15px;
      right: 10px;
      &:hover{
        cursor: pointer;
        color: #5D6AFE;
      }
    }
    .input-list-item{
      display: block;
      line-height: 40px;
      width: 100%;
      padding: 0 20px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      &:hover{
        cursor: pointer;
        background-color: #F0F1FE;
      }
    }
  }
  /deep/ {
    .com-input {
      &.code {
        margin-top: 5px;
        width: 140px;
      }
    }
    .captcha {
      height: 40px;
      margin: 25px 0 19px 0;
      .yidun_control {
        height: 40px !important;
        .yidun_slide_indicator {
          height: 40px !important;
        }
        .yidun_tips {
          line-height: 40px !important;
        }
      }
    }
    .phone-box {
      position: relative;
    }
    .com-button {
      font-size: 12px;
      padding: 6px 20px;
      &.codeBtn {
        text-align: center;
        margin-top: 5px;
        width: 140px;
        margin-left: 1px;
        position: absolute;
        bottom: 2px;
        right: 2px;
        height: 36px;
        line-height: 36px;
        border-color: #ffd021;
        background-color: #ffd021;
        opacity: 1;
        padding: 0;
        &:disabled {
          border-color: #e2e2e2;
          background-color: #e2e2e2;
        }
      }
    }
    .error-msg {
      position: absolute;
      color: #fc5659;
      padding-left: 10px;
      line-height: 20px;
      font-size: 12px;
    }
  }
}
</style>
