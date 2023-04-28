<template>
  <el-form ref="searchDataRef" v-loading="loading" size="mini" :model="form">
    <el-form-item label="定时刊登" prop="uploadTime" label-width="100px">
      <el-date-picker v-model="form.uploadTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" placeholder="选择日期时间" @change="handle" />
    </el-form-item>
    <div style="padding-top: 20px; text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
      <el-button size="medium" type="primary" @click="handlerSeve">确 定</el-button>
    </div>
  </el-form>
</template>

<script>

/**
 * @description 提交审核弹窗
 * **/

import { dateFormat } from '@/util/date'
import improveBatch from '@/views/components/improveBatch.vue'
export default {
  name: 'DialogListingAudit',
  props: {
    spuIds: {
      type: Array,
      default: () => []
    },
    audit: Function,
    isCheck: {
      type: Boolean,
      default: false
    },
    keyName: {
      type: String,
      default: 'spuIds'
    }
  },
  data() {
    return {
      loading: false,
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        }
      },
      form: {
        uploadTime: ''
      }
    }
  },
  methods: {
    handle: function() {
      var startAt = new Date(this.form.uploadTime) * 1000 / 1000
      if (startAt < Date.now()) {
        this.form.uploadTime = dateFormat(new Date())
      }
    },
    handlerSeve() {
      const uploadTime = this.form.uploadTime || null
      const params = { [this.keyName]: this.spuIds, uploadTime, isCheck: this.isCheck }
      this.loading = true
      this.audit(params).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.$parent.$emit('close', true)
        } else if (res.code === 201) {
          this.defaultErr(res.msg, { ...params, isCheck: false })
        } else this.$message.error(res.msg || '未知错误')
      }).catch(() => {
        this.$message.error('未知错误')
      }).finally(() => {
        this.loading = false
      })
    },
    defaultErr(msg, params) {
      this.$modal({
        title: '警告',
        component: improveBatch,
        data: {
          tableList: JSON.parse(msg),
          params: { [this.keyName]: this.spuIds, isCheck: !this.isCheck, uploadTime: params.uploadTime },
          // header: ['SKU', '违禁词'],
          isCheck: !this.isCheck,
          keyName: this.keyName,
          isType: 'update',
          requestApi: this.audit
        },
        callback: (refresh) => {
          if (refresh) {
            this.checked = []
            this.$parent.$emit('close', true)
          }
        }
      })
    }
  }

}
</script>

<style>

</style>
