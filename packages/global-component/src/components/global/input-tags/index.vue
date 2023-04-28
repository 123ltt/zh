<template>
  <div>
    <div v-popover:popover
         class="zh-input d-flex align-items-stretch rounded px-1"
         :class="{focus,[size||'mini']:true}"
         @click="focusHandler"
    >
      <div v-if="useTagMode"
           class="d-flex align-items-center w-100 overflow-hidden"
           :class="{'flex-wrap':isFlexWrap}"
      >
        <template v-if="values.length>0">
          <template v-if="isFlexWrap">
            <el-tag v-for="item in values"
                    :key="item.value||item.label"
                    type="info"
                    :closable="!disabled"
                    :size="size"
                    disable-transitions
                    @close="closeTag(item)"
            >
              <span>{{ item.label }}</span>
            </el-tag>
          </template>
          <template v-else>
            <el-tag type="info"
                    :closable="!disabled"
                    :size="size"
                    :style="{maxWidth:tagWidth}"
                    disable-transitions
                    @close="closeTag(values[0])"
            >
              <span class="text-truncate">{{ values[0].label }}</span>
            </el-tag>
            <el-tag v-if="collapseTags&&values.length>1"
                    ref="count"
                    type="info"
                    disable-transitions
                    :size="size"
            >
              <span>+ {{ values.length - 1 }}</span>
            </el-tag>
          </template>
        </template>
        <input ref="input"
               readonly
               class="input-box zh-cursor-default"
               :class="{'zh-collapse':values.length>0&&!isFlexWrap}"
               :placeholder="values.length>0?'':placeholder"
               @blur="blurHandler"
        >
      </div>
      <input v-else
             :value="values.title||values.label"
             readonly
             :placeholder="placeholder"
             class="input-box"
             @blur="blurHandler"
      >
      <span v-if="!disabled" class="d-flex align-items-center">
        <i v-if="clearable&&hasValue"
           class="zh-cursor zh-close el-icon-circle-close"
           @click="clear"
        />
        <i v-if="showArrow"
           class="zh-arrow el-icon-arrow-down"
           :class="{'no-value':!hasValue,'no-clear':!clearable}"
        />
      </span>
    </div>
    <el-popover ref="popover"
                placement="right"
                trigger="hover"
                popper-class="p-0"
                :disabled="disablePopover"
    >
      <div class="pop-box p-2 overflow-auto" style="max-height:60vh;">
        <div v-for="item in values" :key="item.value" class="m-1">{{ item.title || item.label }}</div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'GInputTags',
  props: {
    value: [Array, Object],
    // 是否使用tag模式，默认`true`。如果`multiple`为`true`则会强制将`tagMode`设为`true`
    tagMode: {
      type: Boolean,
      default: true
    },
    // 是否显示多个值。默认`true`
    multiple: {
      type: Boolean,
      default: true
    },
    // 是否显示清空按钮。默认`false`
    clearable: {
      type: Boolean,
      default: false
    },
    // 是否显示下拉箭头。默认`false`
    showArrow: {
      type: Boolean,
      default: false
    },
    // 鼠标悬停时显示详情。默认`true`
    showDetail: {
      type: Boolean,
      default: true
    },
    // 是否收起tag（`tagMode`为true时生效）。默认`false`
    collapseTags: {
      type: Boolean,
      default: false
    },
    // 尺寸，只支持 `small`、`mini`两种尺寸，其他尺寸可能与elementUI对不上。默认`mini`
    size: {
      type: String,
      default: 'mini'
    },
    // 是否禁用，默认`false`
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: String
  },
  data() {
    return {
      focus: false,
      values: this.value || {},
      tagWidth: 0
    }
  },
  computed: {
    useTagMode() {
      if (this.multiple) return true
      return this.tagMode
    },
    hasValue() {
      if (this.multiple) {
        return Array.isArray(this.values) && this.values.length > 0
      }
      return !!this.values
    },
    disablePopover() {
      if (!this.showDetail) return true
      if (this.useTagMode) return this.values.length === 0
      return true
    },
    isFlexWrap() {
      return this.multiple && !this.collapseTags
    }
  },
  watch: {
    value(v) {
      this.values = v
      this.getFirstTagWidth()
    }
  },
  mounted() {
    this.getFirstTagWidth()
  },
  methods: {
    focusHandler() {
      if (this.disabled) return
      if (this.useTagMode) this.$refs.input.focus()
      this.focus = true
      this.$emit('focus')
    },
    blurHandler() {
      this.focus = false
      this.$emit('blur')
    },
    closeTag(data) {
      this.values = this.values.filter(item => item !== data)
      this.emitValue()
      this.$emit('remove', data, this.values)
    },
    clear() {
      this.values = []
      this.emitValue()
    },
    emitValue() {
      this.$emit('input', this.values)
    },
    // collapseTags 为 `true` 时，给第一个tag计算宽度
    getFirstTagWidth() {
      this.$nextTick(() => {
        const w = this.$refs.count ? this.$refs.count.$el.offsetWidth : 0
        this.tagWidth = this.$el.offsetWidth - 25 - w + 'px'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.zh-input {
  min-height: 26px;
  border: 1px #ddd solid;
  &.small {
    padding-top: 2px;
    padding-bottom: 2px;
  }
  &.focus {
    border-color: var(--color-primary);
    .zh-arrow {
      transform: rotate(-180deg);
    }
  }

  &:hover {
    .zh-close:not(.no-value) {
      display: initial;
      &:hover {
        color: var(--color-primary);
      }
    }
    .zh-arrow:not(.no-value,.no-clear) {
      display: none;
    }
  }
  .zh-close {
    display: none;
  }
  .el-tag {
    margin: 1px;
  }
  .input-box {
    width: 100%;
    border: none;
    outline: none;
    flex: 1 1;
    &.zh-collapse {
      display: none;
    }
  }
  .zh-cursor-pointer {
    cursor: pointer;
  }
  .zh-cursor-default {
    cursor: default;
  }
  i[class*=el-icon] {
    font-size: 14px;
    color: #999;
  }
  .zh-arrow {
    transition: all 0.5s;
  }

  .pop-box {
    ul {
      list-style-position: inside;
    }
  }

  ::v-deep {
    .el-tag {
      display: flex;
      align-items: center;
    }
  }
}
</style>
