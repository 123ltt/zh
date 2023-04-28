<template>
  <!-- 库存管理/可用库存-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="100px" size="mini" class="no-message">
          <el-row>
            <el-col :span="7">
              <el-form-item prop="warehouseType" label="仓库类型">
                <el-select v-model="submit.warehouseType" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in warehouseTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="warehouseBelong" label="仓库归属">
                <g-select v-model="submit.warehouseBelong" style="width:80%;" :items="warehouseBelongList" key-field="dictKey" label-field="dictValue" value-field="dictKey" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="warehouseId" label="仓库名称">
                <g-select v-model="submit.warehouseId" style="width:80%;" :items="warehouseNameList" key-field="id" label-field="warehouseName" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="productSku" label="产品编码">
                <el-input v-model.trim="submit.productSku" clearable placeholder="请填写" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="productAuthId" label="货权">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="productOwnerId" label="货主">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
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
      <el-table-column slot="productSku" label="产品编码" min-width="90" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row)">
            <g-text-ellipsis :lines="2">{{ row.productSku }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>

      <!-- 产品图片 -->
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

      <!-- 产品归属 -->
      <el-table-column slot="warehouseBelong" label="仓库归属" width="95" align="center">
        <template v-slot="{row}">
          <span>{{ row.warehouse?warehouseBelongObj[row.warehouse.warehouseBelong] :'' }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="90">
        <template v-slot="{row}">
          <el-button type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>
  </basic-container>
</template>

<script>
import { getList, getOrg } from '@/api/stock/availableStock.js'
import { getDictBiz, getAllEnableWarehouse } from '@/api/public/public.js'
import availableStockDetails from './components/availableStockDetails.vue'
export default {
  name: 'ImsStockAvailableStock',
  data() {
    return {
      searchOk: false,
      cascaderKey: 0,
      warehouseTypeList: [],
      warehouseBelongList: [],
      warehouseNameList: [],
      warehouseBelongObj: {},
      submit: {
        warehouseBelong: '',
        warehouseId: '',
        warehouseType: '',
        productSku: '',
        productAuthId: '',
        productOwnerId: ''
      },
      searchData: [],
      productOwnerIdList: [],
      options: [],
      orgList: [], // 货权数组
      productOwnerList: [], // 货主数组
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
          label: '仓库类型',
          prop: 'warehouse.warehouseType.desc',
          minWidth: '100px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'warehouseBelong'
        },
        {
          label: '仓库名称',
          prop: 'warehouse.warehouseName',
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '货权',
          prop: 'productAuthName',
          showOverflowTooltip: true,
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '货主',
          prop: 'productOwnerName',
          showOverflowTooltip: true,
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '库位号',
          prop: 'stockLocationOutsideCode',
          showOverflowTooltip: true,
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '可用库存',
          prop: 'availableQty',
          minWidth: '70px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取下拉数据
    getData() {
      // 仓库类型
      getDictBiz('warehouse_type').then(res => {
        this.warehouseTypeList = res.data
      })
      // 仓库名称
      getAllEnableWarehouse().then(res => {
        this.warehouseNameList = res.data
      })
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        this.warehouseBelongList = res.data
        this.warehouseBelongList.forEach(item => {
          this.warehouseBelongObj[item.dictKey] = item.dictValue
        })
      })
      // 获取货权
      getOrg().then(res => {
        this.orgList = res.data
      })
    },
    getproductOwner(val) {
      this.cascaderKey = ++this.cascaderKey
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
    detailBtn(val) {
      this.$newTab({
        path: '/view/availableStockDetails',
        title: '可用库存详情',
        component: availableStockDetails,
        data: {
          openData: val,
          warehouseBelongObj: this.warehouseBelongObj
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
