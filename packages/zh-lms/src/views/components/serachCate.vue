<template>
  <el-dropdown ref="drop" trigger="click">
    <el-button :disabled="disabled" icon="el-icon-search" size="mini" />
    <el-dropdown-menu slot="dropdown" v-loading="loading" class="dropdown-box py-1">
      <el-input v-model="keyword" size="mini" />
      <div v-if="!list.length" class="text-center h-30 lh-lg">暂无数据</div>
      <RecycleScroller v-else
                       v-slot="{ item }"
                       :items="list"
                       :item-size="itemHeight"
                       :key-field="keyField"
      >
        <div class="d-flex justify-content-between align-items-center h-30 px-2 py-2" @click="checkItem(item)">
          <g-text-ellipsis>{{ item.label }}</g-text-ellipsis>
          <i v-if="item.check" class="el-icon-check" />
        </div>
      </RecycleScroller>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller'
import { debounce } from '@/util/util'

export default {
  components: {
    RecycleScroller
  },
  props: {
    params: Function, // 查询参数
    apiFn: Function, // api
    keyField: { // 唯一key
      type: String,
      default: 'id'
    },
    options: { // 展示字段
      type: Object,
      default: () => {
        return {
          label: 'name'
        }
      }
    },
    paramsKey: { // 查询入参
      type: String,
      default: 'name'
    },
    disabled: Boolean
  },
  data() {
    return {
      keyword: '',
      list: [],
      itemHeight: 30,
      loading: false,
      value: '',
      data: {}
    }
  },
  watch: {
    keyword: debounce(function(v) {
      if (this.paramsKey) {
        this.data[this.paramsKey] = this.keyword
      }
      if (this.data[this.paramsKey].length < 3) {
        this.$message.warning('类目名称不能小于3个字母')
        this.list = []
        return
      }
      this.getList()
    }, 350),
    value() {
      this.list.forEach(item => {
        if (this.value === item.id) {
          item.check = !item.check
        } else {
          item.check = false
        }
      })
    }
  },
  mounted() {
    const show = this.$refs.drop.show
    const that = this
    this.$refs.drop.show = function() {
      show()
      that.data = that.params()
    }
  },
  methods: {
    getList() {
      this.loading = true
      this.apiFn(this.data).then(res => {
        this.list = res.data.map(item => {
          return {
            label: item[this.options.label], ...item, check: false
          }
        }) || []
      }).finally(_ => {
        this.loading = false
      })
    },
    checkItem(item) {
      this.value = item.id
      this.$emit('get', item)
      this.$refs.drop.hide()
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-box{
  height: 200px;
  overflow: hidden;
  overflow-y: auto;
  width: 300px;
  }
.vue-recycle-scroller__item-wrapper::v-deep {
  position: relative;
}
.vue-recycle-scroller__item-view::v-deep {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.el-dropdown-menu::v-deep{
  padding: 0;
}
.h-30{
  height: 30px;
}
</style>
