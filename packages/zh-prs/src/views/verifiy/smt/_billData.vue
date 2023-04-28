<template>
  <basic-container>
    <el-tabs class="autoHeight">
      <el-tab-pane>
        <span slot="label" style="font-size:15px ; ">汇总</span>
        <smt-total />
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label" style="font-size:15px ;">明细</span>
        <smt-detail />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import smtDetail from './components/smtDetail.vue'
import smtTotal from './components/smtTotal.vue'
export default {
  name: 'PrsVerifiySmtBillData',
  components: { smtDetail, smtTotal },
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
