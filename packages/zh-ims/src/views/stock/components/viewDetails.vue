<template>
  <!-- 详情 -->
  <basic-container v-loading="loading">
    <el-card>
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
              <el-input :value="detailData.skuInfo.categoryPath" disabled />
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
          <el-col v-if="type=='all'" :span="8">
            <el-form-item label="库存总量">
              <el-input :value="detailData.stockTotal" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-tabs v-if="isOk" v-model="activeName" type="border-card" style="box-shadow:none">
      <el-tab-pane v-for="(item,index) in detailList" :key="index" :label="item.title" :name="item.name">
        <viewChildDetails :warehouse-type-list="warehouseTypeList" :warehouse-name-list="warehouseNameList" :warehouse-belong-list="warehouseBelongList" :parameter="parameter" :detail-data="detailData" :warehouse-belong-obj="warehouseBelongObj" :type="item.type" />
      </el-tab-pane>
    </el-tabs>

  </basic-container>
</template>

<script>
import { getDetail } from '@/api/stock/view.js'
import { getDictBiz, getAllEnableWarehouse } from '@/api/public/public.js'
import viewChildDetails from './viewChildDetails.vue'
export default {
  name: 'ViewDetail',
  components: { viewChildDetails },
  props: {
    parameter: Object,
    type: String
  },
  data() {
    return {
      loading: false,
      activeName: '',
      warehouseTypeList: [],
      warehouseNameList: [],
      warehouseBelongList: [],
      warehouseBelongObj: {},
      detailData: {
        skuInfo: {
          productName: '',
          categoryPath: ''
        }
      },
      detailList: [
        { title: '库存明细', name: 'all', type: 'all' },
        { title: '采购中库存列表', name: 'purchasing', type: 'purchasing' },
        { title: '在途库存', name: 'intransit', type: 'intransit' },
        { title: '可用库存', name: 'available', type: 'available' },
        { title: '冻结库存', name: 'freeze', type: 'freeze' },
        { title: '备用库存', name: 'reserve', type: 'reserve' },
        { title: '在库库存', name: 'inWarehouse', type: 'inWarehouse' },
        { title: '缺货库存', name: 'oosQuantity', type: 'oosQuantity' }
      ],
      isOk: false
    }
  },
  mounted() {
    this.getData()
    this.getDetail()
    this.activeName = this.type
  },
  methods: {
    getData() {
      // 仓库类型
      getDictBiz('warehouse_type').then(res => {
        this.warehouseTypeList = res.data
      })
      // 仓库名称
      getAllEnableWarehouse().then(res => {
        this.warehouseNameList = res.data
      })
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        this.warehouseBelongList = res.data
        this.warehouseBelongList.forEach(item => {
          this.warehouseBelongObj[item.dictKey] = item.dictValue
        })
      })
    },
    getDetail() {
      this.loading = true
      this.isOk = false
      getDetail(this.parameter).then(res => {
        this.detailData = res.data
        this.isOk = true
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btnBox{
  ::v-deep .el-form-item__content{
    margin-left: 0!important;
  }
}
</style>
