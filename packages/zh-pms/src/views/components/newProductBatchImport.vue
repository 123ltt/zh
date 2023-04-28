// 新品录入批量导入
<template>
  <div>
    <div class="fileTips" style="color: red;">
      Note: 批量导入时，图片请上传到图片库，然后上传图片链接，详情见模板
      <el-button type="text" size="mini" @click="downloadTemp">点击下载模板</el-button>
    </div>
    <div class="text-center mt-2">
      <el-upload ref="batchUploadRef"
                 :auto-upload="true"
                 :on-remove="()=>file=''"
                 :on-success="uploadSuccess"
                 :on-error="uploadError"
                 :on-exceed="handleExceed"
                 :limit="1"
                 :multiple="false"
                 :headers="headers"
                 :action="action"
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
    </div>
    <div class="text-end mt-2">
      <el-button type="primary" size="mini" :loading="batchImporting" @click.stop="importExc">导 入</el-button>
      <el-button type="primary" size="mini" @click="$parent.$emit('close')">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { debounce, dowloadExc } from '@/util/util'
import { downloadTemplate, uploadNewProductExcelInfo } from '@/api/newProductEntry'
import request, { getAuthHeader } from '@/router/axios'

export default {
  data() {
    return {
      headers: Object.assign(getAuthHeader()),
      action: `${request.defaults.baseURL}/ops-resource/oss/endpoint/put-file?code=minio`,
      batchImporting: false
    }
  },
  methods: {
    downloadTemp: debounce(function() {
      const t = this.$message.success('正在下载，请稍等片刻...')
      const name = '产品开发批量导入模板.xlsx'
      downloadTemplate()
        .then(res => {
          if (res.size) {
            dowloadExc(res, name)
            this.$message.success('下载模板成功')
          }
        })
        .catch(() => {
          this.$message.error('请求异常，下载模板失败')
        })
        .finally(() => {
          t.close()
        })
    }, 1000, true),
    uploadError() {
      this.$message.error('上传文件失败')
    },
    uploadSuccess(res, file, files) {
      this.file = file
    },
    // 批量导入相关
    handleExceed(files, fileList) {
      this.$message.error('只能上传单个文件')
      // this.$set(fileList[0], 'raw', files[0])
      // this.$set(fileList[0], 'name', files[0].name)
      // this.$refs['batchUploadRef'].handleStart(files[0]) // 选择文件后的赋值方法
      // this.file = fileList[0].raw
    },
    importExc() {
      if (this.batchImporting) return
      const type = ['xlsx', 'xls']
      if (!this.file) {
        this.$message.error('请选择文件')
        return
      }
      const fileType = this.file.name.split('.')[1]
      if (!type.includes(fileType)) {
        this.$message.error('请选择正确的格式文件')
        return
      }
      // this.$refs.batchUploadRef.submit()
      this.uploadNewProductExcelInfo()
    },
    uploadNewProductExcelInfo() {
      const t = this.$message.success('正在导入中，请稍等...')
      const { originalName, link } = this.file.response.data
      this.batchImporting = true
      uploadNewProductExcelInfo(originalName, link)
        .then(res => {
          this.batchImporting = false
          this.$message.success('导入成功,请到下载中心查看导入结果')
          this.$parent.$emit('close')
        })
        .catch(() => {
          this.$message.error('导入失败')
          this.batchImporting = false
        })
        .finally(() => {
          t.close()
        })
    }
  }
}
</script>
