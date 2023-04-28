<template>
  <basic-container>
    <el-tabs class="autoHeight">
      <el-tab-pane type="border-card">
        <span slot="label" style="font-size: 15px">汇总</span>
        <g-table
          ref="tableRef"
          stripe
          border
          :headers="headers"
          :fetch="fetch"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          row-key="id"
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
                        v-model="
                          formInfo.timeConditionType
                        "
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
                      value-format="yyyy-MM-dd HH:mm:ss"
                      clearable
                      type="daterange"
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
                      placeholder="多个用英文逗号隔开"
                      clearable
                    />
                    <el-button
                      size="mini"
                      type="primary"
                      class="ml-2"
                      @click="search"
                    >查询</el-button>
                    <el-button
                      size="mini"
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
          <template slot="commission">
            <el-table-column
              v-slot="{ row }"
              label="订单交易费(Commission)"
              width="90"
            >
              <g-text-ellipsis>
                {{
                  getDataByName(
                    row.orderFeeTypeAmountTotal,
                    'commission'
                  )
                }}
              </g-text-ellipsis>
            </el-table-column>
          </template>
          <template slot="shippingHB">
            <el-table-column
              v-slot="{ row }"
              label="运费交易费(ShippingHB)"
              width="90"
            >
              <g-text-ellipsis>
                {{
                  getDataByName(
                    row.orderFeeTypeAmountTotal,
                    'shippingHB'
                  )
                }}
              </g-text-ellipsis>
            </el-table-column>
          </template>

          <template slot="ShippingChargeback">
            <el-table-column
              v-slot="{ row }"
              label="订单运费优惠(ShippingChargeback)"
              width="150"
            >
              <g-text-ellipsis>
                {{
                  getDataByName(
                    row.orderFeeTypeAmountTotal,
                    'ShippingChargeback'
                  )
                }}
              </g-text-ellipsis>
            </el-table-column>
          </template>
          <template slot="fbaPerUnitFulfillmentFee">
            <el-table-column
              v-slot="{ row }"
              label="FBA运费(FBAPerUnit FulfillmentFee)"
              width="150"
            >
              <g-text-ellipsis>
                {{
                  getDataByName(
                    row.orderFeeTypeAmountTotal,
                    'fbaPerUnitFulfillmentFee'
                  )
                }}
              </g-text-ellipsis>
            </el-table-column>
          </template>

          <template slot="reCommission">
            <el-table-column
              v-slot="{ row }"
              label="退还交易费"
              width="100"
            >
              <g-text-ellipsis>
                {{
                  getDataByName(
                    row.refundFeeTypeAmountTotal,
                    'commission'
                  )
                }}
              </g-text-ellipsis>
            </el-table-column>
          </template>
          <template slot="refundCommission">
            <el-table-column
              v-slot="{ row }"
              label="退款交易费"
              width="100"
            >
              <g-text-ellipsis>
                {{
                  getDataByName(
                    row.refundFeeTypeAmountTotal,
                    'refundCommission'
                  )
                }}
              </g-text-ellipsis>
            </el-table-column>
          </template>

          <template slot="refundShippingHB">
            <el-table-column
              v-slot="{ row }"
              label="退还运费交易费"
              width="120"
            >
              <g-text-ellipsis>
                {{
                  getDataByName(
                    row.refundFeeTypeAmountTotal,
                    'shippingHB'
                  )
                }}
              </g-text-ellipsis>
            </el-table-column>
          </template>
          <template slot="refundShippingChargeback">
            <el-table-column
              v-slot="{ row }"
              label="退还运费优惠"
              width="110"
            >
              <g-text-ellipsis>
                {{
                  getDataByName(
                    row.refundFeeTypeAmountTotal,
                    'shippingChargeback'
                  )
                }}
              </g-text-ellipsis>
            </el-table-column>
          </template>
        </g-table>
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label" style="font-size: 15px">明细</span>
        <amazon-detail />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import amazonDetail from './components/amazonDetail.vue'
import { getAmazonList } from '@/api/amazon/amazon'
import { getStoreCodeList } from '@/api/common'
import handelDownload from '@/views/components/handelDownload'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyAmazonBillData',
  components: { amazonDetail, handelDownload },
  data() {
    return {
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
        {
          label: 'deposit-date',
          prop: 'depositDate',
          width: '150'
        },
        { label: '账单币种', prop: 'currency' },
        { label: '账单放款', prop: 'totalAmount' },
        {
          label: '订单收入(price amount)',
          prop: 'orderPriceAmount',
          width: '150'
        },

        {
          label: '促销折扣 (promotion amount)',
          prop: 'orderPromotionAmount',
          width: '150'
        },
        { slot: true, slotName: 'commission' },
        { slot: true, slotName: 'shippingHB' },
        { slot: true, slotName: 'ShippingChargeback' },
        {
          slot: true,
          slotName: 'fbaPerUnitFulfillmentFee'
        },
        // { slot: true, slotName: 'costOfAdvertising', width: '150' },
        {
          label: '广告费',
          prop: 'advertisingFeeAmount',
          width: '90'
        },

        {
          label: '仓租 ',
          prop: 'storageFee',
          width: '90'
        },
        {
          label: '仓租年费(StorageRenewal Billing)',
          prop: 'storageRenewalBilling',
          width: '150'
        },
        {
          label: '店铺月租(Subscription Fee)',
          prop: 'subscriptionFee',
          width: '150'
        },
        {
          label: '放款未成功',
          prop: 'fundsUnsuccessful',
          width: '90'
        },

        {
          label: '本期储备金',
          prop: 'currentReserveAmount',
          width: '90'
        },

        {
          label: '期初储备金',
          prop: 'previousReserveAmountBalance',
          width: '90'
        },
        {
          label: '退款金额',
          prop: 'refundPriceAmount',
          width: '70'
        },
        {
          label: '退还折扣',
          prop: 'refundPromotionAmount',
          width: '70'
        },
        // { label: '退还交易费(Commission)', prop: '', width: '150' },
        // {
        //   label: '退款交易费(RefundCommission)',
        //   prop: '',
        //   width: '150'
        // },
        // {
        //   label: '退还运费优惠(ShippingChargeback)',
        //   prop: '',
        //   width: '150'
        // },
        // { label: '退还运费交易费(ShippingHB)', prop: '', width: '150' },
        { slot: true, slotName: 'reCommission' }, // 退还交易费(Commission)
        { slot: true, slotName: 'refundCommission' }, // 退款交易费(RefundCommission)
        { slot: true, slotName: 'refundShippingHB' },
        {
          slot: true,
          slotName: 'refundShippingChargeback'
        },
        { label: '其他', prop: 'otherAmountTotal' },
        { label: '文件名称', prop: 'fileName', width: '150' }
      ],
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
      fn: getAmazonList,
      dateOptions: [
        { label: '账单开始时间', value: 1 },
        { label: '账单结束时间', value: 2 }
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
    getDataByName(val, name) {
      const orderFeeTypeAmountTotal = JSON.parse(val)
      return orderFeeTypeAmountTotal.find((item) => item.name === name)
        ?.amount
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
::v-deep.autoHeight {
    display: flex;
    flex-direction: column;
    height: 100%;
    .el-tabs__content {
        flex: 1;
        .el-tab-pane {
            height: 100%;
        }
    }
}
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
