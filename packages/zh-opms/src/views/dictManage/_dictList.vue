<template>
  <el-row class="dict-list">
    <el-col :span="12">
      <basic-container>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
          </div>
          <div class="clearfix"><parent-list @parentData="onParentData" @selectedDict="selectedDict" /></div>
        </el-card>
      </basic-container>
    </el-col>
    <el-col :span="12">
      <basic-container>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>[{{ dictValue }}] 字典详情</span>
          </div>
          <div class="clearfix"><child-list :parent-data="parentData" /></div>
        </el-card>
      </basic-container>
    </el-col>
  </el-row>
</template>

<script>
import parentList from './components/parentList.vue'
import childList from './components/childList.vue'

export default {
  name: 'DictList',
  components: { parentList, childList },
  data() {
    return {
      dictValue: '暂无',
      parentData: {}
    }
  },
  methods: {
    selectedDict(val) {
      this.dictValue = val
    },
    onParentData(val) {
      this.parentData = val
    }
  }
}
</script>

<style lang="scss">
.dict-list {
  .el-card__body {
    padding: 8px 4px !important;
  }
  .el-col {
    margin-bottom: 0;
  }
  .dict-button .el-form-item__content {
    margin-left: 20px!important;
  }
  .basic-container {
    min-width: 0;
  }
  .el-checkbox:last-of-type {
    margin-right: 0;
  }
}
</style>
