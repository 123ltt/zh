<template>
  <!-- 库存分析/库存销量 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="productSku">
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="9">
              <el-form-item prop="productSku" label="产品编码">
                <el-input v-model.trim="submit.productSku" clearable style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="category" label="产品类目">
                <category-cascader ref="cascader" v-model="submit.category" style="width:80%;" check-strictly :multiple="false" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="货权">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="货主">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
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

      <!-- 产品编码详情 -->
      <el-table-column slot="productSku" label="产品编码" min-width="100" align="center">
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
          <g-text-ellipsis lines="4">
            {{ row.skuInfo.productName }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 产品类目 -->
      <el-table-column slot="categoryName" label="产品类目" min-width="80" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis lines="4">
            {{ row.skuInfo.categoryName }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 货权货主 -->
      <el-table-column slot="product" label="货权货主" min-width="180" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="25px">
            <g-list-group-item label="货权">
              <g-text-ellipsis lines="2" class="text-start">{{ row.productAuthName }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="货主">
              <g-text-ellipsis class="text-start">{{ row.productOwnerName }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 月销量 -->
      <el-table-column slot="month" label="月销量" min-width="150" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="80px">
            <g-list-group-item :label="row.salesMonth1">
              <g-text-ellipsis class="text-start">{{ row.monthSalesQty1 }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item :label="row.salesMonth2">
              <g-text-ellipsis class="text-start">{{ row.monthSalesQty2 }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item :label="row.salesMonth3">
              <g-text-ellipsis class="text-start">{{ row.monthSalesQty3 }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item :label="row.salesMonth4">
              <g-text-ellipsis class="text-start">{{ row.monthSalesQty4 }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 产品销量 -->
      <el-table-column slot="salesQty" label="产品销量" min-width="150" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="80px">
            <g-list-group-item label="48小时销量">
              <g-text-ellipsis class="text-start">{{ row.hoursSalesQty }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="前1周销量">
              <g-text-ellipsis class="text-start">{{ row.weekSalesQty1 }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="前2周销量">
              <g-text-ellipsis class="text-start">{{ row.weekSalesQty2 }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="前3周销量">
              <g-text-ellipsis class="text-start">{{ row.weekSalesQty3 }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="前4周销量">
              <g-text-ellipsis class="text-start">{{ row.weekSalesQty4 }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 日均销量 -->
      <el-table-column slot="wtdDays" label="日均销量" min-width="150" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="80px">
            <g-list-group-item label="加权日销量">
              <g-text-ellipsis class="text-start">{{ row.wtdDaysSalesQty }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="前1周日均">
              <g-text-ellipsis class="text-start">{{ row.daySalesQty1 }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="前2周日均">
              <g-text-ellipsis class="text-start">{{ row.daySalesQty2 }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="前3周日均">
              <g-text-ellipsis class="text-start">{{ row.daySalesQty3 }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="前4周日均">
              <g-text-ellipsis class="text-start">{{ row.daySalesQty4 }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 销量等级趋势 -->
      <el-table-column slot="sales" min-width="130" label="销量等级趋势" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="30px">
            <g-list-group-item label="等级">
              <g-text-ellipsis class="text-start">{{ row.salesRank }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="趋势">
              <g-text-ellipsis class="text-start">{{ row.salesTendency }} %</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" align="center" min-width="100" fixed="right">
        <template v-slot="{row}">
          <el-button type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>
  </basic-container>
</template>

<script>
import CategoryCascader from '@/components/category-cascader/index.vue'
import { getList } from '@/api/stockAnalysis/salesVolume.js'
import { getCateGoryChild, getOrg } from '@/api/public/public.js'
import salesVolumeDetail from './components/salesVolumeDetail.vue'

export default {
  name: 'ImsStockAnalysisSalesVolume',
  components: { CategoryCascader },
  data() {
    return {
      cascaderKey: 0,
      submit: {
        category: '',
        productSku: '',
        productAuthId: '',
        productOwnerId: ''
      },
      mainPath: [],
      orgList: [],
      productOwnerIdList: [],
      mainCategorylList: [],
      options: [],
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
          slotName: 'product'
        },
        {
          slot: true,
          slotName: 'month'
        },
        {
          slot: true,
          slotName: 'salesQty'
        },
        {
          slot: true,
          slotName: 'wtdDays'
        },
        {
          slot: true,
          slotName: 'sales'
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
  },
  methods: {
    getDictionary() {
      getCateGoryChild().then(res => {
        res.data.forEach(item => {
          const obj = {
            value: item.id,
            label: item.name,
            children: []
          }
          item.categoryChildVOList.forEach(item => {
            const childobj = {
              value: item.id,
              label: item.name
            }
            obj.children.push(childobj)
          })
          this.mainCategorylList.push(obj)
        })
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
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    detailBtn(val) {
      this.$newTab({
        path: '/stockAnalysis/salesVolume/detail',
        title: '库存销量详情',
        component: salesVolumeDetail,
        data: {
          detailData: val
        },
        clearCache: true,
        callback: () => {}
      })
    },
    search() {
      this.submit.productOwnerId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    reset() {
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.options = []
      this.mainPath = []
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
::v-deep .el-table .cell{
  line-height: 14px!important;
}
</style>
