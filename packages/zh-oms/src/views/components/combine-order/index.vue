<template>
  <el-popover
    v-model="showPopover"
    placement="top-start"

    trigger="hover"
  >
    <div v-for="(order, i) in orders" :key="i">
      <span :class="{'link-el':isLink}" @click="isLink && $emit('toDetails', order)">{{ order }}</span>
      <i v-show="isCopy"
         v-clipboard="()=>order"
         v-clipboard:success="()=>clipboardHandler('success')"
         v-clipboard:error="()=>clipboardHandler('error')"
         class="el-icon-document-copy ms-1 copy-hover-i"
      />
    </div>
    <i slot="reference" class="el-icon-s-grid" />
  </el-popover>

</template>

<script>
import { throttle } from '@/util/util'
export default {
  props: {
    orders: {
      type: Array,
      default: () => []
    },
    isCopy: Boolean,
    isLink: Boolean,
    preText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showPopover: false
    }
  },
  deactivated() {
    this.showPopover = false
  },
  methods: {
    clipboardHandler: throttle(function(type) {
      this.$message[type](this.preText + (type === 'success' ? '复制成功' : '复制失败'))
    }, 500)
  }
}
</script>
<style lang="scss" scoped>
.link-el{
  color: $--color-primary;
  cursor:default;
  &:hover{
    text-decoration: underline;
  }
}
.copy-hover-i:hover{
  color: $--color-primary;
  cursor:pointer;
}
</style>
