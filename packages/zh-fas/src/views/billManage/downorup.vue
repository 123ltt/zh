<template>
  <div v-loading="loading">
    <el-form ref="formRef" :model="formInfo" label-width="100px" size="mini" class="form-col" :rules="rules">

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
        <g-link />
      </el-form-item>

      <el-form-item label="平台" prop="platformCode">
        <el-select v-model="formInfo.platformCode"
                   placeholder="请选择"
                   size="mini"
        >
          <el-option v-for="item in platformOptions"
                     :key="item.platformCode"
                     :value="item.platformCode"
                     :label="item.platformName"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="isShowWM" label="站点" prop="site">
        <el-select v-model="formInfo.site"
                   placeholder="请选择"
                   size="mini"
        >
          <el-option v-for="item in siteOptions"
                     :key="item"
                     :value="item"
                     :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isShowEBay" label="店铺编码" prop="storeCode">
        <g-select v-model="formInfo.storeCode" placeholder="请选择" :items="storeOptions" key-field="key" value-field="value" label-field="value" />
      </el-form-item>
      <el-form-item v-if="isShowJoom" label="主账户" prop="conditionInfo">
        <el-input v-model="formInfo.conditionInfo" class="small" />
      </el-form-item>
      <el-form-item label="任务类型" prop="taskType">
        <el-select v-model="formInfo.taskType">
          <el-option v-for="item in taskTypeList" :key="item.taskType" :value="item.taskType" :label="item.taskName" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isShowDate" label="账单日期:" prop="date">
        <el-date-picker v-model="formInfo.date"
                        type="daterange"
                        size="mini"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
        />

      </el-form-item>
      <el-form-item label="导入文件:">
        <upload-file button-text="选择文件" :files.sync="files" mimetype=".csv,.zip,.doc,.docx,.pdf,.txt,.xls,.xlsx" :limit="1" :uploading.sync="uploading" :http-request="httpRequest" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpload">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
      <el-form-item>
        <div class="tipShow">
          <p v-if="isShowEBay" class="text-danger">文件名格式:文件名-日期,如文件名-20210623.xls</p>
          <p>提示：一次只能上传一个格式文件</p>
          <p>  支持扩展名：.csv .zip .doc .docx .pdf .txt .xls .xlsx.</p>
        </div>
      </el-form-item>
      <el-form-item>
        <div v-if="isShowLazada" class="tipShow danger">
          <p>Lazada放款账单导入注意事项：</p>
          <p> 第一步：将Lazada SKU为空白的数据筛选出来；</p>
          <p>   第二步：在Transaction Number列添加站点名称,以便识别币种.如MYDPP Service Fee==FC990..</p>
        </div>
        <span v-if="isShowJoom||isShowJD" class="tipShow danger">
          直接将表格账单压缩成ZIP，勿含文件夹！
        </span>
        <span v-if="isShowVova" class="tipShow danger">
          直接将total和fine账单压缩成ZIP，勿含文件夹！
        </span>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { UploadFile } from 'global-components'
import upload from '@/api/common/upload'
import { debounce } from '@/util/util.js'
import { getStoreCodeList, getPlatformList, getSiteNameList, fileImport, getTaskTypeList, getTemplateList } from '@/api/common'
export default {
  name: 'ImportBill',
  components: { UploadFile },

  data() {
    return {
      templateUrl: '', // 模板链接
      loading: false,
      isShowWM: false, // 每个平台样式都不一样,显示沃尔玛样式
      isShowEBay: true, // 显示ebay样式
      isShowLazada: false, // 显示lazada样式
      isShowJoom: false, // 显示joom样式
      isShowJD: false, // 显示jd样式
      isShowDate: true, // 显示日期样式
      isShowVova: false, // 显示vovo样式
      files: [
      ],
      uploading: false,
      httpRequest: upload,
      templateOptions: [],
      platformOptions: [],
      siteOptions: [],
      storeOptions: [],
      taskTypeList: [],
      formInfo: {
        dateEnd: '',
        dateBegin: '',
        link: '',
        platformCode: '',
        site: '',
        storeCode: '',
        taskType: '',
        conditionInfo: ''
      },
      rules: {
        platformCode: [{ required: true, message: '请选择', trigger: 'blur' }],
        site: [{ required: true, message: '请选择', trigger: 'blur' }],
        storeCode: [{ required: true, message: '请选择', trigger: 'blur' }],
        taskType: [{ required: true, message: '请选择', trigger: 'blur' }],
        conditionInfo: [{ required: true, message: '请输入', trigger: 'blur' }],
        date: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  computed: {
    storeName() {
      return this.storeOptions?.find(item => item.value === this.formInfo.storeCode)?.other
    }
  },
  watch: {

    'formInfo.date'(val) {
      this.formInfo.dateBegin = val?.[0]
      this.formInfo.dateEnd = val?.[1]?.replace(/00:00:00/, '23:59:59')
    },
    'formInfo.platformCode'(val) {
      this.reset()
      if (val === 'SP' || val === 'EB') {
        this.isShowEBay = false
      }
      if (val === 'WM' || val === 'AM') {
        this.isShowWM = true
      }
      if (val === 'LZ') {
        this.isShowLazada = true
      }
      if (val === 'VV') {
        this.isShowVova = true
      }
      if (val === 'JM') {
        this.isShowJoom = true
        this.isShowEBay = false
      }
      if (val === 'JD' || val === 'NE') {
        this.isShowJD = true
      }
      if (val === 'WH' || val === 'AM' || val === 'SM') {
        this.isShowDate = false
      }
      getStoreCodeList({ platformCode: val }).then(res => {
        this.storeOptions = res.data
      })
      getSiteNameList({ platformCode: val }).then(res => {
        this.siteOptions = res.data
      })
      getTaskTypeList({ platformCode: val }).then(res => {
        this.taskTypeList = res.data

        if (this.taskTypeList.length === 1) {
          this.formInfo.taskType = this.taskTypeList[0].taskType
        }
      })
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    cancel() {
      this.$parent.$emit('close')
    },
    reset() {
      this.formInfo.storeCode = ''
      this.formInfo.site = ''
      this.formInfo.taskType = ''
      this.isShowEBay = true
      this.isShowLazada = false
      this.isShowJoom = false
      this.isShowJD = false
      this.isShowDate = true
      this.isShowVova = false
      this.isShowWM = false
    },

    submitUpload: debounce(function() {
      this.$refs.formRef.validate(val => {
        if (val) {
          if (!this.files.length) {
            this.$message.warning('请选择文件')
            return
          }
          var reg = /(.*)-\d+\.[a-zA-Z]*$/
          if (this.formInfo.storeCode) {
            var str = this.files[0].name.match(reg)
            if (!str) {
              this.$message.warning('文件名格式错误')
              return
            }
            if (str[1] !== this.storeName) {
              this.$message.warning('文件名与店铺名称不匹配')
              return
            }
          }
          const link = this.files[0].url
          const fileName = this.files[0].name
          this.loading = true
          fileImport(Object.assign(this.formInfo, { link, fileName, fileType: 1 })).finally(
            this.loading = false
          ).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    }, 500, true),
    async getData() {
      this.templateOptions = (await getTemplateList({ type: 1 })).data
      this.platformOptions = (await getPlatformList()).data
    },
    downloadTemplate() {
      var a = document.createElement('a')
      a.href = this.templateUrl
      // a.remove()

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
}
</script>

<style lang='scss' scoped>
.g-select {
 width:280px;
}
.el-select{
  width: 280px;
}
.small{

  width:280px!important;
}
.el-date-editor--daterange.el-input__inner{
   width: 280px  !important;
 }
.tipShow{
  &.danger{
    color:#f56c6c;
  }
  p{
    margin:0 25px 0 0 ;
  }
  }
</style>
