<template>
  <el-card class="border-0" shadow="never" body-style="padding:0rem">
    <div slot="header" class="d-flex justify-content-between align-items-center">
      <b>自定义列</b>
      <el-button size="mini" type="primary" @click="onConfirm">确定</el-button>
    </div>
    <div class="d-flex align-items-stretch">
      <div>
        <slot :data="allList">
          <div class="custom-column-body">
            <template v-for="group in groupList">
              <div v-if="group.name" :key="group.name+'b'" class="py-2 border-bottom fw-bold">{{ group.name }}</div>
              <div :key="group.name+'a'" class="d-flex flex-wrap" :class="{'m-3':!!group.name}" :style="{width:bodyWidth}">
                <div v-for="item in group.list" :key="item._index" class="my-1 text-truncate" :style="{width:options.itemWidth}">
                  <el-checkbox v-model="item.visible" @change="onChecked(item)">{{ item.label }}</el-checkbox>
                </div>
              </div>
            </template>
          </div>
        </slot>
      </div>
      <div class="border-start">
        <div class="py-2 mx-3 border-bottom">
          <b>已选择</b>
          <span class="text-muted">（可拖拽排序）</span>
        </div>
        <draggable v-model="selectedList"
                   tag="ul"
                   class="drag-area"
        >
          <li v-for="item in selectedList" :key="item._index" class="item">
            {{ item.label }}
          </li>
        </draggable>
      </div>
    </div>
  </el-card>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  inject: ['gTable'],
  components: { draggable },
  props: {
    // 对应传入 GTable 的 headers 属性
    headers: {
      type: Array,
      default: () => []
    },
    /** @type {ZHKJ.VueProps<{cols:number; itemWidth:string}>} 自定义配置 */
    options: Object
  },
  data() {
    const { allList, groupList, selectedList, groups } = this.getList()
    return {
      allList,
      groupList,
      selectedList,
      groups,
      initSelectedCount: selectedList.length // 初始时已勾选的个数
    }
  },
  computed: {
    bodyWidth() {
      const { itemWidth, cols } = this.options
      const arr = itemWidth.match(/^(\d+\.?\d*)([^\d]+)$/)
      if (arr) {
        return arr[1] * cols + arr[2]
      }
      return itemWidth * cols
    }
  },
  methods: {
    getList() {
      const allList = [] // 所有数据
      const selectedList = [] // 已选中数据
      let sort = 0
      const isInlucdeSort = this.headers.some(item => item._sort !== undefined)
      const notGroupList = []
      const groups = {}

      this.headers.forEach((el, index) => {
        if (this.gTable.specialColumnTypes.includes(el.type)) return

        const d = {
          label: el.label,
          visible: el.visible === undefined ? true : el.visible,
          group: el.group,
          filter: el.filter,
          _index: index
        }

        allList.push(d)
        if (el.group) {
          if (!groups[el.group]) {
            groups[el.group] = {
              list: [],
              name: el.group
            }
          }
          groups[el.group].list.push(d)
        } else {
          notGroupList.push(d)
        }

        if (d.visible) {
          const _sort = isInlucdeSort ? el._sort : sort++
          selectedList.push(Object.assign({ _sort }, d))
        }
      })

      selectedList.sort((x, y) => x._sort - y._sort)

      const list = Object.values(groups) // 分组数据
      if (notGroupList.length > 0) {
        list.push({ name: Object.keys(groups).length > 0 ? '未分组' : '', list: notGroupList })
      }

      return { groupList: list, allList, selectedList, groups: Object.keys(groups) }
    },
    onChecked(data) {
      if (data.visible) {
        this.selectedList.push(data)
      } else {
        this.selectedList = this.selectedList.filter(item => item._index !== data._index)
      }
    },
    onConfirm() {
      if (this.selectedList.length === 0) return this.$message.info('必须选一个')

      // 根据 数组的索引 与 _sort 比较，判断 this.selectedList 是否有更新
      let isChange = false
      this.selectedList.forEach((el, index) => {
        if (el._sort !== index) isChange = true
        el._sort = index // 根据索引重新排序
      })

      if (isChange || this.selectedList.length !== this.initSelectedCount) {
        // 如果当前显示的列中 没有过滤功能的列，则清空 excludeRowKeys
        if (this.selectedList.every(item => (item.visible || item.visible === undefined) && item.filter !== true)) {
          this.gTable.excludeRowKeys = []
        }

        this.$emit('change', this.selectedList)
      }
      this.$emit('close')
    }
  }
}
</script>
