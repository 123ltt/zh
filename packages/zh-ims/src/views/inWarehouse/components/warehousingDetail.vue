<template>
  <!-- 入库详情 -->
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="100px" size="mini" class="no-message" :model="detailData">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="业务类型">
              <el-input :value="detailData.inputType.desc" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务单号">
              <el-input :value="detailData.businessCode" disabled />
            </el-form-item>
          </el-col>
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
          <el-col :span="8">
            <el-form-item label="入库单号">
              <el-input :value="detailData.inputCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库日期">
              <el-input :value="detailData.inputDate" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库数量">
              <el-input :value="detailData.inputQty" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">仓库明细</span>
      </div>
      <el-form label-width="100px" size="mini" class="no-message">
        <el-row>
          <el-col :span="6">
            <el-form-item label="产品编码">
              <el-input v-model.trim="productSku" clearable placeholder="请填写" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="submit()">查询</el-button>
              <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
        <el-table-column prop="skuInfo.categoryPath" label="产品类目" align="center" min-width="90">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.categoryPath }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="productAuthName" label="货权" align="center" min-width="130">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.productAuthName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="productOwnerName" label="货主" align="center" min-width="100">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.productOwnerName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="batchCode" label="批次号" align="center" min-width="120" show-overflow-tooltip />
        <el-table-column prop="stockAgeDate" label="库龄日期" align="center" min-width="120" />
        <el-table-column prop="inputQty" label="入库数量" align="center" min-width="90" />
      </el-table>
    </el-card>
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/inWarehouse/warehousing.js'
export default {
  name: 'WarehousingDetail',
  props: {
    id: String,
    warehouseBelongObj: Object
  },
  data() {
    return {
      loading: false,
      recordData: [],
      productSku: '',
      detailData: {
        inputType: { desc: '' },
        warehouse: {
          warehouseType: { desc: '' },
          warehouseBelong: '',
          warehouseName: ''
        }
      },
      submitData: {}
    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(id) {
      this.loading = true
      getDetail(id).then(res => {
        this.detailData = res.data
        res.data.orderDetailList.forEach(item => {
          item.stockAgeDate = res.data.inputDate.split(' ')[0]
        })
        this.recordData = res.data.orderDetailList
        this.submitData = res.data.orderDetailList
        this.loading = false
      })
    },
    submit() {
      if (this.productSku) {
        this.recordData = this.submitData.filter(item => {
          return item.productSku === this.productSku
        })
      } else {
        this.recordData = this.submitData
      }
    },
    reset() {
      this.productSku = ''
      this.recordData = this.submitData
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
