<template>
  <!-- 采购管理/采购退货 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini" class="searchBox">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="logisticsCode" label="物流运单号">
                <el-input v-model.trim="formData.logisticsCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="purchaseCode" label="采购编码">
                <el-input v-model.trim="formData.purCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="lpId" label="供应商名称">
                <g-select v-model="formData.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="lpId" label="物流商名称">
                <g-select v-model="formData.lpId" style="width:100%;" :items="logisticsProviderList" key-field="id" label-field="lpFullname" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="warehousingCode" label="入库编码">
                <el-input v-model.trim="formData.warehousingCode" clearable />
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
      <el-table-column slot="returnGoodsCode" label="退货编码" min-width="80" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="getTable(row.id)">{{ row.returnGoodsCode }}</g-link>
        </template>
      </el-table-column>

      <!-- 物流运单号 -->
      <el-table-column slot="logisticsCode" label="物流运单号" min-width="81" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis :lines="2">{{ row.logisticsCode }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 物流商名称 -->
      <el-table-column slot="lpName" label="物流商名称" min-width="130" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis :lines="2">{{ row.lpName }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 不良编码 -->
      <el-table-column slot="wmsAbnormalCode" label="不良编码" min-width="90" align="center">
        <template v-slot="{row}">
          <div>
            <g-text-ellipsis v-for="item in row.returnAbnormalRelationVOList" :key="item.returnId" :lines="1">{{ item.orderAbnormal.wmsAbnormalCode }}
            </g-text-ellipsis>
          </div>

        </template>
      </el-table-column>

      <!-- 入库编码 -->
      <el-table-column slot="warehousingCode" label="入库编码" min-width="90" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis :lines="2">{{ row.warehousingCode }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 采购编码 -->
      <el-table-column slot="purCode" label="采购编码" min-width="90" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis :lines="2">{{ row.purCode }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 供应商名称 -->
      <el-table-column slot="supplierName" label="供应商名称" min-width="90" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis :lines="2">{{ row.supplierName }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="55">
        <template v-slot="slot">
          <el-button type="text" @click="getTable(slot.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import returnGoodsDetail from './returnGoodsModal/returnGoodsDetail'
import { getList, getSupplier, logisticsProvider } from '@/api/ordermanagement/orderReturn'
export default {
  data() {
    return {
      loading: false,
      visible: false,
      formData: {
        logisticsCode: '',
        purCode: '',
        lpId: '',
        warehousingCode: '',
        supplierId: ''
      },
      searchData: [],
      logisticsProviderList: [],
      supplierList: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'returnGoodsCode'
        },
        {
          slot: true,
          slotName: 'logisticsCode'
        },
        {
          slot: true,
          slotName: 'lpName'
        },
        {
          label: '运费',
          prop: 'shippingFee',
          minWidth: '60px',
          align: 'center'
        },
        {
          label: '运费承担方',
          prop: 'paymentMethodName',
          minWidth: '81px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'wmsAbnormalCode'
        },
        {
          slot: true,
          slotName: 'warehousingCode'
        },
        {
          slot: true,
          slotName: 'purCode'
        },
        {
          slot: true,
          slotName: 'supplierName'
        },
        {
          label: '不良品数量',
          prop: 'rejectsQty',
          minWidth: '81px',
          align: 'center'
        },
        {
          label: '退货数量',
          prop: 'returnGoodsQty',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '退货金额',
          prop: 'returnTotalAmount',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '退货人',
          prop: 'returnGoodsPeople',
          minWidth: '65px',
          align: 'center'
        },
        {
          label: '退货时间',
          prop: 'creturnGoodsTime',
          width: '85px',
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
    initialization() { // 分页接口调取
      this.$refs.table.load(1, this.searchData)
    },
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数据
          size: res.data.pageSize // 每页做大条数
        }
      })
    },
    getSearch() {
      logisticsProvider().then(res => {
        this.logisticsProviderList = res.data
      })
      getSupplier().then(res => {
        this.supplierList = res.data
      })
    },
    getTable(id) {
      this.$newTab({
        path: '/purchaseReturn/returnGoodsDetail',
        title: '退货详情',
        component: returnGoodsDetail,
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
    cancel() {
      this.visible = false
    },
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.formData))
      this.initialization()
    },
    reset() {
      this.formData.logisticsCode = ''
      this.formData.purCode = ''
      this.formData.lpId = ''
      this.formData.supplierId = ''
      this.formData.warehousingCode = ''
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
