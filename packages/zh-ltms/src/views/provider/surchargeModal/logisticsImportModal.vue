<template>
  <div>
    <div class="modal-box">
      <el-row type="flex" class="row-bg" justify="end">
        <el-button size="mini" type="primary" @click="downloadTemplate">下载模板</el-button>
      </el-row>
      <el-row :gutter="20" class="mt-20">
        <el-upload ref="upload"
                   class="upload-demo"
                   :http-request="httpRequest"
                   :on-preview="handlePreview"
                   :on-remove="handleRemove"
                   :file-list="fileList"
                   :on-change="handleChange"
                   :auto-upload="false"
                   :limit="2"
                   drag
                   :before-upload="beforeUpload"
                   action=""
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text"><em>点击上传文件</em></div>
          <div slot="tip" class="el-upload__tip">提示：一次只能上传一个.xls/.xlsx文件</div>
        </el-upload>
        <el-row type="flex" class="row-bg" justify="end">
          <el-button style="margin-left: 10px;" size="small" type="primary" @click="cancel">取消</el-button>
          <el-button style="margin-left: 10px;" size="small" type="primary" @click="submitUpload">导入</el-button>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script>
import { dowloadExc } from '@/util/util'
import { downloadCodeTemplatePost, importExcelPost } from '@/api/logisticsSurcharge.js'
export default {
  data() {
    return {
      fileList: [],
      file: '',
      importData: []
    }
  },
  methods: {
    downloadTemplate() {
      downloadCodeTemplatePost().then(res => {
        const name = '邮编模板.xlsx'
        dowloadExc(res, name)
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    cancel() {
      this.$parent.$emit('close', true)
    },
    httpRequest() {
      const loading = this.$loading({
        lock: true,
        text: '加载中。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      importExcelPost({ file: this.file }).then(res => {
        this.importData = res.data
        this.$parent.$emit('close', true, this.importData)
        loading.close()
      }).catch(() => {
        loading.close()
        this.$message.error('加载失败')
      })
    },
    beforeUpload(file) {
      const type = file.name.split('.')[1]
      if (!(type === 'xlsx' || type === 'xls')) {
        this.$message.error('只能上传.xls/.xlsx文件')
        return false
      }
    },
    handleChange(file, fileList) {
      if (fileList.length > 1) fileList.splice(0, 1)
      this.file = file.raw
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-box{
  padding: 0 20px;
}
.mt-20{
  margin-top: 20px;
}
// 新增样式
.file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .file-type {
    width: 60%;
  }
}
::v-deep .el-upload.el-upload--text,
::v-deep .el-upload-dragger {
  width: 100%;
  height: 160px;
}
</style>
