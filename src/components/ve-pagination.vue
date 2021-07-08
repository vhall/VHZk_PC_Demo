<template>
  <div class="pagination-box">
    <el-pagination
      background
      :pager-count="pagerCount"
      :layout="layout"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="total"
      @current-change="changePage">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 've-pagination',
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    layout: {
      type: String,
      default: 'prev, pager, next'
    },
    pagerCount: {
      type: Number,
      default: 7
    }
  },
  methods: {
    changePage (num) {
      this.$emit('changePage', num)
    }
  }
}
</script>

<style lang="scss">
  .pagination-box{
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #4B5AFE;
      &:hover{
        color: #fff;
      }
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      color: #4B5AFE;
    }
  }
</style>
