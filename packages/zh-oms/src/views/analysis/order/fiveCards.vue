<template>
  <!-- oms 订单分析 - 五个小卡片 -->
  <div class="container d-flex">
    <el-card class="box-card ">
      <div>订单量</div>
      <div class="account">{{ sum. orderCount }}</div>
      <div>（单位:笔）</div>
    </el-card>
    <el-card class="box-card ">
      <div>销售额</div>
      <div class="account">{{ sum. salesAmount }}</div>
      <div>（单位:$）</div>
    </el-card>
    <el-card class="box-card ">
      <div>客单价</div>
      <div class="account">{{ sum.customerUnitPrice }}</div>
      <div>（单位:$）</div>
    </el-card>
    <el-card class="box-card ">
      <div>退款额</div>
      <div class="account">{{ sum.refundAmount }}</div>
      <div>（单位:$）</div>
    </el-card>
    <el-card class="box-card ">
      <div>利润预估</div>
      <div class="account">{{ sum.forecastProfits }}</div>
      <div>（单位:$）</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'FiveCards',
  components: { },
  props: {
    sum: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    width: 15%;
    height:80px;
    border: 1px solid rgb(204, 203, 203);
    font-weight: bold;
    text-align: center;
    font-size: 12px;
    .account{
      font-size: 20px;
      color: #409eff;
    }
  }
  .container{
    margin:20px 0 20px 0;
    justify-content: space-evenly;
    ::v-deep .el-card__body{
    margin-top:-6px;
   }
  }

</style>
