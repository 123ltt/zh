<template>
  <g-table ref="tableRef"
           :fetch="fetch"
           :header-cell-style="{'text-align':'center'}"
           :cell-style="{'text-align':'center'}"
           :headers="headers"
           @selection-change="handleSelectionChange"
  >
    <template #header>
      <cols-form ref="formRef" :form-item="formItem" :form-info="formInfo" :form-handler="formHandler" />
      <handel-download :all-data="allData" :part-data="exportData" :headers="headers" @getAllData="getAllData" />
    </template>
    <template slot="remark">
      <el-table-column v-slot="{row}" label="备注">
        <g-text-ellipsis>
          {{ row.remark }}
        </g-text-ellipsis>
      </el-table-column>
    </template>
  </g-table>
</template>
<script>
import { getShopeeLoanAdjustment } from '@/api/shopee/shopee'
import { getStoreCodeList, getSiteNameList } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import handelDownload from '@/views/components/handelDownload'
export default {
  name: 'SipTotal',
  components: { colsForm, handelDownload },

  data() {
    return {
      exportData: [],
      allData: [],
      formInfo: {},
      formItem: [{
        type: 'gselect',
        optionValue: 'value',
        label: '店铺编码',
        prop: 'storeCode',
        options: []
      },
      {
        type: 'bselect',
        label: '站点',
        prop: 'site',
        options: []
      },
      {
        type: 'input',
        label: 'order_sn',
        prop: 'orderSn',
        placeholder: '多个用英文逗号隔开'

      },
      {
        type: 'input',
        label: '文件名称',
        prop: 'fileName',
        placeholder: '多个用英文逗号隔开'

      }
      ],
      formHandler: [{
        label: '查询',
        handler: () => {
          this.search()
        }
      }, {
        label: '重置',
        handler: () => {
          this.reset()
        }
      }],

      headers: [
        { width: '55', type: 'selection' },
        { label: 'scenario(Pay+/Deduct-)', prop: 'scenario' },
        { label: 'order_id', prop: 'orderId' },
        { label: 'order_sn', prop: 'orderSn' },
        { label: 'Child UserID', prop: 'childUserid' },
        { label: 'seller_username', prop: 'sellerUsername' },
        { label: 'offline_adjustment', prop: 'offlineAdjustment' },
        { slot: true, slotName: 'remark' },
        { label: 'GP Account Name', prop: 'gpAccountName' },
        { label: 'GP Account Owner', prop: 'gpAccountOwner' },
        { label: '文件名称', prop: 'fileName', width: '200' }
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
    this.getData()
  },
  methods: {

    getAllData() {
      getShopeeLoanAdjustment(1, 50000, this.formInfo).then(res => {
        this.allData = res.data.records
      })
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    getData() {
      getStoreCodeList({ platformCode: 'SP' }).then(res => {
        this.formItem[0].options = res.data
      })
      getSiteNameList({ platformCode: 'SP' }).then(res => {
        this.formItem[1].options = res.data
      })
    },
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
      return getShopeeLoanAdjustment(current, size, params).then((res) => {
        this.$refs.formRef.filterData(res.data.records)
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

<style>

</style>
