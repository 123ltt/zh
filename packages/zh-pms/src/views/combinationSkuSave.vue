// 新增或修改 组合sku
<template>
  <el-form ref="formRef" size="small" label-width="100px" @submit.native.prevent="submit">
    <el-form-item v-if="oldData" label="组合SKU编码">
      <el-input v-model="skuCode" disabled placeholder="组合SKU编码" />
    </el-form-item>
    <div class="p-2 border rounded">
      <div v-for="(item, index) in list" :key="index" class="d-flex">
        <el-form-item :error="item.skuError" label="SKU编码">
          <el-input
            v-model="item.sku"
            placeholder="请输入SKU编码"
            @focus="item.skuError = ''"
          />
        </el-form-item>
        <el-form-item :error="item.countError" label="数量">
          <el-input
            v-model="item.count"
            min="1"
            type="number"
            placeholder="请输入数量"
            @focus="item.countError = ''"
          />
        </el-form-item>
        <el-form-item label-width="10px">
          <div style="width:100px">
            <el-button v-if="index+1===list.length" size="small" icon="el-icon-plus" @click="plus(index)" />
            <el-button v-if="list.length>1" size="small" icon="el-icon-minus" @click="minus(index)" />
          </div>
        </el-form-item>
      </div>
    </div>
    <div class="text-end mt-3">
      <el-button size="small" @click="onCancel">取消</el-button>
      <el-button type="success" size="small" native-type="submit">保存</el-button>
    </div>
  </el-form>
</template>

<script>
import { saveCombSku } from '@/api/combSku'

export default {
  props: {
    oldData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      skuCode: this.oldData ? this.oldData.productSku : '',
      list: []
    }
  },
  computed: {
    oldList() {
      if (this.oldData) {
        return this.oldData.combineSkuDetail.split(';').map((item) => {
          const [sku, count] = item.split('*')
          return { sku, count }
        })
      }
      return [{}]
    }
  },
  watch: {
    loading(status) {
      this.$parent.$emit('loading', status)
    }
  },
  created() {
    this.list = this.newItem(true)
  },
  methods: {
    newItem(isInit = false) {
      const base = { sku: '', skuError: '', count: '', countError: '' }
      if (isInit) return this.oldList.map((item) => ({ ...base, ...item }))
      return base
    },
    plus() {
      this.list.push(this.newItem())
    },
    minus($index) {
      this.list.splice($index, 1)
    },
    submit() {
      const requiredMsg = '必填项'
      if (this.list.length < 1) return

      if (this.oldData && this.skuCode.trim() === '') {
        this.skuCodeError = requiredMsg
        return
      }

      let count = 0
      this.list.forEach((item) => {
        if (item.sku.trim() === '') {
          item.skuError = requiredMsg
          count++
        }
        if (item.count.trim() === '') {
          item.countError = requiredMsg
          count++
        }
        if (!/^\d+$/.test(item.count)) {
          item.countError = '必须是数值'
          count++
        }
      })
      if (count > 0) return
      const combineSkuDetails = this.list.map(({ sku, count }) => ({
        sku,
        count: Number(count)
      }))
      const params = { combineSkuDetails }

      if (this.oldData) {
        params.id = this.oldData.id
        params.productSku = this.skuCode
      }

      this.loading = true
      saveCombSku(params)
        .then((res) => {
          if (res.success) {
            this.$parent.$emit('close', true) // 修改成功必须传入true
          }
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'errors'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    onCancel() {
      this.$parent.$emit('close')
    }
  }
}
</script>
