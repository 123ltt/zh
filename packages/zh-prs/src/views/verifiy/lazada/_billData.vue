<template>
  <basic-container>
    <el-tabs v-model="activeName" class="autoHeight">
      <el-tab-pane type="border-card" name="total">
        <span slot="label" style="font-size:15px ; ">汇总</span>
        <lazada-total ref="total" />
      </el-tab-pane>
      <el-tab-pane type="border-card" name="detail" lazy>
        <span slot="label" style="font-size:15px ;">明细</span>
        <lazada-detail ref="detail" />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>

import lazadaDetail from './components/lazadaDetail'
import lazadaTotal from './components/lazadaTotal'

export default {
  name: 'PrsVerifiyLazadaBillData',
  components: { lazadaDetail, lazadaTotal },
  data() {
    return {
      activeName: 'total'
    }
  },
  watch: {
    activeName(val) {
      this.$nextTick(() => {
        this.$refs[val].$refs.tableRef.tableRef.doLayout()
      })
    }
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
