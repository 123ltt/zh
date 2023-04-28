<template>
  <el-form ref="formObjRef" :model="importForm" label-width="120px" size="mini">
    <el-row :gutter="10">
      <el-form-item label="下载模板">
        <el-button v-if="permission.role_import_template" type="text" @click="handlerDown">模板及填写说明下载</el-button>
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
          class="upload-demo"
          drag
          action=""
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text"><em>请点击选择需要导入的Excel文件</em></div>
          <div
            slot="tip"
            class="el-upload__tip"
          >提示：一次只能上传一个xls/xlsx格式文件</div>
        </el-upload>
      </el-form-item>
      <p />
      <div class="text-end pe-3 mb-3">
        <el-button size="mini" @click="$parent.$emit('close')">取 消</el-button>
        <el-button :disabled="!file" type="primary" size="mini" @click.stop="importExc">上 传</el-button>
      </div>
    </el-row>
  </el-form>
</template>

<script>
import { debounce, dowloadExc } from '@/util/util'
import { downloadTemp, roleImport } from '@/api/role'
export default {
  name: 'ImportRole',
  props: {
    permission: Object
  },
  data() {
    return {
      formData: {},
      roleList: [],
      importForm: {},
      confirmCover: false,
      file: null
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
    httpRequest() {
      const loading = this.$loading({
        lock: true,
        text: '正在上传中......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      roleImport({ file: this.file }).then(() => {
        this.$message.success('上传成功')
        this.$parent.$emit('close', true)
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
      const name = '导入更新本角色权限模板.xlsx'
      downloadTemp().then(res => {
        dowloadExc(res, name)
      })
    }
  }

}
</script>
