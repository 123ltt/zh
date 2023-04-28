<template>
  <el-input v-model="keyword" placeholder="请输入供应商名称进行查找" class="check-supplier" @keyup.native.enter="clickHandler">
    <span slot="prepend" class="d-flex align-items-center">
      <el-checkbox v-model="checked" :disabled="!name" @click.native.prevent="clearHandler" />
      <span class="ms-1">{{ name }}</span>
    </span>
    <el-button slot="append" :loading="loading" icon="el-icon-check" @click="clickHandler" />
  </el-input>
</template>

<script>
import { getSupplierList } from '@/api/newProductEntry'

export default {
  props: {
    value: [Object, String]
  },
  data() {
    return {
      keyword: '',
      checked: false,
      loading: false
    }
  },
  computed: {
    name() {
      return typeof this.value === 'string' ? '' : this.value.supplierName
    }
  },
  methods: {
    clickHandler() {
      if (this.loading) return
      const keyword = this.keyword.trim()

      if (keyword === '') return

      this.loading = true
      getSupplierList(keyword).then(res => {
        this.checked = res.data.length > 0
        if (this.checked) {
          this.keyword = ''
        }
        this.$emit('input', this.checked ? res.data[0] : '')
      }).finally(() => {
        this.loading = false
      })
    },
    clearHandler() {
      this.checked = false
      this.$emit('input', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.check-supplier ::v-deep {
  .el-input-group__prepend {
    padding: 0 10px;
    .el-checkbox {
      margin-right: 0;
    }
  }
  .el-input-group__append {
    font-size: 1.3rem;
  }
}
</style>
