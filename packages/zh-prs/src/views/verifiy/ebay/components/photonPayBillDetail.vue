<template>
  <basic-container>
    <g-table
      ref="tableRef"
      stripe
      border
      :headers="headers"
      :fetch="fetch"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      @selection-change="handleSelectionChange"
    >
      <template #header>
        <el-form
          ref="rulesForm"
          size="mini"
          :model="formInfo"
          label-width="100px"
          class="form-col no-message"
        >
          <el-row type="flex">
            <el-col>
              <el-form-item label="店铺编码">
                <el-select
                  v-model="formInfo.storeCode"
                  placeholder="请选择"
                  clearable
                >
                  <el-option v-for="item in storeList" :key="item.value" :label="item.value" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="订单编号">
                <el-input
                  v-model="orderNumbers"
                  class="small"
                  placeholder="多个用英文逗号隔开"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="账单日期">
                <el-date-picker
                  v-model="dateTime"
                  clearable
                  type="daterange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />

              </el-form-item>

            </el-col>
            <el-col>
              <el-form-item label="文件名称">
                <el-input
                  v-model="formInfo.fileName"
                  class="small"
                  placeholder="多个用英文逗号隔开"
                  clearable
                />
                <el-button
                  size="mini"
                  type="primary"
                  class="ml-2"
                  @click="search"
                >查询</el-button>
                <el-button size="mini"
                           type="primary"
                           @click="reset"
                >重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <handel-download
          :all-data="allData"
          :part-data="exportData"
          :headers="headers"
          @getAllData="getAllData"
        />
      </template>
      <el-table-column slot="product" label="Product">
        <template v-slot="{ row }">
          <g-link :href="row.product">product</g-link>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getEbayPhotonPayBill } from '@/api/ebay/ebay'
import { getStoreCodeList } from '@/api/common'
import handelDownload from '@/views/components/handelDownload'
import { filterData } from '../../../../utils/filterData'
export default {
  name: 'PhotonPayBill',
  components: { handelDownload },
  data() {
    return {
      headers: [
        { width: '55', type: 'selection' },
        { label: '店铺编号', prop: 'storeCode' },
        { label: 'Start date', prop: 'startDate', width: '150' },
        { label: 'End date', prop: 'endDate', width: '150' },
        {
          label: 'Transaction date',
          prop: 'transactionDate',
          width: '150'
        },
        { label: 'Type', prop: 'photonPayType' },

        { label: 'Order number', prop: 'orderNumber', width: '150' },
        { label: 'Net amount', prop: 'netAmount' },

        { label: 'Payout currency', prop: 'payoutCurrency' },

        { label: 'Payout ID', prop: 'payoutId' },
        { label: 'Status', prop: 'status' },
        { label: 'Item ID', prop: 'itemId' },

        { label: 'Quantity', prop: 'quantity' },
        { label: 'Item subtotal', prop: 'itemSubtotal' },

        {
          label: 'Shipping and handling',
          prop: 'shippingAndHandling',
          width: '150'
        },

        {
          label: 'Seller collected tax',
          prop: 'sellerCollectedTax',
          width: '150'
        },
        { label: 'eBay collected tax', prop: 'ebayCollectedTax' },
        { label: 'Seller specified VAT rate', prop: 'sellerSpecifiedVatRate' },
        {
          label: 'Final Value Fee - fixed',
          prop: 'finalValueFeeFixed',
          width: '150'
        },
        {
          label: 'Final Value Fee - variable',
          prop: 'finalValueFeeVariable',
          width: '150'
        },
        {
          label: 'Very high "item not as described" fee',
          prop: 'otherReturnFee',
          width: '150'

        },
        {
          label: 'Below standard performance fee',
          prop: 'belowStandardPerformanceFee',
          width: '150'
        },
        {
          label: 'International fee',
          prop: 'internationalFee'
        },

        {
          label: 'Gross transaction amount',
          width: '150',
          prop: 'grossTransactionAmount'
        },

        { label: 'Transaction currency', prop: 'transactionCurrency' },
        { label: 'Description', prop: 'description', width: '200' },
        { label: '文件名', prop: 'fileName', width: '150' }
      ],
      exportData: [], // 导出数据
      allData: [],
      downloadLoading: '',
      dateTime: [],
      orderNumbers: '',
      storeList: [],
      formInfo: {
        storeCode: '',
        startDate: '',
        endDate: '',
        orderNumber: [],
        fileName: ''
      },
      fn: getEbayPhotonPayBill
    }
  },
  mounted() {
    this.getData()
    this.init()
  },
  methods: {
    // 选择获取数据
    getAllData() {
      this.fn(1, 50000, this.formInfo).then((res) => {
        this.allData = res.data.records
      })
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    // 重置
    reset() {
      this.formInfo = {}
      this.orderNumbers = ''
      this.dateTime = []

      this.init()
    },
    // 搜索
    search() {
      this.formInfo.orderNumber = this.orderNumbers
      if (this.dateTime) {
        this.formInfo.startDate = this.dateTime[0]
        this.formInfo.endDate = this.dateTime[1]?.replace(
          /00:00:00/,
          '23:59:59'
        )
      } else {
        this.formInfo.startDate = ''
        this.formInfo.endDate = ''
      }
      this.init()
    },
    fetch({ current, size }, params) {
      return this.fn(current, size, params).then((res) => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    getData() {
      getStoreCodeList({ platformCode: 'EB' }).then((res) => {
        if (res.success && res.data) {
          this.storeList = res.data
        }
      })
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    }
  }
}
</script>

<style scoped lang="scss">
.small {
    width: 245px !important;
}
.g-select {
    width: 245px !important;
}
.el-select {
    width: 245px !important;
}
.el-date-editor--daterange.el-input__inner {
    width: 245px;
}
</style>
