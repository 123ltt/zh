<template>
  <basic-container>
    <g-table ref="tableRef"
             :headers="headers"
             :fetch="fetch"
             :header-cell-style="{'text-align':'center'}"
             :cell-style="{'text-align':'center'}"
             @selection-change="handleSelectionChange"
    >
      <template #header>
        <cols-form :form-info="formInfo" :form-item="formItem">
          <el-form-item slot="handleBtn">
            <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button icon="el-icon-delete" @click="reset">重置</el-button>
            <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="add">新增</el-button>
          </el-form-item>
        </cols-form>
      </template>
    </g-table>
  </basic-container>
</template>

<script>
import colsForm from '@/views/components/colsForm.vue'
import addSetting from './components/addSetting.vue'
export default {
  name: 'LpsSettlementEntry',
  components: {
    colsForm
  },
  data() {
    return {
      formInfo: {},
      formItem: [
        {
          label: '物流商简称',
          type: 'gselect',
          prop: 'lpAbbreviation',
          optionValue: 'lpAbbreviation',
          optionLabel: 'lpAbbreviation',
          options: []
        },
        { label: '状态', type: 'select', prop: '22', options: [] }
      ],
      headers: [
        { type: 'index', label: '序号' },
        { label: '物流商', prop: '' },
        { label: '重量差异', prop: '' },
        { label: '金额差异', prop: '' },
        { label: '以我司重量为准', prop: '' },
        { label: '以我司金额为准', prop: '' },
        { label: '更新时间', prop: '' },
        { label: '更新人', prop: '' },
        { label: '状态', prop: '' },
        { label: '操作', prop: '' }
      ]
    }
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
    },
    fetch() {
      return new Promise((resolve) => { resolve() }).then(() => {
        return {
          records: [
            { a: 1, b: 2, c: 3, weight: 11 },
            { a: 1, b: 2, c: 4, weight: 11 }
          ],
          total: 2,
          size: 20
        }
      }
      )
    },
    add() {
      const that = this
      this.$modal({
        title: '新增预付款单',
        width: '380px',
        component: addSetting,
        callback(val) {
          val && that.init()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
