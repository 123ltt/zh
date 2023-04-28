<template>
  <!-- 应付管理/采购应付-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item label="采购方主体">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:100%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="purDemanderId" label="采购方名称">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:100%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="supplierInfoId" label="供应商名称">
                <g-select v-model="submit.supplierInfoId" style="width:100%;" :items="warehouseList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="purCode" label="采购编码">
                <el-input v-model.trim="submit.purCode" clearable placeholder="请填写" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="shouldCode" label="应付编码">
                <el-input v-model.trim="submit.shouldCode" clearable placeholder="请填写" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="shouldPayStatus" label="状态">
                <el-select v-model="submit.shouldPayStatus" clearable placeholder="请选择" filterable style="width:100%">
                  <el-option v-for="(item,index1) in statusList" :key="index1" :label="item.dictValue" :value="item.dictKey" />
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
      <el-table-column slot="shouldCode" label="应付编码" width="100" align="center">
        <template v-slot="scope">
          <span v-if="scope.row.shouldPayStatus == '待支付'">{{ scope.row.shouldCode }}</span>
          <g-link v-if="scope.row.shouldPayStatus != '待支付'&&(scope.row.accountPeriod.settleAccountStartTime)" color="primary" @click="detailBtn(scope.row,'payment')">{{ scope.row.shouldCode }}</g-link>
          <g-link v-if="scope.row.shouldPayStatus != '待支付'&&(!scope.row.accountPeriod.settleAccountStartTime)" color="primary" @click="detailBtn(scope.row,'single')">{{ scope.row.shouldCode }}</g-link>
        </template>
      </el-table-column>

      <!-- 应付账期 -->
      <el-table-column slot="accountPeriodTime" label="应付账期" align="center" min-width="95">
        <template v-slot="scope">
          <span v-if="scope.row.accountPeriod.startTime">{{ scope.row.accountPeriod.startTime }} ~ {{ scope.row.accountPeriod.endTime }} </span>
        </template>
      </el-table-column>

      <!-- 付款周期 -->
      <el-table-column slot="accountPeriod" label="付款周期" align="center" min-width="95">
        <template v-slot="scope">
          <span v-if="scope.row.accountPeriod.settleAccountStartTime">{{ scope.row.accountPeriod.settleAccountStartTime }} ~ {{ scope.row.accountPeriod.settleAccountEndTime }} </span>
        </template>
      </el-table-column>

      <!-- 采购方名称 -->
      <el-table-column slot="orgName" label="采购方名称" align="center" min-width="130" show-overflow-tooltip>
        <template v-slot="scope">
          <span>{{ scope.row.purDemander.orgName }}</span>
        </template>
      </el-table-column>

      <!-- 供应商名称 -->
      <el-table-column slot="supplierName" label="供应商名称" align="center" min-width="130" show-overflow-tooltip>
        <template v-slot="scope">
          <span>{{ scope.row.supplierInfo.supplierName }}</span>
        </template>
      </el-table-column>

      <!-- 币种名称 -->
      <el-table-column slot="rqmtTotalQty" label="币种" align="center" min-width="70">
        <template v-slot="scope">
          <span>{{ scope.row.supplierInfo.rqmtTotalQty?scope.row.supplierInfo.rqmtTotalQty:'RMB' }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" width="100">
        <template v-slot="scope">
          <el-button v-if="scope.row.shouldPayStatus != '已支付'" type="text" @click="addBtn(scope.row)">请款</el-button>
          <el-button v-if="scope.row.shouldPayStatus != '待支付'&&(!scope.row.accountPeriod.settleAccountStartTime)" type="text" @click="detailBtn(scope.row,'single')">详情</el-button>
          <el-button v-if="scope.row.shouldPayStatus != '待支付'&&(scope.row.accountPeriod.settleAccountStartTime)" type="text" @click="detailBtn(scope.row,'payment')">详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, getDemander, getSupplierInfo } from '@/api/payableManagement/payableManagement.js'
import { dictionary, getOrg } from '@/api/commonApi.js'
import purchasePayableCase from './components/purchasePayableCase.vue'
import purchasePayableDetail from './components/purchasePayableDetail.vue'
export default {
  name: 'PurchasePayableManagementPurchasePayable',
  data() {
    return {
      // 搜索参数
      submit: {
        purCode: '',
        shouldCode: '',
        shouldPayStatus: '',
        supplierInfoId: '',
        productAuthId: '',
        purDemanderId: ''
      },
      orgList: [],
      productOwnerIdList: [],
      options: [],
      demanderList: [],
      cascaderKey: 0,
      warehouseList: [],
      statusList: [],
      //   规则名称
      rulesName: [],
      //   规则类型
      rulesType: [],
      searchData: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'shouldCode'
        },
        {
          label: '采购编码',
          prop: 'purCode',
          width: '110px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'accountPeriodTime'
        },
        {
          slot: true,
          slotName: 'accountPeriod'
        },
        {
          slot: true,
          slotName: 'shouldCode'
        },
        {
          slot: true,
          slotName: 'orgName'
        },
        {
          slot: true,
          slotName: 'supplierName'
        },
        {
          label: '采购金额',
          prop: 'purTotalMoney',
          width: '80px',
          align: 'center'
        },
        {
          label: '预付金额',
          prop: 'prepayTotalMoney',
          width: '80px',
          align: 'center'
        },
        {
          label: '退款金额',
          prop: 'returnedTotalMoney',
          width: '80px',
          align: 'center'
        },
        {
          label: '应付金额',
          prop: 'shouldPayTotalMoney',
          width: '80px',
          align: 'center'
        },
        {
          label: '已请款金额',
          prop: 'requiredTotalMoney',
          width: '90px',
          align: 'center'
        },
        {
          label: '待付金额',
          prop: 'unRequiredTotalMoney',
          width: '80px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'rqmtTotalQty'
        },
        {
          label: '收款人',
          prop: 'destWarehouse',
          width: '110px',
          align: 'center'
        },
        {
          label: '状态',
          prop: 'shouldPayStatus',
          width: '110px',
          align: 'center'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: '135px',
          align: 'center'
        },
        {
          label: '最后修改时间',
          prop: 'updateTime',
          width: '135px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      openData: {}
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
      dictionary('ips_should_pay_status').then(res => {
        const data = res.data
        this.statusList = data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      getDemander().then(res => {
        const data = res.data.records
        this.demanderList = data
      })
      getSupplierInfo().then(res => {
        this.warehouseList = res.data
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
    // 初始化数据
    fetch({ current, size }, params) {
      params.append('current', current)
      params.append('size', size)
      return getList(params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      const formData = new FormData()
      for (var i in this.searchData) {
        if (this.searchData[i]) {
          formData.append(i, this.searchData[i])
        }
      }
      this.$refs.table.load(1, formData)
    },
    search() {
      this.submit.purDemanderId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      this.options = []
      this.productOwnerIdList = []
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.cascaderKey = ++this.cascaderKey
      this.initialization()
    },
    addBtn(val) {
      this.openData = JSON.parse(JSON.stringify(val))
      this.$modal({
        title: '采购应付请款',
        component: purchasePayableCase,
        data: {
          openData: this.openData
        },
        callback: (bool) => {
          if (bool) {
            this.initialization()
          }
        }
      })
    },
    // 详情
    detailBtn(val1, val2) {
      var str = ''
      var pathName = ''
      this.detailData = JSON.parse(JSON.stringify(val1))
      if (val2 === 'payment') {
        this.single = false
        str = '采购应付详情(账期)'
        pathName = '/ips/purchasePayable/paymentDetail'
      } else if (val2 === 'single') {
        this.single = true
        str = '采购应付详情(单次)'
        pathName = '/ips/purchasePayable/singleDetail'
      }
      this.$newTab({
        path: pathName,
        title: str,
        component: purchasePayableDetail,
        data: {
          single: this.single,
          detailData: this.detailData
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
            margin-left: 20px!important;
        }
    }
}
</style>
