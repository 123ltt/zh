<template>
  <basic-container>
    <g-table ref="tableRef"
             :headers="headers"
             :fetch="fetch"
             :header-cell-style="{'text-align':'center'}"
             :cell-style="{'text-align':'center'}"
    >
      <template #header>
        <cols-form :form-item="formItem" :form-info="formInfo" :form-handler="formHandler" />
      </template>
      <el-table-column slot="billDetail" width="120" label="账单明细">
        <template v-slot="{row}">
          <auto-button @click="showDetail(row)">查看</auto-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import colsForm from '@/views/components/colsForm'
import AutoButton from '@/views/components/autoButton.vue'
import { getStoreCodeList, donePage } from '@/api/common'
import billDetail from './components/billDoneDetail'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyJdBillDone',
  components: { colsForm, AutoButton },
  data() {
    return {
      formInfo: {},
      formItem: [
        {
          label: '店铺编码',
          prop: 'storeCode',
          type: 'gselect',
          optionValue: 'value',
          options: []
        },
        {
          label: '账单ID',
          prop: 'mainAccountNumber',
          type: 'input',
          placeholder: '多个请用英文逗号隔开'
        }
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
      headers: [
        { label: '店铺编码', prop: 'storeCode' },
        { label: '账单ID', prop: 'billId' },
        { label: '账单币种', prop: 'billCurrency' },
        { label: '账单放款', prop: 'billAmount' },
        { slot: true, slotName: 'billDetail' }
      ]
    }
  },
  mounted() {
    this.init()
    this.getData()
  },
  methods: {
    reset() {},
    search() {
      this.init()
    },
    init() {
      this.formInfo.platformCode = 'JD'
      this.$refs.tableRef.load(1, this.formInfo)
    },
    fetch({ current, size }, params) {
      return donePage(current, size, params).then(res => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    // 获取店铺列表
    getData() {
      getStoreCodeList({ platformCode: 'JD' }).then((res) => {
        if (res.success && res.data) {
          this.formItem[0].options = res.data
        }
      })
    },
    showDetail(row) {
      this.$newTab({
        path: 'jd/billDone/detail',
        title: '账单明细',
        component: billDetail,
        clearCache: true,
        data: {
          verifyBillId: row.id
        }
      })
    }
  }
}
</script>
