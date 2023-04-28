<template>
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="120px" size="mini" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="退货运单号：">
              <el-input :value="detailData.returnGoodsWaybill" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货人：">
              <el-input :value="detailData.returnGoodsPeople" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货时间：">
              <el-input :value="detailData.returnGoodsTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货数量：">
              <el-input :value="detailData.returnGoodsNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货人：">
              <el-input :value="detailData.receiptPeople" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货时间：">
              <el-input :value="detailData.receiptTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货数量：">
              <el-input :value="detailData.receiptNumber" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">退货明细</span>
      </div>
      <el-table :data="recordData" max-height="400px" stripe style="width: 100%" border class="g-table">
        <el-table-column prop="goodsCode" label="商品编码" align="center" min-width="100" />
        <el-table-column prop="goodsName" label="商品名称" align="center" min-width="130" />
        <el-table-column prop="rejectsQty" label="不良品数量" align="center" min-width="100" />
        <el-table-column prop="returnGoodsNumber" label="退货数量" align="center" min-width="80" />
        <el-table-column prop="receiptNumber" label="收货数量" align="center" min-width="80" />
      </el-table>
    </el-card>

  </basic-container>
</template>

<script>
import { getDetail } from '@/api/orderManagement/returnOrder.js'
export default {
  name: 'ReturnOrderDetails',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      detailData: {},
      recordData: []
    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    // 详情
    getData(val) {
      this.loading = true
      getDetail(val).then(res => {
        if (res.code === 200) {
          this.detailData = res.data
          this.recordData = res.data.returnDetails
          this.loading = false
        } else {
          this.$message.error('加载失败!')
        }
      })
    }
  }

}
</script>

<style lang='scss' scoped>

</style>
