<template>
  <div v-loading="loading" class="modal-box">
    <div v-if="selectTitle" class="file">
      <label for="#importFile"><span v-text="selectTitle" /></label>
      <el-select
        id="importFile"
        v-model="form.templateType"
        placeholder="请选择"
        class="file-type"
        size="mini"
      >
        <el-option
          v-for="item in options"
          :key="item.dictKey"
          :value="+item.dictKey"
          :label="item.dictValue"
        />
      </el-select>
    </div>
    <el-row :gutter="20" class="mt-20">
      <el-upload ref="upload"
                 class="upload-demo"
                 :http-request="httpRequest"
                 :file-list="fileList"
                 :on-change="handleChange"
                 :auto-upload="false"
                 :limit="2"
                 :on-progress="beforeUpload"
                 drag
                 :before-upload="beforeUpload"
                 action=""
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击选择文件</em></div>
        <div
          slot="tip"
          class="el-upload__tip"
        >提示：一次只能上传一个xls/xlsx格式文件</div>
      </el-upload>
      <el-row type="flex" class="row-bg" justify="end">
        <el-button class="ms-1" size="mini" @click="close()">取消</el-button>
        <el-button class="ms-1" size="mini" type="primary" @click="submitUpload()">导入</el-button>
        <el-button v-if="!selectTitle && hasDCt" class="ms-1" type="primary" size="mini" @click="downloadTemplateClick">下载模板</el-button>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import { dowloadExc } from '@/util/util'
import { dictionary } from '@/api/common'

export default {
  props: {
    rows: Object,
    code: String,
    selectTitle: String,
    requiredDType: {
      type: Boolean,
      required: false,
      default: true
    },
    downloadTemplateCt: Function,
    templateName: String,
    uploadInterface: Function,
    requiredUType: {
      type: Boolean,
      required: false,
      default: true
    },
    hasDCt: Boolean

  },
  data() {
    return {
      loading: false,
      form: {
        templateType: ''
      },
      fileList: [],
      file: '',
      options: []
    }
  },

  mounted() {
    this.code && this.getDictionary()
  },
  methods: {

    getDictionary() {
      dictionary(this.code).then(res => {
        this.options = res.data
      })
    },
    downloadTemplateClick() {
      const templateType = this.form.templateType
      if (this.requiredType && !templateType) return this.$message.error('请选择模板类型')
      this.downloadTemplateCt({ templateType, ...this.rows }).then(res => {
        const name = this.templateName
        dowloadExc(res, name)
      })
    },
    submitUpload() {
      if (!this.file) return this.$message.error('请选择要上传的文件')
      this.$refs.upload.submit()
    },
    close(refreshPage) {
      this.$parent.$emit('close', refreshPage)
    },
    httpRequest() {
      const templateType = this.form.templateType
      if (!templateType && this.selectTitle) return this.$message.error('请选择模板类型')
      this.loading = true
      this.uploadInterface({ file: this.file, templateType, ...this.rows }).then(res => {
        this.$message.success(res.msg)
        this.close(true)
        this.loading = false
      }).catch(err => {
        this.loading = false
        if (err.toString() === 'Error: Error: Network Error') this.$message.error('加载失败请尝试再次导入')
      })
    },

    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 > 1
      if (isLt1M) {
        this.$message({
          message: '上传文件大小不能超过 1MB!',
          type: 'warning'
        })
        return false
      }
    },
    handleChange(file, fileList) {
      const templateType = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
      if (!(templateType === 'xlsx' || templateType === 'xls')) {
        this.$message.error('只能上传.xls/.xlsx文件')
        fileList.length = 0
        this.file = ''
        return false
      } else {
        if (fileList.length > 1) fileList.splice(0, 1)
        this.file = file.raw
      }
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
