// 批量备注
<template>
  <el-form size="small" @submit.native.prevent="save">
    <el-form-item label="请输入备注内容">
      <el-input v-model.trim="remark" type="textarea" />
    </el-form-item>
    <el-form-item class="text-center">
      <el-button type="primary" native-type="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { submitBatchRemark } from '@/api/myAudit'
export default {
  props: {
    ids: {
      type: Array,
      default: () => ([])
    },
    apiFn: Function,
    detailsType: String
  },
  data() {
    return {
      remark: ''
    }
  },
  methods: {
    save() {
      if (this.ids.length > 0) {
        const { remark, detailsType } = this
        if (!remark) return this.$message.error('备注内容不能为空')
        if (this.apiFn) {
          this.apiFn({ ids: this.ids, remark, detailsType }).then((res) => {
            this.$parent.$emit('close', true)
            this.$message.success(res.msg)
          })
          return
        }
        submitBatchRemark({ ids: this.ids, remark }).then(res => {
          if (res.success) {
            this.$parent.$emit('close', true)
          }
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
        })
      } else {
        this.$message.error('没有勾选内容')
      }
    }
  }
}
</script>
