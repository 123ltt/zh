<template>
  <div v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">预付申请</span>
      </div>
      <el-form label-width="120px" size="mini" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="采购编码">
              <el-input :value="params.purCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="第三方单号">
              <el-input :value="params.outsideCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购方名称">
              <el-input :value="params.purDemander.orgName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input :value="params.supplierInfo.supplierName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购金额">
              <el-input :value="params.purTotalMoney" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预付类型">
              <el-input :value="params.prepayType" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预付金额">
              <el-input :value="params.prepayTotalMoney" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input :value="params.remark" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人">
              <el-input :value="params.applyUser.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请时间">
              <el-input :value="params.applyTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">审核信息</span>
      </div>
      <el-form label-width="120px" size="mini" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="审核人">
              <el-input :value="params.orderPrepayDetails[0]?params.orderPrepayDetails[0].operateUser:null" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核时间">
              <el-input :value="params.orderPrepayDetails[0]?params.orderPrepayDetails[0].operateTime:null" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input :value="params.orderPrepayDetails[0]?params.orderPrepayDetails[0].remark:null" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">付款信息</span>
      </div>
      <el-form label-width="120px" size="mini" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="付款人">
              <el-input :value="params.orderPrepayDetails[1]?params.orderPrepayDetails[1].operateUser:null" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款时间">
              <el-input :value="params.orderPrepayDetails[1]?params.orderPrepayDetails[1].operateTime:null" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input :value="params.orderPrepayDetails[1]?params.orderPrepayDetails[1].remark:null" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { Detail } from '@/api/advanceManagement/apply'
export default {
  name: 'ApplyeDetail',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      isShow: false,
      params: {
        supplierInfo: { supplierName: '' },
        purDemander: { orgName: '' },
        applyUser: { name: '' },
        supplapplyUser: { nameierInfo: '' }
      },
      pay: {}
    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(val) {
      this.loading = true
      Detail(val).then(res => {
        this.params = res.data
        this.loading = false
      })
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-card__body{
    padding-bottom: 0;
  }
</style>
