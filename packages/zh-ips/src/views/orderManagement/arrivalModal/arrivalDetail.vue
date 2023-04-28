<template>
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="100px" size="mini" class="no-message">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="入库单号">
              <el-input :value="propsData.warehousingCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物流运单号">
              <el-input :value="propsData.logisticsCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物流商名称">
              <el-input :value="propsData.lpName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购编码">
              <el-input :value="propsData.purchaseCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购数量">
              <el-input :value="propsData.purQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货数量">
              <el-input :value="propsData.receivingGoodsNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不良品数量">
              <el-input :value="propsData.rejectsQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上架数量">
              <el-input :value="propsData.upFrameQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货人">
              <el-input :value="propsData.receiptPeople" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货时间">
              <el-input :value="propsData.receivingGoodsTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">收货明细</span>
      </div>
      <el-table :data="propsData.arrivalDetails" border stripe>
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="90" />
        <el-table-column prop="productName" label="产品名称" align="center" min-width="90" />
        <el-table-column prop="purQty" label="采购数量" align="center" min-width="90" />
        <el-table-column prop="deliveryQty" label="发货数量" align="center" min-width="90" />
        <el-table-column prop="receivingGoodsQty" label="收货数量" align="center" min-width="90" />
        <el-table-column prop="rejectsQty" label="不良品数量" align="center" min-width="90" />
        <el-table-column prop="upFrameQty" label="上架数量" align="center" min-width="90" />
      </el-table>
    </el-card>

  </basic-container>
</template>

<script>
import { detail } from '@/api/ordermanagement/orderReceive'
export default {
  props: {
    id: String
  },
  data() {
    return {
      isShow: false,
      propsData: { }
    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(id) {
      detail(id).then(res => {
        this.propsData = res.data
        this.propsData.arrivalDetails.map(item => {
          for (const key in item) {
            if (item[key] === -1) item[key] = ''
          }
          return item
        })
      })
    },
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
