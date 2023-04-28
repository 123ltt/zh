<template>
  <el-form v-loading="loading" size="mini" class="form-col no-message g-table g-table-dense">
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in list"
        :key="index"
        :span="12"
      >
        <div class="attr-item">
          <span class="el-form-item__label">{{ item.fieldNameEn }}: </span>
          <div class="el-form-item__content">{{ item.fieldValue || '-' }}
            <i
              v-if="item.fieldValue"
              v-clipboard="()=>item.fieldValue"
              v-clipboard:success="()=>clipboardSuccessHandler(item.fieldNameEn+'属性值')"
              v-clipboard:error="()=>clipboardErrorHandler(item.fieldNameEn+'属性值')"
              class="el-icon-document-copy"
              title="点击复制"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-if="list.length === 0" class="el-table__empty-text">暂无数据</div>
  </el-form>
</template>

<script>
import { throttle } from '@/util/util'
export default {
  name: 'LoadAttr',
  props: {
    list: Array
  },
  data() {
    return {
      // 加载信息状态
      loading: false
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
.el-form-item__label{
  width: 120px;
  line-height: inherit;
}
.el-form-item__content{
  margin-left: 120px;
  line-height: inherit;
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
