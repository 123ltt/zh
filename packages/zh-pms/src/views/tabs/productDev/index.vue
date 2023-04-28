<template>
  <!-- 我的审核-产品开发审核 -->
  <el-tabs v-model="activeName" v-loading="loading" class="my-tabs" type="border-card">
    <el-tab-pane :lazy="activeName!=='productInfo'" label="产品信息" name="productInfo">
      <ProductInfo v-if="!loading" :id="id" @close="close" />
    </el-tab-pane>

    <el-tab-pane :lazy="activeName!=='imageInfo'" label="图片信息" name="imageInfo">
      <ImageInfo :id="id" @close="close" />
    </el-tab-pane>

    <el-tab-pane :lazy="activeName!=='safeAuditInfo'" label="安全审核信息" name="safeAuditInfo">
      <SafeAuditInfo />
    </el-tab-pane>

    <el-tab-pane :lazy="activeName!=='logInfo'" label="日志信息" name="logInfo">
      <LogInfo :id="id" />
    </el-tab-pane>
    <VerifyResults v-if="isHidden" :flow-id="flowId" title="主管审核结果确认" />
  </el-tabs>
</template>

<script>
import ProductInfo from './productInfo'
import ImageInfo from './imageInfo'
import SafeAuditInfo from './safeAuditInfo'
import LogInfo from './logInfo'
import VerifyResults from './verifyResults'
export default {
  name: 'ProductDev',
  components: { ProductInfo, ImageInfo, SafeAuditInfo, LogInfo, VerifyResults },
  props: {
    isHidden: {
      type: Boolean,
      default: false
    },
    active: {
      type: String,
      default: ''
    },
    id: String,
    flowId: String
  },
  data() {
    return {
      activeName: 'productInfo',
      detail: null,
      loading: false
    }
  },
  watch: {
    active: {
      handler(val) {
        if (val !== '') this.activeName = val
      },
      immediate: true
    }
  },
  methods: {
    close(bool) {
      this.$emit('close', bool)
    }
  }
}
</script>

<style scoped lang="scss">
.my-tabs{
  padding: 0 !important;
  height: 100%;
  ::v-deep .el-tabs__header {
    position: sticky;
    top: 0;
    z-index: 99;
  }
}
::v-deep .productInfo .el-col {
  margin-bottom: 0;
}
</style>
