<template>
  <!-- 采购管理/采购询价 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="rqmtCode" label="需求编码" style="width:100%">
                <el-input v-model.trim="formData.rqmtCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="需求方货权">
                <el-select v-model="formData.productAuthId" clearable placeholder="请选择" filterable style="width:100%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="需求方货主">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择需求方货权" filterable style="width:100%" :options="options" @change="getRqmtUserId" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="rqmtUserId" label="需求人">
                <g-select v-model="formData.rqmtUserId" :items="userList" placeholder="请先选择需求方名称" key-field="id" label-field="name" value-field="id" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="inqueryCode" label="询价编码">
                <el-input v-model.trim="formData.inqueryCode" clearable style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="destWarehouseId" label="目的仓库">
                <g-select v-model="formData.destWarehouseId" style="width:100%;" :items="warehouseList" key-field="id" label-field="warehouseName" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="status" label="状态">
                <el-select v-model="formData.status" clearable style="width:100%">
                  <el-option v-for="item in statusList" :key="item.dictKey" :value="item.dictKey" :label="item.dictValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="btnBox">
              <el-form-item class="btnBox" style="text-align:right;">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button icon="el-icon-delete" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="inqueryCode" label="询价编码" min-width="120" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-link v-if="row.status==3" color="primary" @click="propsDetail(row,row.id)">{{ row.inqueryCode }}</g-link>
          <span v-else>{{ row.inqueryCode }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" align="center" min-width="90">
        <template v-slot="slot">
          <span>{{ ['待询价','询价中','已询价','待调整','待审核'][slot.row.status-1]||'' }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" align="center" min-width="90" fixed="right">
        <template v-slot="scope">
          <el-button v-if="scope.row.status===1||scope.row.status===2" type="text" @click="propsProcess(scope.row,scope.row.id)">处理</el-button>
          <el-button v-if="scope.row.status===4" type="text" @click="propsProcess(scope.row,scope.row.id)">调整</el-button>
          <el-button v-if="scope.row.status===5" type="text" @click="propsCheckExamine(scope.row,scope.row.id)">审核</el-button>
          <el-button v-if="scope.row.status===3" type="text" @click="propsDetail(scope.row,scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import inquiryDetail from './purchaseInquiryModal/inquiryDetail.vue'
import inquiryProcess from './purchaseInquiryModal/inquiryProcess'
import checkExamine from './purchaseInquiryModal/checkExamine.vue'
/** 采购询价接口引入 */
import { getList } from '@/api/ordermanagement/chaseInquiry'
import { getAllEnableWarehouse, getUserListWithAuth, dictionary, getOrg } from '@/api/commonApi'
export default {
  name: 'PurchaseOrderManagementPurchaseInquiry',
  data() {
    return {
      visible: false,
      formData: {
        status: '',
        destWarehouseId: '',
        productAuthId: '',
        inqueryCode: '',
        rqmtUserId: '',
        demanderId: '',
        rqmtCode: ''
      },
      searchData: [],
      statusList: [],
      warehouseList: [],
      orgList: [],
      productOwnerIdList: [],
      options: [],
      userList: [],
      cascaderKey: 0,
      manageModelList: [],
      headers: [
        {
          slot: true,
          slotName: 'inqueryCode'
        },
        {
          label: '需求编码',
          prop: 'rqmtCode',
          minWidth: '130px',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          label: '需求方货主',
          prop: 'demander',
          showOverflowTooltip: true,
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '需求人',
          prop: 'rqmtUserName',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '需求数量',
          prop: 'purchaseQty',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '目的仓库',
          prop: 'destWarehouse',
          showOverflowTooltip: true,
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '创建人',
          prop: 'createUserName',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          minWidth: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
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
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    getSearch() {
      getAllEnableWarehouse().then(res => {
        this.warehouseList = res.data
      })
      dictionary('ips_inquiry_status').then(res => {
        this.statusList = res.data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      dictionary('ips_manage_model').then(res => {
        this.manageModelList = res.data
      })
      getOrg().then(res => {
        this.orgList = res.data
      })
    },
    getproductOwner(val) {
      this.formData.rqmtUserId = ''
      this.userList = []
      this.productOwnerIdList = []
      this.options = []
      this.cascaderKey = ++this.cascaderKey
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
    getRqmtUserId(val) {
      this.formData.rqmtUserId = ''
      this.userList = []
      if (val.length) {
        getUserListWithAuth(val[val.length - 1]).then(res => {
          this.userList = res.data.records
        })
      }
    },
    getTable() {
      this.$refs.controlDetail.getData()
    },
    propsData() { // 主详情页展示
      this.visible = true
    },
    propsProcess(row, id) { // 处理页面展示
      this.$newTab({
        path: '/chanseInquiry/inquiryProcess',
        title: '采购询价处理',
        component: inquiryProcess,
        data: {
          manageModelList: this.manageModelList,
          rows: row,
          id
        }, // 在 foo.vue组件中的 `props` 可得到`name`
        clearCache: true,
        callback: (bool) => {
          if (bool) {
            this.initialization()
          }
        }
      })
    },
    propsCheckExamine(rows, id) { // 审核页面展示
      this.$newTab({
        path: '/chanseInquiry/checkExamine',
        title: '采购询价审核',
        component: checkExamine,
        data: {
          manageModelList: this.manageModelList,
          rows,
          id
        }, // 在 foo.vue组件中的 `props` 可得到`name`
        clearCache: true,
        callback: (bool) => {
          if (bool) {
            this.initialization()
          }
        }
      })
    },
    propsDetail(detail, id) { // 询价详情展示
      this.$newTab({
        path: '/chanseInquiry/inquiryDetail',
        title: '采购询价详情',
        component: inquiryDetail,
        data: {
          manageModelList: this.manageModelList,
          detail,
          id
        }, // 在 foo.vue组件中的 `props` 可得到`name`
        clearCache: true,
        callback: (bool) => {
          if (bool) {
            this.initialization()
          }
        }
      })
    },
    cancel() {
      this.visible = false
    },
    search() {
      this.formData.demanderId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
      this.searchData = JSON.parse(JSON.stringify(this.formData))
      this.initialization()
    },
    reset() {
      Object.keys(this.formData).forEach(item => {
        this.formData[item] = ''
      })
      this.options = []
      this.productOwnerIdList = []
      this.cascaderKey = ++this.cascaderKey
      this.userList = []
      this.searchData = []
      this.initialization()
    }
  }
}
</script>
<style lang="scss" scoped>
.searchBox {
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
.btnBox{
  ::v-deep .el-form-item__content{
     margin-left: 0px!important;
  }
}
</style>
