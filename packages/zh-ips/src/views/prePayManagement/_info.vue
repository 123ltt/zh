<template>
  <!-- 预付款信息 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item label="采购方主体">
                <el-select v-model="formData.productAuthId" clearable placeholder="请选择" filterable style="width:100%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="purSquareId" label="采购方名称">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:100%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="supplierInfoId" label="供应商名称">
                <g-select v-model="formData.supplierInfoId" style="width:100%;" :items="warehouseList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="purCode" label="采购编码">
                <el-input v-model.trim="formData.purCode" clearable style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="outsideCode" label="第三方单号">
                <el-input v-model.trim="formData.outsideCode" clearable style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="applyCode" label="申请编码">
                <el-input v-model.trim="formData.applyCode" clearable style="width:100%" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item class="btnBox">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button icon="el-icon-delete" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="prepayMoneyCode" label="预付编码" width="100" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="propsData(row.id)">{{ row.prepayMoneyCode }}</g-link>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="prepayStatus" label="状态" width="60" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.prepayStatus == 'WaitAudit'">待审核</span>
          <span v-if="scope.row.prepayStatus == 'Rejected'">启用</span>
          <span v-if="scope.row.prepayStatus == 'WaitPay'">待支付</span>
          <span v-if="scope.row.prepayStatus == 'Delivered'">已支付</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="70">
        <template slot-scope="slot">
          <el-button type="text" @click="propsData(slot.row.id)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>
<script>
import infoDetail from './infoModal/infoDetail'
import { getList } from '@/api/advanceManagement/info'
import { purchaser, supplier, getOrg } from '@/api/commonApi'
export default {
  name: 'PurchasePrePayManagementInfo',
  data() {
    return {
      visible: false,
      visible2: false,
      formData: {
        applyCode: '',
        outsideCode: '',
        purCode: '',
        productAuthId: '',
        supplierInfoId: '',
        purSquareId: ''
      },
      orgList: [],
      productOwnerIdList: [],
      options: [],
      searchData: [],
      warehouseList: [],
      cascaderKey: 0,
      list: [
        { value: 0, label: '测试一' },
        { value: 1, label: '测试二' },
        { value: 2, label: '测试三' }
      ],
      purchaseList: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'prepayMoneyCode'
        },
        {
          label: '申请编码',
          prop: 'applyCode',
          width: '105px',
          align: 'center'
        },
        {
          label: '采购编码',
          prop: 'purCode',
          minWidth: '105px',
          align: 'center'
        },
        {
          label: '第三方单号',
          prop: 'outsideCode',
          width: '90px',
          align: 'center'
        },
        {
          label: '采购方名称',
          prop: 'purDemander.orgName',
          showOverflowTooltip: true,
          width: '90px',
          align: 'center'
        },
        {
          label: '供应商名称',
          prop: 'supplierInfo.supplierName',
          showOverflowTooltip: true,
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '采购金额',
          prop: 'purTotalMoney',
          width: '75px',
          align: 'center'
        },
        {
          label: '预付金额',
          prop: 'prepayTotalMoney',
          width: '75px',
          align: 'center'
        },
        {
          label: '币种',
          prop: 'purAccountCurrency.value',
          width: '60px',
          align: 'center'
        },
        {
          label: '预付款时间',
          prop: 'prepayTime',
          width: '135px',
          align: 'center'
        },
        {
          label: '退款金额',
          prop: 'returnedTotalMoney',
          width: '75px',
          align: 'center'
        },
        {
          label: '已核销金额',
          prop: 'verifiedTotalMoney',
          width: '85px',
          align: 'center'
        },
        {
          label: '待核销金额',
          prop: 'unverifyTotalMoney',
          width: '85px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'prepayStatus'
        },
        {
          label: '结清时间',
          prop: 'settledTime',
          width: '110px',
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
    this.getSearch()
  },
  methods: {
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
    getSearch() {
      purchaser().then(res => {
        this.purchaseList = res.data
      })
      supplier().then(res => {
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
    getTable() {
      this.$refs.controlDetail.getData()
    },
    propsData(id) {
      this.$newTab({
        path: '/info/infoDetail',
        title: '预付款信息详情',
        component: infoDetail,
        data: {
          id
        },
        callback: () => { },
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
      this.searchData = []
      this.cascaderKey = ++this.cascaderKey
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
