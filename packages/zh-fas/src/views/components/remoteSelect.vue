<template>
  <el-select
    v-model="value1"
    v-scrollSelect="load"
    :remote-method="remoteMethod"
    placeholder="请输入关键词"
    :loading="loading"
    filterable
    remote
    v-bind="$attrs"
    @clear="clearOptions"
    @change="changeValue"
    v-on="$listeners"
  >
    <el-option
      v-for="(item,index) in options"
      :key="index"
      :label="item[optionLabel]||item.label"
      :value="item[optionValue]||item.value"
      :disabled="item.disabled"
    />
  </el-select>
</template>

<script>
export default {
  name: 'RemoteSelect',
  directives: {
    scrollSelect: {
      bind(el, binding, vnode) {
        const dom = el.getElementsByClassName('el-select-dropdown__wrap el-scrollbar__wrap')[0]
        el.scrollFn = function() {
          if (this.scrollHeight - this.scrollTop - this.clientHeight <= 0) {
            binding.value()
          }
        }
        dom.addEventListener('scroll', el.scrollFn)
      },

      unbind(el) {
        const dom = el.getElementsByClassName('el-select-dropdown__wrap el-scrollbar__wrap')[0]

        console.log('dom', dom)
        dom && dom.removeEventListener('scorll', el.scrollFn)
        el.tableScrollFn = undefined
      }
    }
  },
  props: {
    value: {
      type: [Number, String, Array],
      default: ''
    },
    prop: {
      type: String,
      default: '',
      required: true
    },
    fetch: {
      type: Function,
      default: null,
      required: true
    },
    size: {
      type: Number,
      default: 10
    },
    optionLabel: {
      type: String,
      default: ''
    },
    optionValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      i: 1, // 当前页
      loading: false,
      value1: this.value,
      options: [],
      total: null,
      lock: false// 是否已加载完匹配数据
    }
  },
  watch: {
    value(val) {
      this.value1 = val
    }
  },
  methods: {
    load() {
      if (this.lock) return null
      this.fetch(
        ++this.i, (this.size) * (this.i), { [this.prop]: this.value1 }).then(res => {
        this.options.pop()
        this.options = [...this.options, ...res.data.records]
        if (this.i * 10 > this.total) {
          this.options.push({ label: '已加载完所有匹配数据...', value: Symbol('id'), disabled: true })
          this.lock = true
        } else {
          this.options.push({ label: '正在努力加载中...', value: Symbol('id'), disabled: true })
        }
      })
    },
    remoteMethod(val) {
      this.lock = false
      this.loading = true
      this.i = 1
      if (val) {
        this.fetch(
          1, this.size, { [this.prop]: val }
        ).then(res => {
          if (res.data.records.length) {
            this.total = res.data.total
            this.loading = false
            this.options = res.data.records
            this.options.push({ label: '正在努力加载中...', value: Symbol('id'), disabled: true })
          } else {
            this.loading = false
            this.options = [{ label: '暂无匹配数据...', value: Symbol('id'), disabled: true }]
          }
        })
      }
    },
    changeValue(val) {
      this.$emit('input', val)
    },
    clearOptions() {
      this.options = []
    }
  }
}
</script>

<style>

</style>
