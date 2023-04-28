<template>
  <!-- 质检不合格 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form label-width="100px" size="mini" class="searchBox">
          <el-row :gutter="10">
            <el-col :span="9">
              <el-form-item prop="logisticsCode" label="物流运单号">
                <el-input v-model.trim="formData.logisticsCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="purCode" label="采购编码">
                <el-input v-model.trim="formData.purCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="warehousingCode" label="入库编码">
                <el-input v-model.trim="formData.warehousingCode" clearable style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="status" label="状态">
                <el-select v-model="formData.status" clearable filterable style="width:100%">
                  <el-option v-for="item in statusList" :key="item.dictKey" :value="item.dictKey" :label="item.dictValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button icon="el-icon-delete" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="wmsAbnormalCode" label="不良编码" min-width="110" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status!==2" color="primary" @click="getTable(row)">{{ row.wmsAbnormalCode }}</g-link>
          <span v-else>{{ row.wmsAbnormalCode }}</span>
        </template>
      </el-table-column>

      <!-- 供应商名称 -->
      <el-table-column slot="supplierName" label="供应商名称" align="center" min-width="120">
        <template v-slot="scope">
          <g-text-ellipsis :lines="2">{{ scope.row.supplierName }} </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" align="center" min-width="60">
        <template v-slot="slot">
          <span>{{ ['待确认','待处理','已处理'][slot.row.status-1]||'' }}</span>
        </template>
      </el-table-column>

      <!-- 处理意见 -->
      <el-table-column slot="handleSuggestion" label="处理意见" align="center" min-width="90">
        <template v-slot="slot">
          <span>{{ slot.row.handleSuggestionName }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" align="center" min-width="70" fixed="right">
        <template v-slot="scope">
          <el-button v-if="scope.row.status!==2" size="mini" type="text" @click="getTable(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status===2" size="mini" type="text" @click="processData(scope.row)">处理</el-button>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>
<script>
import checkDetail from './components/checkDetail.vue'
import checkProcess from './components/checkProcess.vue'
import { getList } from '@/api/exceptionManagement/checkFail'
import { dictionary } from '@/api/commonApi'
export default {
  name: 'PurchaseExceptionManagementCheckUnqualified',
  data() {
    return {
      loading: false,
      visible: false,
      visible2: false,
      formData: {
        status: '',
        warehousingCode: '',
        purCode: '',
        logisticsCode: ''
      },
      searchData: [],
      statusList: [],
      tableData: [],
      headers: [
        {
          slot: true,
          slotName: 'wmsAbnormalCode'
        },
        {
          label: '入库编码',
          prop: 'warehousingCode',
          minWidth: '90',
          align: 'center'
        },
        {
          label: '物流运单号',
          prop: 'logisticsCode',
          minWidth: '90',
          align: 'center'
        },
        {
          label: '采购编码',
          prop: 'purCode',
          minWidth: '110',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'supplierName'
        },
        {
          label: '收货数量',
          prop: 'receiveQty',
          minWidth: '70',
          align: 'center'
        },
        {
          label: '不良品数量',
          prop: 'rejectQty',
          minWidth: '90',
          align: 'center'
        },
        {
          label: '不良类型',
          prop: 'abnormalTypeName',
          minWidth: '90',
          align: 'center'
        },
        {
          label: '上架数量',
          prop: 'upFrameQty',
          minWidth: '70',
          align: 'center'
        },
        {
          label: '质检人',
          prop: 'inspectPeople',
          minWidth: '90',
          align: 'center'
        },
        {
          label: '质检时间',
          prop: 'inspectTime',
          minWidth: '130',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          slot: true,
          slotName: 'handleSuggestion'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ]
    }
  },
  mounted() {
    this.initialization()
    this.getSearch()
  },
  methods: {
    getSearch() {
      dictionary('ips_order_abnormal_status').then(res => {
        this.statusList = res.data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
    },
    initialization() { // 分页接口调取
      this.$refs.table.load(1, this.searchData)
    },
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        res.data.records.map(item => {
          for (const key in item) {
            if (item[key] === -1) item[key] = ''
          }
          return item
        })
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    getTable(val) {
      this.$newTab({
        path: '/checkField/checkDetail',
        title: '质检不合格详情',
        component: checkDetail,
        data: {
          detailData: val
        },
        clearCache: true,
        callback: () => {}
      })
    },
    processData(val) {
      this.$newTab({
        path: '/checkField/checkProcess',
        title: '质检不合格处理',
        component: checkProcess,
        data: {
          checkData: val
        },
        clearCache: true,
        callback: (bool) => {
          if (bool) {
            this.initialization()
          }
        }
      })
    },
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.formData))
      this.initialization()
    },
    reset() {
      this.formData.status = ''
      this.formData.warehousingCode = ''
      this.formData.purCode = ''
      this.formData.logisticsCode = ''
      this.searchData = []
      this.initialization()
    }
  }

}
</script>
<style lang="scss" scoped>
.searchBox{
    ::v-deep .el-form-item{
      margin-bottom: 0;
    }
  }
.block{
    text-align:right;
    margin: 10px 10px 0 0;
}
</style>
