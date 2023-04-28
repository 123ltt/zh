// 流程审核
<template>
  <el-card v-if="flowStatus" shadow="always" class="mt-2">
    <div slot="header">{{ title }}</div>
    <el-form ref="form" label-width="100px" size="mini" @submit.native.prevent="submit">
      <el-form-item :error="errors.eventNo" label="审核结果">
        <el-select v-model="form.eventNo" placeholder="请选择" @change="resetError">
          <el-option v-for="item in auditList" :key="item.eventNo" :label="item.eventName" :value="item.eventNo" />
        </el-select>
      </el-form-item>
      <el-form-item :error="errors.remark" label="备注">
        <el-input v-model.trim="form.remark" :autosize="{minRows:2,maxRows:6}" :maxlength="LIMIT.content" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="submitting" type="primary" native-type="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getFlowEventById, submitFlow } from '@/api/myAudit'
import { LIMIT } from '@/config/form'

const REQUIRED = '必填项'
export default {
  props: {
    flowId: String
  },
  data() {
    return {
      LIMIT,
      // 是否能进行流程操作
      flowStatus: false,
      title: '',
      form: {
        eventNo: '',
        remark: ''
      },
      errors: {
        eventNo: '',
        remark: ''
      },
      auditList: [],
      submitting: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 清空错误提示
    resetError() {
      Object.keys(this.errors).forEach(key => {
        this.errors[key] = ''
      })
    },
    getData() {
      getFlowEventById(this.flowId).then(res => {
        if (res.success) {
          this.flowStatus = res.data.ifCanSubmitFlow
          this.title = res.data.currentNodeDesc
          this.auditList = res.data.eventList
        }
      }).finally(() => {
        this.$emit('loaded', true)
      })
    },
    submit() {
      const eventNo = this.form.eventNo
      if (eventNo) {
        // 根据后端返回的必填项字段(mustField) 来判断当前表单的字段是否已填值
        const item = this.auditList.find(el => el.eventNo === eventNo)
        if (item && Array.isArray(item.mustField) && item.mustField.length > 0) {
          const field = item.mustField.find(el => !this.form[el])
          if (field && field.ifRequired && !this.form[field.fieldCode]) {
            this.errors[field.fieldCode] = REQUIRED
            return
          }
        }
        this.submitting = true
        submitFlow({ ...this.form, flowId: this.flowId }).then(res => {
          if (res.success) {
            this.$emit('close', true)
          }
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
        }).finally(() => {
          this.submitting = false
        })
      } else {
        this.errors.eventNo = REQUIRED
      }
    }
  }
}
</script>
