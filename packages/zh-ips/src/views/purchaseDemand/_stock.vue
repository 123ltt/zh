<template>
  <!-- 采购需求/备货采购需求-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col v-if="!isSaas" :span="6">
              <el-form-item label="需求方货权">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:100%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="!isSaas" :span="6">
              <el-form-item label="需求方货主">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择需求方货权" filterable style="width:100%" :options="options" @change="getRqmtUserId" />
              </el-form-item>
            </el-col>
            <el-col v-else :span="6">
              <el-form-item prop="checkOrg" label="需求方货主">
                <el-cascader v-model="checkOrg" placeholder="请选择" style="width:100%" :options="checkOrgList" clearable collapse-tags filterable @change="getRqmtUserId" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="rqmtUserId" label="需求人">
                <g-select v-model="submit.rqmtUserId" :items="userList" key-field="id" label-field="name" value-field="id" style="width:100%" placeholder="请先选择需求方名称" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="destWarehouseId" label="目的仓库">
                <g-select v-model="submit.destWarehouseId" style="width:100%;" :items="warehouseList" key-field="id" label-field="warehouseName" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="rqmtCode" label="需求编码">
                <el-input v-model.trim="submit.rqmtCode" clearable placeholder="请填写" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="status" label="状态">
                <el-select v-model="submit.status" clearable placeholder="请选择" filterable style="width:100%">
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="addBtn()">新增</el-button>
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

      <!-- 编码跳转详情 -->
      <el-table-column v-if="!isSaas" slot="productAuthName" label="需求方货权" min-width="130" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <span>{{ row.productAuthName }}</span>
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
          <el-button v-if="scope.row.status == 0" type="text" @click="enableBtn(scope.row)">提交</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="addBtn(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="removeBtn(scope.row)">删除</el-button>
          <el-button v-if="scope.row.status == 1 && !isSaas" type="text" @click="auditBtn(scope.row)">审核</el-button>
          <el-button v-if="scope.row.status == 1 && isSaas" type="text" @click="detailBtn(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status == 2 ||scope.row.status == 3" type="text" @click="detailBtn(scope.row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, submit, remove } from '@/api/purchaseDemand/stock.js'
import { dictionary, getOrg, getUserListWithAuth, getAllEnableWarehouse, getOrgTree, getAllEnableSaas } from '@/api/commonApi.js'
import stockAdd from './components/stockAdd.vue'
import stockDetail from './components/stockDetail.vue'
import { isSaas } from '@/config/env.js'

export default {
  name: 'PurchasePurchaseDemandStock',
  data() {
    return {
      // 搜索参数
      submit: {
        demanderId: '',
        destWarehouseId: '',
        status: '',
        rqmtUserId: '',
        productAuthId: '',
        rqmtCode: '',
        // STOCK_UP；OWE_ORDER；REPLENISH
        rqmtType: 'STOCK_UP'
      },
      checkOrg: [],
      searchData: [],
      orgList: [],
      checkOrgList: [],
      productOwnerIdList: [],
      options: [],
      userList: [],
      demanderList: [],
      warehouseList: [],
      statusList: [],
      //   规则名称
      rulesName: [],
      //   规则类型
      rulesType: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'rqmtCode'
        },
        {
          slot: true,
          slotName: 'productAuthName'
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
          width: '130px',
          align: 'center'
        },
        {
          label: '期望到货时间',
          prop: 'expectArrivalTime',
          width: '130px',
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
      //   提示弹框的状态
      title: '',
      statusObj: {},
      isSaas: false,
      enable: {},
      // 新增编辑
      isAdd: false,
      editData: {},
      cascaderKey: 0,
      audit: false,
      openData: []
    }
  },
  mounted() {
    this.isSaas = isSaas
    this.getData()
    this.searchData = JSON.parse(JSON.stringify(this.submit))
    this.initialization()
  },
  methods: {
    // 获取数据
    getData() {
      dictionary('ips_rqmt_status').then(res => {
        const data = res.data
        this.statusList = data
        this.statusList.forEach(item => {
          this.statusObj[item.dictKey] = item.dictValue
        })
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      if (isSaas) {
        getOrgTree().then(res => {
          res.data.forEach(item => {
            if (item.category === '1') {
              if (item.hasChildren) {
                this.findChildren(item)
              }
            } else if (item.category === '2') {
              if (item.hasChildren) {
                this.findChildren(item)
              }
            }
          })
        })
        getAllEnableSaas().then(res => {
          this.warehouseList = res.data
        })
      } else {
        getOrg().then(res => {
          this.orgList = res.data
        })
        getAllEnableWarehouse().then(res => {
          this.warehouseList = res.data
        })
      }
    },
    findChildren(arr) {
      arr.children.forEach(ele => {
        if (!ele.hasChildren) {
          this.checkOrgList.push({
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
          this.checkOrgList.push({
            value: ele.id,
            label: ele.title,
            children: chidrenArr
          })
        }
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
      if (this.isSaas) {
        this.submit.demanderId = this.checkOrg.length ? this.checkOrg[this.checkOrg.length - 1] : ''
      } else {
        this.submit.demanderId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
      }
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      this.options = []
      this.checkOrg = []
      this.userList = []
      this.cascaderKey = ++this.cascaderKey
      this.productOwnerIdList = []
      Object.keys(this.submit).forEach(item => {
        if (item !== 'rqmtType') {
          this.submit[item] = ''
        }
      })
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
        this.editData = JSON.parse(JSON.stringify(val))
      } else {
        this.isAdd = true
      }
      this.$newTab({
        path: '/ips/stock/add',
        title: (this.isAdd ? '新增备货采购需求' : '编辑备货采购需求'),
        component: stockAdd,
        data: {
          isAdd: this.isAdd,
          editData: this.editData,
          warehouseList: this.warehouseList
        },
        clearCache: true,
        callback: (bool) => {
          if (bool) {
            this.isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },
    // 信息确认
    confirm(title, obj, fn) {
      this.$confirm(`确定要${title}该条记录吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fn(obj).then(() => {
          this.initialization()
          this.$message.success('操作成功!')
        })
      })
    },
    // 提交
    enableBtn(val1, val2) {
      this.enable = JSON.parse(JSON.stringify(val1))
      this.confirm('提交', this.enable, submit)
    },
    // 删除
    removeBtn(val1, val2) {
      this.enable = JSON.parse(JSON.stringify(val1))
      this.confirm('删除', this.enable.id, remove)
    },
    // 审核
    auditBtn(val) {
      this.audit = true
      this.openData = JSON.parse(JSON.stringify(val))
      this.$newTab({
        title: '备货采购需求审核',
        path: '/ips/stock/audit',
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
        path: '/ips/stock/detail',
        title: '备货采购需求详情',
        component: stockDetail,
        data: {
          audit: this.audit,
          isSaas: this.isSaas,
          openData: this.openData
        },
        clearCache: true,
        callback: () => {}
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
            margin-left: 30px!important;
        }
    }
}

</style>
