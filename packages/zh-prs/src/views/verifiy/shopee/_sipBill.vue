<template>
  <basic-container>
    <el-tabs class="autoHeight">
      <el-tab-pane>
        <span slot="label" style="font-size:15px ; ">Summary</span>
        <sip-total />
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label" style="font-size:15px ;">Offline</span>
        <sip-detail />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import sipDetail from './components/sipDetail'
import sipTotal from './components/sipTotal'
export default {
  name: 'PrsVerifiyShopeeSipBill',
  components: { sipTotal, sipDetail },
  data() {
    return {

    }
  },

  methods: {

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
