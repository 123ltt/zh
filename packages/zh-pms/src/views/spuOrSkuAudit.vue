<template>
  <g-table ref="table"
           :headers="headers"
           :fetch="fetch"
           :diff-height="0"
           row-key="id"
           :expand-row-keys="expandIds"
           @selection-change="checkedHandler"
  >
    <el-form slot="header" size="mini" class="form-col no-message" label-width="80px" @submit.native.prevent="getData">
      <el-row>
        <el-col :span="8">
          <el-form-item label="类目">
            <category-cascader v-model="form.categoryIds" lazy-multiple width="100%" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="环节">
            <el-select v-model="form.nodeNo" clearable @change="form.bizStatusNo=''">
              <el-option label="全部" value="" />
              <el-option v-for="item in flowList" :key="item.updateTime" :label="item.nodeName" :value="item.nodeNo" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="form.bizStatusNo" :disabled="!form.nodeNo">
              <el-option label="全部" value="" />
              <el-option v-for="item in statusList" :key="item.bizStatusNo" :label="item.bizStatusName" :value="item.bizStatusNo" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-input v-model.trim="form.productName" placeholder="请输入产品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型">
            <el-select v-model="form.type">
              <el-option v-for="item in typeList" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="10px">
            <el-button type="primary" native-type="submit">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table-column slot="imageUrl" label="缩略图" width="70" align="center">
      <template #default="{row}">
        <g-thumb class="d-table-cell" :url="row.imageUrl" />
      </template>
    </el-table-column>
    <el-table-column slot="productName" label="产品名称">
      <template #default="{row}">
        <g-link @click="infoHandler(row,true)">
          <g-text-ellipsis>{{ row.productName }}</g-text-ellipsis>
        </g-link>
      </template>
    </el-table-column>
    <el-table-column slot="productSpu" label="编码" width="100">
      <template #default="{row}">
        <g-link color="primary" @click="infoHandler(row,true)">{{ row.productSpu }}</g-link>
      </template>
    </el-table-column>
    <el-table-column slot="skuCount" label="SKU数量" width="80">
      <template #default="{row}">
        <el-button v-if="row.type===1" type="text" :disabled="!row.skuCount" @click="querySkuList(row)">{{ row.skuCount||0 }}</el-button>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column slot="handler" label="操作" width="100">
      <template slot-scope="scope">
        <el-button type="text" class="p-1" size="mini" @click="flowChartHandler(scope.row)">{{ expandIds.includes(scope.row.id)?'隐藏':'查看' }}流程</el-button><br>
        <template v-if="scope.row.ifCanSubmitFlow">
          <el-button type="text" class="p-1" size="mini" @click="infoHandler(scope.row,false)">处理</el-button><br>
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
import CategoryCascader from '@/components/category-cascader/index.vue'
import { getSXUAuditList, getFlowList } from '@/api/myAudit'
import VBatchRemark from './batchRemark.vue'
import FlowChart from '@/components/flow-chart/index.vue'

export default {
  name: 'SpuOrSkuAudit',
  components: { CategoryCascader, FlowChart },
  data() {
    return {
      form: {
        categoryIds: [],
        productName: '',
        nodeNo: '',
        bizStatusNo: '',
        type: ''
      },
      headers: [
        { type: 'selection' },
        { slot: true, slotName: 'imageUrl' },
        {
          label: '类型',
          prop: 'type',
          width: '70',
          formatter: (row, column, cellValue) => {
            const item = this.typeList.find(item => item.value === cellValue)
            return item ? item.label : '-'
          }
        },
        { slot: true, slotName: 'productName' },
        { slot: true, slotName: 'productSpu' },
        { slot: true, slotName: 'skuCount' },
        { label: '环节', prop: 'currentNodeDesc', width: '120px' },
        { label: '状态', prop: 'currentBizStatusDesc', width: '120px' },
        { slot: true, slotName: 'handler' },
        { slot: true, slotName: 'expand' }
      ],
      flowList: [],
      typeList: [
        { label: '全部', value: '' },
        { label: 'SPU', value: 1 },
        { label: 'SKU', value: 2 },
        { label: '组合SKU', value: 3 }
      ],
      list: [],
      checkedIds: [],
      expandIds: []
    }
  },
  computed: {
    statusList() {
      const data = this.flowList.find(item => item.nodeNo === this.form.nodeNo)
      return data ? (data.bizStatusList || []) : []
    }
  },
  created() {
    this.getConditionData()
  },
  mounted() {
    this.$refs.table.$el.classList.add('_expand_scroll_fixed')
    this.$refs.table.load(1, this.form)
  },
  methods: {
    fetch(page, params) {
      return getSXUAuditList(params, page).then(res => res.data)
    },
    getData() {
      this.$refs.table.load(1, this.form)
    },
    // 获取 环节列表、状态列表 数据
    getConditionData() {
      getFlowList('FLOW_SPU').then(res => {
        this.flowList = res.data
      })
    },
    querySkuList(data) {
      this.$router.push({
        name: 'PmsSku',
        params: {
          condition: {
            productSpu: data.productSpu
          }
        }
      }, true)
    },
    // 新增与修改spu
    infoHandler(data = {}, readonly = false) {
      const { productSku: code, flowId } = data
      if (readonly) {
        this.$newPage({
          path: '/pms/product/detail',
          data: { code }
        })
      } else {
        this.$newPage({
          path: `/pms/product/audit/-/${flowId}`,
          data: { code },
          callback: refresh => {
            if (refresh) {
              this.$refs.flowChart && this.$refs.flowChart.getData()
              this.getData()
            }
          }
        })
      }
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
          data: { ids: this.checkedIds },
          width: '400px'
        })
      }
    },
    flowChartHandler(data) {
      if (this.expandIds.indexOf(data.id) > -1) {
        this.expandIds = this.expandIds.filter(item => item !== data.id)
      } else {
        this.expandIds.push(data.id)
      }
    },
    reset() {
      Object.assign(this.form, {
        categoryIds: [],
        productName: '',
        nodeNo: '',
        bizStatusNo: '',
        type: ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-box {
  ::v-deep .el-form-item {
    margin-bottom: 0.5rem !important;
  }
}
</style>
