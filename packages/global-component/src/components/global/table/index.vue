<template>
  <div class="g-table-wrap">
    <div>
      <slot name="header" />
    </div>
    <div class="position-relative">
      <el-popover v-if="draggable" ref="popover" v-model="activedColumn" class="custom-column-btn" popper-class="custom-column-popover p-0">
        <CustomColumn v-if="activedColumn"
                      :headers="headers"
                      :options="customColumn"
                      @change="_onColumnChange"
                      @close="activedColumn=false"
        >
          <template v-slot="{data}">
            <slot name="custom-column-body" :data="data" />
          </template>
        </CustomColumn>
        <el-button v-show="showCustomBtn||activedColumn"
                   slot="reference"
                   plain
                   type="primary"
                   size="mini"
        ><i class="el-icon-setting" /> 自定义列</el-button>
      </el-popover>
      <el-table ref="tableRef"
                v-loading="loading"
                :data="tableList"
                :size="size"
                :border="border"
                :stripe="stripe"
                :row-key="rowKey"
                class="g-table"
                :class="{'g-table-dense':dense}"
                v-bind="combAttrs"
                v-on="$listeners"
      >
        <el-table-column v-if="showOrder" label="#" width="60" align="center">
          <template v-slot="{$index}">
            {{ $index + 1 + (page.current - 1) * page.size }}
          </template>
        </el-table-column>
        <template v-if="tableHeaders.length>0">
          <template v-for="(item,index) in tableHeaders">
            <!-- 是否使用自定义具名slot -->
            <slot v-if="item.slot" :name="item.slotName" :data="item" />
            <el-table-column v-else :key="item.prop||index" v-bind="item">
              <ColumnHeader v-if="item.filter===true" slot="header" :label="item.label" :prop="item.prop" />
            </el-table-column>
          </template>
        </template>
        <slot v-else />
      </el-table>
    </div>
    <div class="footer-box">
      <div class="page-left">
        <slot name="footer-left" />
      </div>
      <el-pagination v-if="pageShow"
                     :page-size.sync="page.size"
                     :current-page.sync="page.current"
                     :layout="page.layout"
                     :page-sizes="page.sizes"
                     :total="page.total"
                     :pager-count="pagerCount"
                     :disabled="loading"
                     @current-change="currentChange"
                     @size-change="sizeChange"
      />
    </div>
  </div>
</template>

<script>
import { debounce } from '@/util/util'
import dragColumnMixin from './dragColumn'
import customColumnMixin from './customColumn'
import filterMixin from './filter'
import CustomColumn from './customColumn.vue'
import ColumnHeader from './columnHeader.vue'

export default {
  name: 'GTable',
  components: { CustomColumn, ColumnHeader },
  mixins: [dragColumnMixin, customColumnMixin, filterMixin],
  provide() {
    return { gTable: this }
  },
  props: {
    // 列表数据中具有唯一性的字段名。默认为索引值
    rowKey: {
      type: String,
      default: '_$index'
    },
    headers: Array,
    // 是否显示分页
    pageShow: {
      type: Boolean,
      default: true
    },
    // 默认每页数量
    pageSize: {
      type: Number,
      default: 20
    },
    // 分页
    pageSizes: {
      type: Array,
      default: () => ([10, 15, 20, 30, 50, 100])
    },
    // 对应分页的 layout 属性
    pageLayout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    // 页码按钮的数量，当总页数超过该值时会折叠
    pagerCount: {
      type: Number,
      default: 7
    },
    /**
     * g-table组件调用该方法时会传入两个参数：
     *  @param {Object} page page中包含两个属性：current(当前页码) 和 size(当前每页数量)
     *  @param {any} params 对应通过load方法传入的第二个参数
     */
    fetch: Function,
    // table尺寸
    size: {
      type: String,
      default: 'small'
    },
    // 可能因某些原因导致高度计算有误，可以通过该参数补充
    diffHeight: {
      type: Number,
      default: 10 // 默认10px为basic-container组件的上内边距
    },
    border: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: true
    },
    // 是否通过js计算高度，使表格固定高度
    fixedHeight: {
      type: Boolean,
      default: true
    },
    // 组件创建是否自动获取数据（即执行`this.load(1)`）
    immediate: {
      type: Boolean,
      default: false
    },
    // 是否使用紧凑表格（减少行距、表格内边距）
    dense: {
      type: Boolean,
      default: false
    },
    // 是否在首列添加序号
    showOrder: {
      type: Boolean,
      default: false
    },
    // 表头是否支持拖拽排序
    draggable: {
      type: Boolean,
      default: false
    },
    // 自定义列的设置页面 的配置（即 popover 左侧区域的配置，详见 customColumn.vue 文件）
    customColumn: {
      type: Object,
      default: () => ({
        cols: 3, // 每行显示的个数
        itemWidth: '100px' // 每个的宽度
      })
    }
  },
  data() {
    return {
      loading: false,
      cacheList: [], // 缓存列表数据
      tableList: [],
      page: {
        current: 1,
        size: this.pageSizes.find(item => item === this.pageSize) || this.pageSizes[1],
        sizes: this.pageSizes,
        layout: this.pageLayout,
        total: 0
      },
      // 缓存外部通过调用 load方法 传入的第二个参数
      cacheParams: {},
      isActived: true,
      unwatch: null,
      savePosition: [0, 0], // 记录滚动条位置 [y轴, x轴]
      specialColumnTypes: ['selection', 'index', 'expand']
    }
  },
  computed: {
    // 便于外部直接访问table实例
    tableRef() {
      return this.$refs.tableRef
    },
    combAttrs() {
      const attrs = Object.assign({}, this.$attrs)
      if (this.fixedHeight) {
        attrs.height = '100%'
      }
      return attrs
    },
    tableHeaders() {
      if (Array.isArray(this.headers)) {
        return this.headers
          .filter(item => item.visible !== false)
          .sort((x, y) => {
            if (this.specialColumnTypes.includes(x.type)) return -1
            if (this.specialColumnTypes.includes(y.type)) return 1

            // x._sort , y._sort 中只要有一个为 undefined 则保持该两元素的原有的顺序
            if ([x._sort, y._sort].includes(undefined)) return 1
            return x._sort - y._sort > 0 ? 1 : -1
          })
      }
      return []
    }
  },
  watch: {
    pageIndex(current) {
      this.page.current = current
    }
  },
  created() {
    if (this.immediate) {
      this.load()
    }
  },
  mounted() {
    if (this.draggable) this._tableHeadDrageable()

    if (this.fixedHeight) {
      if (this.$el.parentElement.children.length > 1) {
        console.warn('请确保g-table组件没有兄弟元素')
      }
      this.$nextTick(() => {
        this.updateTableHeight()
      })
      this.resizeWatch('beforeDestroy')

      // 监听菜单折叠
      if (this.$store) {
        const unwatch = this.$watch(() => this.$store.state.common.isCollapse, debounce(function() {
          this.updateTableHeight()
        }, 250))
        this.$once('hook:beforeDestroy', unwatch)
      }
    }
  },
  activated() {
    if (this.fixedHeight) {
      if (!this.isActived) {
        this.$nextTick(this.updateTableHeight)
      }
      this.isActived = true
      this.$once('hook:deactivated', () => {
        this.isActived = false
      })

      this.resizeWatch('deactivated')
      this.restoreScrollPosition()
    }
  },
  beforeDestroy() {
    this.isActived = false
  },
  methods: {
    // 监听窗口变化
    resizeWatch(unWatchHook) {
      if (!this.$store) return
      // 如果触发了activated，则将mounted创建的watch删掉
      // 没有使用 keep-alive，则不会触发 activated
      if (this.unwatch) {
        this.unwatch() // 移除 $watch
        this.$off(this.unwatch.hookName) // 移除 $once
      }

      this.unwatch = this.$watch(() => this.$store.state.common.windowResize, () => {
        if (this.fixedHeight) {
          this.updateTableHeight()
        }
      })
      const hookName = 'hook:' + unWatchHook
      this.unwatch.hookName = hookName
      this.$once(hookName, () => {
        if (this.unwatch) {
          this.unwatch()
          this.unwatch = null
        }
      })
    },
    // 切换每页数量时返回到第一页并重新加载数据
    sizeChange() {
      this.load(1, this.cacheParams)
    },
    currentChange() {
      this.load(0, this.cacheParams)
    },
    updateTableHeight() {
      if (!this.isActived) return
      // h = basic-container的高度 - 搜索条件的高度 - 底部分页的高度 - 10px的上内边距
      const h = this.$el.parentElement.offsetHeight - this.$el.firstElementChild.offsetHeight - (this.pageShow ? 33 : 0) - this.diffHeight
      if (this.$refs.tableRef.$el) {
        this.$refs.tableRef.$el.parentElement.style.height = h + 'px'
      }
    },
    /**
     * @param {Number} pageIndex 分页索引，如果小于1则保留当前所在索引
     * @param {any} [params] 传递给fetch方法的第二个参数
     */
    load(pageIndex = 1, params) {
      switch (params) {
        // 如果未传入params则取缓存的params
        case undefined:
          params = this.cacheParams
          break
        // 如果传入null则清空缓存的params
        case null:
          this.cacheParams = undefined
          break
        default:
          this.cacheParams = params
      }

      let { current, size } = this.page
      if (pageIndex >= 1) {
        current = pageIndex
      }

      this.loading = true
      this.fetch({ current, size }, params).then(({ records, total, size }) => {
        this.tableList = this.cacheList = (records || []).map((item, index) => {
          return Object.assign({ _$index: index }, item)
        })
        this.page.current = current
        this.page.total = total
        if (size) {
          this.page.size = size
        }
        // 列表渲染完成后触发rendered事件
        this.$nextTick(() => {
          if (this.isActived) {
            if (this.$refs.tableRef && this.$refs.tableRef.bodyWrapper) {
              this.$refs.tableRef.bodyWrapper.scrollTop = 0
            }
            if (this.fixedHeight) {
              this.updateTableHeight()
            }
          }
          this.$emit('rendered', this.tableList)
        })
      }).finally(() => {
        this.loading = false
      })
    },
    // 根据组件名获取组件对象
    getComponentRef(componentName) {
      let ref = null
      const recursion = (_ref, name) => {
        if (_ref.$options.name === name) {
          ref = _ref
          return true
        }
        return _ref.$children.find(item => recursion(item, name))
      }
      recursion(this, componentName)
      return ref
    },
    // 还原表格滚动条到上次的位置（只有启用keep-alive生效）
    restoreScrollPosition() {
      const tableBody = this.getComponentRef('ElTableBody')
      const scrollEl = tableBody.$el.parentElement

      // 延迟 等待el-table处理完滚动条再还原滚动条的位置
      setTimeout(() => {
        scrollEl.scrollTop = this.savePosition[0]
        scrollEl.scrollLeft = this.savePosition[1]
      }, 50)

      // 记录滚动条的位置
      const handler = e => {
        this.savePosition = [e.target.scrollTop, e.target.scrollLeft]
      }
      scrollEl.addEventListener('scroll', handler)
      this.$once('hook:deactivated', () => scrollEl.removeEventListener('scroll', handler))
    },
    // 更新表头。需要先置空 headers 在重新赋值才能使表格正常显示数据（目前没有好的方法）
    updateHeaders(headers) {
      this.$emit('update:headers', [])
      this.$nextTick(() => {
        this.$emit('update:headers', headers)
      })
    }
  }
}
</script>

<style src="./style.scss" lang="scss" />
