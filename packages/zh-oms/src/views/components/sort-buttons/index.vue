<template>
  <el-button-group v-model="sorts" class="sort-btns">
    <el-button v-for="item in sortList" :key="item.value" :type="sorts.name===item.value?'primary':''" size="mini" @click="sortClick(item.value,$event)">
      {{ item.label }}
      <span class="d-inline-flex flex-column h6 align-top">
        <i class="el-icon-caret-top sort-icon" :style="(sorts.name===item.value&&sorts.type===true)?activeStyle:''" />
        <i class="el-icon-caret-bottom sort-icon" :style="(sorts.name===item.value&&sorts.type===false)?activeStyle:''" />
      </span>
    </el-button>
  </el-button-group>
</template>

<script>
import { throttle } from '@/util/util'
export default {
  name: 'SortButtons',
  props: {
    sortList: Array,
    value: Object,
    activeColor: {
      type: String,
      default: '#67C23A'
    }
  },
  data() {
    return {
      sorts: {
        name: '1',
        type: ''
      },
      sortCount: 0
    }
  },
  computed: {
    activeStyle() {
      return { color: this.activeColor }
    }
  },
  created() {
    this.sorts.name = this.value.name
    this.sorts.type = this.value.type
  },
  methods: {
    sortClick: throttle(function(val, e) {
      if (this.sorts.name !== val) {
        this.sortCount = 9 // 任意大于1的数
        this.sorts.name = val
      }
      ++this.sortCount
      const { sortCount } = this
      if (sortCount > 2) this.sortCount = 0

      this.sorts.type = {
        0: '',
        1: true,
        2: false
      }[sortCount]
      let target = e.target
      if (target.nodeName === 'SPAN') {
        target = e.target.parentNode
      }
      target.blur()
      this.$emit('input', this.sorts)
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
 .sort-btns ::v-deep .el-button{
  border-radius: 0;
  border: none;
  margin-right: 0 !important;
  &:hover{
    background-color: transparent;
    color: var(--color-primary);
  }
  &.el-button--primary:hover{
    background-color: var(--color-primary);
    color: $--button-primary-font-color;
  }
  .sort-icon{
    line-height: .6;
  }
}
</style>
