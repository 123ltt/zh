<template>
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <groupShow :incoming-data="detail" />

      </el-collapse-item>
      <el-collapse-item title="采购明细" name="2">
        <el-table :data="detail.purchaseDetails" max-height="400" stripe style="width:100%" border class="g-table" size="mini">
          <el-table-column prop="productSku" label="产品编码" align="center" min-width="110" />
          <el-table-column prop="productImg" label="产品图片" align="center" width="70">
            <template slot-scope="slot">
              <g-thumb class="d-table-cell" :url="slot.row.productImg" />
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" align="center" min-width="150">
            <template slot-scope="scope">
              <g-text-ellipsis :lines="2">{{ scope.row.productName }}</g-text-ellipsis>
            </template>
          </el-table-column>
          <el-table-column prop="purQty" label="采购数量" align="center" min-width="90" />
          <el-table-column prop="productPrice" label="采购单价" align="center" min-width="90" />
          <el-table-column prop="productTotalAmount" label="产品金额" align="center" min-width="90" />
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="到货记录" name="3">
        <el-table :data="detail.arrivalDetails" max-height="400" stripe style="width:100%" border class="g-table" size="mini">
          <el-table-column prop="warehousingCode" label="入库单号" align="center" min-width="150" />
          <el-table-column prop="logisticsCode" label="物流运单号" align="center" min-width="150" />
          <el-table-column prop="lpName" label="物流商名称" align="center" min-width="200" show-overflow-tooltip />
          <el-table-column prop="receiptPeople" label="收货人" align="center" min-width="100" />
          <el-table-column prop="receivingGoodsNumber" label="收货数量" align="center" min-width="100" />
          <el-table-column prop="rejectsQty" label="不良品数量" align="center" min-width="100" />
          <el-table-column prop="upFrameQty" label="上架数量" align="center" min-width="100" />
          <el-table-column prop="receivingGoodsTime" label="收货时间" align="center" min-width="120" />
          <el-table-column label="操作" align="center" min-width="70">
            <template slot-scope="slot">
              <el-button type="text" @click="turnToArrive(slot.row.id)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="退货记录" name="4">
        <el-table :data="detail.recordData" max-height="400" stripe style="width:100%" border class="g-table" size="mini">
          <el-table-column prop="returnGoodsCode" label="退货单号" align="center" min-width="150" />
          <el-table-column prop="logisticsCode" label="物流运单号" align="center" min-width="150" />
          <el-table-column prop="lpName" label="物流商名称" align="center" min-width="200" show-overflow-tooltip />
          <el-table-column prop="warehousingCode" label="入库单号" align="center" min-width="120" />
          <el-table-column prop="returnGoodsPeople" label="退货人" align="center" min-width="100" />
          <el-table-column prop="rejectsQty" label="不良品数量" align="center" min-width="100" />
          <el-table-column prop="returnGoodsQty" label="退货数量" align="center" min-width="100" />
          <el-table-column prop="creturnGoodsTime" label="退货时间" align="center" min-width="120" />
          <el-table-column label="操作" align="center" min-width="120">
            <template slot-scope="slot">
              <el-button type="text" @click="turnToReturn(slot.row.id)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

  </basic-container>
</template>

<script>
import { detail } from '@/api/ordermanagement/orderManagement'
import arrivalDetail from '../arrivalModal/arrivalDetail'
import returnGoodsDetail from '../returnGoodsModal/returnGoodsDetail.vue'
import groupShow from './groupShow'

export default {
  name: 'PurchaseDetail',
  components: { groupShow },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      activeName: '1',
      isArriavl: false,
      isReturn: false,
      recordData: [],
      prosId: '',
      detail: {},
      activeNames: ['1', '2', '3', '4'],
      incomingData: {}
    }
  },
  mounted() {
    this.showDetail(this.id)
  },
  methods: {
    showDetail(id) {
      this.loading = true
      detail(id).then(res => {
        this.detail = res.data
        this.loading = false
      })
    },
    turnToArrive(id) {
      this.$newTab({
        path: '/purchaseReceive/arrivalDetail',
        title: '到货详情',
        component: arrivalDetail,
        data: {
          id
        },
        callback: () => {},
        clearCache: true
      })
    },
    turnToReturn(id) {
      this.$newTab({
        path: '/purchaseReturn/returnGoodsDetail',
        title: '退货详情',
        component: returnGoodsDetail,
        data: {
          id
        },
        callback: () => {},
        clearCache: true
      })
    },
    cancel() {
      this.$emit('close', true)
    },
    changeArrival() { // 显示到货Modal
      this.isArriavl = true
    },
    arralCancel() {
      this.isArriavl = false
    },
    changeReturn() { // 显示退货Modal
      this.isReturn = true
    },
    returnCancel() {
      this.isReturn = false
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
::v-deep .el-collapse-item__content{
  font-size: 12px;
}
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
*{
  box-sizing: border-box;
}
</style>
