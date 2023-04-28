<template>
  <!-- 采购需求/补货采购需求-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item label="需求方货权">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:100%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="需求方货主">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:100%" :options="options" @change="getRqmtUserId" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="rqmtUserId" label="需求人">
                <g-select v-model="submit.rqmtUserId" :items="userList" key-field="id" label-field="name" value-field="id" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="destWarehouseId" label="目的仓库">
                <g-select v-model="submit.destWarehouseId" :items="warehouseList" key-field="id" label-field="warehouseName" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="rqmtCode" label="需求编码">
                <el-input v-model.trim="submit.rqmtCode" clearable placeholder="请填写" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="status" label="状态">
                <el-select v-model="submit.status" clearable placeholder="请选择" filterable>
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="rqmtCode" label="需求编码" min-width="110" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-link v-if="row.status == 2 ||row.status == 3" color="primary" @click="detailBtn(row)">{{ row.rqmtCode }}</g-link>
          <span v-else>{{ row.rqmtCode }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" width="65" align="center">
        <template v-slot="scope">
          <span>{{ statusObj[scope.row.status] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template v-slot="scope">
          <el-button v-if="scope.row.status == 1" type="text" @click="auditBtn(scope.row)">审核</el-button>
          <el-button v-if="scope.row.status == 2 ||scope.row.status == 3" type="text" @click="detailBtn(scope.row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList } from '@/api/purchaseDemand/stock.js'
import { dictionary, getAllEnableWarehouse, getOrg, getUserListWithAuth } from '@/api/commonApi.js'
import stockDetail from './components/stockDetail.vue'
export default {
  name: 'PurchasePurchaseDemandStock',
  data() {
    return {
      // 搜索参数
      submit: {
        demanderId: '',
        destWarehouseId: '',
        status: '',
        productAuthId: '',
        rqmtUserId: '',
        rqmtCode: '',
        // STOCK_UP；OWE_ORDER；REPLENISH
        rqmtType: 'REPLENISH'
      },
      searchData: [],
      warehouseList: [],
      orgList: [],
      statusList: [],
      productOwnerIdList: [],
      options: [],
      userList: [],
      //   规则名称
      rulesName: [],
      //   规则类型
      rulesType: [],
      statusObj: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'rqmtCode'
        },
        {
          label: '需求方货主',
          prop: 'demander',
          minWidth: '160px',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          label: '需求人',
          prop: 'rqmtUserName',
          width: '110px',
          align: 'center'
        },
        {
          label: '需求数量',
          prop: 'rqmtTotalQty',
          width: '80px',
          align: 'center'
        },
        {
          label: '目的仓库',
          prop: 'destWarehouse',
          showOverflowTooltip: true,
          width: '150px',
          align: 'center'
        },
        {
          label: '需求时间',
          prop: 'createTime',
          width: '160px',
          align: 'center'
        },
        {
          label: '期望到货时间',
          prop: 'expectArrivalTime',
          width: '160px',
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
      ],
      // 新增编辑
      isAdd: false,
      cascaderKey: 0,
      editData: {},
      audit: false,
      openData: []
    }
  },
  mounted() {
    this.getData()
    this.searchData = JSON.parse(JSON.stringify(this.submit))
    this.initialization()
  },
  methods: {
    // 获取数据
    getData() {
      dictionary('ips_replenish_status').then(res => {
        const data = res.data
        this.statusList = data
        this.statusList.forEach(item => {
          this.statusObj[item.dictKey] = item.dictValue
        })
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      getAllEnableWarehouse().then(res => {
        this.warehouseList = res.data
      })
      getOrg().then(res => {
        this.orgList = res.data
      })
    },
    getproductOwner(val) {
      this.productOwnerIdList = []
      this.options = []
      this.cascaderKey = ++this.cascaderKey
      this.submit.rqmtUserId = ''
      this.userList = []
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
      this.submit.rqmtUserId = ''
      this.userList = []
      if (val.length) {
        getUserListWithAuth(val[val.length - 1]).then(res => {
          this.userList = res.data.records
        })
      }
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
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
      this.submit.demanderId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      this.options = []
      this.cascaderKey = ++this.cascaderKey
      this.productOwnerIdList = []
      this.userList = []
      Object.keys(this.submit).forEach(item => {
        if (item !== 'rqmtType') {
          this.submit[item] = ''
        }
      })
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    // 审核
    auditBtn(val) {
      this.audit = true
      this.openData = JSON.parse(JSON.stringify(val))
      this.$newTab({
        title: '审核补货采购需求',
        component: stockDetail,
        data: {
          audit: this.audit,
          openData: this.openData
        },
        clearCache: true,
        callback: (bool) => {
          if (bool) {
            this.initialization()
          }
        }
      })
    },
    // 详情
    detailBtn(val) {
      this.audit = false
      this.openData = JSON.parse(JSON.stringify(val))
      this.$newTab({
        path: '/ips/replenish/detail',
        title: '补货采购需求详情',
        component: stockDetail,
        data: {
          audit: this.audit,
          openData: this.openData
        },
        clearCache: true,
        callback: (bool) => {
          if (bool) {
            this.initialization()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog--center .el-dialog__body{
    padding: 0;
}
.searchBox{
    ::v-deep .el-form-item{
        margin-bottom: 0;
    }
    .btnBox{
        ::v-deep .el-form-item__content{
            margin-left: 20px!important;
        }
    }
}

</style>
