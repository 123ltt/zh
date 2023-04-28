<template>
  <!-- 库存分析/库存预测 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="productSku" @selection-change="selectionChange">
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="8">
              <el-form-item prop="productSku" label="产品编码">
                <el-input v-model.trim="submit.productSku" clearable style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货权">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货主">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="warehouseId" label="仓库名称">
                <g-select v-model="submit.warehouseId" style="width:80%;" :items="warehouseNameList" key-field="id" label-field="warehouseName" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预计结余天数">
                <el-row style="width:80%;">
                  <el-col :span="10">
                    <el-input v-model.trim="submit.estimatedBalanceDay_beginning" v-input.numeric.positive clearable @input="getBegin" />
                  </el-col>
                  <el-col class="line" :span="4" style="text-align: center;color:#CCC">一</el-col>
                  <el-col :span="10">
                    <el-input v-model.trim="submit.estimatedBalanceDay_ending" v-input.numeric.positive clearable @input="getEnding" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="btnBox">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button icon="el-icon-delete" @click="reset">重置</el-button>
                <el-button type="primary" @click="downloadTemp">批量导出</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="productSku" label="产品编码" min-width="100" align="center">
        <template v-slot="{row}">
          <g-link @click="detailBtn(row)">{{ row.productSku }}</g-link>
        </template>
      </el-table-column>

      <!-- 产品图片 -->
      <el-table-column slot="imageUrl" label="产品图片" width="55" align="center">
        <template v-slot="{row}">
          <g-thumb class="d-table-cell" :url="row.skuInfo.imageUrl" />
        </template>
      </el-table-column>

      <!-- 产品名称 -->
      <el-table-column slot="productName" label="产品名称" min-width="100" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis lines="4" :class="isRed(row)?'redColor':''">
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
      <el-table-column slot="product" label="货权货主" min-width="100" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="25px">
            <g-list-group-item label="货权">
              <g-text-ellipsis lines="3" class="text-start">{{ row.productAuthName }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="货主">
              <g-text-ellipsis class="text-start">{{ row.productOwnerName }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 仓库 -->
      <el-table-column slot="warehouse" label="仓库" min-width="90" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="25px">
            <g-list-group-item label="类型">
              <g-text-ellipsis class="text-start">{{ row.warehouse.warehouseType.desc }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="归属">
              <g-text-ellipsis class="text-start">{{ warehouseBelongObj[row.warehouse.warehouseBelong] }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="名称">
              <g-text-ellipsis class="text-start">{{ row.warehouse.warehouseName }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 库存 -->
      <el-table-column slot="stock" label="库存" min-width="120" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="60px">
            <g-list-group-item label="可用库存">
              <g-text-ellipsis class="text-start">{{ row.availableStock }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="备用库存">
              <g-text-ellipsis class="text-start">{{ row.reserveStock }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="采购中库存">
              <g-text-ellipsis class="text-start">{{ row.purchasingStock }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="在途库存">
              <g-text-ellipsis class="text-start">{{ row.intransitStock }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="缺货库存">
              <g-text-ellipsis class="text-start">{{ row.oosStock }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 月销量 -->
      <el-table-column slot="month" label="月销量" min-width="100" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="50px">
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
      <el-table-column slot="salesQty" label="产品销量" min-width="130" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="65px">
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
      <el-table-column slot="wtdDays" label="日均销量" min-width="130" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="65px">
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

      <!-- 销量等级 -->
      <el-table-column slot="sales" min-width="100" label="销量等级" align="center">
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

      <!-- 预计可售卖天数 -->
      <el-table-column slot="estimatedSaleDay" min-width="60" align="center">
        <template slot="header">
          <p style="line-height: 12px">预计可售卖天数</p>
        </template>
        <template v-slot="{row}">
          <span>{{ row.estimatedSaleDay }}</span>
        </template>
      </el-table-column>

      <!-- 预计结余天数 -->
      <el-table-column slot="estimatedBalanceDay" min-width="60" align="center">
        <template slot="header">
          <p style="line-height: 12px">预计结余天数</p>
        </template>
        <template v-slot="{row}">
          <span>{{ row.estimatedBalanceDay }}</span>
        </template>
      </el-table-column>

      <!-- 预计结余数量 -->
      <el-table-column slot="estimatedBalanceQty" min-width="60" align="center">
        <template slot="header">
          <p style="line-height: 12px">预计结余数量</p>
        </template>
        <template v-slot="{row}">
          <span>{{ row.estimatedBalanceQty }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" align="center" min-width="60" fixed="right">
        <template v-slot="{row}">
          <el-button type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>
  </basic-container>
</template>

<script>
import { getList, downloadTemplate } from '@/api/stockAnalysis/forecast.js'
import { getAllEnableWarehouse, getOrg, getDictBiz } from '@/api/public/public.js'
import forecastDateil from './components/forecastDateil.vue'
import { dowloadExc } from '@/util/util'

export default {
  name: 'ImsStockAnalysisForecast',
  data() {
    return {
      cascaderKey: 0,
      submit: {
        warehouseId: '',
        productSku: '',
        productAuthId: '',
        productOwnerId: '',
        estimatedBalanceDay_ending: '',
        estimatedBalanceDay_beginning: ''
      },
      oldBegin: '',
      oldEnd: '',
      mainPath: [],
      orgList: [],
      selectionList: [],
      warehouseBelongObj: {},
      warehouseNameList: [],
      productOwnerIdList: [],
      mainCategorylList: [],
      options: [],
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
          slotName: 'warehouse'
        },
        {
          slot: true,
          slotName: 'stock'
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
          slotName: 'estimatedSaleDay'
        },
        {
          slot: true,
          slotName: 'estimatedBalanceDay'
        },
        {
          slot: true,
          slotName: 'estimatedBalanceQty'
        },
        {
          label: '安全天数',
          prop: 'safeDay',
          minWidth: '80px',
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
    this.getDictionary()
    this.initialization()
  },
  methods: {
    getDictionary() {
      // 仓库名称
      getAllEnableWarehouse().then(res => {
        this.warehouseNameList = res.data
      })
      getOrg().then(res => {
        this.orgList = res.data
      })
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        res.data.forEach(item => {
          this.warehouseBelongObj[item.dictKey] = item.dictValue
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
    detailBtn(val) {
      this.$newTab({
        path: '/stockAnalysis/forecast/detail',
        title: '库存预测详情',
        component: forecastDateil,
        data: {
          dateil: val
        },
        clearCache: true,
        callback: () => {}
      })
    },
    getBegin(val) {
      if (val) {
        if (this.submit.estimatedBalanceDay_ending) {
          if (+val > +this.submit.estimatedBalanceDay_ending) {
            this.$message.error('预计结余天数的起始值要小于结束值！')
            this.submit.estimatedBalanceDay_beginning = this.oldBegin
          } else {
            this.oldBegin = val
          }
        } else {
          this.oldBegin = val
        }
      } else {
        this.oldBegin = val
      }
    },
    getEnding(val) {
      if (val) {
        if (this.submit.estimatedBalanceDay_beginning) {
          if (+val < +this.submit.estimatedBalanceDay_beginning) {
            this.$message.error('预计结余天数的结束值要大于起始值！')
            this.submit.estimatedBalanceDay_ending = this.oldEnd
          } else {
            this.oldEnd = val
          }
        } else {
          this.oldEnd = val
        }
      } else {
        this.oldEnd = val
      }
    },
    selectionChange(val) {
      this.selectionList = val
      this.selectionList.forEach(item => {
        item.warehouse.warehouseBelongDesc = this.warehouseBelongObj[item.warehouse.warehouseBelong]
      })
    },
    isRed(val) {
      if (+val.estimatedBalanceDay < +val.safeDay) {
        return true
      } else {
        return false
      }
    },
    downloadTemp() {
      if (this.selectionList.length === 0) {
        this.$message.error('请勾选需导出的数据')
      } else {
        this.$message.success('正在下载，请稍等片刻...')
        const name = '库存预测导出数据.xlsx'
        downloadTemplate(this.selectionList).then(res => {
          if (res.size) {
            dowloadExc(res, name)
            this.reset()
          }
        }).catch(() => {
          this.$message.error('请求异常，导出失败！')
        })
      }
    },
    search() {
      const submit = this.submit
      if ((submit.estimatedBalanceDay_ending && submit.estimatedBalanceDay_beginning) || (!submit.estimatedBalanceDay_ending && !submit.estimatedBalanceDay_beginning)) {
        submit.productOwnerId = this.productOwnerIdList.length && submit.productAuthId ? this.productOwnerIdList[1] : ''
        this.searchData = JSON.parse(JSON.stringify(submit))
        this.initialization()
      } else {
        this.$message.error('请填写完整的预计结余天数范围！')
      }
    },
    reset() {
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.options = []
      this.selectionList = []
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
::v-deep .el-table .cell{
  line-height: 14px!important;
  padding: 0!important;
  .el-checkbox{
    padding-left: 8px!important;
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
.redColor{
 color: red;
}
</style>
