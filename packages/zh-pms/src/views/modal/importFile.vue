<template>
  <div class="import-wrap">
    <el-form ref="form"
             label-width="100px"
             size="mini"
             :model="form"
             :rules="rules"
             @submit.native.prevent="submit"
    >
      <el-form-item label="平台" prop="platformCodes">
        <el-select v-model="form.platformCodes" multiple filterable class="w-100">
          <el-option v-for="item in platforms" :key="item.code" :value="item.code" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="文件" prop="files" required>
        <UploadFile ref="upload"
                    :http-request="httpRequest"
                    action="/pms/platformLimitedPrice/batchImport"
                    mimetype=".xlsx,.xls"
                    :download="false"
                    :selected.sync="form.files"
                    button-text="选择文件"
                    :limit="1"
                    :auto-upload="false"
                    :data="formData"
                    @on-success="submitSuccess"
        />
      </el-form-item>
      <div class="d-flex justify-content-between">
        <el-button type="text" size="mini" @click="downloadTemp">下载模板</el-button>
        <div>
          <el-button type="primary" native-type="submit" size="mini">上传</el-button>
          <el-button size="mini" @click="close(false)">取消</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import request from '@/router/axios'
import { dowloadExc } from '@/util/util'
import { UploadFile } from 'global-components'
import httpRequest from '@/api/common/upload'
import { getPlatforms } from '@/api/sams'
import { required, customRule } from '@/util/formRules'

export default {
  name: 'ImportFileModal',
  components: { UploadFile },
  props: {
    downloadUrl: String,
    noteText: String
  },
  data() {
    return {
      httpRequest,
      form: {
        platformCodes: [],
        files: []
      },
      rules: {
        platformCodes: required('change', false),
        files: [customRule(v => !(Array.isArray(v) && v.length > 0), '请选择文件')]
      },
      platforms: []
    }
  },
  computed: {
    formData() {
      return { platformCodes: JSON.stringify(this.form.platformCodes) }
    }
  },
  created() {
    getPlatforms().then(res => {
      this.platforms = res
    })
  },
  methods: {
    // 下载模板
    downloadTemp() {
      this.$message.success('正在下载，请稍等片刻...')
      const name = '平台限价模板.xlsx'
      const url = '/pms/platformLimitedPrice/downloadTemplate'
      request({ url, responseType: 'blob' }).then(res => {
        if (res.size) dowloadExc(res, name)
      })
    },
    close(bool = false) {
      this.$parent.$emit('close', bool)
    },
    submit() {
      const uploadRef = this.$refs.upload.$refs.upload
      this.$refs.form.validate(valid => {
        if (valid) {
          uploadRef.submit()
        }
      })
    },
    submitSuccess() {
      this.close(true)
    }
  }
}
</script>
