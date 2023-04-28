<template>
  <!-- 详情 -->
  <div style="width:100%;height:100%">
    <purchasingDetails v-if="type =='purchasing'" :id="detailData.id" />
    <intransitDetails v-if="type =='intransit'" :id="detailData.id" />
    <availableDetails v-if="type =='available'" :id="detailData.id" />
    <reserveDetails v-if="type =='reserve'" :id="detailData.id" />
    <inWarehouseDetails v-if="type =='inWarehouse'" :id="detailData.id" />
    <freezeDetails v-if="type =='freeze'" :id="detailData.id" />
    <oosQuantityDetails v-if="type =='oosQuantity'" :id="detailData.id" />
  </div>
</template>

<script>
import purchasingDetails from './purchasingDetails.vue'
import intransitDetails from './intransitDetails.vue'
import availableDetails from './availableDetails.vue'
import reserveDetails from './reserveDetails.vue'
import inWarehouseDetails from './inWarehouseDetails.vue'
import freezeDetails from './freezeDetails.vue'
import oosQuantityDetails from './oosQuantityDetails.vue'

export default {
  name: 'ViewGrandsonDetails',
  components: { purchasingDetails, intransitDetails, availableDetails, reserveDetails, inWarehouseDetails, freezeDetails, oosQuantityDetails },
  props: {
    warehouseBelongObj: Object,
    type: String,
    openData: Object
  },
  data() {
    return {
      loading: false,
      activeName: '',
      recordData: [],
      detailData: {
        skuInfo: {
          productName: '',
          categoryPath: ''
        },
        warehouse: {
          warehouseType: { desc: '' },
          warehouseBelong: '',
          warehouseName: ''
        }
      }
    }
  },
  created() {
    this.detailData = this.openData
  },
  mounted() {
    this.activeName = this.type || 'purchasing'
  },
  methods: {

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
