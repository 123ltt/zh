<template>
  <basic-container style="min-width: 0">
    <el-form ref="formObjRef" :model="importForm" label-width="100px" size="mini" :rules="rules">
      <el-form-item label="模板名称" prop="templateName">
        <el-input v-model="importForm.templateName" placeholder="请输入" class="w-50" />
      </el-form-item>
      <el-form-item label="刊登站点" prop="siteCode">
        <el-select v-model="importForm.siteCode" class="w-50">
          <el-option v-for="(item, index) in siteOption" :key="index" :value="item.displayName" :label="item.displayName" />
        </el-select>
      </el-form-item>
      <el-form-item label="下载模板">
        <el-button type="priamary" icon="el-icon-download" :disabled="!importForm.siteCode" @click="handlerDown">点击下载</el-button>
      </el-form-item>
      <el-form-item label="上传" prop="name">
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :on-change="handleChange"
          :limit="1"
          :multiple="false"
          :accept="'.xls,.xlsx'"
          :http-request="httpRequest"
          :on-remove="()=>file=''"
          name="店铺模板"
          class="upload-demo"
          drag
          action=""
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text"><em>点击选择文件</em></div>
          <div
            slot="tip"
            class="el-upload__tip"
          >提示：一次只能上传一个xls/xlsx格式文件</div>
        </el-upload>
      </el-form-item>
      <p />
      <div style="padding-bottom: 20px;text-align: right">
        <el-button size="mini" @click="$parent.$emit('close')">取 消</el-button>
        <el-button :disabled="!file" type="primary" size="mini" @click.stop="importExc">上 传</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { downloadCarTemplate, importCarTemplate } from '@/api/ebay/template.js'
import { dowloadExc, debounce } from '@/util/util'
// import ImproveBatch from './improveBatch.vue'
export default {
  name: 'StoreImport',
  props: {
    siteOption: Array
  },
  data() {
    return {
      importForm: {},
      confirmCover: false,
      file: null,
      rules: {
        templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        siteCode: [{ required: true, message: '请选择刊登站点', trigger: 'change' }]
      }

    }
  },
  methods: {
    handleExceed(files, fileList) {
      this.$set(fileList[0], 'raw', files[0])
      this.$set(fileList[0], 'name', files[0].name)
      this.$refs.uploadRef.handleStart(files[0])// 选择文件后的赋值方法
      this.file = fileList[0].raw
    },
    handleChange(file, fileList) {
      fileList.length = 1
      this.file = file.raw
    },
    httpRequest(event) {
      const loading = this.$loading({
        lock: true,
        text: '正在上传中......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        file: this.file,
        ...this.importForm,
        confirmCover: this.confirmCover
      }
      importCarTemplate(params).then(res => {
        if (res.msg.includes('已经被占用')) {
          this.$confirm('模板名称已经被占用,确定覆盖?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.confirmCover = true
            this.httpRequest()
          }).catch(() => {})
        } else {
          this.$message.success('上传成功')
          this.$parent.$emit('close', true)
        }
      }).finally(() => {
        loading.close()
      })
    },
    importExc: debounce(function() {
      this.$refs.formObjRef.validate((valid) => {
        if (valid) {
          if (!this.file) {
            this.$message.error('请选择文件')
            return
          }
          const type = ['xlsx', 'xls']
          const fileType = this.file.name.split('.')[1]
          if (!type.includes(fileType)) {
            this.$message.error('请选择正确的格式文件')
            return
          }
          this.$refs.uploadRef.submit()
        }
      })
    }, 1000, true),
    // 下载模板
    handlerDown() {
      const name = '车型库模板.xlsx'
      downloadCarTemplate({ siteCode: this.importForm.siteCode }).then(res => {
        dowloadExc(res, name)
      })
    }
  }

}
</script>

<style>

</style>
