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
        >
          <template slot="billAmount">
            <el-form-item label="账单放款">
              <el-col :span="8">
                <el-input-number
                  v-model="formInfo.minBillAmount"
                  placeholder="最小值"
                  controls-position="right"
                  :controls="false"
                />
              </el-col>
              <el-col :span="0.5">
                <span> -- </span>
              </el-col>
              <el-col :span="8">
                <el-input-number
                  v-model="formInfo.maxBillAmount"
                  :controls="false"
                  clearable
                  placeholder="最大值"
                  controls-position="right"
                />
              </el-col>
              <el-col :span="7.5">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
              </el-col>
            </el-form-item>
          </template>
        </cols-form>
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
import { donePage } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import billDoneDetail from './components/billDoneDetail'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyJoomBillDone', // 已关闭订单
  components: { colsForm },
  data() {
    return {
      headers: [
        { label: '文件名称', prop: 'billFileName' },
        { label: '主账号', prop: 'mainAccountNumber' },
        { label: '账单币种', prop: 'billCurrency' },
        { label: '账单放款', prop: 'billAmount' },
        { slot: true, slotName: 'operation' }
      ],
      formInfo: {
        platformCode: 'JM',
        minBillAmount: undefined,
        maxBillAmount: undefined
      },
      formItem: [
        { type: 'input', prop: 'mainAccountNumberList', label: '主账号', placeholder: '多个用英文逗号隔开' },
        { type: 'slot', slotName: 'billAmount' }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    showDetail(row) {
      this.$newTab({
        path: '/joom/flowDone/billDoneDetail',
        title: '账单明细',
        component: billDoneDetail,
        clearCache: true,
        data: {
          verifyBillId: row.id
        }
      })
    },
    search() {
      if (this.formInfo.maxBillAmount && this.formInfo.minBillAmount && this.formInfo.maxBillAmount < this.formInfo.minBillAmount) {
        return this.$message({
          type: 'error',
          message: '最大值应大于最小值'
        })
      }
      this.init()
    },
    reset() {
      this.formInfo = {
        platformCode: 'JM'
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
  .el-input-number--mini {
    width: 100%;
  }
</style>
