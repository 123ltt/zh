<template>
  <basic-container>
    <g-table ref="tableRef"
             :fetch="fetch"
             :header-cell-style="{'text-align':'center'}"
             :cell-style="{'text-align':'center'}"
             :headers="headers"
    >
      <template #header>
        <cols-form :form-item="formItem"
                   :form-info="formInfo"
                   :form-handler="formHandler"
        />
      </template>
      <template v-slot:bill="{data}">
        <el-table-column label="账单">
          <el-table-column v-for="item in data.list" :key="item.prop" v-bind="item" />
        </el-table-column>
      </template>
      <template v-slot:flow="{data}">
        <el-table-column label="流水">
          <el-table-column label="收款方式">
            <template v-slot="{row}">
              {{ getPayeeType(row.payeeType)||'--' }}
            </template>
          </el-table-column>
          <el-table-column v-for="item in data.list" :key="item.prop" v-bind="item" />
        </el-table-column>
      </template>
      <el-table-column slot="operation" label="操作">
        <template v-slot="{row}">
          <el-button type="text" @click="showDetail(row)">详情</el-button>

        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>

<script>
import { getFlowDonePage, getStoreCodeList, getFlowStatus, getpayeeTypes } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import detailBill from '@/views/verifiy/modal/detailBill'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyVovaFlowDone',
  components: { colsForm }, // 已核销流水
  data() {
    return {

      headers: [
        {
          slot: true,
          slotName: 'bill',
          list: [
            { label: '文件名称', prop: 'fileName' },
            { label: '店铺编码', prop: 'storeCode' },
            { label: '账单币种', prop: 'billCurrency' },
            { label: '账单放款', prop: 'billAmount' }
          ]
        },
        {
          slot: true,
          slotName: 'flow',
          list: [
            { label: '收款账号', prop: 'payeeAccount' },
            { label: '到账时间', prop: 'receivedDate' },
            { label: '交易流水号', prop: 'flowNumber' },
            { label: '流水币种', prop: 'flowCurrency' },
            { label: '到账流水', prop: 'flowReceived' }
          ]
        },
        { slot: true, slotName: 'operation' }
      ],
      formInfo: {},
      formItem: [
        {
          type: 'gselect',
          optionValue: 'value',
          prop: 'storeCode',
          label: '店铺编码',
          options: []
        },
        {
          type: 'input',
          prop: 'flowNumber',
          label: '交易流水号',
          placeholder: '多个请用英文逗号隔开'
        },
        {
          type: 'select',
          prop: 'payeeType',
          label: '收款方式',
          options: []
        },
        {
          type: 'input',
          prop: 'payeeAccount',
          label: '收款账号',
          placeholder: '多个请用英文逗号隔开'
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
      }]
    }
  },
  mounted() {
    this.getData()
    this.init()
  },
  methods: {
    getData() {
      getStoreCodeList({ platformCode: 'VV' }).then(res => {
        this.formItem[0].options = res.data
      })
      getFlowStatus().then(res => {
        this.formItem[1].options = res.data
      })
      getpayeeTypes().then(res => {
        this.formItem[2].options = res.data
      })
    },
    getPayeeType(val) {
      return this.formItem[2].options.find(item => item.key === val)?.value
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    showDetail(row) {
      this.$newTab({
        path: '/vova/flowDone/detail',
        title: '流水核销详情',
        component: detailBill,
        clearCache: true,
        data: {
          info: { id: row.id, isVerify: 1, platformCode: 'VV' },
          detailType: 'flow'
        }
      })
    },
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {}
      this.init()
    },
    fetch({ current, size }, params) {
      Object.assign(params, { platformCode: 'VV' })
      return getFlowDonePage(current, size, params).then(res => {
        res.data.records === null || filterData(res.data.records)
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

</style>
