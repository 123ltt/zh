<template>
  <el-form ref="formObjRef" :model="importFormObj" label-width="100px" size="mini">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="模板名称：">
          <el-input v-model="importFormObj.templateName" placeholder="请输入" @blur="getCarAttrTempList" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="下载模板：">
          <el-button type="priamary" icon="el-icon-download" @click="handlerDown">点击下载</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="上传：" prop="name">
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
      </el-col>
      <el-col :span="24">
        <p />
      </el-col>
    </el-row>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
      <el-button :disabled="!file" type="primary" size="medium" @click.stop="importExc">上 传</el-button>
    </div>
  </el-form>

</template>

<script>
import { downloadTemp, carAttrTmpeImport, carAttrTempList } from '@/api/aliExpress/temp.js'
import { dowloadExc, debounce } from '@/util/util'
export default {
  name: 'StoreImport',
  data() {
    return {
      importFormObj: {
        templateName: ''
      },
      carAttrTempList: [],
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
      // console.log('%cfile: ', 'color:green;font-size:16px;', file)
    },
    httpRequest(event) {
      const loading = this.$loading({
        lock: true,
        text: '正在上传中......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      carAttrTmpeImport({ file: this.file, templateName: this.importFormObj.templateName }).then(res => {
        if (res.code === 200) {
          this.$message.success('上传成功')
          this.$parent.$emit('close', true)
        } else {
          this.$message.error(res.msg)
        }
        loading.close()
      }).catch(() => {
        loading.close()
      })
    },
    importExc: debounce(function() {
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
      if (this.carAttrTempList.length) {
        this.defaultVali()
      } else {
        this.$refs.uploadRef.submit()
      }
    }, 1000, true),
    // 导出
    handlerDown() {
      const name = '模板.xlsx'
      downloadTemp().then(res => {
        if (res.size) {
          dowloadExc(res, name)
        }
      })
    },
    getCarAttrTempList() {
      carAttrTempList({ name: this.importFormObj.templateName }).then(res => {
        this.carAttrTempList = res.data.records
      })
    },
    defaultVali() {
      this.$confirm('该模板名称已存在，请确认是否继续导入，覆盖该模板原车型库数据，进行模板更新？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.uploadRef.submit()
      })
    }
  }

}
</script>

<style>

</style>
