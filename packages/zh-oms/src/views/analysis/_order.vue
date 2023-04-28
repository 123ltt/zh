<template>
  <basic-container class="container">
    <Search ref="searchForm" :update-table-height="updateTableHeight" :search="search" />
    <FiveCards v-if="flag" ref="fiveCards" :sum="sum" />
    <PubChart ref="pubChart" />
    <el-tabs v-model="activeName" class="orderTab">
      <el-tab-pane label="店铺销售数据排名汇总" name="first">
        <div>
          <g-table ref="platTable"
                   :headers="platformHeaders"
                   row-key="id"
                   :page-show="false"
                   class="platformTable"
                   show-summary
                   :fixed-height="false"
                   :summary-method="getPlatSummaries"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="区域销售数据排名汇总" name="second">
        <div>
          <g-table ref="countryTable"
                   :headers="countryHeaders"
                   row-key="id"
                   :page-show="false"
                   class="countryTable"
                   show-summary
                   :fixed-height="false"
                   :summary-method="getCountrySummaries"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

  </basic-container>
</template>

<script>
import Search from './order/search.vue'
import FiveCards from './order/fiveCards.vue'
import { getPageList } from '@/api/orderAnalysis'
import PubChart from './order/pubChart.vue'

export default {
  name: 'OmsAnalysisOrder',
  components: { Search, FiveCards, PubChart },
  data() {
    return {
      activeName: 'first',
      searchParams: {},
      checked_radio: '按天',
      flag: false,
      sum: {},
      countryTableType: 'countryTable',
      option: {}, // echarts配置
      platformHeaders: [
        { type: 'index', label: '排名', width: '50px' },
        { label: '平台', prop: 'platformCode' },
        { label: '店铺', prop: 'storeName' },
        { label: '订单量', prop: 'orderCount', sortable: true },
        { label: '销售额($)', prop: 'salesAmount', sortable: true },
        { label: '试算利润($)', prop: 'forecastProfits', sortable: true },
        { label: '客单价($)', prop: 'customerUnitPrice', sortable: true },
        { label: '退款金额($)', prop: 'refundAmount', sortable: true }
      ],
      countryHeaders: [
        { type: 'index', label: '排名', width: '50px' },
        { label: '国家', prop: 'countryName' },
        { label: '订单量', prop: 'orderCount', sortable: true },
        { label: '销售额($)', prop: 'salesAmount', sortable: true },
        { label: '试算利润($)', prop: 'forecastProfits', sortable: true },
        { label: '客单价($)', prop: 'customerUnitPrice', sortable: true },
        { label: '退款金额($)', prop: 'refundAmount', sortable: true }
      ]
    }
  },
  mounted() {
    this.$refs.pubChart.getChartData({}, this.$refs.searchForm.form)
    this.fetchTable(this.$refs.searchForm.form)
  },
  methods: {
    updateTableHeight() {
      this.$nextTick(
        this.$refs.platTable.updateTableHeight,
        this.$refs.countryTable.updateTableHeight
      )
    },
    getPlatColumn(index) {
      const sum = this.sum
      const sums = {
        0: '总计',
        1: '',
        2: '',
        3: sum.orderCount,
        4: sum.salesAmount,
        5: sum.forecastProfits,
        6: sum.customerUnitPrice,
        7: sum.refundAmount
      }
      return sums[index]
    },
    getCountryColumn(index) {
      const sum = this.sum
      const sums = {
        0: '总计',
        1: '',
        2: sum.orderCount,
        3: sum.salesAmount,
        4: sum.forecastProfits,
        5: sum.customerUnitPrice,
        6: sum.refundAmount
      }
      return sums[index]
    },
    // 平台列表总计逻辑
    getPlatSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        this.getPlatColumn(index)
      })
      return sums
    },
    // 国家列表总计逻辑
    getCountrySummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        this.getCountryColumn(index)
      })
      return sums
    },
    fetchTable(params) {
      return getPageList({ current: 1, size: 50 }, params).then(res => {
        this.sum = res.data.sum
        this.flag = true
        this.$refs.platTable.tableList = (res.data.storeRanking || []).map(item => {
          item.customerUnitPrice = Number(item.customerUnitPrice)
          item.forecastProfits = Number(item.forecastProfits)
          item.refundAmount = Number(item.refundAmount)
          item.salesAmount = Number(item.salesAmount)
          return item
        })
        this.$refs.countryTable.tableList = (res.data.countryRanking || []).map(item => {
          item.customerUnitPrice = Number(item.customerUnitPrice)
          item.forecastProfits = Number(item.forecastProfits)
          item.refundAmount = Number(item.refundAmount)
          item.salesAmount = Number(item.salesAmount)
          return item
        })
      })
    },
    search() { // 点击搜索的时候，重新查数据
      this.$refs.pubChart.getChartData({}, this.$refs.searchForm.form)
      this.fetchTable(this.$refs.searchForm.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.copy-hover-i:hover{
  color: $--color-primary;
}
.chartRadio{
  text-align:right;
  margin-right:49px;
}
.orderTab{
  margin: 10px 34px 10px 34px;
}
</style>
