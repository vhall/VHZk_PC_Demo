<template>
  <div class="single-select-wrap" :class="{isPhone:value.ext.key==='phone'}">
    <div class="question-content">
      <div class="index">{{index}}</div>
      <div v-if="edit"
           class="q-des">{{value.ext.name}}</div>
      <div class="q-edit"
           :class="{display:!edit}">
        <!-- 问题描述区 -->
        <com-input v-if="edit"
                   class="q-subject"
                   @focus="focusTitle"
                   :class="{error:value.error}"
                   v-model="value.title"
                   :max-length="30"></com-input>
        <div v-if="!edit"
             class="q-subject">{{value.title}}<span v-if="value.required === 'Y'" class="v-red">*</span></div>
        <!-- 问题描述区 -->
        <component ref="content"
                   :is="QComs[value.type]"
                   v-model="value"
                   :edit="edit"
                   :isView="isView"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { coms as QComs, types as QTypes } from 'components/questionnaire/types'
import qRadio from './q-radio'
import qCheckbox from './q-checkbox'
import qSelect from './q-select'
import qText from './q-text'
import qDate from './q-date'
import qArea from './q-area'

export default {
  components: {
    qRadio,
    qCheckbox,
    qSelect,
    qText,
    qDate,
    qArea
  },
  props: {
    index: {
      type: Number,
      default: 1
    },
    value: {
      type: Object,
      default () {
        return {

        }
      }
    },
    edit: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      QComs: QComs
    }
  },
  mounted () {
    if (this.value.verification === 'Y') {
      this.value.verifiy = true
    }
  },
  methods: {
    check () {
      return this.$refs.content.check()
    },
    focusTitle () {
      if (this.value.error) {
        this.value.error = false
        this.value.title = ''
      }
    },
    addItem () {
      if (this.value.detail.list.length < 20) {
        this.value.detail.list.push({
          value: '选项'
        })
      }
    },
    remove () {
      let option = {
        type: this.value.ext.key,
        index: this.index
      }
      this.$emit('remove', option)
    }
  },
  watch: {
    'value.verifiy': {
      handler (val) {
        if (val) {
          this.value.verification = 'Y'
        } else {
          this.value.verification = 'N'
        }
      },
      deep: true
    }
  },
  computed: {
    showAddItem () {
      return !this.value.ext.fixedness && (this.value.type === QTypes.RADIO || this.value.type === QTypes.CHECKBOX || this.value.type === QTypes.SELECT)
    }
  }
}
</script>

<style scoped lang="scss">
.single-select-wrap {
  width: 100%;
  font-size: 12px;
  position: relative;
  border-radius: 4px;
  border: 1px solid #d2d2d2;
  &.isPhone {
    overflow: visible;
  }
  /deep/ {
    .el-radio + .el-radio {
      margin-left: 0;
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
    .com-input {
      width: 100%;
      input {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
      }
    }
    .index {
      float: left;
      margin: 2px 5px 0 0;
      padding-left: 10px;
      font-size: 14px;
    }
    .v-red {
      display: inline-block;
      color: #fc5659;
      margin-left: 6px;
      vertical-align: middle;
    }
    .question-content {
      padding: 15px 12px 5px;
      width: 100%;
      background-color: #fff;
      .q-des {
        margin-bottom: 15px;
      }
      .q-edit {
        padding: 0 10px;
        margin-bottom: 15px;
        &.display {
          // margin-bottom: 0;
        }
        .q-subject {
          margin-bottom: 14px;
          word-break: break-all;
          font-size: 14px;
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
      .q-operate {
        padding: 0 10px 0 15px;
        text-align: right;
        .add-select-item {
          float: left;
          cursor: pointer;
          margin-top: 6px;
        }
        .required-des {
          display: inline-block;
          vertical-align: middle;
        }
        .el-switch__core {
          height: 18px;
          .el-switch__button {
            width: 14px;
            height: 14px;
          }
        }
        .sort {
          display: inline-block;
          text-align: center;
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 30px;
          border: 1px solid #d2d2d2;
          cursor: pointer;
          margin-left: 10px;
        }
        .del {
          display: inline-block;
          text-align: center;
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 30px;
          border: 1px solid #d2d2d2;
          cursor: pointer;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
