<template>
  <basic-container>
    <g-table
      ref="tableRef"
      :headers="headers"
      :fetch="fetch"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
    >
      <template #header>
        <cols-form
          ref="colsForm"

          :form-info="formInfo"
          :form-item="formItem"
          :form-handler="formHandler"
        />
        <el-button style="margin-left:auto;display:block" type="primary" size="mini" @click="exportBill">导入账单</el-button>

      </template>
      <el-table-column slot="result" label="结果">
        <template v-slot="{row}">

          <span v-if="row.status==='失败'">
            失败:{{ row.causesFailure }}
          </span>
          <span v-else>--</span>
        </template>

      </el-table-column>

      <el-table-column slot="operation" label="操作">
        <template v-slot="{row}">
          <auto-button @click="doloadBill(row)">
            下载
          </auto-button>
          <g-auth code="prs_importOrExport_delete">
            <auto-button auto-confirm @confirm="delBill(row)">
              删除
            </auto-button>
          </g-auth>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>

import colsForm from '@/views/components/colsForm'
import autoButton from '@/views/components/autoButton'
import downOrUp from './downorup'
import { getFileTask, getPlatformList, getStoreCodeList, delFileTask, getTaskTypeList } from '@/api/common'
import { filterData } from '../../utils/filterData'
export default {
  name: 'ImportOrExport',
  components: { colsForm, autoButton },
  data() {
    return {
      formInfo: {
        platformName: '',
        storeCode: ''
      },
      opreationOption: [
        { dictKey: 1, dictValue: '账单导入' },
        { dictKey: 2, dictValue: '流水导入' },
        { dictKey: 3, dictValue: '文件导出' }
      ],
      statusOption: [
        { dictKey: 1, dictValue: '待处理' },
        { dictKey: 2, dictValue: '处理中' },
        { dictKey: 3, dictValue: '成功' },
        { dictKey: 4, dictValue: '失败' },
        { dictKey: 5, dictValue: '删除中' },
        { dictKey: 6, dictValue: '已删除' }
      ],
      headers: [
        { label: '平台', prop: 'platformName' },
        { label: '站点', prop: 'site' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '操作人', prop: 'operator' },
        { label: '操作类型', prop: 'fileType' },
        { label: '任务类型', prop: 'taskTypeName' },
        { label: '创建时间', prop: 'createTime' },
        { label: '文件名称', prop: 'fileName' },
        { label: '文件状态', prop: 'status' },
        { slot: true, slotName: 'result' },
        { slot: true, slotName: 'operation' }

      ],
      formItem: [

        {
          type: 'gselect',
          label: '平台名称',
          prop: 'platformCode',
          options: [],
          optionValue: 'platformCode',
          optionLabel: 'platformName'
        },

        {
          type: 'gselect',
          optionValue: 'value',
          label: '店铺编码',
          prop: 'storeCode',
          options: []
        },
        {
          type: 'input',
          label: '操作人',
          prop: 'operator',
          placeholder: '请输入'
        },
        {
          type: 'select',
          label: '操作类型',
          prop: 'fileType',
          options: [

          ]
        },
        {
          type: 'select',
          label: '状态',
          prop: 'status',
          options: [

          ]

        },
        {
          type: 'select',
          label: '任务类型',
          prop: 'taskType',
          optionLabel: 'taskName',
          optionValue: 'taskType',
          options: [

          ]

        }
      ],
      formHandler: [
        {
          label: '查询',
          handler: () => {
            this.search()
          }
        },
        {
          label: '重置',
          handler: () => {
            this.reset()
          }
        }
      ]
    }
  },
  watch: {
    'formInfo.platformCode'(val) {
      this.formInfo.storeCode = ''
      val || (this.formItem[1].options = [])
      val && getStoreCodeList({ platformCode: val }).then(res => {
        this.formItem[1].options = res.data
      })
    }
  },
  mounted() {
    this.init()
    this.getData()
  },
  methods: {
    doloadBill(row) {
      var a = document.createElement('a')
      var blob = new Blob([row.link])
      var url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = row.fileName
      a.click()
    },
    getData() {
      getPlatformList().then(res => {
        this.formItem[0].options = res.data
      })
      getTaskTypeList().then(res => {
        this.formItem[5].options = res.data
      })
      this.formItem[3].options = this.opreationOption
      this.formItem[4].options = this.statusOption
    },
    exportBill() {
      const that = this
      this.$modal({
        title: '导入账单',
        width: '38%',
        component: downOrUp,
        callback(val) {
          val && that.init()
        }
      })
    },
    delBill(row) {
      delFileTask({ id: row.id }).then(res => {
        this.$message.success(res.msg)
        this.init()
      })
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    fetch({ current, size }, params) {
      return getFileTask(current, size, params).then((res) => {
      // 格式化数据

        res.data.records.forEach(item => {
          this.opreationOption.forEach(ele => {
            if (item.fileType === ele.dictKey) {
              item.fileType = ele.dictValue
            }
          })
          this.statusOption.forEach(ele => {
            if (item.status === ele.dictKey) {
              item.status = ele.dictValue
            }
          })
        })
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    search() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    reset() {
      this.formInfo = {
        platformName: '',
        storeCode: ''
      }
      this.init()
    }
  }
}
</script>

<style></style>
