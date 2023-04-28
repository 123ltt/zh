<template>
  <basic-container>
    <el-tabs class="autoHeight">
      <el-tab-pane type="border-card">
        <span slot="label" style="font-size:15px ; ">汇总</span>
        <walmart-total />
      </el-tab-pane>
      <el-tab-pane type="border-card" lazy>
        <span slot="label" style="font-size:15px ;">明细US</span>
        <walmart-us-detail />
      </el-tab-pane>
      <el-tab-pane type="border-card" lazy>
        <span slot="label" style="font-size:15px ;">明细CA</span>
        <walmart-ca-detail />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import walmartCaDetail from './components/walmartCaDetail'
import walmartUsDetail from './components/walmartUsDetail'
import walmartTotal from './components/walmartTotal'

export default {
  name: 'PrsVerifiyWalmartBillData',
  components: { walmartUsDetail, walmartCaDetail, walmartTotal }

}
</script>

<style scoped lang="scss">
::v-deep.autoHeight{
  display: flex;
  flex-direction: column;
  height:100%;
  .el-tabs__content{
    flex: 1;
    .el-tab-pane{
      height: 100%;
    }
  }
}
</style>
