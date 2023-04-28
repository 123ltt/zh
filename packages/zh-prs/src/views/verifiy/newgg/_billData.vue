<template>
  <basic-container>
    <el-tabs class="autoHeight">
      <el-tab-pane type="border-card">
        <span slot="label" style="font-size:15px ">汇总</span>
        <g-table ref="tableRef"
                 key="newEggTotal"
                 :header-cell-style="{'text-align':'center'}"
                 :cell-style="{'text-align':'center'}"
                 :fetch="fetch"
                 @selection-change="handleSelectionChange"
        >
          <template #header>
            <el-form size="mini" :model="formInfo" label-width="150px" class="form-col no-message">
              <el-row type="flex">
                <el-col>
                  <el-form-item label="店铺编码">
                    <el-select v-model="formInfo.storeCode" clearable>
                      <el-option v-for="item in storeCodeList" :key="item.value" :label="item.value" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item>
                    <div slot="label">
                      <el-select v-model="formInfo.timeConditionType" style="width:100px !important">
                        <el-option v-for="item in dateOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"
                        />
                      </el-select>
                    </div>
                    <el-date-picker v-model="dateTime"
                                    type="daterange"
                                    placeholder="选择日期"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="Settlement ID">
                    <el-input v-model="formInfo.settlementIds" clearable placeholder="多个用英文逗号隔开" class="small" />
                    <el-button size="mini" type="primary" @click="search">查询</el-button>
                    <el-button size="mini" type="primary" @click="reset">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <handel-download :all-data="allData" :part-data="exportData" :headers="headersExport" @getAllData="getAllData" />
          </template>
          <el-table-column type="selection" width="55" />
          <el-table-column v-for="item in headers"
                           :key="item.label"
                           :label="item.label"
                           :prop="item.prop"
                           :width="item.width"
          >
            <el-table-column v-for="child in item.children"
                             :key="child.label"
                             :label="child.label"
                             :prop="child.prop"
                             :width="child.width"
            />
          </el-table-column>
        </g-table>
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label" style="font-size:15px ">明细</span>
        <newegg-detail />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>
<script>
import neweggDetail from './components/neweggDetail'
import handelDownload from '@/views/components/handelDownload'
import { getStoreCodeList } from '@/api/common'
import { getNewggTotalList } from '@/api/newEgg/newEgg'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyNewggBillData',
  components: { neweggDetail, handelDownload },
  data() {
    return {
      formInfo: {
        storeCode: '',
        settlementIds: '',
        timeConditionType: 1
      },
      storeCodeList: [],
      dateType: 'billDate',
      dateOptions: [
        { label: '账单日期', value: 1 },
        { label: 'Settlement', value: 2 }
      ],
      allData: [],
      exportData: [],
      dateTime: [],
      headers: [
        { label: '店铺编码', prop: 'storeCode' },
        { label: '账单日期', prop: 'fileUploadDate' },
        { label: 'Settlement', width: 110, prop: 'settlement' },
        { label: 'Settlement ID', width: 120, prop: 'settlementId' },
        {
          label: 'Order Total($)',
          children: [
            { label: 'Item Price', prop: 'orderTotalItemPrice' },
            { label: 'Tax & Duty', width: 100, prop: 'orderTotalTaxDuty' },
            { label: 'Shipping', prop: 'orderTotalShipping' }
          ]
        },
        {
          label: 'Refund Total($)',
          children: [
            { label: 'Refund', prop: 'refundTotalRefund' },
            { label: 'Chargeback', width: 100, prop: 'refundTotalChargeback' },
            { label: 'Courtesy Refund', prop: 'refundTotalCourtesyRefund' }
          ]
        },
        {
          label: 'Newegg Fees Total($)',
          children: [
            { label: 'Monthly Fee', prop: 'monthlyFee' },
            { label: 'Commission Fee', prop: 'commissionFee' },
            { label: 'Refund Commission Fee', width: 100, prop: 'refundCommissionFee' },
            { label: 'Fulfillment Fee', width: 100, prop: 'fulfillmentFee' },
            { label: 'Multi-Channel Fee', prop: 'multiChannelFee' },
            { label: 'Inventory Fee', prop: 'inventoryFee' },
            { label: 'Adjustment Fee', prop: 'adjustmentFee' },
            { label: 'Merchandising Fee', prop: 'merchandisingFee' },
            { label: 'Newegg Shipping Label Fee', width: 110, prop: 'neweggShippingLabelFee' },
            { label: 'Newegg Premier Fee', width: 100, prop: 'neweggPremierFee' }
          ]
        },
        { label: 'Total Amount($)', prop: 'totalAmount' }
      ],
      headersExport: [
        {},
        { label: '店铺编码', prop: 'storeCode' },
        { label: '账单日期', prop: 'fileUploadDate' },
        { label: 'Settlement', width: 110, prop: 'settlement' },
        { label: 'Settlement ID', width: 120, prop: 'settlementId' },
        { label: 'Item Price', prop: 'orderTotalItemPrice' },
        { label: 'Tax & Duty', width: 100, prop: 'orderTotalTaxDuty' },
        { label: 'Shipping', prop: 'orderTotalShipping' },
        { label: 'Refund', prop: 'refundTotalRefund' },
        { label: 'Chargeback', width: 100, prop: 'refundTotalChargeback' },
        { label: 'Courtesy Refund', prop: 'refundTotalCourtesyRefund' },
        { label: 'Monthly Fee', prop: 'monthlyFee' },
        { label: 'Commission Fee', prop: 'commissionFee' },
        { label: 'Refund Commission Fee', width: 100, prop: 'refundCommissionFee' },
        { label: 'Fulfillment Fee', width: 100, prop: 'fulfillmentFee' },
        { label: 'Multi-Channel Fee', prop: 'multiChannelFee' },
        { label: 'Inventory Fee', prop: 'inventoryFee' },
        { label: 'Adjustment Fee', prop: 'adjustmentFee' },
        { label: 'Merchandising Fee', prop: 'merchandisingFee' },
        { label: 'Newegg Shipping Label Fee', width: 110, prop: 'neweggShippingLabelFee' },
        { label: 'Newegg Premier Fee', width: 100, prop: 'neweggPremierFee' },
        { label: 'Total Amount($)', prop: 'totalAmount' }
      ]
    }
  },
  mounted() {
    this.getStoreList()
    this.init()
  },
  methods: {
    // 表格数据初始化
    init() {
      this.formInfo.startDate = this.dateTime?.[0]
      this.formInfo.endDate = this.dateTime?.[1]?.replace(/00:00:00/, '23:59:59')
      this.$refs.tableRef.load(1, this.formInfo)
    },
    search() {
      this.init()
    },
    reset() {
      this.dateTime = []
      this.formInfo = {}
      this.init()
    },
    // 导出所有数据
    getAllData() {
      getNewggTotalList(1, 50000, this.formInfo).then(res => {
        // filterData(res.data.records)
        this.allData = res.data.records
      })
    },
    fetch({ current, size }, params) {
      return getNewggTotalList(current, size, params).then(res => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    // 获取选中数据
    handleSelectionChange(val) {
      this.exportData = val
    },
    // 获取店铺列表
    getStoreList() {
      getStoreCodeList({ platformCode: 'NE' }).then(res => {
        this.storeCodeList = res.data
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .small{
    width: 245px!important;
  }
  .el-select{
    width:245px!important;
  }
  .el-range-editor--mini.el-input__inner{
    width: 245px !important;
  }
  ::v-deep.autoHeight{
  display: flex;
  flex-direction: column;
  height:100%;
  .el-tabs__content{
    flex: 1;
    .el-tab-pane{
      height: 100%;
    }
  }
}
</style>
