<!-- 线上发货配置 新增/编辑-->
<template>
  <basic-container v-loading="loading" class="configurationAddEdit">
    <el-form ref="rulesForm" size="mini" :model="configurationInfo" label-width="150px">
      <div class="box">
        <el-row :gutter="10" class="title">
          <div>驳回原因</div>
        </el-row>
        <el-row>
          <el-input
            v-model="configurationInfo.reason"
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
          />
        </el-row>
        <div class="btn">
          <el-button size="mini" type="primary" @click="authorization()">确定</el-button>
          <el-button size="mini" type="primary" @click="close(false)">取消</el-button>
        </div>
      </div>
    </el-form>
  </basic-container>
</template>
<script>
import { rejectPay } from '@/api/payList'// 驳回
export default {
  name: 'OrderSynchronization',
  props: {
    row: Object,
    paymentApplyIds: Array
  },
  data() {
    return {
      loading: false,
      configurationInfo: { // 需要传递的参数
        paymentApplyIds: this.paymentApplyIds, // id
        reason: ''
      }
    }
  },
  created() {
    this.getData()
  },

  methods: {
    // 弹框取消按钮
    close(val) {
      this.$parent.$emit('close', val)
    },
    // 弹框 确定
    authorization() {
      this.$refs.rulesForm.validate(valid => {
        if (valid) {
          this.loading = true
          rejectPay(this.configurationInfo).then(res => {
          })
          this.$parent.$emit('close', true)
          this.$message({
            message: '驳回成功~',
            type: 'success'
          })
        }
      })
    },
    getData() {

    }
  }
}
</script>
<style lang="scss" scoped>
.configurationAddEdit{
  &.basic-container{
    min-width:400px!important;
    .el-input{
      width:40%
    }
    .g-select{
      width:40%
    }
   .btn{
    margin-left: 197px;
    margin-top: 30px;
   }
   .box{
     margin-left: 20px;
   }
   .title{
     margin-bottom: 10px;
     font-size: 12px;
     font-weight: bold;
     padding-left: 2px;
   }
  }
}
</style>
