<template>
  <!-- 预警管理/缺货库存-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id" @selection-change="selectionChange">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="8">
              <el-form-item prop="productSku" label="产品编码">
                <el-input v-model.trim="submit.productSku" clearable placeholder="请填写" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="categoryId" label="产品类目">
                <category-cascader ref="cascader" v-model="submit.categoryId" style="width:100%;" check-strictly :multiple="false" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="warehouseId" label="仓库名称">
                <g-select v-model="submit.warehouseId" :items="warehouseList" key-field="id" label-field="warehouseName" value-field="id" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货权">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:100%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货主">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:100%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="btnBox">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="addBtn()">新增欠单采购</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 产品编码 -->
      <el-table-column slot="productSku" label="产品编码" align="center" min-width="90">
        <template slot-scope="scope">
          <g-text-ellipsis :lines="2">{{ scope.row.productSku }} </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 图片 -->
      <el-table-column slot="imageUrl" label="产品图片" align="center" width="75">
        <template slot-scope="scope">
          <g-thumb class="d-table-cell" :url="scope.row.skuInfo.imageUrl" />
        </template>
      </el-table-column>

      <!-- 产品类目 -->
      <el-table-column slot="categoryName" label="产品类目" align="center" min-width="90">
        <template slot-scope="scope">
          <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.categoryName }} </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 产品名称 -->
      <el-table-column slot="productName" label="产品名称" align="center" min-width="120">
        <template slot-scope="scope">
          <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.productName }} </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 货权 -->
      <el-table-column slot="productAuthName" label="货权" align="center" min-width="120">
        <template slot-scope="scope">
          <g-text-ellipsis :lines="2">{{ scope.row.productAuthName }} </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 货主 -->
      <el-table-column slot="productOwnerName" label="货主" align="center" min-width="120">
        <template slot-scope="scope">
          <g-text-ellipsis :lines="2">{{ scope.row.productOwnerName }} </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 采购中/在途/可用/备用库存 -->
      <el-table-column slot="stock" label="采购中/在途/可用/备用库存" align="center" min-width="200">
        <template slot-scope="scope">
          <span>
            {{ scope.row.purchasingStock == -1?0:scope.row.purchasingStock }} / {{ scope.row.intransitStock == -1?0:scope.row.intransitStock }} / {{ scope.row.availableStock == -1?0:scope.row.availableStock }} / {{ scope.row.reserveStock == -1?0:scope.row.reserveStock }}
          </span>
        </template>
      </el-table-column>

      <!-- 缺货库存 -->
      <el-table-column slot="oosQuantity" label="缺货库存" align="center" min-width="80">
        <template slot-scope="scope">
          <g-link @click="detailBtn(scope.row)">{{ scope.row.oosQuantity }} </g-link>
        </template>
      </el-table-column>

      <!-- 采购确认中 -->
      <el-table-column slot="prePurchaseQuantity" label="采购确认中" align="center" min-width="90">
        <template slot-scope="scope">
          <g-link @click="procureBtn(scope.row)">{{ scope.row.prePurchaseQuantity }} </g-link>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import CategoryCascader from '@/components/category-cascader/index.vue'
import { getList, getEnableList } from '@/api/warningManagement/stockoos.js'
import { getOrg } from '@/api/commonApi.js'
import stockoosDetail from './components/stockoosDetail.vue'
import procureDetail from './components/procureDetail.vue'
import stockoosAdd from './components/stockoosAdd.vue'

export default {
  name: 'PurchaseWarningManagementStockoos',
  components: { CategoryCascader },
  data() {
    return {
      // 搜索参数
      submit: {
        productSku: '',
        warehouseId: '',
        productAuthId: '',
        productOwnerId: '',
        categoryId: '',
        categoryFullId: ''
      },
      searchData: [],
      warehouseList: [],
      orgList: [],
      statusList: [],
      productOwnerIdList: [],
      options: [],
      cascaderKey: 0,
      //   规则名称
      rulesName: [],
      //   规则类型
      rulesType: [],
      // 表格数据0
      headers: [
        {
          type: 'selection',
          width: '40px'
        },
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
          slotName: 'categoryName'
        },
        {
          slot: true,
          slotName: 'productName'
        },
        {
          label: '仓库名称',
          prop: 'warehouse.warehouseName',
          width: '100px',
          align: 'center'
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
          slot: true,
          slotName: 'stock'
        },
        {
          slot: true,
          slotName: 'oosQuantity'
        },
        {
          slot: true,
          slotName: 'prePurchaseQuantity'
        },
        {
          label: '预计待采数量',
          prop: 'purchaseEstimateQuantity',
          width: '100px',
          align: 'center'
        }
      ],
      // 新增
      equally: false,
      addData: {},
      equallyData: [],
      parData: []
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
      getEnableList().then(res => {
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
      this.productOwnerIdList = []
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.cascaderKey = ++this.cascaderKey
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    selectionChange(sele) {
      if (sele.length) {
        this.equallyData = sele
        const arr = sele.filter(item => {
          return (item.productAuthId !== sele[0].productAuthId || item.productOwnerId !== sele[0].productOwnerId || item.warehouseId !== sele[0].warehouseId)
        })
        if (arr.length) {
          this.equally = false
          this.addData = {}
          this.parData = []
        } else {
          this.equally = true
          this.addData = {
            productOwnerName: sele[0].productOwnerName,
            productAuthName: sele[0].productAuthName,
            warehouseName: sele[0].warehouse.warehouseName,
            demanderId: sele[0].productOwnerId,
            productAuthId: sele[0].productAuthId,
            destWarehouseId: sele[0].warehouseId
          }
          sele.forEach(item => {
            this.parData.push({
              productAuthId: item.productAuthId,
              productOwnerId: item.productOwnerId,
              warehouseId: item.warehouseId,
              productSku: item.productSku
            })
          })
        }
      } else {
        this.equally = false
        this.addData = {}
        this.parData = []
        this.equallyData = []
      }
    },
    // 缺货库存详情
    detailBtn(val) {
      this.$modal({
        title: '缺货库存详情',
        component: stockoosDetail,
        data: {
          detailData: val
        },
        callback: () => {}
      })
    },
    // 采购中详情
    procureBtn(val) {
      this.$modal({
        title: '采购确认中详情',
        component: procureDetail,
        data: {
          detailData: val
        },
        callback: () => {}
      })
    },
    addBtn() {
      if (this.equallyData.length) {
        if (this.equally) {
          this.$newTab({
            path: '/ips/stockoos/stockoosAdd',
            title: '新增欠单采购',
            component: stockoosAdd,
            clearCache: true,
            data: {
              addData: this.addData,
              parData: this.parData,
              equallyData: this.equallyData
            },
            callback: (bool) => {
              if (bool) {
                this.initialization()
              }
            }
          })
        } else {
          this.$message.error('请勾选货权、货主和仓库一致的欠单采购数据！')
        }
      } else {
        this.$message.error('请先勾选新增欠单采购数据！')
      }
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
