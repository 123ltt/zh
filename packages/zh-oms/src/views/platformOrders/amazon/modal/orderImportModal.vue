<template>
  <div>
    <div class="file">
      <label for="#importFile">导入类型</label>
      <el-select id="importFile" v-model="modular" placeholder="请选择导入类型" class="file-type" size="mini">
        <el-option v-for="item in importRuleTypeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictKey" />
      </el-select>
      <el-button type="primary" size="mini" @click="downloadTemp">下载模板</el-button>
    </div>
    <el-upload ref="uploadRef"
               :auto-upload="true"
               :on-remove="()=>file=''"
               :on-error="uploadError"
               :on-exceed="onExceed"
               :before-upload="beforeUpload"
               :limit="1"
               :http-request="httpRequest"
               :multiple="false"
               action=""
               accept=".xls, .xlsx"
               class="upload-demo"
               drag
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击选择文件</em>
      </div>
      <div slot="tip" class="el-upload__tip">
        提示：一次只能上传一个xls/xlsx格式的文件
      </div>
    </el-upload>
    <el-row type="flex" justify="end">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" size="mini" @click="uploadFile">上 传</el-button>
    </el-row>
  </div>
</template>

<script>
import { debounce, dowloadExc } from '@/util/util'
import { downloadModel, uploadManualExcelFile, putFile } from '@/api/platformOrder'
export default {
  data() {
    return {
      importRuleTypeList: [
        { dictValue: 'AMAZON_MODULAR', dictKey: '亚马逊订单导入模板' },
        { dictValue: 'WISH_MODULAR', dictKey: 'Wish订单导入模板' },
        { dictValue: 'COMMON_MODULAR', dictKey: '通用模板' }
      ],
      modular: 'COMMON_MODULAR',
      fileName: '',
      linkFileSource: '',
      loading: false
    }
  },
  methods: {
    httpRequest() {
      putFile({ file: this.file }).then(res => {
        if (res.code === 200) {
          this.linkFileSource = res.data.link
        }
      }).catch(() => {
        this.$message.error('上传失败')
      })
    },
    uploadError() {
      this.$message.error('上传文件失败')
    },
    handleChange(file) {
    },
    beforeUpload(file) {
      this.file = file
    },
    onExceed(files, fileList) {
      this.$set(fileList[0], 'raw', files[0])
      this.$set(fileList[0], 'name', files[0].name)
      this.file = fileList[0].raw
      this.httpRequest()
    },
    uploadFile: debounce(function() {
      if (!this.linkFileSource?.length || !this.file) {
        this.$message.warning('请先选择文件')
        return false
      }
      const type = ['xlsx', 'xls']
      const fileType = this.file.name.split('.')[1]
      if (!type.includes(fileType)) {
        this.$message.error('请选择正确的格式文件')
        return false
      }
      this.loading = true
      uploadManualExcelFile({ fileName: this.file.name, taskParameters: this.linkFileSource, modular: this.modular }).then(res => {
        if (res.success) {
          this.$message.success('上传成功，请到下载中心查看结果')
          this.loading = false
          this.close()
        }
      }).catch(() => {
        this.loading = false
      })
    }, 1000, true),
    downloadTemp: debounce(function() {
      this.$message.success('正在下载，请稍等片刻...')
      const index = this.importRuleTypeList.findIndex((value) => value.dictValue === this.modular)
      let tmpName = this.importRuleTypeList[index].dictKey
      this.importRuleTypeList.forEach(item => {
        if (this.modular === item.dictValue) tmpName = item.dictKey + '.xlsx'
      })
      downloadModel(this.modular).then(res => {
        if (res.size) {
          dowloadExc(res, tmpName)
        }
      }).catch(() => {
        this.$message.error('请求异常，导出失败！')
      })
    }, 1000, true),
    cancel() {
      this.close()
    },
    close() {
      this.$parent.$emit('close', 'hello', [1, 2])
    }
  }
}
</script>

<style lang="scss" scoped>
.file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .file-type {
    width: 60%;
  }
}
::v-deep .el-upload-dragger,::v-deep .el-upload{
    width: 100%;
}
</style>
