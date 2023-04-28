<template>
  <el-form ref="formObjRef" :model="importFormObj" label-width="100px" size="mini">
    <el-row :gutter="20">
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
            name="模板"
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
    </el-row>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
      <el-button :disabled="!file" type="primary" size="medium" @click.stop="importExc">上 传</el-button>
    </div>
  </el-form>

</template>

<script>
import { importTemplate } from '@/api/common.js'
import { debounce, dowloadExc } from '@/util/util'
export default {
  name: 'SiteImport',
  data() {
    return {
      importFormObj: {},
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
      importTemplate({ file: this.file }).then(res => {
        if (res.code === 403) {
          this.$message.error('暂无权限')
          loading.close()
          return
        }
        if (res.msg) {
          this.$message.error(res.msg)
        } else {
          this.$message.success('上传成功,请在文件中查看处理结果')
          const name = '图片域名结果文件.xlsx'
          dowloadExc(res, name)
          this.$parent.$emit('close', true)
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
      this.$refs.uploadRef.submit()
    }, 1000, true),
    // 导出
    handlerDown() {
      window.location.href = 'https://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/000000/LMS/img_host.xlsx'
    }
  }
}
</script>

<style>

</style>
