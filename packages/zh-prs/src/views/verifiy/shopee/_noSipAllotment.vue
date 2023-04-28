<template>
  <basic-container>
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
    </g-table>
  </basic-container>
</template>

<script>
import { getShopeeAllocateFunds } from '@/api/shopee/shopee'
import { getStoreCodeList } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import handelDownload from '@/views/components/handelDownload'
export default {
  name: 'PrsVerifiyShopeeNoSipAllotment', // 非sip拨款流水
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
        type: 'input',
        label: 'payee_id',
        prop: 'payeeId',
        placeholder: '多个用英文逗号隔开'

      },
      {
        type: 'datePicker',
        label: '拨款时间',
        prop: 'date'
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
        { label: '销售经理', prop: 'managerName' },
        { label: '组织架构', prop: 'organizationCode' },
        { label: '注册公司', prop: 'register', width: '100' },
        { label: '收款方式', prop: 'payService' },
        { label: '收款公司', prop: 'payeeCompany' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '站点', prop: 'site' },
        { label: '原始币种', prop: 'fromCurrency' },
        { label: '拨款币种', prop: 'payoutCurrency' },
        { label: '执行汇率', prop: 'exchangeRate' },
        { label: 'payee_id', prop: 'payeeId' },
        { label: '拨款时间', prop: 'payoutTimeStr' },
        { label: '拨款金额（原币）', prop: 'fromAmount', width: '120' },
        { label: '拨款金额', prop: 'payoutAmount' }
      ]

    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.beginTime = val?.[0]
      this.formInfo.endTime = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },
  mounted() {
    this.init()
    this.getData()
  },
  methods: {
    getAllData() {
      getShopeeAllocateFunds(1, 50000, this.formInfo).then(res => {
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
      return getShopeeAllocateFunds(current, size, params).then((res) => {
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
