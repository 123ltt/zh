<template>
  <!-- 库存成本详情 -->
  <basic-container ref="box">
    <el-card ref="infoBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="100px" size="mini" class="no-message" :model="detailData">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="产品编码">
              <el-input :value="detailData.productSku" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称">
              <el-input :value="detailData.skuInfo.productName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品类目">
              <el-input :value="detailData.skuInfo.categoryName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货权">
              <el-input :value="detailData.productAuthName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货主">
              <el-input :value="detailData.productOwnerName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">仓库维度</span>
      </div>
      <div :style="{ height: maxHeight + 'px' }">
        <g-table ref="table" :headers="headers" :fetch="fetch" row-key="warehouseId">

          <!-- 仓库归属 -->
          <el-table-column slot="warehouseBelong" label="仓库归属" min-width="100" align="center">
            <template v-slot="{row}">
              <span>{{ warehouseBelongObj[row.warehouse.warehouseBelong] }}</span>
            </template>
          </el-table-column>

          <!-- 采购信息 -->
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

          <!-- 关联人员 -->
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

          <!-- 仓库 -->
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

          <!-- 采购 -->
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

        </g-table>
      </div>
    </el-card>
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/stockAnalysis/salesVolume.js'
import { getDictBiz } from '@/api/public/public.js'

export default {
  name: 'SalesVolumeDetail',
  props: {
    detailData: Object
  },
  data() {
    return {
      maxHeight: '',
      stockData: [],
      warehouseBelongObj: {},
      headers: [
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
          minWidth: '100px',
          align: 'center'
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
  created() {
    this.getData()
  },
  mounted() {
    this.$nextTick(() => {
      const allHeight = this.$refs.box.$el.clientHeight
      const infoHeight = this.$refs.infoBox.$el.clientHeight || 0
      this.maxHeight = allHeight - infoHeight - 70
    })
    this.initialization()
  },
  methods: {
    getData() {
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        res.data.forEach(item => {
          this.warehouseBelongObj[item.dictKey] = item.dictValue
        })
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      const obj = {
        category: this.detailData.skuInfo.categoryId,
        productSku: this.detailData.productSku,
        productAuthId: this.detailData.productAuthId,
        productOwnerId: this.detailData.productOwnerId
      }
      return getDetail(current, size, obj).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.$refs.table.load(1)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-table .cell{
  line-height: 14px!important;
}
</style>
