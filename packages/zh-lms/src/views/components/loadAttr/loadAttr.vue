// 加载产品属性参考弹窗
<template>
  <div class="d-inline-block ms-3 me-3">
    <el-button :disabled="!productSku" type="primary" size="mini" class="load-attr" @click="dialogVisible = true">加载产品属性</el-button>
    <vue-drag-resize
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :w="dragWidth"
      :h="dragHeight"
      title="产品属性"
      class="VueDragResize"
    >
      <el-form v-loading="loadAttr.loading" size="mini" class="form-col no-message g-table g-table-dense">
        <g-list-group :cols="2" :label-width="labelWidth + 'px'" label-align="right">
          <g-list-group-item v-for="(item,index) in loadAttr.list"
                             :key="index"
                             :label="item.fieldNameEn"
                             sep=": "
                             label-align="right"
                             class="attr-item"
          >
            <div class="ms-2">
              <el-tooltip v-if="item.fieldValue && item.fieldValue.length > 10 " class="item" effect="dark" :content="item.fieldValue" placement="top">
                <el-link :underline="false" class="ver-align-3">{{ item.fieldValue.substring(0, 10) }}...</el-link>
              </el-tooltip>
              <span v-else class="d-inline-block ver-align-3">{{ item.fieldValue || '-' }}</span>
              <i
                v-if="item.fieldValue"
                v-clipboard="()=>item.fieldValue"
                v-clipboard:success="()=>clipboardSuccessHandler(item.fieldNameEn+'属性值')"
                v-clipboard:error="()=>clipboardErrorHandler(item.fieldNameEn+'属性值')"
                class="el-icon-document-copy ver-align-3"
                title="点击复制"
              />
            </div>
          </g-list-group-item>
        </g-list-group>
        <div v-if="loadAttr.list.length === 0" class="el-table__empty-text">暂无数据</div>
      </el-form>
    </vue-drag-resize>
  </div>
</template>

<script>

/**
 * @description 加载产品属性参考弹窗
 * **/

import { throttle } from '@/util/util'
import VueDragResize from '@/components/vue-drag-resize'
import { loadAttr, getSkuAttrList } from '@/views/components/loadAttr/loadAttr.js'
export default {
  name: 'LoadAttr',
  components: { VueDragResize },
  props: {
    productSku: String,
    dragWidth: {
      type: Number,
      default: 560
    },
    dragHeight: {
      type: Number,
      default: 250
    },
    labelWidth: {
      type: Number,
      default: 120
    }
  },
  data() {
    return {
      loadAttr,
      dialogVisible: false
    }
  },
  watch: {
    '$route.name'() {
      this.dialogVisible = false
    },
    // 更新sku
    productSku(val) {
      val && getSkuAttrList(val)
    }
  },
  methods: {
    clipboardSuccessHandler: throttle(function(type) {
      this.$message.success(type + '复制成功')
    }, 500),
    clipboardErrorHandler: throttle(function(type) {
      this.$message.success(type + '复制失败')
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
.el-table__empty-text{
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
}
.attr-item{
  padding: 5px 0;
  .el-icon-document-copy{
    cursor: pointer;
    opacity: 0;
    transition: 0.2s opacity;
    &:hover{
      color: $--color-primary;
    }
  }
  &:hover{
    .el-icon-document-copy{
      opacity: 1;
    }
  }
}
</style>
