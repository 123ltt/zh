<template>
  <!-- 安全天数详情 -->
  <basic-container ref="box" v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item ref="infoBox" title="基本信息" name="1">
        <el-form label-width="130px" size="mini" class="no-message" :model="dateil" disabled>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="产品编码">
                <el-input :value="dateil.productSku" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品名称">
                <el-input :value="dateil.skuInfo.productName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品类目">
                <el-input :value="dateil.skuInfo.categoryName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货权">
                <el-input :value="dateil.productAuthName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓库类型">
                <el-input :value="dateil.warehouse.warehouseType.desc" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓库归属">
                <el-input :value="warehouseBelongObj[dateil.warehouse.warehouseBelong]" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓库名称">
                <el-input :value="dateil.warehouse.warehouseName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可用库存">
                <el-input :value="dateil.availableStock" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备用库存">
                <el-input :value="dateil.reserveStock" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购中库存">
                <el-input :value="dateil.purchasingStock" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="在途库存">
                <el-input :value="dateil.intransitStock" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺货库存">
                <el-input :value="dateil.oosStock" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售等级">
                <el-input :value="dateil.salesRank" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售趋势">
                <el-input :value="add(dateil.salesTendency)" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="加权日均销量">
                <el-input :value="dateil.wtdDaysSalesQty" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预计结余天数">
                <el-input :value="dateil.estimatedBalanceDay" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预计结余数量">
                <el-input :value="dateil.estimatedBalanceQty" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预计可售卖天数">
                <el-input :value="dateil.estimatedSaleDay" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>

      <el-collapse-item title="仓库维度预测" name="2">
        <el-table :data="tableData" size="mini" max-height="350px" stripe style="width: 100%" border>
          <el-table-column prop="stockType" label="仓库类型" align="center" min-width="110" />
          <el-table-column prop="stockQty" label="库存数量" align="center" min-width="90" />
          <el-table-column prop="businessType" label="业务类型" align="center" min-width="110" />
          <el-table-column prop="businessCode" label="业务单号" align="center" min-width="130" />
          <el-table-column prop="estimatedArrivalTime" label="预计到货时间" align="center" min-width="140" />
          <el-table-column prop="estimatedArrivalDay" label="预计到货天数" align="center" min-width="140" />
          <el-table-column prop="estimatedSaleDay" label="预计可售卖天数" align="center" min-width="140" />
          <el-table-column prop="estimatedBalanceDay" label="预计结余天数" align="center" min-width="150" />
          <el-table-column prop="estimatedBalanceQty" label="预计结余数量" align="center" min-width="150" />
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </basic-container>

</template>

<script>
import { getDetail } from '@/api/stockAnalysis/forecast.js'
import { getDictBiz } from '@/api/public/public.js'

export default {
  name: 'ForecastDateil',
  props: {
    dateil: Object
  },
  data() {
    return {
      loading: false,
      warehouseBelongObj: {},
      tableData: [],
      activeNames: ['1', '2']
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        res.data.forEach(item => {
          this.warehouseBelongObj[item.dictKey] = item.dictValue
        })
      })
      getDetail(this.dateil.id).then(res => {
        this.tableData = res.data
        this.tableData[0].estimatedArrivalTime = ''
        this.tableData[0].estimatedArrivalDay = ''
        this.tableData[0].estimatedBalanceDay = ''
        this.tableData[0].estimatedBalanceQty = ''
      })
    },
    add(val) {
      return val + '%'
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-collapse-item__header{
  padding: 0 30px;
  font-weight: 600;
  ::v-deep .el-collapse-item__arrow{
    margin: 0 auto 0 20px;
    font-weight: 600;
  }
}
</style>
