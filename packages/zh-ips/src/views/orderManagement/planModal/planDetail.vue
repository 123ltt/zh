<template>
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-form label-width="100px" size="mini" class="no-message">
          <el-row>
            <el-col :span="8">
              <el-form-item label="计划编码">
                <el-input :value="row.planCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求编码">
                <el-input :value="row.rqmtCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购方名称">
                <el-input :value="row.demander" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称">
                <el-input :value="row.supplierName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划数量">
                <el-input :value="row.planQty" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求人">
                <el-input :value="row.rqmtUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划金额">
                <el-input :value="row.planAmount" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="目的仓库">
                <el-input :value="row.destWarehouse" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人">
                <el-input :value="row.createUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间">
                <el-input :value="row.createTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最后修改人">
                <el-input :value="row.updateUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最后修改时间">
                <el-input :value="row.updateTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="采购产品" name="2">
        <el-table :data="productData"
                  class="g-table"
                  stripe
                  style="width:100%"
                  border
                  :summary-method="getSummaries"
                  show-summary
        >
          <el-table-column prop="productSku" label="产品编码" align="center" min-width="110" />
          <el-table-column prop="productImg" label="产品图片" align="center" width="70">
            <template slot-scope="scope">
              <g-thumb class="d-table-cell" :url="scope.row.productImg" />
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" align="center" min-width="120">
            <template slot-scope="scope">
              <g-text-ellipsis :lines="2">{{ scope.row.productName }}</g-text-ellipsis>
            </template>
          </el-table-column>
          <el-table-column prop="purchasePrice" label="采购单价" align="center" min-width="80" />
          <el-table-column prop="planQty" label="计划数量" align="center" min-width="80" />
          <el-table-column prop="purchasedQty" label="已采数量" align="center" min-width="80" />
          <el-table-column prop="toPurQty" label="待采数量" align="center" min-width="80" />
          <el-table-column prop="productTotalAmount" label="产品金额" align="center" min-width="100">
            <template slot-scope="slot">
              <el-input :value="(+slot.row.purchasedQty)*((+slot.row.purchasePrice)*1000)/1000" size="mini" disabled />
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="采购订单" name="3">
        <el-table :data="recordData" max-height="400" stripe style="width:100%" border class="g-table">
          <el-table-column prop="purCode" label="采购编码" align="center" min-width="110" />
          <el-table-column prop="isStraight" label="直发仓库" align="center" min-width="80">
            <template slot-scope="slot">
              <span>{{ slot.row.isStraight === 1 ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="transitWarehouseName" label="中转仓库" align="center" min-width="80" />
          <el-table-column prop="purQty" label="采购数量" align="center" min-width="80" />
          <el-table-column prop="purAmount" label="采购金额" align="center" min-width="80" />
          <el-table-column prop="paymentMethod" label="付款方式" align="center" min-width="90">
            <template slot-scope="slot">
              <span v-for="item in methodList" :key="item.dictKey">{{ Number(slot.row.paymentMethod)===Number(item.dictKey)?item.dictValue:null }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="paymentCondition" label="付款条件" align="center" min-width="120">
            <template slot-scope="slot">
              <span v-for="item in methodType" :key="item.dictKey">{{ Number(slot.row.paymentCondition)===Number(item.dictKey)?item.dictValue:null }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center" min-width="100">
            <template slot-scope="slot">
              <span>{{ copyStatusList[slot.row.status] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="purTime" label="采购时间" align="center" min-width="140" />
          <el-table-column prop="expectArrivalTime" label="期望到货时间" align="center" min-width="140" />
        </el-table>
        <div class="block">
          <el-pagination :current-page="page.current" :page-sizes="[10,40,50,80]" :page-size="page.size" :total="page.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-collapse-item>
    </el-collapse>
  </basic-container>
</template>

<script>
import { getList, addDetail } from '@/api/ordermanagement/orderManagement'
import { dictionary } from '@/api/commonApi'
export default {
  props: {
    id: String
  },
  data() {
    return {
      loading: 'false',
      recordData: [],
      productData: [],
      methodList: [],
      methodType: [],
      planId: '',
      activeNames: ['1', '2', '3'],
      page: {
        current: 1,
        total: 0,
        size: 10
      },
      copyStatusList: {},
      row: {}
    }
  },
  mounted() {
    this.initialization(this.page.current, this.page.size)
    addDetail(this.id).then(res => {
      this.productData = res.data.planDetailVOList
      this.row = res.data
    })
    this.getDictionary()
  },
  methods: {
    getDictionary() {
      dictionary('ips_payment_method').then(res => {
        this.methodList = res.data
      })
      dictionary('ips_payment_condition').then(res => {
        this.methodType = res.data
      })
      dictionary('ips_order_status').then(res => {
        res.data.forEach(item => {
          this.copyStatusList[item.dictKey] = item.dictValue
        })
      })
    },
    initialization(current = 1, size = 10) { // 分页接口调取
      const val3 = {
        purPlanId: this.id
      }
      this.loading = true
      getList(current, size, val3).then(res => {
        if (res.code === 200) {
          const data = res.data
          this.recordData = data.records
          this.page.total = data.total
          this.loading = false
        } else {
          this.loading = false
          this.$message('加载失败')
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      let values = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        if (column.property === 'productTotalAmount') {
          values = data.map((item, index) => {
            this.$set(this.productData[index], 'productTotalAmount', Number((item.purchasePrice * 1000) * item.purchasedQty / 1000))
            return Number((item.purchasePrice * 1000) * item.purchasedQty / 1000)
          })
        } else {
          values = data.map(item => {
            return Number(item[column.property])
          })
        }
        // const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return (prev * 1000 + curr * 1000) / 1000
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    handleSizeChange(val) {
      this.page.size = val
      this.page.current = 1
      this.initialization(this.page.current, this.page.size)
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.initialization(this.page.current, this.page.size)
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
.block{
  text-align: right;
  margin: 10px 10px 0 0;
}
</style>
