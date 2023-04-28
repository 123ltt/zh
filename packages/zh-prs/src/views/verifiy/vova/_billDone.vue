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
      <el-table-column slot="operation" label="账单明细">
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
  name: 'PrsVerifiyVovaBillDone', // 已关闭订单
  components: { colsForm },
  data() {
    return {

      headers: [
        { label: '文件名称', prop: 'billFileName' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '账单币种', prop: 'billCurrency' },
        { label: '账单放款', prop: 'billAmount' },
        { slot: true, slotName: 'operation' }
      ],
      formInfo: { platformCode: 'VV' },
      formItem: [
        {
          type: 'gselect',
          optionValue: 'value',
          prop: 'storeCode',
          label: '店铺编码',
          options: []
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
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    showDetail(row) {
      this.$newTab({
        path: '/vova/flowDone/billDoneDetail',
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
        platformCode: 'VV'
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
