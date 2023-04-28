<template>
  <div v-if="row[typeName]"
       class="d-block"
       @mouseover="isCopy = index"
       @mouseleave="isCopy = ''"
  >
    <span>{{ typeName==='itemId'?'ItemID':'ASIN' }}：
      <g-link class="text-primary" @click="handleItemIdCell(row)">{{ row[typeName] }}</g-link>
    </span>
    <i v-show="isCopy === index"
       v-clipboard="()=>row[typeName]"
       v-clipboard:success="()=>clipboardSuccessHandler(typeName)"
       v-clipboard:error="()=>clipboardErrorHandler(typeName)"
       class="el-icon-document-copy mt-1 ms-1 copy-hover-i"
       style="cursor:pointer;"
    />
  </div>
</template>

<script>
import { throttle } from '@/util/util.js'
export default {
  name: 'CopyItemId',
  props: {
    typeName: {
      type: String,
      default: 'itemId'
    },
    row: {
      type: Object
    },
    index: Number
  },
  data() {
    return {
      isCopy: ''
    }
  },
  methods: {
    clipboardSuccessHandler: throttle(function(type) {
      this.$message.success(type + '复制成功')
    }, 500),
    clipboardErrorHandler: throttle(function(type) {
      this.$message.success(type + '复制失败')
    }, 500),
    handleItemIdCell(row) {
      this.$emit('handleItemIdCell', row)
    }
  }
}
</script>
<style lang="scss" scoped>
.copy-hover-i:hover{
  color: $--color-primary;
}
</style>
