<template>
  <!-- 采购调整 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini" :model="formData">
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
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="formData.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="purCode" label="采购编码">
                <el-input v-model.trim="formData.purCode" style="width:100%" />
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
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-delete" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="adjustCode" label="调整编码" min-width="110" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="propVisible(row.id)">{{ row.adjustCode }}</g-link>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="60" align="center">
        <template v-slot="slot">
          <span>{{ ['确认中','已调整','已驳回'][slot.row.status-1]||'' }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" align="center" min-width="70">
        <template v-slot="slot">
          <el-button type="text" @click="propVisible(slot.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>
<script>
import purchaseDetail from './purchaseDetail.vue'
import { getList } from '@/api/adjManagement/purchaseAdj'
import { dictionary, supplier, purchaser, getOrg } from '@/api/commonApi'
export default {
  name: 'PurchaseAdjManagementPurchaseAdj',
  data() {
    return {
      visible: false,
      formData: {
        status: '',
        purCode: '',
        supplierId: '',
        productAuthId: '',
        purSquareId: ''
      },
      searchData: [],
      orgList: [],
      productOwnerIdList: [],
      cascaderKey: 0,
      options: [],
      statusList: [],
      supplierList: [],
      purchaseList: [],
      headers: [
        {
          slot: true,
          slotName: 'adjustCode'
        },
        {
          label: '采购编码',
          prop: 'purCode',
          minWidth: '105px',
          align: 'center'
        },
        {
          label: '采购方名称',
          prop: 'purSquareName',
          showOverflowTooltip: true,
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '供应商名称',
          prop: 'supplierName',
          showOverflowTooltip: true,
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '调整人',
          prop: 'adjustPeople',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '调整前数量',
          prop: 'adjustBeforeQty',
          minWidth: '80px',
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
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '调整时间',
          prop: 'createTime',
          minWidth: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '生效时间',
          prop: 'adjustEffectiveTime',
          minWidth: '130px',
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
    getSearch() {
      supplier().then(res => {
        this.supplierList = res.data
      })
      purchaser().then(res => {
        this.purchaseList = res.data
      })
      dictionary('ips_adjustment_status').then(res => {
        this.statusList = res.data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
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
    initialization() { // 分页接口调取
      this.$refs.table.load(1, this.searchData)
    },
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.records.map(item => {
            for (const key in item) {
              if (item[key] === -1) item[key] = ''
            }
            return item
          }), // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    search() {
      this.formData.purSquareId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
      this.searchData = JSON.parse(JSON.stringify(this.formData))
      this.initialization()
    },
    propVisible(id) {
      this.$modal({
        title: '采购调整详情',
        component: purchaseDetail,
        data: {
          id
        },
        callback: () => {}
      })
    },
    reset() {
      this.formData.status = ''
      this.formData.purCode = ''
      this.formData.supplierId = ''
      this.formData.purSquareId = ''
      this.formData.productAuthId = ''
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
.block{
    text-align:right;
    margin: 10px 10px 0 0;
}
.searchBox{
    ::v-deep .el-form-item{
        margin-bottom: 0px;
    }
    .btnBox{
        ::v-deep .el-form-item__content{
            margin-left: 20px!important;
        }
    }
}
</style>
