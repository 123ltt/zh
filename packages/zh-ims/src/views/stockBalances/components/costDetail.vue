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
            <el-form-item label="仓库类型">
              <el-input :value="detailData.warehouse.warehouseType.desc" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库归属">
              <el-input :value="warehouseBelongObj[detailData.warehouse.warehouseBelong] " disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库名称">
              <el-input :value="detailData.warehouse.warehouseName" disabled />
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
          <el-col :span="8">
            <el-form-item label="库存期间">
              <el-input :value="detailData.stockPeriod" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存平均成本">
              <el-input :value="detailData.stockAvgCost" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="期初库存">
              <el-input :value="detailData.openingStockQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="期末库存">
              <el-input :value="detailData.endingStockQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="期初库存成本">
              <el-input :value="detailData.openingStockQtyCost" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="增加库存成本">
              <el-input :value="detailData.addStockQtyCost" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="期末库存成本">
              <el-input :value="detailData.endingStockQtyCost" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">成本单据</span>
      </div>
      <div :style="{ height: maxHeight + 'px' }">
        <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
          <template slot="header">
            <el-form label-width="100px" size="mini" class="no-message" :model="submit">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="批次号">
                    <el-input v-model.trim="submit.batchCode" clearable placeholder="请填写" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                    <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>

          <el-table-column slot="availableQty" align="center" min-width="150">
            <template slot="header">
              <span>库位数量  </span><span style="color:blue">  合计：{{ detailData.endingStockQty }}</span>
            </template>
            <template v-slot="{row}">
              <span>{{ row.availableQty }}</span>
            </template>
          </el-table-column>

          <el-table-column slot="stockCost" align="center" min-width="150">
            <template slot="header">
              <span>库存成本  </span><span style="color:blue">  合计：{{ detailData.endingStockQtyCost }}</span>
            </template>
            <template v-slot="{row}">
              <span>{{ row.stockCost }}</span>
            </template>
          </el-table-column>

        </g-table>
      </div>
    </el-card>
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/stockBalances/cost.js'

export default {
  name: 'CostDetail',
  props: {
    detailData: Object,
    warehouseBelongObj: Object
  },
  data() {
    return {
      submit: {
        batchCode: '',
        stockCostId: ''
      },
      searchData: {},
      maxHeight: '',
      // 表格数据
      headers: [
        {
          label: '批次号',
          prop: 'batchCode',
          minWidth: '200px',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          label: '库位号',
          prop: 'stockLocationOutsideCode',
          showOverflowTooltip: true,
          minWidth: '200px',
          align: 'center'
        },
        {
          label: '综合成本单价',
          prop: 'comprehensiveCostPrice',
          minWidth: '120px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'availableQty'
        },
        {
          slot: true,
          slotName: 'stockCost'
        },
        {
          label: '添加时间',
          prop: 'addTime',
          minWidth: '150px',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      const allHeight = this.$refs.box.$el.clientHeight
      const infoHeight = this.$refs.infoBox.$el.clientHeight || 0
      this.maxHeight = allHeight - infoHeight - 70
    })
    this.submit.stockCostId = this.detailData.id
    this.search()
  },
  methods: {
    // 初始化数据
    fetch({ current, size }, params) {
      return getDetail(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.$refs.table.load(1, this.searchData)
    },
    search() {
      this.initialization()
    },
    reset() {
      this.submit.batchCode = ''
      this.searchData = {}
      this.initialization()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
