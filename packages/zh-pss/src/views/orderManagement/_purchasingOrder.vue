<template>
  <basic-container>
    <!-- 采购订单 -->
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini" class="searchBox">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="submit.supplierId" style="width:80%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购方主体">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购方名称">
                <el-cascader v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="purchaseCode" label="采购编码">
                <el-input v-model="submit.purchaseCode" placeholder="请输入" clearable style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="status" label="状态">
                <el-select ref="input" v-model="submit.status" clearable placeholder="请选择" filterable style="width:80%">
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
      <el-table-column slot="purchaseCode" label="采购编码" min-width="105" align="center">
        <template slot-scope="slot">
          <g-link @click="detail(slot.row,slot.row.id)">{{ slot.row.purchaseCode }}</g-link>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" align="center" min-width="90">
        <template slot-scope="getStatus">
          <div v-for="item in statusList" :key="item.dictKey">
            <span v-if="getStatus.row.status == item.dictKey">{{ item.dictValue }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="120">
        <template slot-scope="slot">
          <el-button v-if="slot.row.status===1" type="text" @click="process(slot.row,slot.row.id)">处理</el-button>
          <el-button v-if="slot.row.status===3 || (slot.row.status===6 && slot.row.showSuggestion===1)" type="text" @click="delivery(slot.row,slot.row.purchaseCode)">发货</el-button>
          <el-button type="text" @click="detail(slot.row,slot.row.id)">详情</el-button>
          <!-- 状态: 1.采购待处理 2.采购确认中 3.采购待发货 4.待收货 5.已签收 6.部分已收货 7.已收货 8.全部已退货 -->
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>

import orderDetail from './components/purchasingOrder/orderDetail.vue'
import orderProcess from './components/purchasingOrder/orderProcess.vue'
import orderDelivery from './components/purchasingOrder/orderDelivery.vue'
import { paging, supplier } from '@/api/orderManagement/purchasingOrder'
import { getMyDictBiz, getOrg } from '@/api/commonApi/common.js'
export default {
  name: 'SupplierOrderManagementPurchasingOrder',
  data() {
    return {
      supplierList: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'purchaseCode'
        },
        {
          label: '采购方名称',
          prop: 'purchaseSquareName',
          showOverflowTooltip: true,
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '供应商名称',
          prop: 'supplierName',
          showOverflowTooltip: true,
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '中转仓库',
          prop: 'transitWarehouseName',
          showOverflowTooltip: true,
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '目的仓库',
          prop: 'destWarehouseName',
          showOverflowTooltip: true,
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '平台单号',
          prop: 'platformCode',
          showOverflowTooltip: true,
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '采购人',
          prop: 'purchasePeople',
          minWidth: '95px',
          align: 'center'
        },
        {
          label: '采购数量',
          prop: 'purchaseNumber',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '采购时间',
          prop: 'purchaseTime',
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '期望到货时间',
          prop: 'expectArrivalTime',
          minWidth: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '操作人',
          prop: 'updateUserName',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '操作时间',
          prop: 'updateTime',
          minWidth: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      orgList: [],
      options: [],
      productOwnerIdList: [],
      submit: {
        purchaseSquareId: '',
        supplierId: '',
        purchaseCode: '',
        productAuthId: '',
        status: ''
      },
      statusList: [],
      searchData: {}
    }
  },
  created() {
    this.getSuppliers()
  },
  mounted() {
    this.initialization()
  },
  methods: {
    getSuppliers() { // 获取供应商
      supplier().then(res => {
        if (res.code === 200) {
          this.supplierList = res.data
        }
      })
      getMyDictBiz('pss_purchase_order_status').then(res => {
        if (res.code === 200) {
          const data = res.data
          this.statusList = data
        } else {
          this.$message.error('获取业务字典数据失败')
        }
      })
      getOrg().then(res => {
        this.orgList = res.data
      })
    },
    getproductOwner(val) {
      this.productOwnerIdList = []
      this.options = []
      if (val) {
        const orgArr = this.orgList.filter(ele => ele.tenantId === val)[0].orgTreeNodeList
        orgArr.forEach(item => {
          if (item.hasChildren) {
            item.children.forEach(ele => {
              if (!ele.hasChildren) {
                this.options.push({
                  value: ele.id,
                  label: ele.title,
                  disabled: true
                })
              } else {
                const chidrenArr = []
                ele.children.forEach(e => {
                  chidrenArr.push({
                    value: e.id,
                    label: e.title
                  })
                })
                this.options.push({
                  value: ele.id,
                  label: ele.title,
                  children: chidrenArr
                })
              }
            })
          }
        })
      }
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
    search() {
      this.submit.purchaseSquareId = this.productOwnerIdList.length ? this.productOwnerIdList[1] : ''
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    process(row, id) {
      this.$newTab({
        path: '/pss/orderManagement/orderProcess',
        title: '采购处理',
        component: orderProcess,
        data: {
          id
        },
        callback: bool => {
          if (bool) {
            this.reset()
          }
        },
        clearCache: true
      })
    },

    delivery(row, purchaseCode) {
      this.$newTab({
        path: '/pss/orderManagement/orderDelivery',
        title: '采购订单发货',
        component: orderDelivery,
        data: {
          purchaseCode
        },
        callback: bool => {
          if (bool) {
            this.reset()
          }
        },
        clearCache: true
      })
    },

    detail(row, id) {
      this.$newTab({
        path: '/pss/orderManagement/orderDetail',
        title: '采购订单详情',
        component: orderDetail,
        data: {
          id
        },
        clearCache: true,
        callback: () => {}
      })
    },
    reset() { // 重置方法
      this.submit.purchaseSquareId = ''
      this.submit.supplierId = ''
      this.submit.purchaseCode = ''
      this.submit.productAuthId = ''
      this.submit.status = ''
      this.options = []
      this.productOwnerIdList = []
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
