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
      <el-table-column slot="operation" width="200" label="账单明细">
        <template v-slot="{row}">
          <el-button type="text" @click="showDetail(row)">查看</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { donePage, getStoreCodeList } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import billDoneDetail from './components/billDoneDetail'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiySmtBillDone', // 已关闭订单
  components: { colsForm },
  data() {
    return {

      headers: [
        { label: '店铺编码', prop: 'storeCode' },
        { label: '账期开始时间', prop: 'billStartTime' },
        { label: '账期结束时间', prop: 'billEndTime' },
        { label: '账单币种', prop: 'billCurrency' },
        { label: '账单总收入', prop: 'billAmount' }, //
        { label: '账单总支出', prop: 'billRefundAmount' }, //
        { slot: true, slotName: 'operation' }
      ],
      formInfo: { platformCode: 'SM' },
      formItem: [
        {
          type: 'gselect',
          optionValue: 'value',
          prop: 'storeCode',
          label: '店铺编码',
          options: []
        },
        {
          type: 'datePicker',
          label: '账单时间',
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
      }]
    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.billStartTime = val?.[0]
      this.formInfo.billEndTime = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },
  mounted() {
    this.getData()
    this.init()
  },
  methods: {
    getData() {
      getStoreCodeList({ platformCode: 'SM' }).then(res => {
        this.formItem[0].options = res.data
      })
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    showDetail(row) {
      this.$newTab({
        path: '/smt/flowDone/billDoneDetail',
        title: '账单明细',
        component: billDoneDetail,
        clearCache: true,
        data: {
          verifyBillId: row.id
        }
      })
    },
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {
        platformCode: 'SM'
      }
      this.init()
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
    }
  }
}
</script>

<style scoped lang="scss">

</style>
