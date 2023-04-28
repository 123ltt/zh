<template>
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">产品调价</span>
      </div>
      <el-table :data="adjustHisData" stripe border class="g-table">
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="90" />
        <el-table-column prop="productName" label="产品名称" align="center" min-width="100" />
        <el-table-column prop="preAdjustSupplierName" label="原供应商" align="center" min-width="130" />
        <el-table-column prop="preAdjustPurchasePrice" label="原采购单价" align="center" min-width="90" />
        <el-table-column prop="postAdjustPrice" label="调后单价" align="center" min-width="70" />
        <el-table-column prop="postSupplierName" label="调后供应商" align="center" min-width="130" />
        <!-- 涨降幅度 -->
        <el-table-column prop="priceChange" label="涨降幅度" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.priceChange >0">
              <i class="el-icon-top" style="color:red" /> +{{ scope.row.priceChange }} %
            </span>
            <span v-if="scope.row.priceChange <0">
              <i class="el-icon-bottom" style="color:green" /> {{ scope.row.priceChange }} %
            </span>
            <span v-if="scope.row.priceChange==0"> {{ scope.row.priceChange }}</span>
          </template>
        </el-table-column>
        <!-- 调价原因 -->
        <el-table-column prop="adjustReason" label="调价原因" align="center" min-width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.adjustType == 1">{{ upReasonObj[scope.row.adjustReason] }}</span>
            <span v-if="scope.row.adjustType == 2">{{ downReasonObj[scope.row.adjustReason] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="adjustComment" label="调价备注" align="center" min-width="100">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="3">{{ scope.row.adjustComment }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="adjustImage" label="调价图片" align="center" width="75">
          <template slot-scope="scope">
            <g-thumb class="d-table-cell" :url="scope.row.adjustImage" />
          </template>
        </el-table-column>
        <el-table-column prop="verifyStatus" label="审核意见" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ verifyStatusObj[scope.row.verifyStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="verifyComment" label="审核备注" align="center" min-width="100">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="3">{{ scope.row.verifyComment }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="applicantName" label="申请人" align="center" min-width="90" />
        <el-table-column prop="applicantTime" label="申请时间" align="center" min-width="90" />
      </el-table>
    </el-card>
  </basic-container>
</template>
<script>

import { dictionary } from '@/api/commonApi'
import { getAdjustHis } from '@/api/ordermanagement/price'

export default {
  name: 'PriceAdjustHis',
  props: {
    detailData: Object
  },
  data() {
    return {
      adjustHisData: [],
      loading: false,
      upReasonObj: {},
      downReasonObj: {},
      verifyStatusObj: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      dictionary('ips_raise_price_reason').then(res => {
        res.data.forEach(item => {
          this.upReasonObj[item.dictKey] = item.dictValue
        })
      })
      dictionary('ips_reduce_price_reason').then(res => {
        res.data.forEach(item => {
          this.downReasonObj[item.dictKey] = item.dictValue
        })
      })
      dictionary('ips_price_audit_status').then(res => {
        res.data.forEach(item => {
          this.verifyStatusObj[item.dictKey] = item.dictValue
        })
      })
      getAdjustHis(this.detailData.id).then(res => {
        const data = res.data
        this.adjustHisData = data
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
