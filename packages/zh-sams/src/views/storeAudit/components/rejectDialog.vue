<template>
  <el-form ref="rejectObjRef" :model="rejectObj" :rules="rules" label-width="100px" size="mini" style="width:460px" class="form-col">
    <el-form-item label="驳回理由" prop="rejectReason">
      <el-input v-model.trim="rejectObj.rejectReason" type="textarea" :rows="6" :maxlength="LIMIT.title" placeholder="请输入" clearable />
    </el-form-item>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取消</el-button>
      <el-button v-if="isALLReject" size="medium" type="primary" @click="rejectALLSave('rejectObjRef')">保存</el-button>
      <el-button v-else type="primary" size="medium" @click="rejectSave('rejectObjRef')">保存</el-button>
    </div>
  </el-form>

</template>

<script>
import { rejectStatus, reviewStatus, allFirstBatch, allRecheckBatch } from '@/api/storeAudit'
import { LIMIT } from '@/config/form'
export default {
  props: {
    isALLReject: {
      type: Boolean

    },
    checkedIds: {
      type: Array
    },
    auditTabActiveName: {
      type: String
    },
    rejectId: {
      type: String
    }
  },
  data() {
    return {
      LIMIT,
      rejectObj: {
        rejectReason: ''
      },
      rules: {
        rejectReason: [{ required: true, message: '驳回理由不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 批量驳回提交
    rejectALLSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.auditTabActiveName === '2') { // 初审驳回
            allFirstBatch({ ids: this.checkedIds, isPass: false, rejectReason: this.rejectObj.rejectReason }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          } else if (this.auditTabActiveName === '3') { // 复审驳回
            allRecheckBatch({ ids: this.checkedIds, isPass: false, rejectReason: this.rejectObj.rejectReason }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          }
        }
      })
    },
    // 初审 驳回保存
    rejectSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 初审
          if (this.auditTabActiveName === '2') {
            rejectStatus({ id: this.rejectId, rejectReason: this.rejectObj.rejectReason, isPass: false }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          } else if (this.auditTabActiveName === '3') {
            reviewStatus({ id: this.rejectId, rejectReason: this.rejectObj.rejectReason, isPass: false }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          }
        }
      })
    }
  }

}
</script>

<style>

</style>
