<template>
  <div class="d-flex">
    <AttrTable ref="left" class="flex-grow-1" :has-checked="hasChecked" :product-info="productInfo" @select="onSelect" />
    <div class="ms-2">
      <div class="fw-bold py-2 mt-1">已选属性列表（{{ checked.length }}）</div>
      <AttrCheckedTable ref="right" :items="checked" height="331" class="right-list" @remove="onRemove" />
      <div class="text-end mt-1">
        <el-button v-show="checked.length>0" size="mini" @click="onEmpty">清空勾选</el-button>
        <el-button size="mini" type="primary" @click="onConfirm">确定</el-button>
        <el-button size="mini" @click="onClose(false)">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import AttrTable from './attrTable.vue'
import AttrCheckedTable from './attrCheckedTable.vue'

export default {
  components: { AttrTable, AttrCheckedTable },
  props: {
    /** @type {ZHKJ.VueProps<{id:string;code:number;productCode:string}[]>} */
    productInfo: {
      type: Array
    },
    /**
     * 已经在使用的规格属性 字段id列表
     * @type {ZHKJ.VueProps<string[]>}
     */
    hasChecked: Array
  },
  data() {
    return {
      checked: [...this.hasChecked]
    }
  },
  methods: {
    onSelect(data) {
      this.checked = data
    },
    onRemove(data) {
      this.$refs.left._unselect(data)
    },
    onEmpty() {
      this.$refs.left._unselectall()
    },
    onClose(...args) {
      this.$parent.$emit('close', ...args)
    },
    onConfirm() {
      this.onClose(true, this.$refs.right.list)
    }
  }
}
</script>

<style lang="scss" scoped>
.right-list {
  width: 400px;
}
</style>
