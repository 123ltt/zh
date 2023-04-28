// 选择spu、sku界面
<template>
  <div>
    <SearchForm slot="header" @submit="onSearch" />
    <div class="d-flex">
      <div class="flex-grow-1 overflow-hidden">
        <div class="fw-bold py-1">待选列表</div>
        <div class="left-list w-100">
          <SxuTable ref="left" :params="params" :has-checked="hasChecked" @select="onSxuChecked" />
        </div>
      </div>
      <div class="right-list ms-2">
        <div class="fw-bold py-1">已选列表（{{ checked.length }}）</div>
        <SxuCheckedTable :items="checked" :height="350" @remove="onRemove" />
        <div class="text-end mt-1">
          <el-button v-show="checked.length>0" size="mini" @click="onEmpty">清空勾选</el-button>
          <el-button type="primary" size="mini" @click="onClose(true,checked)">确定</el-button>
          <el-button size="mini" @click="onClose(false)">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from './sxuConditionForm.vue'
import SxuTable from './sxuTable.vue'
import SxuCheckedTable from './sxuCheckedTable.vue'

export default {
  components: { SearchForm, SxuTable, SxuCheckedTable },
  props: {
    // 传入已勾选的spu/sku
    hasChecked: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checked: [...this.hasChecked],
      params: {}
    }
  },
  methods: {
    onSxuChecked(data) {
      this.checked = data
    },
    onRemove(data) {
      this.$refs.left._unselect(data)
    },
    onEmpty() {
      this.$refs.left._unselectall()
    },
    onSearch(params) {
      // isBatchUpdated 0-未修改过，1-修改过，2-全部
      this.params = Object.assign({ isBatchUpdated: 2 }, params)
    },
    onClose(status, data) {
      let d
      if (data) {
        d = data.map(item => {
          return {
            id: item.id,
            type: item.type,
            productCode: item.productCode,
            attrIdFieldIds: []
          }
        })
      }
      this.$parent.$emit('close', status, d, data)
    }
  }
}
</script>

<style lang="scss" scoped>
.left-list {
  height: 380px;
}

.right-list {
  width: 300px;
}
</style>
