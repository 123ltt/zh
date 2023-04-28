<template>
  <el-popover ref="popover" :placement="placement" :trigger="trigger" popper-class="p-2">
    <div :style="{height,minHeight,maxHeight}" class="d-flex flex-column">
      <div v-if="items.length>10" class="mb-2">
        <el-input v-model.trim="keyword"
                  size="mini"
                  placeholder="输入关键词"
                  clearable
                  @input="onSearch"
        />
      </div>
      <div v-if="items.length>0" class="flex-grow-1 overflow-auto">
        <div v-for="item in list" :key="item.code">
          <el-checkbox :checked="checkedList.includes(item.code)" @change="onCheck(item)">{{ item.label }}</el-checkbox>
        </div>
      </div>
      <div v-else class="text-center">{{ keyword.length>0?'未匹配到数据':'暂无数据' }}</div>
    </div>
    <slot slot="reference" />
  </el-popover>
</template>

<script>
import { debounce } from '@/util/util'

export default {
  props: {
    /** @type {ZHKJ.VueProps<{label:string; code:string}[]>} */
    items: Array,
    // top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
    placement: {
      type: String,
      default: 'bottom'
    },
    trigger: {
      type: String,
      default: 'click'
    },
    height: {
      type: String,
      default: 'auto'
    },
    minHeight: {
      type: String,
      default: 'auto'
    },
    maxHeight: {
      type: String,
      default: '50vh'
    }
  },
  data() {
    return {
      keyword: '',
      list: this.items,
      checkedList: []
    }
  },
  watch: {
    items(items) {
      this.checkedList = []
      this.list = items
    }
  },
  methods: {
    include(str) {
      if (!this.keyword) return true
      return str.toLowerCase().includes(this.keyword.toLowerCase())
    },
    onSearch: debounce(function() {
      this.list = this.items.filter(item => this.include(item.label))
      this.$nextTick(() => {
        this.updatePopper()
      })
    }, 250),
    onCheck(data) {
      const status = !this.checkedList.includes(data.code) // true 选中， false取消选中
      if (status) {
        this.checkedList.push(data.code)
      } else {
        this.checkedList = this.checkedList.filter(item => item !== data.code)
      }
      this.$emit('select', data, status)
    },
    updatePopper() {
      this.$refs.popover.updatePopper() // 重置popover的位置
    }
  }
}
</script>
