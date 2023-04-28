<template>
  <basic-container>
    <el-tabs class="autoHeight">
      <el-tab-pane type="border-card">
        <span slot="label" style="font-size:15px ">汇总</span>
        <g-table ref="tableRef"
                 :headers="headers"
                 :fetch="fetch"
                 :header-cell-style="{'text-align':'center'}"
                 :cell-style="{'text-align':'center'}"
                 @selection-change="handleSelectionChange"
        >
          <template #header>
            <cols-form :form-info="formInfo" :form-item="formItem" :form-handler="formHandler" />
            <handel-download :all-data="allData" :part-data="exportData" :headers="headers" @getAllData="getAllData" />
          </template>
        </g-table>
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label" style="font-size:15px">明细</span>
        <jd-detail />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>
<script>
import colsForm from '@/views/components/colsForm'
import { getJdPage } from '@/api/jd/jd'
import { getStoreCodeList } from '@/api/common'
import handelDownload from '@/views/components/handelDownload'
import jdDetail from './components/jdDetail'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyJdBillData',
  components: {
    colsForm,
    handelDownload,
    jdDetail
  },
  data() {
    return {
      formItem: [
        {
          type: 'gselect',
          optionValue: 'value',
          label: '店铺编码',
          prop: 'storeCode',
          options: []
        },
        { type: 'input', label: '结算单号', prop: 'settlementNumberList', placeholder: '多个用英文逗号隔开' },
        { type: 'datePicker', label: '账单日期', prop: 'date' }
      ],
      formHandler: [
        {
          label: '查询',
          handler: () => { this.search() }
        },
        {
          label: '重置',
          handler: () => { this.reset() }
        }
      ],
      formInfo: {
      },
      allData: [],
      exportData: [],
      headers: [
        { width: 55, type: 'selection' },
        { label: '账单日期', prop: 'billDate' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '结算单号', prop: 'settlementNumber' },
        { width: 60, label: '币种', prop: 'currency' },
        { label: '货款合计', prop: 'paymentTotal' },
        { label: '佣金合计', prop: 'commissionTotal' },
        { label: '退款合计', prop: 'refundTotal' },
        { width: 100, label: '返还佣金合计', prop: 'refundCommissionTotal' },
        { width: 110, label: '退货配送费合计', prop: 'returnDeliveryTotal' },
        { width: 100, label: '配送费合计', prop: 'deliveryTotal' },
        { width: 100, label: '费用金额合计', prop: 'feeTotal' },
        { width: 100, label: '调账金额合计', prop: 'adjustingTotal' },
        { label: '账单放款', prop: 'billTotal' }
      ]
    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.billBegin = val?.[0]
      this.formInfo.billEnd = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },
  mounted() {
    this.init()
    this.getStoreList()
  },
  methods: {
    // 获取选中数据
    handleSelectionChange(val) {
      this.exportData = val
    },
    // 获取店铺列表
    getStoreList() {
      getStoreCodeList({ platformCode: 'JD' }).then(res => {
        this.formItem[0].options = res.data
      })
    },
    // 导出查询所有数据
    getAllData() {
      getJdPage(1, 50000, this.formInfo).then(res => {
        // filterData(res.data.records)
        this.allData = res.data.records
      })
    },
    // 表格数据初始化
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {}
      this.init()
    },
    fetch({ current, size }, params) {
      return getJdPage(current, size, params).then(res => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
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
