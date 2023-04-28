<template>
  <basic-container>
    <el-table ref="table"
              :data="tableData"
              :page-show="false"
              border
              style="width: 50%"
              stripe
              size="small"
              :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
    >
      <el-table-column
        prop="updateUserName"
        label="操作人"
        width="180"
      />
      <el-table-column
        prop="content"
        label="操作"
        width="180"
      />
      <el-table-column
        prop="updateTime"
        label="时间"
      />
    </el-table>
  </basic-container>
</template>

<script>
export default {
  name: 'OperationLog',
  props: {
    type: String,
    status: Number,
    baseProductInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.tableData = this.baseProductInfo.declareCustomsHis
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.demo-form-inline{
  width: 90%;
}
::v-deep .el-input__inner{
  width:145px;
}
.el-cate-dropdown-list{
  max-height: 285px;
  overflow-y: auto;
}
.cate-cascader{
  width: 42px !important;
}
.cate{
  position: relative;
}
.no-border{
  ::v-deep input{
    border: 0;
  }
}
.cate-change{
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9;
  opacity: 0;
}
.h28{
  height: 28px
}
</style>
