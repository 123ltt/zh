<template>
  <div>
    <p class="text-danger pb-2 text-height">Note: 批量标记请下载模板</p>
    <div class="file">
      <label for="#importFile">模板</label>
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
        备注：订单标记结果请到订单详情列表或者系统后台查询。
      </div>
    </el-upload>
    <el-row type="flex" justify="end">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button :loading="loading" type="primary" size="mini" @click="uploadFile">上 传</el-button>
    </el-row>
  </div>
</template>

<script>
import { debounce, dowloadExc } from '@/util/util'
import { getDemoUrl, uploadMarkExcel, putFile } from '@/api/platformOrder'
export default {
  props: {
    platformCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      importRuleTypeList: [
        { dictValue: 'AMAZON_MODULAR', dictKey: '标记模板' }
      ],
      modular: 'AMAZON_MODULAR',
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
      uploadMarkExcel({ fileName: this.file.name, taskParameters: this.linkFileSource, platformCode: this.platformCode }).then(res => {
        if (res.success) {
          this.$message.success('标记成功，稍后系统会自动进行标记，请根据平台订单号查询标记结果。')
          this.loading = false
          this.close(true)
        }
      }).catch(() => {
        this.loading = false
      })
    }, 1000, true),
    downloadTemp: debounce(function() {
      this.$message.success('正在下载，请稍等片刻...')
      const index = this.importRuleTypeList.findIndex((value) => value.dictValue === this.modular)
      const tmpName = this.importRuleTypeList[index].dictKey + '.xlsx'
      getDemoUrl().then(async res => {
        dowloadExc(res.data, tmpName, true)
      }).catch(() => {
        this.$message.error('请求异常，导出失败！')
      })
    }, 1000, true),
    close(type = false) {
      this.$parent.$emit('close', type)
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
.text-height{
  line-height: 0px;
}
</style>
