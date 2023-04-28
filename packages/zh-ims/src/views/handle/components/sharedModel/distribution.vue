<template>
  <basic-container ref="box" v-loading="loading">
    <!-- 分销明细 -->
    <el-card ref="basis">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form size="mini" :model="distriData" label-width="120px" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input :value="distriData.productSku" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input :value="distriData.skuInfo.productName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分销方(货权)">
              <el-input :value="distriData.productAuthName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分销方(货主)">
              <el-input :value="distriData.productOwnerName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分销数量">
              <el-input :value="distriData.distributionQuantity" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分销金额">
              <el-input :value="distriData.distributionAmount" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">分销明细</span>
      </div>
      <el-table :data="recordData" size="mini" :max-height="maxHeight" stripe border class="g-table">
        <el-table-column prop="businessType" label="业务类型" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ typeObj[scope.row.businessType] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="businessCode" label="业务单号" align="center" min-width="200" show-overflow-tooltip />
        <el-table-column prop="distributionQuantity" label="分销数量" align="center" min-width="70">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.distributionQuantity) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priceBeforeSharing" label="共享前价格" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.priceBeforeSharing) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="distributionPrice" label="分销单价" align="center" min-width="70">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.distributionPrice) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="distributionAmount" label="分销金额" align="center" min-width="70">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.distributionAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" min-width="130" show-overflow-tooltip />
      </el-table>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination :current-page="page.current" :page-sizes="[10, 40, 50, 80]" :page-size="page.size" :total="page.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

  </basic-container>
</template>

<script>

import { getDistribution } from '@/api/handle/shared.js'
import { getDictBiz } from '@/api/public/public.js'

export default {
  name: 'Distribution',
  props: {
    distriData: Object
  },
  data() {
    return {
      recordData: [],
      //   分页参数,
      page: {
        current: 1,
        total: 1,
        size: 10
      },
      typeObj: {},
      maxHeight: '0',
      loading: false
    }
  },
  created() {
    this.getData()
    this.$nextTick(() => {
      this.basisHeight = this.$refs.basis.$el.clientHeight
      this.maxHeight = (this.$refs.box.$el.clientHeight - this.basisHeight - 120) + 'px'
    })
    this.initialization()
  },
  methods: {
    getData() {
      // 仓库归属
      getDictBiz('OutputWarehouseType').then(res => {
        res.data.forEach(item => {
          this.typeObj[item.dictKey] = item.dictValue
        })
      })
    },
    initialization() {
      this.loading = true
      const obj = {
        sharingId: this.distriData.sharingId,
        productAuthId: this.distriData.productAuthId,
        productOwnerId: this.distriData.productOwnerId,
        productSku: this.distriData.productSku
      }
      getDistribution(this.page.current, this.page.size, obj).then(res => {
        this.recordData = res.data.records
        this.loading = false
      })
    },
    isHas(val) {
      if (val === -1 || !val) {
        return ''
      } else {
        return val
      }
    },
    // 点击分页
    handleSizeChange(val) {
      this.page.size = val
      this.page.current = 1
      this.initialization()
    },
    // 点击页码跳转
    handleCurrentChange(val) {
      this.page.current = val
      this.initialization()
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
::v-deep .el-card__body{
    padding-bottom: 0!important;
  }

.divider{
  display: inline-block;
  width: 10%;
  text-align: center;
  color: #c4c7cf;
}

.redStar{
  color: red;
  font-size: 12px;
}
.block {
        text-align: right;
        margin-top: 20px;
        }
</style>
