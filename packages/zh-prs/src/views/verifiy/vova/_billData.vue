<template>
  <basic-container>
    <el-tabs class="autoHeight">
      <el-tab-pane type="border-card">
        <span slot="label" style="font-size:15px ; ">汇总</span>
        <vova-total />
      </el-tab-pane>
      <el-tab-pane type="border-card" lazy>
        <span slot="label" style="font-size:15px ;">明细</span>
        <vova-detail />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import vovaDetail from './components/vovaDetail'
import vovaTotal from './components/vovaTotal'
export default {
  name: 'PrsVerifiyVovaBillData',
  components: { vovaDetail, vovaTotal }

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
