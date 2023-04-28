<template>

  <el-form flex size="mini" label-width="68px">
    <el-form-item label="选择文件">
      <upload-file button-text="选择文件" :files.sync="files" mimetype=".csv,.zip,.doc,.docx,.pdf,.txt,.xls,.xlsx" :limit="1" :uploading.sync="uploading" :http-request="httpRequest" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary">确认导入</el-button>
      <el-button type="primary" @click="downloadTemplate">下载导入模板</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import { UploadFile } from 'global-components'
import upload from '@/api/common/upload'
export default {
  components: {
    UploadFile
  },
  data() {
    return {
      files: [],
      uploading: false,
      fee: '',
      httpRequest: upload
    }
  },
  methods: {
    // 下载导入模板
    downloadTemplate() {
      var a = document.createElement('a')
      a.href = 'http://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/000000/OMS/20210504/4437f2580b1ec11dc78ab52ef0e31323.xlsx'
      // a.remove()

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    cancel() {
      this.$parent.$emit('close')
    }
  }
}
</script>
