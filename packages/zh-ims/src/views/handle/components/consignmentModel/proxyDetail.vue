<template>
  <!-- 分销明细 -->
  <basic-container ref="box" v-loading="loading">
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
            <el-form-item label="代销方(货权)">
              <el-input :value="distriData.productAuthName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代销方(货主)">
              <el-input :value="distriData.productOwnerName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代销数量">
              <el-input :value="distriData.changeQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代销金额">
              <el-input :value="distriData.proxyAmount" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">代销明细</span>
      </div>
      <el-table :data="recordData" size="mini" :max-height="maxHeight" stripe border class="g-table">
        <el-table-column prop="businessType" label="业务类型" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ warehouseTypeObj[scope.row.businessType] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="businessCode" label="业务单号" align="center" min-width="200" show-overflow-tooltip />
        <el-table-column prop="changeQty" label="代销数量" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.changeQty) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priceAfterAuth" label="代销单价" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.priceAfterAuth) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="proxyAmount" label="代销金额" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.proxyAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" min-width="130" show-overflow-tooltip />
      </el-table>
    </el-card>

  </basic-container>
</template>

<script>

import { getDistribution } from '@/api/handle/consignment.js'
import { getDictBiz } from '@/api/public/public.js'
export default {
  name: 'ProxyDetail',
  props: {
    distriData: Object
  },
  data() {
    return {
      recordData: [],
      warehouseTypeObj: {},
      maxHeight: '0',
      loading: false
    }
  },
  mounted() {
    this.getData()
    this.$nextTick(() => {
      this.basisHeight = this.$refs.basis.$el.clientHeight
      this.maxHeight = (this.$refs.box.$el.clientHeight - this.basisHeight - 80) + 'px'
    })
  },
  methods: {
    getData() {
      this.loading = true
      // 仓库类型
      getDictBiz('OutputWarehouseType').then(res => {
        res.data.forEach(item => {
          this.warehouseTypeObj[item.dictKey] = item.dictValue
        })
      })

      const obj = {
        productProxySaleId: this.distriData.productProxySaleId,
        productOwnerId: this.distriData.productOwnerId,
        productSku: this.distriData.productSku,
        warehouseId: this.distriData.warehouseId
      }
      getDistribution(obj).then(res => {
        this.recordData = res.data
        this.loading = false
      })
    },
    isHas(val) {
      if (val === -1 || (!val && val !== 0)) {
        return ''
      } else {
        return val
      }
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
