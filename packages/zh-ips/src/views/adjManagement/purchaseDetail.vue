<template>
  <div v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="100px" size="mini" class="no-message">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="调整编码">
              <el-input :value="params.adjustCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购编码">
              <el-input :value="params.purCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购方名称">
              <el-input :value="params.purSquareName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input :value="params.supplierName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调整人">
              <el-input :value="params.adjustPeople" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调整前数量">
              <el-input :value="params.adjustBeforeQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调整数量">
              <el-input :value="params.adjustQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调整后数量">
              <el-input :value="params.adjustAfterQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调整时间">
              <el-input :value="params.createTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生效时间">
              <el-input :value="params.adjustEffectiveTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">采购调整明细</span>
      </div>
      <el-table :data="params.orderDetails" class="g-table" max-height="300px" border stripe size="mini">
        <el-table-column prop="productSku" label="商品编码" align="center" min-width="110" />
        <el-table-column prop="productName" label="商品名称" align="center" min-width="110" show-overflow-tooltip />
        <el-table-column prop="adjustBeforeQty" label="调整前数量" align="center" min-width="90" />
        <el-table-column prop="adjustQty" label="调整数量" align="center" min-width="80" />
        <el-table-column prop="adjustAfterQty" label="调整后数量" align="center" min-width="90" />
      </el-table>
    </el-card>
  </div>

</template>
<script>
import { detail } from '@/api/adjManagement/purchaseAdj'
export default {
  name: 'PurchaseDetail',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      isShow: false,
      params: {
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      detail(this.id).then(res => {
        this.params = res.data
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
