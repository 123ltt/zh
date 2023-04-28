<template>
  <div class="container">
    <div class="header">
      <div class="title">
        <div class="page" />
        <div class="h2" style="float-left">物流支付申请单</div>
        <div class="page">单据及附件共&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;页</div>
      </div>
      <div class="info">
        <div>部门: {{ dept }}</div>
        <div>xxx年xx月xx日</div>
        <div>编号xxxxx</div>
      </div>
    </div>
    <table border="2" class="table">
      <tbody>
        <tr style="height: 15px">
          <td rowspan="2" style="width: 15%">摘要</td>
          <td rowspan="2" style="width: 20%">付款单号</td>
          <td colspan="10" style="width: 20%; height: 15px">金额</td>
          <td rowspan="2" colspan="2">收款/付款信息</td>
        </tr>
        <tr class="unit-cell">
          <td>千</td>
          <td>百</td>
          <td>十</td>
          <td>万</td>
          <td>千</td>
          <td>百</td>
          <td>十</td>
          <td>元</td>
          <td>角</td>
          <td>分</td>
        </tr>
        <tr>
          <td rowspan="3">申请xxxx</td>
          <td>wxxxx</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td style="width: 15%">收款单位</td>
          <td style="width: 20%">xxxxx</td>
        </tr>
        <tr>
          <td>wxxxx</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>账号</td>
          <td>xxxxx</td>
        </tr>
        <tr>
          <td>wxxxx</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>开户行</td>
          <td>xxxxx</td>
        </tr>
        <tr>
          <td colspan="2">合计</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>x</td>
          <td>付款公司主体</td>
          <td>xxxxx</td>
        </tr>
        <tr>
          <td>大写</td>
          <td colspan="11">&nbsp;&nbsp;&nbsp;&nbsp;仟&nbsp;&nbsp;&nbsp;&nbsp;佰&nbsp;&nbsp;&nbsp;&nbsp;拾&nbsp;&nbsp;&nbsp;&nbsp;万&nbsp;&nbsp;&nbsp;&nbsp;仟&nbsp;&nbsp;&nbsp;&nbsp;佰&nbsp;&nbsp;&nbsp;&nbsp;拾&nbsp;&nbsp;&nbsp;&nbsp;元&nbsp;&nbsp;&nbsp;&nbsp;角&nbsp;&nbsp;&nbsp;&nbsp;分</td>
          <td>付款账号</td>
          <td>xxxxx</td>
        </tr>
        <tr>
          <td>备注</td>
          <td colspan="13">xxx</td>
        </tr>
        <tr>
          <td>部门经理</td>
          <td>财务部经理</td>
          <td colspan="6">主管副经理</td>
          <td colspan="5">总经理</td>
          <td>董事长</td>
        </tr>
        <tr>
          <td>aaa</td>
          <td />
          <td colspan="6" />
          <td colspan="5" />
          <td />
        </tr>
      </tbody>
    </table>
    <div class="footer">
      <div>复核:</div>
      <div>出纳:</div>
      <div>申请人:</div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      // page: 1,
      dept: '财务部'
    }
  },
  mounted() {
    window.print()
    this.$nextTick(() => {
      document.querySelector('.basic-container').className = ''
    })
  }
}
</script>

<style lang='scss' scoped>

.container{
  color: #0C57B3;
  min-width: 680px;
  padding: 10px;
  font-size: 12px;
  .header{
    margin-bottom: 6px;
    width: 100%;
    .title{
      display: flex;
      justify-content: space-between;
      height: 36px;
      .h2{
        flex:1;
        font-size: 24px;
        font-weight: 700;
        text-align: center;
      }
      .page{
        flex:1;
        text-align: right;
        line-height: 36px;
      }
    }
    .info{
      display: flex;
      justify-content: space-between;
      div:nth-child(1){
        flex:1;
        text-align: left;
      }
      div:nth-child(2){
        flex:1;
        text-align: center;
      }
      div:nth-child(3){
        flex:1;
        text-align: right;
      }
    }
  }
  .table{
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    td{
      border: 1px solid #0C57B3;
    }
    tbody{
      border: 2px solid #0C57B3;
      tr{
        height: 40px;
      }
    }
    .unit-cell{
      td {
        width: 3%;
      }
    }
  }
  .footer{
    margin-top: 6px;
    display: flex;
    justify-content: space-around;
  }
}
</style>
