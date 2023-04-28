<template>
  <div v-loading="loading">
    <cols-form ref="formRef" :cols="1" :form-item="formItem" :form-info="formInfo" message-style :form-handler-pre="formHandlerPre">
      <template #templateDown>
        <el-form-item label="模板下载">
          <el-select v-model="templateUrl" placeholder="请选择">
            <el-option v-for="item in templateOptions"
                       :key="item.url"
                       :value="item.url"
                       :label="item.name"
            />
          </el-select>
          <el-button type="primary" size="mini" :disabled="!templateUrl" @click="downloadTemplate">
            下载
          </el-button>
        </el-form-item>
      </template>

      <template #uploadFlow>
        <el-form-item label="导入文件:">
          <upload-file button-text="选择文件" :files.sync="files" mimetype=".csv,.zip,.doc,.docx,.pdf,.txt,.xls,.xlsx" :limit="1" :uploading.sync="uploading" :http-request="httpRequest" />
        </el-form-item>
      </template>
      <template #tips>
        <el-form-item>
          <p>提示：一次只能上传一个文件</p>
          <p>支持扩展名：.csv.zip .doc .docx .pdf .txt.xls...</p>
        </el-form-item>
      </template>
    </cols-form>
  </div>
</template>

<script>
import colsForm from '@/views/components/colsForm'
import upload from '@/api/common/upload'
import { UploadFile } from 'global-components'
import { debounce } from '@/util/util.js'
import { fileImport, getTemplateList, getTaskTypeList } from '@/api/common'

export default {

  name: 'DownOrUpFlow',
  components: { colsForm, UploadFile },
  data() {
    return {

      files: [],
      templateOptions: [],
      uploading: false,
      httpRequest: upload,
      templateUrl: '',
      loading: false,
      formInfo: {
        dateEnd: '',
        dateBegin: '',
        link: '',
        platformCode: '',
        site: '',
        storeCode: '',
        taskType: ''
      },
      formItem: [
        { type: 'slot', slotName: 'templateDown' },
        {
          type: 'select',
          label: '收款方式',
          prop: 'payeeType',
          optionValue: 'payeeType',
          optionLabel: 'taskName',
          required: true,
          options: [

          ]
        },

        { type: 'slot', slotName: 'uploadFlow' }

      ],
      formHandlerPre: [{
        label: '提交',
        handler: () => {
          this.submitUpload()
        }
      },
      {
        label: '取消',
        handler: () => {
          this.cancel()
        }
      }]
    }
  },
  computed: {
    showAccount() {
      if (this.formInfo.payeeType === 3) {
        return false
      }
      return true
    }
  },

  mounted() {
    this.getData()
  },
  methods: {
    downloadTemplate() {
      var a = document.createElement('a')
      a.href = this.templateUrl

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    async getData() {
      this.templateOptions = (await getTemplateList({ type: 2 })).data
      this.formItem[1].options = (await getTaskTypeList({ type: 2 })).data
    },
    submitUpload: debounce(function() {
      this.$refs.formRef.colsForm.validate(val => {
        if (val) {
          if (!this.files.length) {
            this.$message.warning('请选择文件')
            return
          }
          this.formInfo.taskType = this.formItem[1].options.find(item => item.payeeType === this.formInfo.payeeType)?.taskType
          const link = this.files[0].url
          const fileName = this.files[0].name
          this.loading = true
          fileImport(Object.assign(this.formInfo, { link, fileName, fileType: 2 })).finally(
            this.loading = false
          ).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    }, 500, true),
    cancel() {
      this.$parent.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.el-select{
  width:245px;
}
.small{
  width:245px;
}
</style>
