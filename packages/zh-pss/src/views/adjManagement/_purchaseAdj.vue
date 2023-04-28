<template>
  <!-- 采购调整-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="8">
              <el-form-item label="采购方主体">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:100%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="demandSideId" label="采购方名称">
                <el-cascader v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:100%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <span slot="label">供货方名称</span>
                <g-select v-model="submit.supplierId" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <span slot="label">采购编码</span>
                <el-input v-model="submit.purchaseCode" placeholder="请填写" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="status" label="状态">
                <el-select ref="input" v-model="submit.status" clearable placeholder="请选择" filterable>
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button class="btn" type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button class="btn" icon="el-icon-delete" @click="reset()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="purchaseAdjustmentCode" label="调整编码" min-width="110" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" @click="detailBtn(row)">{{ row.purchaseAdjustmentCode }}</g-link>
          <span v-else>{{ row.purchaseAdjustmentCode }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="60" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">待确认</span>
          <span v-if="scope.row.status == 2">已同意</span>
          <span v-if="scope.row.status == 3">已驳回</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="text" size="small" @click="addBox(scope.row)">处理</el-button>
          <el-button v-if="scope.row.status != 0" type="text" size="small" @click="detailBtn(scope.row)">详情
          </el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import {
  getList
} from '@/api/adjManagement/purchaseAdj.js'
import adjOrderHandle from './components/adjOrderHandle.vue'
import adjOrderDetails from './components/adjOrderDetails.vue'
import { getDictBiz, supplier, getOrg } from '@/api/commonApi/common.js'
export default {
  name: 'SupplierAdjManagementPurchaseAdj',
  data() {
    return {
      // 搜索参数
      submit: {
        demandSideId: '',
        purchaseCode: '',
        supplierId: '',
        productAuthId: '',
        status: ''
      },
      //   状态
      statusList: [],
      orgList: [],
      supplierList: [],
      productOwnerIdList: [],
      options: [],
      searchData: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'purchaseAdjustmentCode'
        },
        {
          label: '采购编码',
          prop: 'purchaseCode',
          minWidth: '105px',
          align: 'center'
        },
        {
          label: '采购方名称',
          prop: 'demandSideName',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '供货方名称',
          prop: 'supplierName',
          showOverflowTooltip: true,
          minWidth: '170px',
          align: 'center'
        },
        {
          label: '调整人',
          prop: 'moderator',
          minWidth: '85px',
          align: 'center'
        },
        {
          label: '调整前数量',
          prop: 'adjustFrontQty',
          minWidth: '85px',
          align: 'center'
        },
        {
          label: '调整数量',
          prop: 'adjustQty',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '调整后数量',
          prop: 'adjustAfterQty',
          minWidth: '85px',
          align: 'center'
        },
        {
          label: '调整时间',
          prop: 'adjustTime',
          width: '150px',
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
      id: '',
      isAdd: false,
      title: '',
      enable: {},
      information: '',
      addData: {
        name: '',
        type: '',
        score: '',
        description: ''
      },
      openData: '',
      //   详情
      detailData: '',
      isDetail: false,
      tableMaxHeight: 'auto'
    }
  },
  mounted() {
    this.initialization()
    this.getStatus()
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
    search() {
      this.submit.demandSideId = this.productOwnerIdList.length ? this.productOwnerIdList[1] : ''
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.options = []
      this.productOwnerIdList = []
      this.searchData = {}
      this.initialization()
    },
    getStatus() {
      getDictBiz('pss_purchase_adjust_status').then(res => {
        this.statusList = res.data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      getOrg().then(res => {
        this.orgList = res.data
      })
      supplier().then(res => {
        this.supplierList = res.data
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
    // 新增处理操作
    addBox(val) {
      this.$newTab({
        path: '/adjManagement/adjOrderHandle',
        title: '采购调整处理',
        component: adjOrderHandle,
        data: {
          id: val.id
        },
        clearCache: true,
        callback: bool => { // bool:false 点击的是取消
          if (bool) this.initialization()
        }
      })
    },
    // 关闭
    close() {
      this.isAdd = false
      this.isDetail = false
    },

    detailBtn(val) {
      this.detailData = JSON.parse(JSON.stringify(val))
      if (this.detailData.adjustIntention === 1) {
        this.detailData.adjustIntention = '同意调整'
      } else if (this.detailData.adjustIntention === 2) {
        this.detailData.adjustIntention = '拒绝调整'
      } else {
        this.detailData.adjustIntention = ''
      }
      if (this.detailData.supplyWay === 1) {
        this.detailData.supplyWay = '全部供货'
      } else if (this.detailData.supplyWay === 2) {
        this.detailData.supplyWay = '分批供货'
      } else {
        this.detailData.supplyWay = ''
      }
      this.$newTab({
        path: '/adjManagement/adjOrderDetails',
        title: '采购调整详情',
        component: adjOrderDetails,
        data: {
          detailData: this.detailData
        },
        clearCache: true,
        callback: () => { }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"] {
  -moz-appearance: textfield;
}
.btnBox {
  ::v-deep .el-form-item__content {
    margin-left: 20px !important;
  }
  .btn {
    width: 30%;
  }
}
.searchBox {
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
</style>
