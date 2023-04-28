<template>
  <basic-container>
    <g-table ref="tableRef"
             :headers="headers"
             :fetch="fetch"
             :header-cell-style="{'text-align':'center'}"
             :cell-style="{'text-align':'center'}"
    >
      <template #header>
        <cols-form :form-info="formInfo" :form-item="formItem" :label-width="'auto'">
          <el-form-item slot="handleBtn">
            <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button icon="el-icon-delete" @click="reset">重置</el-button>
          </el-form-item>
        </cols-form>
      </template>
    </g-table>
  </basic-container>
</template>

<script>
import colsForm from '@/views/components/colsForm.vue'
import { getWishYouPage } from '@/api/query'
export default {
  name: 'LpsSettlementEntry',
  components: {
    colsForm
  },
  data() {
    return {
      formInfo: {},
      formItem: [
        { label: 'wish邮账号', type: 'gselect', prop: 'account', options: [] },
        { label: '时间', type: 'datePicker', prop: 'date' }
      ],
      headers: [
        { type: 'index', label: '序号' },
        { label: 'wish邮账号', prop: 'account' },
        { label: '总余额', prop: 'allBalance' },
        { label: '可用余额', prop: 'availableBalance' },
        { label: '冻结余额', prop: 'blockedBalances' },
        { label: '更新日期', prop: 'updateTime' }
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
    search() {
      this.init()
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    reset() {
      this.formInfo = {}
      this.init()
    },
    fetch({ current, size }, params) {
      return getWishYouPage(current, size, params).then(res => {
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

<style lang="scss" scoped>
</style>
