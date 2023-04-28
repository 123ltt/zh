<template>
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
                v-model="stores"
                placeholder="请选择"
                clearable
                style="width: 240px !important"
              >
                <el-option v-for="item in storeList" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="结算ID">
              <el-input
                v-model="settlementIds"
                class="small"
                clearable
                placeholder="多个用英文逗号隔开"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item>
              <div slot="label">
                <el-select
                  v-model="formInfo.timeConditionType"
                  placeholder="请选择"
                  clearable
                  style="width: 100px !important"
                >
                  <el-option
                    v-for="item in dateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
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
                v-model="fileNames"
                class="small"
                clearable
                placeholder="多个用英文逗号隔开"
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
</template>

<script>
import { getAmazonBillOriginList } from '@/api/amazon/amazon'
import { getStoreCodeList } from '@/api/common'
import handelDownload from '@/views/components/handelDownload'
import { filterData } from '../../../../utils/filterData'
export default {
  name: 'AmazonDetail',
  components: { handelDownload },
  data() {
    return {
      exportData: [], // 导出数据
      allData: [],
      downloadLoading: '',
      dateTime: [],
      storeList: [],
      settlementIds: '',
      fileNames: '',
      stores: '',
      formInfo: {
        stores: [],
        startDate: '',
        endDate: '',
        fileNames: [],
        settlementIds: []
      },
      fn: getAmazonBillOriginList, // 接口名
      dateOptions: [
        { label: '账单开始时间', value: 1 },
        { label: '账单结束时间', value: 2 }

      ],
      headers: [
        { type: 'selection' },
        { label: '店铺编码', prop: 'storeCode', width: '150' },
        { label: '结算ID', prop: 'settlementId', width: '150' },
        {
          label: '开始时间',
          prop: 'settlementStartDate',
          width: '150'
        },
        {
          label: '结束时间',
          prop: 'settlementEndDate',
          width: '150'
        },
        { label: 'deposit-date', prop: 'depositDate', width: '150' },
        { label: 'total-amount', prop: 'totalAmount', width: '150' },
        { label: 'currency', prop: 'currency' },
        {
          label: 'transaction-type',
          prop: 'transactionType',
          width: '150'
        },
        { label: 'order-id', prop: 'amzOrderId', width: '150' },
        {
          label: 'merchant-order-id',
          prop: 'merchantOrderId',
          width: '150'
        },
        {
          label: 'marketplace-name',
          prop: 'marketplaceName',
          width: '150'
        },
        {
          label: 'shipment-fee-type',
          prop: 'shipmentFeeType',
          width: '150'
        },
        {
          label: 'shipment-fee-amount',
          prop: 'shipmentFeeAmount',
          width: '150'
        },
        { label: 'order-fee-type', prop: 'orderFeeType', width: '150' },
        {
          label: 'order-fee-amount',
          prop: 'orderFeeAmount',
          width: '150'
        },
        {
          label: 'fulfillment-id',
          prop: 'fulfillmentId',
          width: '150'
        },
        { label: 'posted-date', prop: 'postedDate', width: '150' },
        {
          label: 'merchant-order-item-id',
          prop: 'merchantOrderId',
          width: '150'
        },
        {
          label: 'merchant-adjustment-item-id',
          prop: 'merchantAdjustmentItemId',
          width: '150'
        },
        { label: 'sku', prop: 'sku' },
        {
          label: 'quantity-purchased',
          prop: 'quantityPurchased',
          width: '150'
        },
        { label: 'price-type', prop: 'priceType', width: '150' },
        { label: 'price-amount', prop: 'priceAmount', width: '150' },
        { label: 'item-related-fee-type', prop: '', width: '150' },
        {
          label: 'item-related-fee-amount',
          prop: 'itemRelatedFeeAmount',
          width: '150'
        },
        {
          label: 'misc-fee-amount',
          prop: 'miscFeeAmount',
          width: '150'
        },
        {
          label: 'other-fee-amount',
          prop: 'otherFeeAmount',
          width: '150'
        },
        {
          label: 'other-fee-reason-description',
          prop: 'otherFeeReasonDescription',
          width: '150'
        },
        { label: 'promotion-id', prop: 'promotionId' },
        {
          label: 'promotion-type',
          prop: 'promotionType',
          width: '150'
        },
        { label: 'promotion-amount', prop: 'promotionAmount' },
        {
          label: 'direct-payment-type',
          prop: 'directPaymentType',
          width: '150'
        },
        {
          label: 'direct-payment-amount',
          prop: 'directPaymentAmount',
          width: '150'
        },
        { label: 'other-amount', prop: 'otherAmount' },
        { label: '上传时间', prop: 'fileUploadDate', width: '150' },
        { label: '文件名称', prop: 'fileName', width: '150' }
      ]
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
      this.fileNames = ''
      this.settlementIds = ''
      this.dateTime = []
      this.init()
    },
    // 搜索
    search() {
      this.formInfo.fileNames = this.fileNames
      this.formInfo.settlementIds = this.settlementIds
      this.formInfo.stores = this.stores
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
      getStoreCodeList({ platformCode: 'AM' }).then((res) => {
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
    width: 245px !important;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: '';
}
.clearfix:after {
    clear: both;
}
</style>
