<template>
  <div class="v-questions">
    <com-question v-for="(item,index) in dragData"
                :value.sync="item"
                :edit="false"
                :index="index+1"
                :key="index"
                :class="{isSingle:isSingle}"
                :ref="`com${index}`">
    </com-question>
    <com-question v-if="phoneData.length"
                  class="v-phone"
                  :value.sync="phoneData[0]"
                  :edit="false"
                  :ref="`comPhone`"
                  :index="dragData.length+1"
                  :isView="isView"
                  :key="dragData.length+1">
    </com-question>
  </div>
</template>
<script>
import question from 'components/questionnaire/wrap'
export default {
  components: {
    comQuestion: question
  },
  props: {
    dragData: {
      type: Array,
      default: null
    },
    phoneData: {
      type: Array,
      default: null
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isSingle () {
      return (this.dragData.length === 1) && (this.phoneData.length === 0)
    }
  }
}
</script>
<style scoped lang="scss">
.v-questions /deep/ {
  .single-select-wrap {
    border: none;
    text-align: left;
    .question-content {
      .q-edit-content {
        width: 100%;
        .el-select {
          width: 100%;
        }
        .com-input {
          width: 100%;
        }
        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 100%;
        }
      }
    }
  }
}
</style>
