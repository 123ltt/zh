<template>
  <div :key="index" class="d-flex">
    <g-text-ellipsis>
      <span :class="[cursor?'cursor':'','text-primary']" @click="toUrl">{{ id }}</span>
    </g-text-ellipsis>
    <span v-if="index===active&&id" :key="index" @click="copy"><i class="el-icon-document-copy" /></span>
  </div>
</template>

<script>
import { throttle } from '@/util/util'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    },
    active: {
      type: Number,
      default: -1
    },
    toDetails: Function,
    cursor: Boolean
  },
  data() {
    return {
    }
  },
  methods: {
    toUrl() {
      this.$emit('toDetails')
    },
    copy: throttle(function(val, e) {
      this.$clipboard(this.id)
      this.$message.success('复制成功')
    }, 500)

  }
}
</script>

<style scoped lang="scss">
.cursor{
  cursor:pointer
}
.cursor:hover{
  text-decoration: underline;
}
</style>
