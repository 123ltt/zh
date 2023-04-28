<template>
  <el-form ref="form" :model="form" size="mini" :label-width="labelWidth" class="demo-form-inline form-col">
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1"
                      label="报关单号"
                      prop="declareCustomsNo"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '报关单号不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.declareCustomsNo" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1"
                      label="申报日期"
                      prop="declareDate"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '申报日期不能为空', trigger: 'blur' }]:[]"
        >
          <el-tooltip :disabled="!form.declareDate" effect="dark" :content="form.declareDate" placement="top">
            <el-date-picker
              v-model="form.declareDate"
              type="datetime"
              placeholder=""
              value-format="yyyy-MM-dd HH:mm:ss"
              class="g-w100"
              :disabled="readOnly"
            />
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1"
                      label="申报口岸"
                      prop="declarePort"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '申报口岸不能为空', trigger: 'blur' }]:[]"
        >
          <el-tooltip :disabled="!form.declarePort" effect="dark" :content="form.declarePort" placement="top">
            <el-input v-model="form.declarePort" placeholder="" :disabled="readOnly" />
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1"
                      label="离境口岸"
                      prop="departurePort"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '离境口岸不能为空', trigger: 'blur' }]:[]"
        >
          <el-tooltip :disabled="!form.departurePort" effect="dark" :content="form.departurePort" placement="top">
            <el-input v-model="form.departurePort" placeholder="" :disabled="readOnly" />
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1"
                      label="出境关别"
                      prop="exitGate"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '出境关别不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.exitGate" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1"
                      label="航次号"
                      prop="flightNo"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '航次号不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.flightNo" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1"
                      label="提运单号"
                      prop="ladeTransportNo"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '提运单号不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.ladeTransportNo" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1"
                      label="报关公司单位"
                      prop="declareCustomsCompany"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '报关公司单位不能为空', trigger: 'blur' }]:[]"
        >
          <el-tooltip :disabled="!form.declareCustomsCompany" effect="dark" :content="form.declareCustomsCompany" placement="top">
            <el-input v-model="form.declareCustomsCompany" placeholder="" :disabled="readOnly" />
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1"
                      label="许可证号"
                      prop="licenseKey"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '许可证号不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.licenseKey" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1" label="预测退税金额(RMB)" prop="predictRerateRmb">
          <el-input v-model="form.predictRerateRmb" placeholder="" disabled />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1"
                      label="运输工具名称"
                      prop="transportToolName"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '运输工具名称不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.transportToolName" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1" label="预计到港时间" prop="predictArrivalTime">
          <el-tooltip :disabled="!form.predictArrivalTime" effect="dark" :content="form.predictArrivalTime" placement="top">
            <el-date-picker
              v-model="form.predictArrivalTime"
              type="datetime"
              placeholder=""
              value-format="yyyy-MM-dd HH:mm:ss"
              class="g-w100"
              :disabled="readOnly"
            />
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1"
                      label="随附单证及编号"
                      prop="attdocumentsNo"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '随附单证及编号不能为空', trigger: 'blur' }]:[]"
        >
          <el-tooltip :disabled="!form.attdocumentsNo" effect="dark" :content="form.attdocumentsNo" placement="top">
            <el-input v-model="form.attdocumentsNo" placeholder="" :disabled="readOnly" />
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1"
                      label="标记唛码及备注"
                      prop="marksRemark"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '标记唛码及备注不能为空', trigger: 'blur' }]:[]"
        >
          <el-tooltip :disabled="!form.marksRemark" effect="dark" :content="form.marksRemark" placement="top">
            <el-input v-model="form.marksRemark" placeholder="" :disabled="readOnly" />
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col />
      <el-col />
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <!-- <el-form-item v-loading="form.retaxLoading <1" label="单一窗口报关单上传" prop="warehouseId">
          <el-row>
            <el-button type="text" @click="uploadFiles">上传文件</el-button>
          </el-row>
        </el-form-item> -->
        <el-form-item v-loading="form.retaxLoading <1"
                      label="单一窗口报关单上传"
                      prop="declareCustomsPdf"
                      :rules="status===3&&type==='report' ? [{ required: true, message: '单一窗口报关单不能为空', trigger: 'blur' }]:[]"
        >
          <el-col :span="3">
            <el-button type="text" :disabled="type==='isView'" @click="uploadFiles(false)">上传文件</el-button>
          </el-col>
          <el-col :span="7" class="d-flex" style="flex-direction:column;align-items:end;">
            <el-button v-model="form.declareCustomsPdf" type="text" style="margin-left:0;">{{ form.declareCustomsPdf?form.declareCustomsPdf.name:'' }}&nbsp;&nbsp;<i v-if="form.declareCustomsPdf&&form.declareCustomsPdf.name" class="el-icon-circle-close" :disabled="type==='isView'" @click="delPic(false)" /></el-button>
          </el-col>
          <el-col :span="2" class="d-flex" style="flex-direction:column;align-items:end;">
            <el-button v-if="form.declareCustomsPdf&&form.declareCustomsPdf.name" type="text" style="margin-left:0;" :disabled="type==='isView'" @click="downLoad(form.declareCustomsPdf)">下载</el-button>
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.retaxLoading <1" label="货代底单上传" prop="freightForwardPdf">
          <el-col :span="3">
            <el-button type="text" :disabled="type==='isView'" @click="uploadFiles(true)">上传文件</el-button>
          </el-col>
          <el-col :span="7" class="d-flex" style="flex-direction:column;align-items:end;">
            <el-button v-for="(item,index) in form.freightForwardPdf" :key="index" type="text" :disabled="type==='isView'" style="margin-left:0;">{{ item?item.name:'' }}&nbsp;&nbsp;<i class="el-icon-circle-close" @click="delPic(true,index)" /></el-button>
          </el-col>
          <el-col v-if="form.freightForwardPdf" :span="2" class="d-flex" style="flex-direction:column;align-items:end;">
            <el-button v-for="(item,index) in form.freightForwardPdf" :key="index" type="text" :disabled="type==='isView'" style="margin-left:0;" @click="downLoad(item)">下载</el-button>
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { dowloadExc } from '@/util/util'
import uploadFile from '@/views/customInfo/components/uploadFile.vue'
import { downLoadPDF } from '@/api/customDeclare'
export default {
  name: 'RetaxInfo',
  props: {
    type: String,
    status: Number,
    labelWidth: {
      type: String,
      default: '120px'
    },
    baseProductInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      onlyImgUrls: [],
      imgUrls: [],
      requestFlag: false,
      warehouseList: [],
      cateSearchLoading: false,
      cateSearchLoading2: false,
      cateSearchList: [],
      cateSearchList2: [],
      freightForwardPdf: [],
      declareCustomsPdf: {},
      form: {
        freightForwardPdf: [],
        declareCustomsPdf: {}
      }
    }
  },
  computed: {
    readOnly() {
      return this.type === 'isView'
    }
  },
  created() {
    this.form = this.baseProductInfo.taxRebateRegister
    const { freightForwardPdf, declareCustomsPdf } = this.form
    this.form.freightForwardPdf = freightForwardPdf || []
    this.form.declareCustomsPdf = declareCustomsPdf || {}
  },
  mounted() {

  },

  methods: {
    downLoad(param) {
      const pdf = param
      downLoadPDF(pdf).then(res => {
        const name = pdf.name
        dowloadExc(res, name)
        this.$emit('close', true)
      })
    },
    delPic(flag, index) {
      if (flag) {
        this.form.freightForwardPdf.splice(index, 1)
        this.$forceUpdate()
      } else {
        Object.keys(this.form.declareCustomsPdf).forEach(key => { this.form.declareCustomsPdf[key] = '' })
      }
      // flag ? this.form.freightForwardPdf.splice(index, 1) : Object.keys(this.form.declareCustomsPdf).forEach(key => { this.form.declareCustomsPdf[key] = '' })
    },
    uploadFiles(flag) {
      let type = ''
      if (!flag) {
        type = 'only'
      }
      this.requestFlag = true // 用户点击了按钮，按钮置为disabled防止重复点击

      // this.$modal({
      //   title: '上传',
      //   component: uploadModal,
      //   data: {
      //     siteOption: this.siteOption
      //   },
      //   callback: (refresh) => {
      //     this.requestFlag = false // 请求回来且方法执行完，按钮恢复可点击状态
      //     refresh && this.search()
      //   }
      // })

      this.$modal({
        title: '上传PDF',
        component: uploadFile,
        width: '560px',
        minHeight: '200px',
        data: {
          type: type
        },
        callback: (imageUrls) => {
          if (imageUrls && flag) { // 多个
            this.$nextTick(() => {
              this.form.freightForwardPdf = this.form.freightForwardPdf.concat(imageUrls[0])
              this.$forceUpdate()
            })
          } else { // 一个
            this.$nextTick(() => {
              this.declareCustomsPdf = imageUrls[0]
              this.form.declareCustomsPdf = this.declareCustomsPdf
              this.$forceUpdate()
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-form-inline{
  width: 90%;
}
::v-deep .el-input__inner{
  width:145px;
}
.el-cate-dropdown-list{
  max-height: 285px;
  overflow-y: auto;
}
.cate-cascader{
  width: 42px !important;
}
.cate{
  position: relative;
}
.no-border{
  ::v-deep input{
    border: 0;
  }
}
.cate-change{
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9;
  opacity: 0;
}
.h28{
  height: 28px
}
</style>
