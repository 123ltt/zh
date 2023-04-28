<template>
  <el-form ref="formRef" :model="formInfo" :rules="rules" flex size="mini" label-width="76px">
    <el-form-item prop="files" label="选择文件">
      <upload-file button-text="选择文件" :files.sync="formInfo.files" mimetype=".csv,.zip,.doc,.docx,.pdf,.txt,.xls,.xlsx" :limit="1" :uploading.sync="uploading" :http-request="httpRequest" />
    </el-form-item>
    <el-form-item prop="feeStatus" label="费用格式">
      <el-select v-model="formInfo.feeStatus" style="width: 270px">
        <el-option label="正数" value="1" />
        <el-option label="负数" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">确认导入</el-button>
      <el-button type="primary" @click="downloadTemplate">下载导入模板</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { UploadFile } from 'global-components'
import upload from '@/api/common/upload'
import { getList } from '@/api/system/dictbiz'
import { uploadFile } from '@/api/importOrExport'
export default {
  components: {
    UploadFile
  },
  data() {
    return {
      formInfo: {},
      uploading: false,
      fee: '',
      httpRequest: upload,
      rules: {
        files: [
          { required: true, message: '请先上传文件', trigger: 'change' }
        ],
        feeStatus: [
          { required: true, message: '请选择费用格式', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 下载导入模板
    downloadTemplate() {
      getList(1, 1, { dictValue: '物流商对账导入模板' }).then((res) => {
        var a = document.createElement('a')
        a.href = res.data[0].dictKey
        // a.remove()

        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      })
    },
    submit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          const params = {
            taskName: '物流导入',
            taskType: 'logistic.bill.import',
            fileName: this.formInfo.files[0].name,
            link: this.formInfo.files[0].url,
            feeStatus: this.formInfo.feeStatus
          }
          uploadFile(params).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    },
    cancel() {
      this.$parent.$emit('close')
    }
  }
}
</script>

<style>

</style>
