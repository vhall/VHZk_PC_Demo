<template>
  <div class="q-edit-content">
    <el-radio v-for="(item,index) in value.detail.list"
              class="q-select-item"
              :class="{display:!edit}"
              v-model="val"
              @change="change"
              :label="item.key"
              :key="index">
      <com-input v-if="edit"
                 :class="{error:item.error}"
                 @focus="itemFocus(item)"
                 v-model="item.value"
                 :max-length="30"></com-input>
      <div v-if="!edit"
           class="item-text"
           v-text="item.value"></div>
      <span class="remove"
            v-if="edit&&value.detail.list.length>1"
            @click="delItem(index)">删</span>
    </el-radio>
    <div v-if="!edit&&errorTip"
         class="error-msg">{{errorTip}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      val: '',
      errorTip: ''
    }
  },
  methods: {
    delItem (index) {
      this.value.detail.list.splice(index, 1)
    },
    change () {
      this.errorTip = ''
    },
    itemFocus (item) {
      if (item.error) {
        item.error = false
        item.value = ''
      }
    },
    validate () {
      let result = true
      if (!this.value.title) {
        result = false
        this.value.error = true
        this.value.title = '请设置问卷内容'
      }
      this.value.detail.list.forEach(item => {
        if (!item.value) {
          result = false
          item.value = '请设置选项内容'
          item.error = true
        } else {
          item.error = false
        }
      })
      return result
    },
    check () {
      if (this.value.required === 'Y' && !this.val) {
        this.errorTip = '此项为必填项'
        return false
      }
      let ext = this.value.ext
      return { id: this.value.id, value: this.val, type: ext.key }
    }
  }
}
</script>

<style scoped lang="scss">
.q-edit-content {
  /deep/ {
    .error-msg {
      position: absolute;
      color: #fc5659;
      padding-left: 10px;
      line-height: 20px;
      font-size: 12px;
    }
    .q-select-item {
      width: 100%;
      position: relative;
      margin-bottom: 15px;
      height: 24px;
      &.display {
        margin-bottom: 21px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .el-radio__input {
      display: inline-block;
      margin-top: 8px;
    }
    .el-radio__label {
      left: 20px;
      right: 28px;
      padding-left: 0;
      position: absolute;
      margin-right: 10px;
      .com-input {
        margin-right: 8px;
        &.error {
          input {
            border-color: #fc5659;
            color: #fc5659;
          }
          .limit {
            display: none;
          }
        }
      }
    }
    .remove {
      cursor: pointer;
      font-size: 12px;
    }
    .item-text {
      display: inline-block;
      font-size: 14px;
      margin-top: 8px;
    }
  }
}
</style>
