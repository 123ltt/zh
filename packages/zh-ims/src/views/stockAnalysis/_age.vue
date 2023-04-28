<template>
  <!-- 库存分析/库存库龄-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="80px" size="mini" class="no-message">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item prop="warehouseType" label="仓库类型">
                <el-select v-model="submit.warehouseType" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in formData.warehouseTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="warehouseBelong" label="仓库归属">
                <g-select v-model="submit.warehouseBelong" style="width:80%;" :items="formData.warehouseBelongList" key-field="dictKey" label-field="dictValue" value-field="dictKey" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="warehouseId" label="仓库名称">
                <g-select v-model="submit.warehouseId" style="width:80%;" :items="formData.warehouseNameList" key-field="id" label-field="warehouseName" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="productSku" label="产品编码">
                <el-input v-model.trim="submit.productSku" clearable placeholder="请填写" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="productAuthId" label="货权">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @input="getproductOwner">
                  <el-option v-for="item in formData.orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="货主">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="period" label="库龄期间">
                <el-select v-model="submit.period" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in periodList" :key="item.id" :label="item.name" :value="item.id" />
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
      <el-table-column slot="productSku" label="产品编码" min-width="90" align="center">
        <template v-slot="{row}">
          <g-link @click="detailBtn(row)">{{ row.productSku }}</g-link>
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
          <g-text-ellipsis lines="2">
            {{ row.skuInfo.productName }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 产品类目 -->
      <el-table-column slot="categoryName" label="产品类目" min-width="80" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis lines="2">
            {{ row.skuInfo.categoryName }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 货权 -->
      <el-table-column slot="productAuthName" label="货权" min-width="100" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis lines="2">
            {{ row.productAuthName }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 货主 -->
      <el-table-column slot="productOwnerName" label="货主" min-width="100" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis lines="2">
            {{ row.productOwnerName }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 仓库归属 -->
      <el-table-column slot="warehouseBelong" label="仓库归属" min-width="70" align="center">
        <template v-slot="{row}">
          <span>{{ warehouseBelongObj[row.warehouseBelong] }}</span>
        </template>
      </el-table-column>

      <!-- 仓库类型 -->
      <el-table-column slot="warehouseType" label="仓库类型" min-width="70" align="center">
        <template v-slot="{row}">
          <span>{{ warehouseTypeObj[row.warehouseType] }}</span>
        </template>
      </el-table-column>

      <!-- 仓库类型 -->
      <el-table-column slot="averageStockAge" label="平均库龄" min-width="70" align="center">
        <template v-slot="{row}">
          <span>{{ row.averageStockAge ==-1?'': row.averageStockAge }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="70">
        <template v-slot="{row}">
          <el-button type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>

<script>
import { getList } from '@/api/stockAnalysis/age.js'
import { getDictBiz, getAllEnableWarehouse, getOrg } from '@/api/public/public.js'
import ageDetail from './components/ageDetail.vue'

export default {
  name: 'ImsStockAnalysisAge',
  data() {
    return {
      formData: {
        warehouseTypeList: [], // 仓库类型
        warehouseNameList: [], // 仓库名称
        warehouseBelongList: [], // 仓库归属
        orgList: []// 货权
      },
      cascaderKey: 0,
      searchData: [],
      options: [],
      warehouseBelongObj: {},
      warehouseTypeObj: {},
      productOwnerIdList: [],
      periodList: [
        { id: '', name: '全部' },
        { id: 0, name: '30天以下' },
        { id: 1, name: '30~90天' },
        { id: 2, name: '90~180天' },
        { id: 3, name: '180~360天' },
        { id: 4, name: '360~720天' },
        { id: 5, name: '720天以上' }
      ],
      periodObj: {
        0: ['', 30],
        1: [30, 90],
        2: [90, 180],
        3: [180, 360],
        4: [360, 720],
        5: [720, '']
      },
      submit: {
        productSku: '',
        averageStockAgeL: '',
        averageStockAgeR: '',
        period: '',
        warehouseId: '',
        warehouseType: '',
        warehouseBelong: '',
        productAuthId: '',
        productOwnerId: ''
      },
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
          slotName: 'warehouseType'
        },
        {
          slot: true,
          slotName: 'warehouseBelong'
        },
        {
          label: '仓库名称',
          prop: 'warehouseName',
          minWidth: '80px',
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
          slotName: 'averageStockAge'
        },
        {
          label: '库存数量',
          prop: 'availableStock',
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
  mounted() {
    this.initialization()
  },
  methods: {
    // 获取下拉数据
    getData() {
      // 仓库类型
      getDictBiz('warehouse_type').then(res => {
        this.formData.warehouseTypeList = res.data
        this.formData.warehouseTypeList.forEach(item => {
          this.warehouseTypeObj[item.dictKey] = item.dictValue
        })
      })
      // 仓库名称
      getAllEnableWarehouse().then(res => {
        this.formData.warehouseNameList = res.data
      })
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        this.formData.warehouseBelongList = res.data
        this.formData.warehouseBelongList.forEach(item => {
          this.warehouseBelongObj[item.dictKey] = item.dictValue
        })
      })
      // 获取货权
      getOrg().then(res => {
        this.formData.orgList = res.data
      })
    },
    getproductOwner(val) {
      this.cascaderKey = ++this.cascaderKey
      this.submit.productOwnerId = ''
      this.options = []
      if (val) {
        const orgArr = this.formData.orgList.filter(ele => ele.tenantId === val)[0].orgTreeNodeList
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
      this.submit.productOwnerId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
      if (this.submit.period || this.submit.period === 0) {
        this.submit.averageStockAgeL = this.periodObj[this.submit.period][0]
        this.submit.averageStockAgeR = this.periodObj[this.submit.period][1]
      } else {
        this.submit.averageStockAgeL = ''
        this.submit.averageStockAgeR = ''
      }
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
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
        path: '/stockAnalysis/age/detail',
        title: '库存库龄详情',
        component: ageDetail,
        data: {
          parData: val,
          warehouseBelongObj: this.warehouseBelongObj,
          warehouseTypeObj: this.warehouseTypeObj
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
    margin-left: 20px!important;
  }
}

</style>
