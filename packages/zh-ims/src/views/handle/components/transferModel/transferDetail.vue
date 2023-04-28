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
            <el-form-item label="转移编码">
              <el-input :value="detailData.changeCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="转移方(货权)">
              <el-input :value="detailData.productAuthName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="转移方(货主)">
              <el-input :value="detailData.productOwnerName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="转移数量">
              <el-input :value="detailData.changeQtyTotal" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="转移前金额">
              <el-input :value="detailData.priceBeforeTotal" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="转移后金额">
              <el-input :value="detailData.priceAfterTotal" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="折损/溢价金额">
              <el-input :value="detailData.priceDiff" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="转移人">
              <el-input :value="detailData.createUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <el-input :value="detailData.createTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">转移明细</span>
      </div>
      <el-table :data="recordData" max-height="400" stripe style="width:100%" size="mini" border class="g-table">
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="110" />
        <el-table-column prop="skuInfo" label="产品图片" align="center" width="70">
          <template slot-scope="scope">
            <g-thumb class="d-table-cell" :url="scope.row.skuInfo.imageUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="skuInfo.productName" label="产品名称" align="center" min-width="120">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.productName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="skuInfo.categoryPath" label="产品类目" align="center" min-width="110">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.categoryPath }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="warehouse.warehouseType.desc" label="仓库类型" align="center" min-width="80" />
        <el-table-column prop="warehouseBelong" label="仓库归属" align="center" min-width="80">
          <template v-slot="{row}">
            <span>{{ warehouseObj[row.warehouse.warehouseBelong] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="warehouse.warehouseName" label="仓库名称" align="center" min-width="100" />
        <el-table-column prop="productAuthName" label="接受方（货权）" align="center" min-width="130" show-overflow-tooltip />
        <el-table-column prop="productOwnerName" label="接受方（货主）" align="center" min-width="130" show-overflow-tooltip />
        <el-table-column prop="stockLocationOutsideCode" label="库位号" align="center" min-width="100" />
        <el-table-column prop="changeQty" label="转移数量" align="center" min-width="70" />
        <el-table-column prop="priceBeforeChange" label="转移前单价" align="center" min-width="90" />
        <el-table-column prop="priceBeforeTotal" label="转移前金额" align="center" min-width="90" />
        <el-table-column prop="priceAfterChange" label="转移后单价" align="center" min-width="90" />
        <el-table-column prop="priceAfterTotal" label="转移后金额" align="center" min-width="90" />
      </el-table>
    </el-card>
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/handle/transfer.js'
import { getDictBiz } from '@/api/public/public.js'
export default {
  name: 'TransferDetail',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      recordData: [],
      warehouseObj: {},
      detailData: {}
    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(id) {
      this.loading = true
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        res.data.forEach(item => {
          this.warehouseObj[item.dictKey] = item.dictValue
        })
      })
      getDetail(id).then(res => {
        this.detailData = res.data
        this.recordData = res.data.productAuthChangeDetailList
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
