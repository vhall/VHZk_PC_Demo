<template>
  <div class="q-edit-content"
       :class="{display:!edit}">
    <el-select v-if="!edit"
               v-model="val"
               @change="change"
               :placeholder="value.placeholder||'请选择'">
      <el-option v-for="(item,index) in value.detail.list"
                 :label="item.value"
                 :value="item.key"
                 :key="index">
      </el-option>
    </el-select>
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
      return { id: this.value.id, value: this.val, type: ext.key, list: this.value.detail.list }
    }
  }
}
</script>

<style scoped lang="scss">
.q-edit-content {
  margin-bottom: 30px;
  &.display {
    margin-bottom: 0;
  }
  /deep/ {
    .el-input__inner {
      padding-left: 10px;
    }
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
      height: 40px;
      .select-icon {
        display: inline-block;
        margin-top: 8px;
      }
      .select-input {
        left: 20px;
        right: 38px;
        padding-left: 0;
        position: absolute;
        top: 0;
        white-space: nowrap;
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
    }
  }
}
</style>
