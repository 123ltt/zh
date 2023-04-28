<template>
  <!-- 采购管理/采购订单 -->
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
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="formData.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="purCode" label="采购编码">
                <el-input v-model.trim="formData.purCode" clearable style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="destWarehouseId" label="目的仓库">
                <g-select v-model="formData.destWarehouseId" style="width:100%;" :items="warehouseList" key-field="id" label-field="warehouseName" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="platformCode" label="平台单号">
                <el-input v-model.trim="formData.platformCode" clearable style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="planCode" label="计划编码">
                <el-input v-model.trim="formData.planCode" clearable style="width:100%" />
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

      <!-- 单号 -->
      <el-table-column slot="purCode" label="单号" min-width="180" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="50px">
            <g-list-group-item label="采购编码">
              <g-text-ellipsis class="text-start">{{ row.purCode }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="计划编码">
              <g-text-ellipsis class="text-start">{{ row.planCode }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="平台单号">
              <g-text-ellipsis class="text-start">{{ row.platformCode }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 采购信息 -->
      <el-table-column slot="purInformation" label="采购信息" min-width="200" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="40px">
            <g-list-group-item label="采购方">
              <g-text-ellipsis class="text-start">{{ row.purSquareName }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="供应商">
              <g-text-ellipsis class="text-start">{{ row.supplierName }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="等级">
              <g-text-ellipsis class="text-start">{{ row.supplierLevel }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 关联人员 -->
      <el-table-column slot="associated" label="关联人员" min-width="110" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="30px">
            <g-list-group-item label="开发">
              <g-text-ellipsis class="text-start">{{ row.developerName }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="本采">
              <g-text-ellipsis class="text-start">{{ row.localPurchaserName }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="海采">
              <g-text-ellipsis class="text-start">{{ row.overseaPurchaserName }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 仓库 -->
      <el-table-column slot="warehouse" label="仓库" min-width="140" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="50px">
            <g-list-group-item label="是否直发">
              <g-text-ellipsis class="text-start">{{ row.isStraight==1?'是':'否' }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="中转仓库">
              <g-text-ellipsis class="text-start">{{ row.transitWarehouseName }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="目的仓库">
              <g-text-ellipsis class="text-start">{{ row.destWarehouseName }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 采购 -->
      <el-table-column slot="pur" min-width="130" align="center">
        <template slot="header">
          <p style="line-height: 12px">采购数量</p>
          <p style="line-height: 12px">采购金额</p>
        </template>
        <template v-slot="{row}">
          <g-list-group label-width="30px">
            <g-list-group-item label="数量">
              <g-text-ellipsis class="text-start">{{ row.purQty }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="金额">
              <g-text-ellipsis class="text-start">{{ row.purAmount }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="币种">
              <g-text-ellipsis class="text-start">{{ currencyList[row.purAccountCurrency] }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 付款方式 -->
      <el-table-column slot="payment" min-width="90" align="center">
        <template slot="header">
          <p style="line-height: 12px">付款方式</p>
          <p style="line-height: 12px">付款条件</p>
        </template>
        <template v-slot="{row}">
          <p>{{ paymentMethodObj[row.paymentMethod] }}</p>
          <p>{{ paymentConditionObj[row.paymentCondition] }}</p>
        </template>
      </el-table-column>

      <!-- 采购 -->
      <el-table-column slot="allTime" min-width="165" align="center">
        <template slot="header">
          <p style="line-height: 12px">采购时间</p>
          <p style="line-height: 12px">期望到货时间</p>
        </template>
        <template v-slot="{row}">
          <g-list-group>
            <g-list-group-item label="采购人" label-width="40px">
              <g-text-ellipsis class="text-start">{{ row.purPeople }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="采" label-width="15px">
              <g-text-ellipsis class="text-start">{{ row.purTime }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="期" label-width="15px">
              <g-text-ellipsis class="text-start">{{ row.expectArrivalTime }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" align="center" min-width="100">
        <template v-slot="slot">
          <span>{{ copyStatusList[slot.row.status] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" align="center" min-width="100" fixed="right">
        <template v-slot="slot">
          <el-button v-if="slot.row.status===1" type="text" @click="process(slot.row.row,slot.row.id)">接单</el-button>
          <el-button v-if="slot.row.status===3" type="text" @click="delivery(slot.row.row,slot.row.id)">发货</el-button>
          <el-button v-if="slot.row.status===6 && slot.row.showAdjust===1" type="text" @click="adjOrder(slot.row,slot.row.id)">调整</el-button>
          <el-button type="text" @click="propsDetail(slot.row.id)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>
  </basic-container>
</template>

<script>
import orderProcess from './purchasingOrderModal/orderProcess'
import purchaseDetail from './purchasingOrderModal/purchaseDetail.vue'
import orderDelivery from './purchasingOrderModal/orderDelivery'
import purchaseAdjustment from './purchasingOrderModal/purchaseAdjustment'
// 调取接口
import { getList } from '@/api/ordermanagement/orderManagement'
import { dictionary, getAllEnableWarehouse, getOrg, supplier } from '@/api/commonApi'

export default {
  name: 'PurchaseOrderManagementPurchasingOrder',
  data() {
    return {
      visible: false,
      isDetail: false,
      isArriavl: false,
      cascaderKey: 0,
      isReturn: false,
      isDelivery: false,
      isAdjustment: false,
      isAdd: false,
      id: '',
      formData: {
        purSquareId: '',
        supplierId: '',
        purCode: '',
        destWarehouseId: '',
        productAuthId: '',
        platformCode: '',
        planCode: '',
        status: ''
      },
      orgList: [],
      productOwnerIdList: [],
      options: [],
      statusList: [],
      copyStatusList: {},
      warehouseList: [],
      directDeliveryWaeList: [],
      paymentMethodObj: [],
      paymentConditionObj: [],
      supplierList: [],
      currencyList: {},
      headers: [
        {
          slot: true,
          slotName: 'purCode'
        },
        {
          slot: true,
          slotName: 'purInformation'
        },
        {
          slot: true,
          slotName: 'associated'
        },
        {
          slot: true,
          slotName: 'warehouse'
        },
        {
          slot: true,
          slotName: 'pur'
        },
        {
          slot: true,
          slotName: 'payment'
        },
        {
          slot: true,
          slotName: 'allTime'
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
    this.getDictionary()
    this.initialization()
    if (this.$route.params.id) this.adjOrder('', this.$route.params.id)
  },
  methods: {
    getDictionary() {
      dictionary('ips_order_status').then(res => {
        this.statusList = res.data
        res.data.forEach(item => {
          this.copyStatusList[item.dictKey] = item.dictValue
        })
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      dictionary('ips_direct_delivery_warehouse').then(res => {
        this.directDeliveryWaeList = res.data
      })
      dictionary('ips_payment_method').then(res => {
        res.data.forEach(item => {
          this.paymentMethodObj[item.dictKey] = item.dictValue
        })
      })
      dictionary('ips_payment_condition').then(res => {
        res.data.forEach(item => {
          this.paymentConditionObj[item.dictKey] = item.dictValue
        })
      })
      supplier().then(res => {
        this.supplierList = res.data
      })
      getAllEnableWarehouse().then(res => {
        this.warehouseList = res.data
      })
      getOrg().then(res => {
        this.orgList = res.data
      })
      dictionary('ips_account_currency').then(res => {
        res.data.forEach(item => {
          this.currencyList[item.dictKey] = item.dictValue
        })
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
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    propsData() { // 接单显隐
      this.visible = true
    },
    propsDetail(id) {
      this.$newTab({
        path: '/purchaseDetail/purchaseDetail',
        title: '采购订单详情',
        component: purchaseDetail,
        data: {
          id
        },
        clearCache: true,
        callback: () => {}
      })
    },
    process(row, id) {
      this.$newTab({
        path: '/orderManagement/orderProcess',
        title: '采购接单',
        component: orderProcess,
        data: {
          id
        },
        callback: (bool) => {
          if (bool) {
            this.reset()
          }
        },
        clearCache: true
      })
    },

    delivery(row, id) {
      this.$newTab({
        path: '/orderManagement/orderDelivery',
        title: '采购订单发货',
        component: orderDelivery,
        data: {
          id
        },
        callback: (bool) => {
          if (bool) {
            this.reset()
          }
        },
        clearCache: true
      })
    },
    adjOrder(row, id) {
      this.$newTab({
        path: '/orderManagement/purchaseAdjustment',
        title: '调整采购订单',
        component: purchaseAdjustment,
        data: {
          id
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
      this.cascaderKey = ++this.cascaderKey
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
::v-deep .el-form-item{
   margin-bottom: 0;
}
p{
  margin: 0!important;
}
    .btnBox{
        ::v-deep .el-form-item__content{
            margin-left: 20px!important;
        }
    }

</style>
