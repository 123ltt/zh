<template>
  <!-- 采购管理/采购到货 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="8">
              <el-form-item prop="logisticsCode" label="物流运单号">
                <el-input v-model.trim="formData.logisticsCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="purchaseCodelogisticsCode" label="采购编码">
                <el-input v-model.trim="formData.purchaseCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="receiptPeopleId" label="收件人">
                <g-select v-model="formData.receiptPeopleId" style="width:100%;" :items="userList" key-field="id" label-field="name" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="warehousingCode" label="入库编码">
                <el-input v-model.trim="formData.warehousingCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="lpId" label="物流商名称">
                <g-select v-model="formData.lpId" style="width:100%;" :items="logisticsProviderList" key-field="id" label-field="lpFullname" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="btnBox">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-delete" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="warehousingCode" label="入库编码" min-width="110" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-link color="primary" @click="getTable(row.id)">{{ row.warehousingCode }}</g-link>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="80">
        <template v-slot="slot">
          <el-button type="text" @click="getTable(slot.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import arrivalDetail from './arrivalModal/arrivalDetail'
import { getList, getUserList, logisticsProvider } from '@/api/ordermanagement/orderReceive'

export default {
  name: 'PurchaseOrderManagementArrival',
  data() {
    return {
      loading: false,
      visible: false,
      formData: {
        lpId: '',
        warehousingCode: '',
        receiptPeopleId: '',
        purchaseCode: '',
        logisticsCode: ''
      },
      searchData: [],
      userList: [],
      logisticsProviderList: [],
      headers: [
        {
          slot: true,
          slotName: 'warehousingCode'
        },
        {
          label: '物流运单号',
          prop: 'logisticsCode',
          showOverflowTooltip: true,
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '物流商名称',
          prop: 'lpName',
          showOverflowTooltip: true,
          width: '175px',
          align: 'center'
        },
        {
          label: '采购编码',
          prop: 'purchaseCode',
          showOverflowTooltip: true,
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '发货数量',
          prop: 'deliveryQty',
          width: '80px',
          align: 'center'
        },
        {
          label: '收货人',
          prop: 'receiptPeople',
          width: '85px',
          align: 'center'
        },
        {
          label: '收货数量',
          prop: 'receivingGoodsNumber',
          width: '75px',
          align: 'center'
        },
        {
          label: '不良品数量',
          prop: 'rejectsQty',
          width: '85px',
          align: 'center'
        },
        {
          label: '上架数量',
          prop: 'upFrameQty',
          width: '75px',
          align: 'center'
        },
        {
          label: '收货时间',
          prop: 'receivingGoodsTime',
          width: '135px',
          align: 'center'
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
    this.getDictionary()
  },
  methods: {
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总条数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    getDictionary() {
      getUserList().then(res => {
        const data = res.data
        this.userList = data.records
      })
      logisticsProvider().then(res => {
        this.logisticsProviderList = res.data
      })
    },
    getTable(id) {
      this.$newTab({
        path: '/purchaseReceive/arrivalDetail',
        title: '到货详情',
        component: arrivalDetail,
        data: {
          id
        },
        callback: bool => {
          if (bool) {
            this.initialization()
          }
        },
        clearCache: true
      })
    },
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.formData))
      this.initialization()
    },
    reset() {
      Object.keys(this.formData).forEach(item => {
        this.formData[item] = ''
      })
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
