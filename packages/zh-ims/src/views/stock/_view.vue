<template>
  <!-- 库存管理/库存查询-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="100px" size="mini" class="no-message">
          <el-row>
            <el-col :span="7">
              <el-form-item prop="productAuthId" label="货权" label-width="40px">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @input="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="货主" label-width="40px">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="productSku" label="产品编码">
                <el-input v-model.trim="submit.productSku" clearable placeholder="请填写" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item class="btnBox">
                <el-button type="primary" size="mini" icon="el-icon-search" :disabled="searchOk" @click="search()">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" :disabled="searchOk" @click="reset()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="productSku" label="产品编码" min-width="85" align="center">
        <template v-slot="{row}">
          <g-link @click="detailBtn(row,'all')">
            <g-text-ellipsis :lines="2">{{ row.productSku }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>

      <!-- 跳转采购中库存详情 -->
      <el-table-column slot="purchasingStockTotal" label="采购中库存" min-width="82" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row,'purchasing')">{{ row.purchasingStockTotal }}</g-link>
        </template>
      </el-table-column>

      <!-- 跳转在途库存详情 -->
      <el-table-column slot="intransitStockTotal" label="在途库存" min-width="70" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row,'intransit')">{{ row.intransitStockTotal }}</g-link>
        </template>
      </el-table-column>

      <!-- 跳转可用库存详情 -->
      <el-table-column slot="availableStockTotal" label="可用库存" min-width="70" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row,'available')">{{ row.availableStockTotal }}</g-link>
        </template>
      </el-table-column>

      <!-- 跳转冻结库存详情 -->
      <el-table-column slot="freezeStockTotal" label="冻结库存" min-width="70" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row,'freeze')">{{ row.freezeStockTotal }}</g-link>
        </template>
      </el-table-column>

      <!-- 跳转备用库存详情 -->
      <el-table-column slot="reserveStockTotal" label="备用库存" min-width="70" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row,'reserve')">{{ row.reserveStockTotal }}</g-link>
        </template>
      </el-table-column>

      <!-- 跳转在库库存详情 -->
      <el-table-column slot="inWarehouseStockTotal" label="在库库存" min-width="70" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row,'inWarehouse')">{{ row.inWarehouseStockTotal }}</g-link>
        </template>
      </el-table-column>

      <!-- 跳转在库库存详情 -->
      <el-table-column slot="oosQuantityTotal" label="缺货库存" min-width="70" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row,'oosQuantity')">{{ row.oosQuantityTotal }}</g-link>
        </template>
      </el-table-column>

      <!-- 产品图片详情 -->
      <el-table-column slot="imageUrl" label="产品图片" width="75" align="center">
        <template v-slot="{row}">
          <g-thumb class="d-table-cell" :url="row.skuInfo.imageUrl" />
        </template>
      </el-table-column>

      <!-- 产品名称 -->
      <el-table-column slot="productName" label="产品名称" min-width="100" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis :lines="2">{{ row.skuInfo.productName }}</g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 产品类目 -->
      <el-table-column slot="categoryName" label="产品类目" min-width="80" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis :lines="2">{{ row.skuInfo.categoryName }}</g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 货权 -->
      <el-table-column slot="productAuthName" label="货权" min-width="120" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis :lines="2">{{ row.productAuthName }}</g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 货主 -->
      <el-table-column slot="productOwnerName" label="货主" min-width="90" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis :lines="2">{{ row.productOwnerName }}</g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="70">
        <template v-slot="{row}">
          <el-button type="text" @click="detailBtn(row,'all')">详情</el-button>
        </template>
      </el-table-column>

    </g-table>
  </basic-container>
</template>

<script>
import { getList, getOrg } from '@/api/stock/view.js'
import viewDetails from './components/viewDetails.vue'
export default {
  name: 'ImsStockView',
  data() {
    return {
      searchOk: false,
      submit: {
        productSku: '',
        productAuthId: '',
        productOwnerId: ''
      },
      cascaderKey: 0,
      searchData: [],
      productOwnerIdList: [],
      orgList: [], // 货权数组
      options: [], // 货主数组
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'productSku'
        },
        {
          slot: true,
          slotName: 'imageUrl'
        },
        {
          slot: true,
          slotName: 'productName'
        },
        {
          slot: true,
          slotName: 'categoryName'
        },
        {
          slot: true,
          slotName: 'productAuthName'
        },
        {
          slot: true,
          slotName: 'productOwnerName'
        },
        {
          label: '库存总量',
          prop: 'stockTotal',
          minWidth: '70px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'purchasingStockTotal'
        },
        {
          slot: true,
          slotName: 'intransitStockTotal'
        },
        {
          slot: true,
          slotName: 'availableStockTotal'
        },
        {
          slot: true,
          slotName: 'freezeStockTotal'
        },
        {
          slot: true,
          slotName: 'reserveStockTotal'
        },
        {
          slot: true,
          slotName: 'inWarehouseStockTotal'
        },
        {
          slot: true,
          slotName: 'oosQuantityTotal'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      typeList: {
        all: '产品',
        purchasing: '采购中',
        intransit: '在途',
        available: '可用',
        reserve: '备用',
        freeze: '冻结',
        inWarehouse: '在库',
        oosQuantity: '缺货'
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取下拉数据
    getData() {
      // 获取货权
      getOrg().then(res => {
        this.orgList = res.data
      })
    },
    getproductOwner(val) {
      this.cascaderKey = ++this.cascaderKey
      this.submit.productOwnerId = ''
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
      this.searchOk = true
      const emptyArr = Object.keys(params).filter(item => {
        if (params[item]) return true
      })
      if (emptyArr.length) {
        return getList(current, size, params).then(res => {
          this.searchOk = false
          return {
            records: res.data.records, // 列表数据
            total: res.data.total, // 总记录数
            size: res.data.pageSize // 每页最大记录数
          }
        })
      } else {
        return Promise.resolve().then(() => {
          this.searchOk = false
          return {
            records: [], // 列表数据
            total: 1, // 总记录数
            size: 20// 每页最大记录数
          }
        })
      }
    },
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    search() {
      const emptyArr = Object.keys(this.submit).filter(item => {
        if (this.submit[item]) return true
      })
      if (emptyArr.length) {
        this.submit.productOwnerId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
        this.searchData = JSON.parse(JSON.stringify(this.submit))
        this.initialization()
      } else {
        this.$message.error('请选择查询条件！')
      }
    },
    //   重置
    reset() {
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.cascaderKey = ++this.cascaderKey
      this.options = []
      this.productOwnerIdList = []
      this.searchData = []
      this.initialization()
    },
    // 详情
    detailBtn(val, type) {
      const obj = {
        productSku: val.productSku,
        productOwnerId: val.productOwnerId,
        productAuthId: val.productAuthId
      }
      this.$newTab({
        path: '/ims/view/viewDetails',
        title: `${this.typeList[type]}库存明细`,
        component: viewDetails,
        data: {
          parameter: obj,
          type: type
        },
        clearCache: true,
        callback: () => {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btnBox{
  ::v-deep .el-form-item__content{
    margin-left: 0!important;
  }
}

</style>
