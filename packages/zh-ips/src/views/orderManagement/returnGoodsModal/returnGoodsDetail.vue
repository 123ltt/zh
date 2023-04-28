<template>
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-form label-width="100px" size="mini" class="no-message">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="退货编码">
                <el-input :value="propsData.returnGoodsCode" disabled />
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
              <el-form-item label="入库编码">
                <el-input :value="propsData.warehousingCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购编码">
                <el-input :value="propsData.purCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称">
                <el-input :value="propsData.supplierName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="不良品数量">
                <el-input :value="propsData.rejectsQty" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退货数量">
                <el-input :value="propsData.returnGoodsQty" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退货金额">
                <el-input :value="propsData.returnTotalAmount" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退货人">
                <el-input :value="propsData.returnGoodsPeople" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退货时间">
                <el-input :value="propsData.creturnGoodsTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="退货地址" name="2">
        <el-form label-width="100px" size="mini" class="no-message">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="收件人">
                <el-input :value="propsData.receiptPeople" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="固定电话">
                <el-input :value="propsData.phone" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="移动电话">
                <el-input :value="propsData.mobile" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货地址">
                <el-input :value="propsData.shippingAddress" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="退货明细" name="3">
        <el-table :data="propsData.returnDetails" border class="g-table" stripe>
          <el-table-column prop="productSku" label="产品编码" align="center" min-width="90" />
          <el-table-column prop="productName" label="产品名称" align="center" min-width="90" show-overflow-tooltip />
          <el-table-column prop="rejectsQty" label="不良品数量" align="center" min-width="90" />
          <el-table-column prop="returnGoodsQty" label="退货数量" align="center" min-width="90" />
          <el-table-column prop="productPrice" label="采购单价" align="center" min-width="90" />
          <el-table-column prop="returnTotalAmount" label="退货金额" align="center" min-width="90" />
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </basic-container>
</template>

<script>
import { detail } from '@/api/ordermanagement/orderReturn'
export default {
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      isShow: false,
      activeNames: ['1', '2', '3'],
      propsData: {
        checkData: []
      }
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
        this.loading = false
      })
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
</style>
