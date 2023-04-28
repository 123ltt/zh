<template>
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-form label-width="100px" size="mini" class="no-message">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="预付编码">
                <el-input :value="propsData.prepayMoneyCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购编码">
                <el-input :value="propsData.purCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="第三方单号">
                <el-input :value="propsData.outsideCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购方名称">
                <el-input :value="propsData.name" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称">
                <el-input :value="propsData.supplierInfo.supplierName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预付金额">
                <el-input :value="propsData.prepayTotalMoney" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预付时间">
                <el-input :value="propsData.prepayTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退款金额">
                <el-input :value="propsData.returnMoney" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已核销金额">
                <el-input :value="propsData.verifiedTotalMoney" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="待核销金额">
                <el-input :value="propsData.unverifyTotalMoney" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态">
                <el-input :value="propsData.verifyStatus" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已核销时间">
                <el-input :value="propsData.settledTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="退款明细" name="2">
        <el-table :data="returnData" border stripe class="g-table">
          <el-table-column prop="returnCode" label="退款编码" align="center" min-width="90" />
          <el-table-column prop="prepayTotalMoney" label="预付金额" align="center" min-width="90" />
          <el-table-column prop="returnMoney" label="退款金额" align="center" min-width="90" />
          <el-table-column prop="returnTime" label="退款时间" align="center" min-width="90" />
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="核销明细" name="3">
        <el-table :data="checkData" border stripe class="g-table">
          <el-table-column prop="shouldCode" label="核销编码" align="center" min-width="90" />
          <el-table-column prop="verifyCode" label="应付编码" align="center" min-width="90" />
          <el-table-column prop="purTotalMoney" label="预付金额" align="center" min-width="90" />
          <el-table-column prop="verifiedTotalMoney" label="核销金额" align="center" min-width="90" />
          <el-table-column prop="verifyTime" label="核销时间" align="center" min-width="90" />
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </basic-container>
</template>
<script>
import { detail } from '@/api/advanceManagement/info'
export default {
  name: 'InfoInfoDetail',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      isShow: false,
      propsData: {
        supplierInfo: { supplierName: '' }
      },
      checkData: [],
      returnData: [],
      activeNames: ['1', '2', '3']
    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(id) {
      this.loading = true
      detail(id).then(res => {
        this.propsData = res.data.orderPrepayInfoVO
        this.returnData = res.data.orderPrepayReturnHis
        this.checkData = res.data.orderPrepayVerifyHis
        this.loading = false
      })
    },
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-collapse-item__header{
  padding: 0 30px;
  font-weight: 600;
  ::v-deep .el-collapse-item__arrow{
    margin: 0 auto 0 20px;
    font-weight: 600;
  }
}
.dialog-footer{
  text-align: right;
  padding: 15px 15px 15px 0;
}
</style>
