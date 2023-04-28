<template>
  <el-form ref="formObjRef" :model="importFormObj" label-width="100px" size="mini">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="下载模板：">
          <el-button type="priamary" icon="el-icon-download" @click="handlerDown">点击下载</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="上传：" prop="files">
          <upload-file :files.sync="importFormObj.files"
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
      <el-button size="medium" @click="$emit('close')">取 消</el-button>
      <el-button :disabled="!importFormObj.files.length" type="primary" size="medium" @click.stop="importExc">上 传</el-button>
    </div>
  </el-form>
</template>

<script>
import { dowloadExc } from '@/util/util'
import { UploadFile } from 'global-components'
import httpRequest from '@/api/common/upload.js'
import { LIMIT_FILE_SIZE } from '@/config/form'
import { batchUpdateByFile, exportPriceStockTemplate } from '@/api/ebay/ebay.js'
export default {
  name: 'NpcImport',
  components: { UploadFile },
  props: {
    selectedIds: Array
  },
  data() {
    return {
      importFormObj: {
        files: []
      },
      action: '/ops-resource/oss/endpoint/put-file',
      httpRequest,
      uploading: false,
      maxFileSize: LIMIT_FILE_SIZE.attachment
    }
  },
  methods: {
    importExc() {
      this.$refs.formObjRef.validate((valid) => {
        if (valid) {
          if (this.uploading) return this.$message.error('文件正在上传中，请稍后')
          batchUpdateByFile({
            execlUrl: this.importFormObj.files[0].response.data.link,
            feedPlatform: 'EB',
            feedType: '1',
            ids: []
          }).then(res => {
            this.$message.success('修改成功')
            this.$emit('close', true)
          })
        }
      })
    },
    responseHandler(res) {
      return { data: res.data.link }
    },
    // 导出
    handlerDown() {
      const name = '更新指定价/指定库存模板.xlsx'
      exportPriceStockTemplate({ ids: this.selectedIds.join(',') }).then(res => {
        if (res.size) {
          dowloadExc(res, name)
        }
      })
    }
  }

}
</script>
