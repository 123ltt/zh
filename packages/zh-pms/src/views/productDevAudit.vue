<template>
  <!-- 我的审核-产品开发审核 -->
  <g-table ref="table"
           :headers="headers"
           row-key="id"
           :fetch="fetch"
           :expand-row-keys="expandIds"
           :diff-height="0"
           @selection-change="checkedHandler"
  >
    <template slot="header">
      <el-form ref="formRef" :model="form" size="mini" label-width="75px" class="search-form" @submit.native.prevent="search">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="开发类目" prop="categoryIds">
              <category-cascader v-model="form.categoryIds" lazy-multiple width="100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="环节" prop="flowNodeNo">
              <el-select v-model="form.flowNodeNo"
                         clearable
                         placeholder="请选择环节"
                         style="width:100%;"
                         @change="form.flowStatus=''"
                         @clear="auditStatusOptions=[],form.flowStatus=''"
              >
                <el-option v-for="(item,index) in auditNodeOptions" :key="index" :value="item.nodeNo" :label="item.nodeName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="flowStatus">
              <el-select v-model="form.flowStatus" clearable placeholder="请选择状态" style="width:100%;" :disabled="!form.flowNodeNo">
                <el-option v-for="item in auditStatusOptions" :key="item.bizStatusNo" :value="item.bizStatusNo" :label="item.bizStatusName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="开发时间" prop="createTime">
              <el-date-picker v-model="form.createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%;" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开发人">
              <v-organization ref="organizationRef" v-model="dever" style="width:100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="0">
              <el-button type="primary" native-type="submit">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>

    <el-table-column slot="imageUrlSlot" label="缩略图" width="70" align="center">
      <template #default="{row}">
        <g-thumb class="d-table-cell" :url="row.imageUrl" />
      </template>
    </el-table-column>

    <el-table-column slot="productNameSlot" label="产品名称">
      <template #default="{row}">
        <g-link @click="showDetail(row)">
          <g-text-ellipsis>{{ row.productName }}</g-text-ellipsis>
        </g-link>
      </template>
    </el-table-column>
    <el-table-column slot="createTime" label="开发时间" width="100">
      <template #default="{row}">
        <!-- eslint-disable-next-line -->
        <span v-html="datetimeWrap(row.createTime)" />
      </template>
    </el-table-column>

    <el-table-column slot="handler" label="操作" width="100">
      <template #default="{row}">
        <el-button type="text" size="mini" @click="flowChartHandler(row)">{{ expandIds.includes(row.id) ? '关闭流程' : '展开流程' }}</el-button><br>
        <template v-if="row.ifCanResubmit">
          <el-button type="text" size="mini" @click="resubmit(row)">重新提交</el-button><br>
        </template>
        <template v-if="row.ifCanSubmitFlow">
          <el-button type="text" size="mini" @click="audit(row)">处理</el-button><br>
        </template>
      </template>
    </el-table-column>

    <el-table-column slot="expand" type="expand" width="1">
      <template slot-scope="scope">
        <flow-chart ref="flowChart" :flow-id="scope.row.flowId" />
      </template>
    </el-table-column>

    <div slot="footer-left">
      <el-button type="primary" size="mini" :disabled="checkedIds.length===0" @click="submitBatchRemark">批量备注</el-button>
    </div>
  </g-table>
</template>

<script>
import { queryAudit, getFlowNo, resubmitAudit, batchRemark } from '@/api/myAudit'
import CategoryCascader from '@/components/category-cascader'
import VBatchRemark from './batchRemark.vue'
import FlowChart from '@/components/flow-chart/index.vue'
import VOrganization from '@/components/organization/index.vue'

export default {
  name: 'PmsProductDevAudit',
  components: { CategoryCascader, FlowChart, VOrganization },
  data() {
    return {
      defendNameOptions: [],
      auditNodeOptions: [],
      auditStatusOptions: [],
      form: {
        categoryIds: [],
        flowNodeNo: '', // 当前环节
        flowStatus: '', // 审核状态
        createTime: '',
        createUser: ''
      },
      dever: [],
      loading: false,
      expandLoading: false,
      checkedIds: [],
      headers: [
        { type: 'selection', width: 50 },
        { slot: true, slotName: 'imageUrlSlot' },
        { label: '类目', prop: 'categoryFullPath', width: 100, 'show-overflow-tooltip': true },
        { slot: true, slotName: 'productNameSlot' },
        {
          label: '是否采样',
          prop: 'isSampling',
          width: 80,
          formatter(row, column, cellValue, index) {
            return cellValue === 1 ? '是' : '否'
          }
        },
        { label: '当前环节', prop: 'flowNodeNoName', width: 120 },
        { label: '状态', prop: 'flowStatusName', width: 130 },
        { slot: true, slotName: 'createTime' },
        { label: '开发人', prop: 'createUserName', width: 120 },
        { slot: true, slotName: 'handler' },
        { slot: true, slotName: 'expand' }
      ],
      rowIndex: undefined,
      expandIds: []
    }
  },
  watch: {
    'form.flowNodeNo'(val) {
      const { auditNodeOptions } = this
      auditNodeOptions.forEach(item => {
        item.nodeNo === val && (this.auditStatusOptions = item.bizStatusList)
      })
    },
    dever(val) {
      this.form.createUser = val.id
    }
  },
  created() {
    getFlowNo().then(res => {
      const { code, data } = res
      if (code === 200) {
        this.auditNodeOptions = data
      }
    })
  },
  mounted() {
    this.$refs.table.$el.classList.add('_expand_scroll_fixed')
    this.$refs.table.load(1, this.form)
  },
  methods: {
    datetimeWrap(str) {
      if (typeof str === 'string') {
        return str.trim().replace(/\s/, '<br>')
      }
      return str
    },
    checkedHandler(data) {
      this.checkedIds = data.map(item => item.id)
    },
    // 提交批量备注
    submitBatchRemark() {
      if (this.checkedIds.length > 0) {
        this.$modal({
          title: '批量备注',
          component: VBatchRemark,
          data: { ids: this.checkedIds, apiFn: batchRemark },
          width: '400px'
        })
      }
    },
    // 重新提交审核
    async resubmit({ flowId, id }) {
      const flag = await this.$confirm('确定重新提交审核？').catch(() => { })
      if (!flag) return
      resubmitAudit(flowId, id).then(res => {
        this.$message.success('重新提交审核成功')
        this.search()
      })
    },
    audit(row) {
      this.$newPage({
        path: `/pms/product/auditDev/-/${row.flowId}`,
        data: { id: row.id },
        callback: bool => { // bool:false 点击的是取消
          if (bool) {
            this.$refs.flowChart && this.$refs.flowChart.getData()
            this.search()
          }
        }
      })
    },
    showDetail(row) {
      this.$newPage({
        path: '/pms/product/detailDev',
        data: { id: row.id }
      })
    },
    fetch({ current, size }, params) {
      const { createTime, ...other } = params

      const data = { ...other, createTime, createTimeFrom: '', createTimeTo: '', current, size }
      if (Array.isArray(createTime)) {
        data.createTimeFrom = createTime[0]
        data.createTimeTo = createTime[1]
      }
      return queryAudit({ current, size, ...data }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    flowChartHandler(data) {
      if (this.expandIds.indexOf(data.id) > -1) {
        this.expandIds = this.expandIds.filter(item => item !== data.id)
      } else {
        this.expandIds.push(data.id)
      }
    },
    reset() {
      this.$refs.formRef.resetFields()
      this.form.createUser = ''
      this.$refs.organizationRef.inputText = ''
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-form-item--mini.el-form-item {
  margin-bottom: 0;
}
::v-deep .el-table__expand-column {
  border-right: none;
  & + td > div.cell {
    text-align: left;
  }
}
::v-deep th.is-leaf.is-left > div.cell {
  text-align: left;
}
</style>
