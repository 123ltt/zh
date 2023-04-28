<template>
  <div>
    <div class="file">
      <el-button type="primary" size="mini" @click.stop="importExc">导入</el-button>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="getFlie()">下载模板</el-button>
    </div>
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      :on-exceed="handleExceed"
      :before-upload="beforeFileUpload"
      :on-change="handleChange"
      :limit="1"
      :multiple="false"
      :http-request="httpRequest"
      accept=".xls,.xlsx"
      action="#"
      class="upload-demo"
      drag
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text"><em>点击选择文件</em></div>
      <div slot="tip" class="el-upload__tip">提示：一次只能上传一个.xls/.xlsx文件</div>
    </el-upload>
  </div>
</template>

<script>
import { importApplyExcel } from '@/api/factoryVisitManagement/apply.js'
import { importRecordExcel } from '@/api/factoryVisitManagement/record.js'

export default {
  name: 'UpData',
  props: {
    type: String
  },
  data() {
    return {
    }
  },
  methods: {
    importExc() {
      this.$refs.uploadRef.submit()
    },
    handleExceed(files, fileList) {
      this.$set(fileList[0], 'raw', files[0])
      this.$set(fileList[0], 'name', files[0].name)
      this.$refs.uploadRef.handleStart(files[0])// 选择文件后的赋值方法
      this.file = fileList[0].raw
    },
    beforeFileUpload(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      let isOk = true
      if (testmsg !== 'xls' && testmsg !== 'xlsx') {
        isOk = false
        this.$message.error('上传的文件只能是xls,xlsx格式!')
      }
      return isOk
    },
    handleChange(file, fileList) {
      fileList.length = 1
      this.file = file.raw
    },
    // 下载
    getFlie() {
      if (this.type === 'apply') {
        window.open('http://dev.minio.izehui.com:9000/bladex/pss/excel/访厂申请模板.xlsx')
      } else if (this.type === 'record') {
        window.open('http://dev.minio.izehui.com:9000/bladex/pss/excel/供应商访厂记录模板.xlsx')
      }
    },
    // 上传
    httpRequest(event) {
      const loading = this.$loading({
        lock: true,
        text: '正在拼了老命的请求中。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$message.success('正在上传中，请稍等...')
      if (this.type === 'apply') {
        importApplyExcel({ file: this.file }).then(res => {
          let title = ''
          if (res.data.length) {
            title = `${res.msg}, ${res.data[0]}`
          } else {
            title = `${res.msg}`
          }
          this.$parent.$emit('close', true)
          this.$message.success(title)
          loading.close()
        }).catch(() => {
          loading.close()
          this.$message.error('上传失败')
        })
      } else if (this.type === 'record') {
        importRecordExcel({ file: this.file }).then(res => {
          let title = ''
          if (res.data.length) {
            title = `${res.msg}, ${res.data[0]}`
          } else {
            title = `${res.msg}`
          }
          this.$parent.$emit('close', true)
          this.$message.success(title)
          loading.close()
        }).catch(() => {
          loading.close()
          this.$message.error('上传失败')
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.file{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

</style>
