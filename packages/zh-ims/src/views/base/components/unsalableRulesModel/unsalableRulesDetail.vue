<template>
  <!-- 转移详情 -->
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="100px" size="mini" class="no-message" :model="detailData">
        <el-row :gutter="30">
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
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="仓库类型">
              <el-input :value="detailData.warehouse.warehouseType.desc" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库归属">
              <el-input :value="warehouseBelongObj[detailData.warehouse.warehouseBelong]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库名称">
              <el-input :value="detailData.warehouse.warehouseName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">滞销规则</span>
      </div>
      <el-table :data="detailData.unsalableRuleDetailList" size="mini" max-height="350px" stripe style="width: 100%" border>
        <el-table-column prop="productCycleType" label="产品周期性" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.productCycleType == 'in_season'?'应季产品':'非应季产品' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="seasonNatureName" label="季节属性" align="center" min-width="100" />
        <el-table-column prop="seasonPeriod" label="季节周期" align="center" min-width="130">
          <template slot-scope="{row}">
            <span v-if="row.seasonPeriodBegin">{{ replaceDate(row.seasonPeriodBegin) }}  ~  {{ replaceDate(row.seasonPeriodEnd) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="unsalableDate" label="滞销日期" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ replaceDate(row.unsalableDate) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="productAgeValue" label="产品库龄" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ characterObj[row.productAgeOperate] }}  {{ row.productAgeValue }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productTurnoverDayValue" label="产品周转天数" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ characterObj[row.productTurnoverDayOperate] }}  {{ row.productTurnoverDayValue }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productSalesValue" label="产品销量" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ characterObj[row.productSalesOperate] }}  {{ row.productSalesValue }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">滞销规则</span>
      </div>
      <el-table :data="detailData.unsalableRuleHislList" size="mini" max-height="350px" stripe style="width: 100%" border>
        <el-table-column prop="updateUserName" label="操作人" align="center" min-width="100" />
        <el-table-column prop="updateTime" label="操作时间" align="center" min-width="130" />
        <el-table-column prop="content" label="操作记录" align="center" min-width="250" />
      </el-table>
    </el-card>

  </basic-container>
</template>

<script>
import { getDetail } from '@/api/base/unsalableRules.js'
import { getDictBiz } from '@/api/public/public.js'

export default {
  name: 'UnsalableRulesDetail',
  props: {
    id: String,
    warehouseBelongObj: Object
  },
  data() {
    return {
      loading: false,
      detailData: {
        warehouse: {
          warehouseType: {}
        }
      },
      characterObj: {}
    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(id) {
      this.loading = true
      // 操作符
      getDictBiz('operator').then(res => {
        res.data.forEach(item => {
          console.log(31, item)
          this.characterObj[item.dictKey] = item.dictValue
        })
        console.log(465, this.characterObj)
      })
      getDetail(id).then(res => {
        this.detailData = res.data
        this.removeNum(this.detailData.unsalableRuleDetailList)
        this.loading = false
      })
    },
    removeNum(arr) {
      arr.forEach(item => {
        Object.keys(item).forEach(el => {
          if (item[el] === -1) {
            item[el] = ''
          }
        })
      })
    },
    replaceDate(val) {
      if (val) {
        const strA = val.split('-')[0]
        const strB = val.split('-')[1]
        return `${strA}月 ${strB}日`
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
