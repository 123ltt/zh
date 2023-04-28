<template>
  <el-dropdown ref="dropdown" trigger="click" :placement="placement" class="g-select" @visible-change="onVisibleChange">
    <div class="el-select el-select--mini w-100" @click.capture="stopPropagation">
      <div v-if="multiple" class="el-select__tags">
        <div v-if="selectedCount>0" class="d-flex w-100">
          <div class="flex-shrink-1 overflow-hidden">
            <el-tag type="info" :closable="true" size="mini" class="flex-shrink-1" @close="onTagClose">
              <span class="el-select__tags-text">{{ getLabel(selectedList[0]) }}</span>
            </el-tag>
          </div>
          <div v-if="selectedCount>1" class="flex-shrink-0">
            <el-tag type="info" size="mini">
              <span class="el-select__tags-text">+{{ selectedCount-1 }}</span>
            </el-tag>
          </div>
        </div>
      </div>
      <el-input ref="input"
                :value="singleText"
                readonly
                size="mini"
                clearable
                :suffix-icon="suffixIcon"
                :placeholder="selectedCount>0?'':placeholder"
                :disabled="isDisabled"
                @click.native="onInputClick"
      />
    </div>
    <el-dropdown-menu slot="dropdown" :style="{width:dropdownMenuWidth,minWidth:dropdownMinWidth}">
      <div v-loading="loading">
        <div v-if="isEmitKeyword||cacheList.length>0" class="mx-1 d-flex align-items-center">
          <el-input ref="search" v-model="keyword" prefix-icon="el-icon-search" size="mini" />
          <el-checkbox v-if="multiple&&isCheckedAll&&cacheList.length>0&&!readonly"
                       v-model="all"
                       :indeterminate="indeterminate"
                       class="ms-2 gs-all"
                       @change="onCheckedAll"
          >全{{ all?'不':'' }}选</el-checkbox>
        </div>
        <div v-if="showList.length===0" class="text-muted text-center py-3">{{ cacheList.length>0?'未查询到数据':'暂无数据' }}</div>
        <RecycleScroller v-else
                         v-slot="{ item }"
                         class="g-select-scroller"
                         :items="showList"
                         :item-size="itemHeight"
                         :key-field="_keyField"
        >
          <div class="gs-item d-flex align-items-center justify-content-between px-2"
               :class="{'gs-checked':item.selected}"
               :style="{height:itemHeight+'px'}"
               @click="onSelect(item)"
          >
            <span class="text-truncate" :title="itemTitle?getLabel(item):undefined">{{ getLabel(item) }}</span>
            <i v-if="item.selected" class="el-icon-check" />
          </div>
        </RecycleScroller>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller'
import { debounce } from '@/util/util'

export default {
  name: 'GSelect',
  components: { RecycleScroller },
  inject: {
    elForm: {
      default: null
    },
    elFormItem: {
      default: null
    }
  },
  props: {
    value: [String, Number, Array],
    // 下拉列表的数据
    items: Array,
    // 每条数据的唯一值对应的字段名
    keyField: {
      type: String,
      required: true
    },
    // 下拉选项显示的内容对应的字段名
    labelField: {
      type: [String, Function],
      default: 'label'
    },
    valueField: String,
    // 下拉选项的高度（每项的高度）。默认`30`（单位像素）
    itemHeight: {
      type: Number,
      default: 30
    },
    // 下拉选项是否添加title属性。默认`false`
    itemTitle: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否显示全选按钮。默认`false`（**只有`multiple`为`true`时才生效**）
    isCheckedAll: {
      type: Boolean,
      default: false
    },
    // 设置下拉框的宽度（需含单位）。默认为输入框的宽度。为 `auto` 时会根据内容大概计算长度
    dropdownWidth: {
      type: String,
      default: ''
    },
    // 设置下拉框最小宽度（需含单位）。默认`12em`
    dropdownMinWidth: {
      type: String,
      default: '12em'
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 菜单弹出位置，可选值有`top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`。默认`bottom`
    placement: {
      type: String,
      default: 'bottom'
    },
    // 是否只读，只读状态不能勾选。默认`false`
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultLabel: 'label_' + Date.now().toString(32).slice(-4),
      cacheList: [], // 缓存整个列表的数据
      cacheValue: this.value,
      keyword: '',
      selectedList: [], // 选中的列表数据
      list: [], // 显示的列表数据
      all: false, // 全选、全不选
      dropdownMenuWidth: 'auto',
      interval: null,
      maxItemStrLen: 0
    }
  },
  computed: {
    /** @type {string} */
    valField() {
      return this.valueField || this.keyField
    },
    _labelField() {
      return typeof this.labelField === 'function' ? this.defaultLabel : this.labelField
    },
    _keyField() {
      return '_' + this.keyField
    },
    /** @type {string} */
    singleText() {
      if (this.multiple) return ''
      return this.selectedList.length > 0 ? this.getLabel(this.selectedList[0]) : ''
    },
    /** @type {number} */
    selectedCount() {
      return this.selectedList.length
    },
    /** @type {boolean} */
    indeterminate() {
      return this.selectedList.length > 0 && this.selectedList.length !== this.items.length
    },
    isDisabled() {
      return this.readonly ? false : (this.disabled || (this.elForm || {}).disabled)
    },
    isEmitKeyword() {
      return typeof this.$listeners.keyword === 'function'
    },
    // 只读模式只显示已勾选的项，正常模式显示所有项
    showList() {
      if (this.readonly) {
        return this.list.filter(item => item.selected)
      }
      return this.list
    },
    suffixIcon() {
      if (this.selectedCount > 0 && !this.isDisabled) return 'el-icon-close'
      return this.$refs.dropdown?.visible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    }
  },
  watch: {
    keyword: debounce(function(v) {
      v = v.trim()
      if (this.isEmitKeyword) {
        this.$emit('keyword', v)
      } else {
        if (v) {
          const r = new RegExp(v.replace(/([.?*+$^[\]()|\\])/g, '\\$1'), 'i')
          this.list = this.cacheList.filter(item => r.test(this.getLabel(item)))
        } else {
          this.list = this.cacheList
        }
      }
    }, 350),
    items: {
      handler(v) {
        this.initData(v)
      },
      immediate: true
    },
    value(val) {
      if (val !== this.cacheValue) {
        this.cacheValue = val
        this.initData(this.items)
      }
    }
  },
  methods: {
    formEmit(trigger = 'change') {
      this.elFormItem && this.$nextTick(() => {
        this.elFormItem.$emit(`el.form.${trigger}`)
      })
    },
    getLabel({ data }) {
      const field = this.labelField
      const t = typeof field
      if (t === 'string') {
        return data[field]
      } else if (t === 'function') {
        return field(data)
      }
      return ''
    },
    // 重建数据
    initData(data = []) {
      // 使用setTimeout，避免同时设置items和value导致找不到勾选的项（有list没value，有value没list）
      clearTimeout(this.interval)
      this.interval = setTimeout(() => {
        const { _keyField, keyField, _labelField, valField } = this
        const arr = data.map((item, index) => {
          const val = item[valField]
          const uid = String(index) + item[keyField]
          const d = {
            data: item,
            selected: Array.isArray(this.cacheValue) ? this.cacheValue.includes(val) : (val === this.cacheValue)
          }
          d[_keyField] = uid
          d[_labelField] = this.getLabel({ data: item })
          d[valField] = val

          const charLen = this.getWidthByChars(d[_labelField])
          if (charLen > this.maxItemStrLen) {
            this.maxItemStrLen = charLen
          }
          return d
        })
        this.list = this.cacheList = arr
        this.selectedList = this.list.filter(item => item.selected)
        if (this.multiple) {
          this.all = this.list.length > 0 && this.selectedList.length === this.list.length
        }
        this.emitInput()
        if (!this.isEmitKeyword) this.keyword = ''
      }, 150)
    },
    emitInput(isEmitFormChange = false) {
      if (this.list.length === 0) return
      let val = null
      if (this.multiple) {
        val = this.selectedList.map(item => item.data[this.valField])
      } else if (this.selectedList.length > 0) {
        val = this.selectedList[0].data[this.valField]
      }
      this.cacheValue = val
      this.$emit('input', val)
      isEmitFormChange && this.formEmit()
    },
    onVisibleChange(visible) {
      if (visible) {
        this.$nextTick(() => {
          this.$refs.search && this.$refs.search.$el.querySelector('input').focus()
        })
      }

      if (this.dropdownWidth === 'auto') {
        this.dropdownMenuWidth = this.maxItemStrLen + 1.5 + 'em'
      } else {
        this.dropdownMenuWidth = this.dropdownWidth ? this.dropdownWidth : (this.$refs.dropdown.$el.offsetWidth + 'px')
      }
      this.$emit('visible-change', visible)
      !visible && this.formEmit('blur')
    },
    onSelect(data) {
      if (this.readonly) return
      const { keyField } = this
      const selected = data.selected

      data.selected = !data.selected
      if (this.multiple) {
        if (selected) {
          this.selectedList = this.selectedList.filter(item => item.data[keyField] !== data.data[keyField])
        } else {
          this.selectedList.push(data)
        }
        this.all = this.selectedList.length === this.list.length
      } else {
        this.$refs.dropdown.hide()
        this.selectedList.forEach(item => {
          item.selected = false
        })

        this.selectedList = selected ? [] : [data]
      }

      this.emitInput(true)
      this.$emit('change', data, this.selectedList)
    },
    onTagClose() {
      const d = this.selectedList.shift()
      d.selected = false // 引用类型，可以直接更新列表的选中状态
      this.emitInput(true)
      this.formEmit('blur')
      this.$emit('remove-tag', d, this.selectedList)
      if (this.selectedList.length === 0) this.keyword = ''
    },
    onInputClick(e) {
      if (e.target.tagName === 'I' && e.target.classList.contains('el-icon-close')) {
        e.stopPropagation()
        this.selectedList.forEach(item => {
          item.selected = false // 重置cacheList的勾选状态（引用类型）
        })
        this.selectedList = []
        this.all = false
        this.emitInput(true)
        this.formEmit('blur')
        this.$refs.dropdown.hide()
        this.$emit('clear')
        this.keyword = ''
        this.$emit('change', null, [])
      }
    },
    // 全选或取消全选
    onCheckedAll(status) {
      // 全选
      if (status) {
        this.selectedList = this.list.map(item => {
          item.selected = true
          return item
        })
      } else {
        this.selectedList.forEach(item => {
          item.selected = false
        })
        this.selectedList = []
      }

      this.emitInput(true)
      this.$emit('change', null, this.selectedList)
    },
    stopPropagation(e) {
      if (this.isDisabled) e.stopPropagation()
    },
    // 根据字符个数来确定宽度（1个中文 = 1em， 2个英文 = 1em）
    getWidthByChars(str) {
      const en = (str.match(/[^\u4e00-\u9fa5]/ig) || []).length // 非中文
      const cn = str.length - en
      return Math.ceil(en / 1.7) + cn + 1
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~vue-virtual-scroller/dist/vue-virtual-scroller.css';
.g-select-scroller {
  height: 200px;
  width: 100%;
  .gs-item {
    cursor: pointer;
    color: $--color-text-regular;
    &:hover {
      background-color: $--background-color-base;
    }
    &.gs-checked {
      color: var(--color-primary);
    }
  }
}
.g-select {
  ::v-deep {
    .el-select .el-input__suffix .el-icon-close {
      &:hover {
        color: var(--color-primary);
        font-weight: 700;
        cursor: pointer;
      }
    }
    .el-select .el-tag .el-select__tags-text {
      width: 100%;
      max-width: 100%;
    }
    .el-select__tags {
      right: 30px;
      left: 0;
    }
  }
}
.gs-all ::v-deep .el-checkbox__label {
  padding-left: 3px;
}
</style>
