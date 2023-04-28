<template>
  <div class="verify-results">
    <el-divider content-position="left">{{ title }}</el-divider>
    <el-form ref="formRef" :model="form" size="mini" label-width="75px" class="search-form">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="处理" prop="eventNo">
            <el-select v-model="form.eventNo" style="width:100%;">
              <el-option v-for="event in eventOptions" :key="event.id" :value="event.eventNo" :label="event.eventName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="原因" prop="remark">
            <el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" style="width:100%;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-end">
          <el-button type="primary" size="mini" @click="onSubmit">提交审核结果</el-button>
          <el-button type="primary" size="mini">取消</el-button>
        </el-col>
      </el-row>
    </el-form></div>
</template>

<script>
import { getFlowEventById, submitFlow } from '@/api/myAudit'
export default {
  name: 'VerifyResults',
  props: {
    title: {
      type: String,
      default: '审核结果确认'
    },
    flowId: String
  },
  data() {
    return {
      form: {
        eventNo: '',
        remark: ''
      },
      eventOptions: []
    }
  },
  created() {
    getFlowEventById(this.flowId).then(res => {
      this.eventOptions = res.data.eventList
      this.form.eventNo = res.data.eventList[0].eventNo
    })
  },
  mounted() {
  },
  methods: {
    onSubmit() {
      const { flowId, form: { eventNo, remark } } = this
      const data = { flowId, eventNo, remark }
      submitFlow(data).then(res => {
        console.log('submitFlow', res)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.search-form{
  margin-top: 20px;
}
</style>
