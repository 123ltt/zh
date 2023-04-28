<template>
  <!-- 我的审核-产品开发审核 -->
  <basic-container>
    <el-tabs v-model="activeName" class="audit-tab" @tab-click="handleClick">
      <el-tab-pane label="产品开发审核" name="1">
        <ProductDevAudit />
      </el-tab-pane>
      <el-tab-pane label="SPU/SKU审核" name="2" lazy>
        <spu-or-sku-audit />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import ProductDevAudit from './productDevAudit'
import SpuOrSkuAudit from './spuOrSkuAudit.vue'

export default {
  name: 'PmsMyAudit',
  components: { ProductDevAudit, SpuOrSkuAudit },
  data() {
    return {
      activeName: this.$route.params.type || '1'
    }
  },
  methods: {
    handleClick(tab, event) {
      this.$route.params.type = this.activeName
    }
  }
}
</script>

<style scoped lang="scss">
.audit-tab ::v-deep {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-tabs__content {
    flex-grow: 1;
    > div {
      height: 100%;
    }
  }
  .g-table-wrap._expand_scroll_fixed>div>.g-table>.el-table__body-wrapper{
    overflow-y: auto !important;
  }
}
</style>
