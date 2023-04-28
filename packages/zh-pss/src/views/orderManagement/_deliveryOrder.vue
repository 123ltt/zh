<template>
  <basic-container>
    <!-- 发货订单 -->
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form ref="formRef" :model="submit" size="mini" label-width="100px" class="searchBox">
          <el-row :gutter="10">
            <el-col :span="9">
              <el-form-item prop="logisticsWaybillNumber" label="发货运单号">
                <el-input v-model="submit.logisticsWaybillNumber" placeholder="请输入" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="purchaseCode" label="采购编码">
                <el-input v-model="submit.purchaseCode" placeholder="请输入" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="receiptPeople" label="收货人">
                <el-input v-model="submit.receiptPeople" placeholder="请输入" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="logisticsStatus" label="状态"> <el-select ref="input" v-model="submit.logisticsStatus" clearable placeholder="请选择" filterable style="width:80%">
                <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button class="btn" type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button class="btn" icon="el-icon-delete" @click="reset()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="logisticsWaybillNumber" label="发货运单号" min-width="90" align="center">
        <template slot-scope="slot">
          <g-link @click="detailShow(slot.row,slot.row.id)">{{ slot.row.logisticsWaybillNumber }}</g-link>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="60" align="center">
        <template slot-scope="slot">
          <div v-for="item in statusList" :key="item.dictKey">
            <span v-if="slot.row.logisticsStatus == item.dictKey">{{ item.dictValue }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="70">
        <template slot-scope="slot">
          <el-button type="text" @click="detailShow(slot.row,slot.row.id)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>
<script>
import { paging } from '@/api/orderManagement/deliveryOrder'
import componentsDetail from './components/deliveryOrder/deliveryDetail.vue'
import { getDictBiz } from '@/api/commonApi/common.js'
export default {
  name: 'SupplierOrderManagementDeliveryOrder',
  data() {
    return {
      submit: {
        logisticsWaybillNumber: '',
        purchaseCode: '',
        logisticsStatus: '',
        receiptPeople: ''
      },
      searchData: {},
      isDetail: false,
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'logisticsWaybillNumber'
        },
        {
          label: '物流商名称',
          prop: 'lpName',
          showOverflowTooltip: true,
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '采购编码',
          prop: 'purchaseCode',
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '采购数量',
          prop: 'purchaseNumber',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '发货人',
          prop: 'consignor',
          minWidth: '85px',
          align: 'center'
        },
        {
          label: '发货时间',
          prop: 'deliveryTime',
          minWidth: '85px',
          align: 'center'
        },
        {
          label: '发货数量',
          prop: 'deliveryNumber',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '不良品数量',
          prop: 'rejectsNumber',
          minWidth: '85px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '收货人',
          prop: 'receiptPeople',
          minWidth: '85px',
          align: 'center'
        },
        {
          label: '收货数量',
          prop: 'receiptNumber',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '收货时间',
          prop: 'receiptTime',
          minWidth: '85px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      statusList: []
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        if (to.params.id) {
          setTimeout(() => {
            this.detailShow('', to.params.id)
          }, 500)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getDictBiz()
    this.initialization()
  },
  methods: {
    detailShow(row, id) {
      this.$newTab({
        path: '/deliveryOrder/componentsDetail',
        title: '采购订单发货',
        component: componentsDetail,
        data: {
          id
        },
        callback: () => {},
        clearCache: true
      })
    },
    getDictBiz() {
      getDictBiz('pss_logistics_status').then(res => {
        if (res.code === 200) {
          const data = res.data
          this.statusList = data
        } else {
          this.$message.error('获取业务字典数据失败')
        }
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return paging(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    cancel() {
      this.isDetail = false
    },
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    reset() {
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.searchData = {}
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
  .block {
    text-align: right;
    margin: 10px 10px 0 0;
  }
  .btnBox{
    ::v-deep .el-form-item__content{
      margin-left: 20px!important;
    }
    .btn{
      width: 30%;
    }
  }
</style>
