<template>
  <basic-container>
    <tab-detail ref="tabDetail">
      <el-tab-pane label="非SPI">
        <notSipOrderl />
      </el-tab-pane>
      <el-tab-pane label="SPI" lazy>
        <SipOrder />
      </el-tab-pane>
    </tab-detail>
  </basic-container>
</template>

<script>
import notSipOrderl from './components/notSipOrderl.vue'
import SipOrder from './components/SipOrder.vue'
import tabDetail from '@/views/components/tabDetail.vue'
export default {
  components: { tabDetail, notSipOrderl, SipOrder },
  data() {
    return {

    }
  },
  updated() {
    this.$refs.tabDetail && this.$refs.tabDetail.updateHeight()
  }
}
</script>

<style>

</style>
