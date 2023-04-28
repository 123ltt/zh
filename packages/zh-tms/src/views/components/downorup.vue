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
      <el-button
        type="primary"
        size="mini"
        @click="downloadTemplateClick"
      >下载模板</el-button>
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
        <el-button class="ms-1" size="mini" type="primary" @click="close()">取消</el-button>
        <el-button class="ms-1" size="mini" type="primary" @click="submitUpload()">导入</el-button>
        <el-button v-if="!selectTitle && detailInfo.dictionary" class="ms-1" type="primary" size="mini" @click="downloadTemplateClick">下载模板</el-button>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import { dowloadExc } from '@/util/util'
import { dictionary } from '@/api/common'
import { downloadTemplate, postcodeRestrictedImportExcel } from '@/api/channelInformation'
import { downloadPriceRules, editionPriceImport, exportPartition, importPartition } from '@/api/costOffer'
import { onlineServiceDownloadTemplate, onlineServiceImportExcel } from '@/api/serviceConfiguration'
export default {
  props: {
    title: String,
    type: String,
    rows: Object,
    selectTitle: String
  },
  data() {
    return {
      loading: false,
      visible: true,
      form: {
        templateType: ''
      },
      mappingObject: [
        {
          title: '邮编限制导入',
          type: 'postcodeRestrictedImport',
          downloadTemplateInterface: downloadTemplate,
          requiredType: false,
          uploadInterface: postcodeRestrictedImportExcel
        },
        {
          title: '线上服务导入',
          type: 'onlineServiceImport',
          dictionary: 'online_channel',
          downloadTemplateInterface: onlineServiceDownloadTemplate,
          requiredType: false,
          templateName: '线上服务模板.xlsx',
          uploadInterface: onlineServiceImportExcel
        },
        {
          title: '邮编分区导入',
          type: 'partitionImport',
          downloadTemplateInterface: exportPartition,
          requiredType: false,
          templateName: '邮编分区导入模板.xlsx',
          uploadInterface: importPartition
        },
        {
          title: '新价格导入',
          type: 'newPriceImport',
          downloadTemplateInterface: downloadPriceRules,
          requiredType: false,
          templateName: this.getTemplateName(),
          uploadInterface: editionPriceImport
        }
      ],
      detailInfo: {}, // 主要信息
      fileList: [],
      file: '',
      options: []
    }
  },

  mounted() {
    this.getDictionary()
  },
  methods: {
    getTemplateName() {
      return ['分区报价横版模板.xlsx', '分区报价竖版模板.xlsx', '通用报价版模板.xlsx'][this.rows?.templateType - 1]
    },
    getDictionary() {
      this.detailInfo = this.mappingObject.filter(item => item.title === this.title)[0]
      this.detailInfo.dictionary && dictionary(this.detailInfo.dictionary).then(res => {
        this.options = res.data
      })
    },
    downloadTemplateClick() {
      const templateType = this.form.templateType
      if (this.detailInfo.requiredType && !templateType) return this.$message.error('请选择模板类型')
      this.detailInfo.downloadTemplateInterface({ templateType, ...this.rows }).then(res => {
        const name = this.detailInfo.templateName
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
      const data = this.detailInfo
      const templateType = this.form.templateType
      if (!templateType && this.selectTitle) return this.$message.error('请选择模板类型')
      this.loading = true
      data.uploadInterface({ file: this.file, templateType, ...this.rows }).then(res => {
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
