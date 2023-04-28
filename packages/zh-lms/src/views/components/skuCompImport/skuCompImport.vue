<template>
  <el-form ref="formObjRef" v-loading="importLoading" :model="importFormObj" label-width="100px" size="mini">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="下载模板：">
          <el-button :loading="downLoading" type="priamary" icon="el-icon-download" @click="handlerDown">点击下载</el-button>

          <el-tooltip placement="top"
                      width="420"
                      trigger="click"
          >
            <div slot="content" class="lh-base">
              1. 没有选中listing时，下载通用模板；如果选中listing，则会把选中listing的平台sku和店铺名，自动填充到模板的对应字段上。
              <br> 2.spu需上传子sku。
            </div>
            <i class="el-icon-question" />
          </el-tooltip>

        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="上传：" prop="name">
          <upload-file :files.sync="file"
                       :action="action"
                       :http-request="httpRequest"
                       :response-handler="responseHandler"
                       :uploading.sync="uploading"
                       :size="maxFileSize"
                       :mimetype="'.xls,.xlsx'"
                       :limit="1"
                       button-size="mini"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
      <el-button :disabled="!file || !file.length" :loading="importLoading" type="primary" size="medium" @click.stop="importExc">上 传</el-button>
    </div>
  </el-form>

</template>

<script>
/**
 * @description sku对照表导入弹窗
 */
import { dowloadExc } from '@/util/util'
import { UploadFile } from 'global-components'
import httpRequest from '@/api/common/upload.js'
import { LIMIT_FILE_SIZE } from '@/config/form'
import { skuUpload, skuUploadDownload } from '@/api/lmsCommon.js'
export default {
  name: 'SkuCompImport',
  components: { UploadFile },
  props: {
    checkIds: Array,
    filePath: String,
    source: String,
    maxLimit: { // 最大限制
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      importLoading: false,
      downLoading: false,
      uploading: false,
      importFormObj: {},
      file: [],
      action: '/ops-resource/oss/endpoint/put-file',
      httpRequest,
      maxFileSize: LIMIT_FILE_SIZE.attachment
    }
  },
  methods: {
    responseHandler(res) {
      return { data: res.data.link }
    },
    handleExceed(files, fileList) {
      this.$set(fileList[0], 'raw', files[0])
      this.$set(fileList[0], 'name', files[0].name)
      this.$refs.uploadRef.handleStart(files[0])// 选择文件后的赋值方法
      this.file = fileList[0].raw
    },
    handleChange(file, fileList) {
      // 文件大小不得超过 MaxLimit
      if (file.raw.size / 1024 / 1024 > this.maxLimit) {
        this.$message.error(`文件大小不得超过${this.maxLimit}`)
        return false
      } else {
        fileList.length = 1
        this.file = file.raw
      }
    },
    importExc() {
      this.$refs.formObjRef.validate((valid) => {
        if (valid) {
          if (this.uploading) return this.$message.error('文件正在上传中，请稍后')
          this.importLoading = true
          skuUpload(this.source, this.file[0].response.data.link).then(res => {
            if (res.code === 200) {
              this.$message.success('修改成功')
              this.$parent.$emit('close', true)
            } else {
              this.$message.error(res.msg || res.message)
            }
          }).finally(() => {
            this.importLoading = false
          })
        }
      })
    },
    // 导出
    handlerDown() {
      const name = 'sku对照表导入.xlsx'
      this.downLoading = true
      skuUploadDownload(this.source, { ids: this.checkIds.join(',') }).then(res => {
        if (res.size) {
          dowloadExc(res, name)
        }
      }).finally(() => {
        this.downLoading = false
      })
    }
  }

}
</script>
