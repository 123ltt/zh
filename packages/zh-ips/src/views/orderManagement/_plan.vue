<template>
  <!-- 采购管理/采购计划 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="8">
              <el-form-item label="采购方主体">
                <el-select v-model="formData.productAuthId" clearable placeholder="请选择" filterable style="width:100%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="purSquareId" label="采购方名称">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:100%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="destWarehouseId" label="目的仓库">
                <g-select v-model="formData.destWarehouseId" style="width:100%;" :items="warehouseList" key-field="id" label-field="warehouseName" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="formData.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="inqueryCode" label="询价编码">
                <el-input v-model.trim="formData.inqueryCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="rqmtCode" label="需求编码">
                <el-input v-model.trim="formData.rqmtCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="planCode" label="计划编码">
                <el-input v-model.trim="formData.planCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="status" label="状态">
                <el-select v-model="formData.status" clearable style="width:100%">
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
      <el-table-column slot="planCode" label="计划编码" min-width="120" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-link v-if="row.status==3" color="primary" @click="propsData(row,row.id)">{{ row.planCode }}</g-link>
          <span v-else>{{ row.planCode }}</span>
        </template>
      </el-table-column>

      <!-- 采购本/海/开发 -->
      <el-table-column slot="purchaser" label="采购本/海/开发" min-width="150" align="center">
        <template v-slot="{row}">
          <span>{{ row.localPurchaserName?row.localPurchaserName:'无' }}/{{ row.overseaPurchaserName?row.overseaPurchaserName:'无' }}/{{ row.developerName?row.developerName:'无' }}</span>
        </template>
      </el-table-column>

      <!-- 采购数量 -->
      <el-table-column slot="purchaseQty" label="采购数量" align="center" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.purchaseQty===-1?'':scope.row.purchaseQty }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" align="center" min-width="100">
        <template v-slot="slot">
          <span>{{ ['待采购','部分已采购','已采购'][slot.row.status-1]||'' }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" align="center" min-width="90" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status===1 || scope.row.status===2?true:false" type="text" @click="propsAdd(scope.row)">采购</el-button>
          <el-button v-if="scope.row.status===3?true:false" type="text" @click="propsData(scope.row,scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
      <!-- 计划金额 -->
      <el-table-column slot="purAccountCurrency" label="币种" align="center" min-width="60">
        <template slot-scope="scope">
          <span>{{ currencyObj[scope.row.purAccountCurrency] }}</span>
        </template>
      </el-table-column>

    </g-table>
  </basic-container>
</template>
<script>
import planDetail from './planModal/planDetail'
import planAdd from './planModal/planAdd'
import { getList } from '@/api/ordermanagement/orderPlan'
import { getAllEnableWarehouse, supplier, purchaser, getOrg, dictionary } from '@/api/commonApi'

export default {
  name: 'PurchaseOrderManagementPlan',
  data() {
    return {
      loading: false,
      visible: false,
      isDetail: false,
      isAdd: false,
      formData: {
        status: '',
        planCode: '',
        rqmtCode: '',
        inqueryCode: '',
        supplierId: '',
        productAuthId: '',
        destWarehouseId: '',
        purSquareId: ''
      },
      cascaderKey: 0,
      orgList: [],
      productOwnerIdList: [],
      options: [],
      searchData: [],
      statusList: [],
      currencyObj: {},
      tableData: [],
      warehouseList: [],
      purchaseList: [],
      supplierList: [],
      headers: [
        {
          slot: true,
          slotName: 'planCode'
        },
        {
          label: '需求编码',
          prop: 'rqmtCode',
          minWidth: '120px',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          label: '采购方名称',
          prop: 'demander',
          showOverflowTooltip: true,
          minWidth: '120px',
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
          label: '等级',
          prop: 'supplierLevel',
          minWidth: '70px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'purchaser'
        },
        {
          label: '目的仓库',
          prop: 'destWarehouse',
          showOverflowTooltip: true,
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '计划数量',
          prop: 'planQty',
          minWidth: '80px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'purAccountCurrency'
        },
        {
          slot: true,
          slotName: 'purchaseQty'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '创建人',
          prop: 'createUserName',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '最后修改时间',
          prop: 'updateTime',
          minWidth: '150px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ]
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        if (to.params.boolean) this.propsData()
      },
      immediate: true
    }
  },
  mounted() {
    this.getSearch()
    this.initialization()
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
      purchaser().then(res => {
        this.purchaseList = res.data
      })
      dictionary('ips_plan_status').then(res => {
        this.statusList = res.data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      dictionary('ips_account_currency').then(res => {
        res.data.forEach(item => {
          this.currencyObj[item.dictKey] = item.dictValue
        })
      })
      supplier().then(res => {
        this.supplierList = res.data
      })
      getOrg().then(res => {
        this.orgList = res.data
      })
    },
    getproductOwner(val) {
      this.productOwnerIdList = []
      this.cascaderKey = ++this.cascaderKey
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
    propsData(row, id) {
      this.$newTab({
        path: '/purchasePlan/planDetail',
        title: '计划订单详情',
        component: planDetail,
        data: {
          id
        },
        callback: () => {},
        clearCache: true
      })
    },
    propsAdd(row) {
      this.$newTab({
        path: '/purchasePlan/planAdd',
        title: '新增采购订单',
        component: planAdd,
        data: {
          purData: row,
          warehouseList: this.warehouseList
        },
        callback: (bool) => {
          if (bool) {
            this.initialization()
          }
        },
        clearCache: true
      })
    },
    search() {
      this.formData.purSquareId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
      this.searchData = JSON.parse(JSON.stringify(this.formData))
      this.initialization()
    },
    reset() {
      Object.keys(this.formData).forEach(item => {
        this.formData[item] = ''
      })
      this.options = []
      this.productOwnerIdList = []
      this.searchData = {}
      this.cascaderKey = ++this.cascaderKey
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
.block {
  text-align: right;
  margin: 10px 10px 0 0;
}
.btnBox{
        ::v-deep .el-form-item__content{
            margin-left: 20px!important;
        }
    }
</style>
