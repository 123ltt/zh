<template>
  <basic-container>
    <el-tabs class="autoHeight">
      <el-tab-pane type="border-card">
        <span slot="label" style="font-size:15px ">汇总</span>
        <photon-pay-bill-total />
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label" style="font-size:15px">明细</span>
        <photon-pay-bill-detail />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import photonPayBillTotal from './components/photonPayBillTotal'
import photonPayBillDetail from './components/photonPayBillDetail'
export default {
  name: 'PrsVerifiyEbayPhotonPayBill',
  components: {
    photonPayBillTotal,
    photonPayBillDetail
  }
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
