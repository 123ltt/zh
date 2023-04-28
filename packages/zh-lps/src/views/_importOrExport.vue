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
        <cols-form :form-info="formInfo" :form-item="formItem" :label-width="'60px'">
          <el-form-item slot="handleBtn">
            <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button icon="el-icon-delete" @click="reset">重置</el-button>
          </el-form-item>
        </cols-form>
      </template>
      <el-table-column slot="causesFailure" fixed="right" width="110px" label="操作">
        <template v-slot="{row}">
          <g-text-ellipsis lines="2">{{ row.causesFailure }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="operation" fixed="right" width="110px" label="操作">
        <template v-slot="{row}">
          <el-button type="text" @click="downLoad(row.link)">下载</el-button>
          <el-button type="text" @click="deleteRow(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import colsForm from '@/views/components/colsForm.vue'
import { getImportOrExportList, deleteImportOrExportRow } from '@/api/importOrExport'
export default {
  name: 'LpsSettlementCheck',
  components: {
    colsForm
  },
  data() {
    return {
      formInfo: {},
      formItem: [
        { label: '操作人', type: 'gselect', prop: 'wls', options: [] },
        { label: '任务类型', type: 'select', prop: '11' },
        { label: '状态', type: 'select', prop: '22' }
      ],
      editable: [],
      allData: [],
      exportData: [],
      headers: [
        { type: 'index', label: '序号', width: '55' },
        { label: '操作人', prop: 'operator' },
        { label: '操作类型', prop: 'operationType' },
        { label: '任务名称', prop: 'taskName' },
        { label: '创建时间', prop: 'createTime' },
        { label: '文件名称', prop: 'fileName' },
        { label: '文件状态', prop: 'status' },
        // { label: '失败原因', prop: 'causesFailure' },
        { slot: true, slotName: 'causesFailure' },
        { slot: true, slotName: 'operation' }
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
    reset() {
      this.formInfo = {}
    },
    downLoad(data) {
      var a = document.createElement('a')
      a.href = data
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    cancel() {
      this.$parent.$emit('close')
    },
    deleteRow(data) {
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteImportOrExportRow({ ids: data }).then(res => {
          this.$message.success(res.msg)
          this.init()
        })
      }).catch(() => {

      })
    },

    handleSelectionChange(val) {
      this.exportData = val
    },
    fetch({ current, size }, params) {
      return getImportOrExportList(current, size, params).then(res => {
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
