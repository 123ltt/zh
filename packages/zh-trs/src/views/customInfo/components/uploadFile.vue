<template>
  <el-form ref="formObjRef" :model="importFormObj" label-width="100px" size="mini">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="上传：" prop="name">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-exceed="handleExceed"
            :on-change="handleChange"
            :limit="limit"
            :multiple="multiple"
            :accept="'pdf'"
            :http-request="httpRequest"
            :on-remove="()=>file=''"
            name="店铺模板"
            class="upload-demo"
            :file-list="fileList"
            drag
            action=""
            show-file-list
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text"><em>点击选择文件</em></div>
            <div
              slot="tip"
              class="el-upload__tip"
            >提示：只能上传pdf格式文件</div>
          </el-upload>
          <!-- <el-upload
            class="upload-demo"
            action=""
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="limit"
            :multiple="multiple"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload> -->
        </el-form-item>
      </el-col>
    </el-row>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
      <el-button type="primary" size="medium" @click.stop="importExc">上 传</el-button>
    </div>
  </el-form>

</template>

<script>
import { batchUploadPdf, uploadPdf } from '@/api/preReport'
export default {
  name: 'PdfImport',
  props: {
    type: String
  },
  data() {
    return {
      importFormObj: {},
      file: null,
      tempFile: [],
      fileList: [],
      freightForwardPdf: [], // 多个
      declareCustomsPdf: [], // 1个
      num: 0
    }
  },
  computed: {
    multiple() {
      return !(this.type === 'only')
    },
    limit() {
      return this.type === 'only' ? 1 : 20
    }
  },
  created() {

  },
  methods: {
    handleExceed(files, fileList) {
      if (!this.limit) return
      this.$message.warning(`当前限制只能选择 ${this.limit} 个文件`)
    },
    handleChange(file, fileList) {
      this.num = 0
      this.tempFile = fileList
      this.num = this.tempFile.length
    },
    httpRequest(event) {
      if (this.num !== this.tempFile.length && this.type !== 'only') {
        return false
      }
      this.num++

      const fd = new FormData()
      console.log('this.tempFile: ', this.tempFile)
      this.tempFile.forEach((file) => { // 上传多个文件，进行遍历
        fd.append('files', file.raw)
      })

      const loading = this.$loading({
        lock: true,
        text: '正在上传中......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.type === 'only') {
        uploadPdf({ file: event.file }).then(res => {
          if (res.code === 200) {
            this.$message.success('上传成功')
            const data = res.data
            this.declareCustomsPdf.push(data)
            this.$parent.$emit('close', this.declareCustomsPdf)
          } else {
            this.$message.error(res.msg)
          }
          loading.close()
        }).catch(() => {
          loading.close()
        })
      } else {
        batchUploadPdf(fd).then(res => {
          if (res.code === 200) {
            this.$message.success('上传成功')
            const data = res.data
            this.freightForwardPdf.push(data)
            this.$parent.$emit('close', this.freightForwardPdf)
          } else {
            this.$message.error(res.msg)
          }
          loading.close()
        }).catch(() => {
          loading.close()
        })
      }
    },
    importExc() {
      if (!this.fileList) {
        this.$message.error('请选择文件')
        return
      }
      const type = ['pdf']
      if (this.fileList.length) {
        this.fileList.forEach((item, index) => {
          if (!type.includes(item.name.split('.')[1])) {
            this.$message.error('请选择正确的格式文件')
            return
          }
          this.fileType = item.name.split('.')[1]
        })
      }
      this.$refs.uploadRef.submit()
    }
  }

}
</script>

<style>

</style>
