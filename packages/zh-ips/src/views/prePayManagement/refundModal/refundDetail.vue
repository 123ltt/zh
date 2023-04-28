<template>
  <div v-loading="loading">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="100px" size="mini" class="no-message">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="采购编码">
              <el-input :value="propsData.purCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="第三方单号">
              <el-input :value="propsData.outsideCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购方名称">
              <el-input :value="propsData.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input :value="propsData.supplierName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购金额">
              <el-input :value="propsData.prepayTotalMoney" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预付金额">
              <el-input :value="propsData.purTatolMoney" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退款金额">
              <el-input :value="propsData.returnMoney" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人">
              <el-input :value="propsData.createUser" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input :value="propsData.createTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input :value="propsData.remark" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退款凭证">
              <el-image :src="propsData.returnCredence" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { detail } from '@/api/advanceManagement/refund'
export default {
  name: 'RefundDetail',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      checkData: [],
      propsData: {}
    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(id) {
      this.loading = true
      detail(id).then(res => {
        this.propsData = res.data
        this.$set(this.propsData, 'name', res.data.purDemander.name)
        this.$set(this.propsData, 'supplierName', res.data.supplierInfo.supplierName)
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__title{
  font-size: 16px;
  font-weight:bold
}
p{
  font-size: 14;
  font-weight: bold;
}
</style>
