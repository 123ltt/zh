<template>
  <basic-container>
    <el-card v-loading="loading" shadow="never">
      <el-card shadow="never">
        <div slot="header">
          <span style="font-weight: 600;">供应商信息</span>
        </div>
        <el-form :model="openData" disabled label-width="120px" size="mini" class="no-message">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="supplierName" label="供应商名称">
                <el-input v-model="supplier.supplierName" disabled style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司资质">
                <el-input v-model="supplier.qualification" disabled style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="auditors" label="成立时间">
                <el-input v-model="supplier.setTime" disabled style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item prop="supplierAddress" label="详细地址">
                <el-select v-model="openData.supplierProvince" style="width:25%">
                  <el-option v-for="item in listAddress" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-select v-model="openData.supplierCity" style="width:25%">
                  <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-input v-model="openData.supplierAddress" style="width:48%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否能开票">
                <el-input v-model="supplier.makeInvoice" disabled style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="relationPeople" label="联系人">
                <el-input v-model="openData.relationPeople" maxlength="50" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="relationPhone" label="联系方式">
                <el-input v-model="openData.relationPhone" maxlength="50" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="supplyType" label="供货类型">
                <el-select v-model="openData.supplyType" placeholder="请选择" style="width:100%">
                  <el-option v-for="item in supplyTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="mainCategoryPathList" label="主营产品类目">
                <el-cascader v-model="openData.mainCategoryPathList" :options="mainCategorylList" clearable placeholder="请选择" filterable style="width:100%" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="productProperty" label="产品属性">
                <el-select v-model="openData.productProperty" style="width:100%">
                  <el-option v-for="item in productPropertyList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="mainProduct" label="主营产品">
                <el-input v-model="openData.mainProduct" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" maxlength="500" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="cooperationProduct" label="合作产品">
                <el-input v-model="openData.cooperationProduct" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" maxlength="500" style="width:100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card shadow="never">
        <div slot="header">
          <span style="font-weight: 600;">访厂申请</span>
        </div>
        <el-form :model="openData" label-width="120px" size="mini" class="no-message">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="applyVisitReason" label="申请访厂原因">
                <el-select v-model="openData.applyVisitReason" style="width:100%" disabled>
                  <el-option v-for="item in visitReasonList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="productPrice" label="产品价格(均价)">
                <el-input v-model="openData.productPrice" v-input.positive style="width:100%" disabled>
                  <template slot="append">RMB</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="expectedVisitTime" label="期望访厂日期">
                <el-date-picker v-model="openData.expectedVisitTime" style="width:100%" type="date" value-format="yyyy-MM-dd" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="applyNote" label="申请备注">
                <el-input v-model="openData.applyNote" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" maxlength="500" style="width:100%" disabled />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="申请资料">
                <div class="imgListBox">
                  <div v-for="item in imgArr" :key="item.make">
                    <p>{{ item.title }}</p>
                    <upload-image v-if="getScc" :images.sync="item.container" :uploading.sync="item.imgStatus" :http-request="httpRequest" :primary="false" :avatar="true" :size="5242880" />
                  </div>
                </div>
                <div>
                  <p style="margin-bottom:0">访厂图片</p>
                  <upload-image v-if="getScc" :images.sync="imageList" :primary="false" :http-request="httpRequest" :uploading.sync="imageUploading" :limit="7" :size="5242880" />
                </div>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="附件信息">
                <upload-file v-if="getScc" :files.sync="filesList" :http-request="httpRequest" :uploading.sync="attUploading" :size="5242880" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card shadow="never">
        <div slot="header">
          <span style="font-weight: 600;">访厂申请审核</span>
        </div>
        <el-form ref="rulesForm" :model="auditData" :rules="rules" label-width="120px" size="mini" :disabled="auditDetail" :class="auditDetail?'no-message':''">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="auditResult" label="审核结果" class="is-required">
                <el-select v-model="auditData.auditResult" clearable placeholder="请选择" filterable style="width:100%" @input="changeRes">
                  <el-option v-for="item in auditResultList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="auditDetail" :span="8">
              <el-form-item label="计划访厂人员" class="is-required">
                <el-tooltip class="item" effect="dark" :content="planUserAll" placement="top">
                  <el-input :value="planUserAll" />
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col v-else :span="8">
              <el-form-item prop="planUserList" label="计划访厂人员" class="is-required">
                <g-select v-model="planUserList" :items="userList" key-field="id" label-field="name" value-field="id" style="width:100%" multiple :disabled="back" :placeholder="!auditDetail?'不通过不需要选择！':''" class="is-required" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="planVisitTime" label="计划访厂时间" class="is-required">
                <el-date-picker v-model="auditData.planVisitTime" style="width:100%" type="date" :placeholder="!auditDetail?'不通过不需要选择！':''" value-format="yyyy-MM-dd" :picker-options="effectiveTimePicker()" :disabled="back" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="auditNote" label="审核备注">
                <el-input v-model="auditData.auditNote" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" maxlength="500" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="auditDetail" label="审核人">
                <el-input v-model="auditPeopleName" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="auditDetail" label="审核时间">
                <el-input v-model="auditTime" clearable style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col v-if="relatedData.status == 1" :span="24">
              <el-form-item style="text-align: right;margin-right: 20px;">
                <el-button size="mini" icon="el-icon-circle-close" @click="$emit('close')">取消</el-button>
                <el-button size="mini" type="primary" @click="define()">保存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card v-if="relatedData.status == 2||relatedData.status == 3" shadow="never">
        <div slot="header">
          <span style="font-weight: 600;">访厂</span>
        </div>
        <el-form ref="visitForm" :model="visitData" :rules="visitRules" label-width="120px" size="mini" :disabled="visitDetail" :class="visitDetail?'no-message':''">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="visitFactoryType" label="访厂类型">
                <el-select v-model="visitData.visitFactoryType" clearable placeholder="请选择" filterable style="width:100%" @input="changeRes">
                  <el-option v-for="item in visitTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="visitDetail" :span="8">
              <el-form-item prop="visitList" label="访厂人员" class="is-required">
                <el-tooltip class="item" effect="dark" :content="visitListAll" placement="top">
                  <el-input :value="visitListAll" />
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col v-else :span="8">
              <el-form-item prop="visitList" label="访厂人员" class="is-required">
                <g-select v-model="visitList" :items="userList" key-field="id" label-field="name" value-field="id" style="width:100%" multiple />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="visitFactoryTime" label="访厂时间">
                <el-date-picker v-model="visitData.visitFactoryTime" style="width:100%" type="date" placeholder="请选择" value-format="yyyy-MM-dd" :picker-options="effectiveTimePicker()" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="visitFactoryNote" label="访厂备注">
                <el-input v-model="visitData.visitFactoryNote" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" :placeholder="relatedData.status == 2?'请输入内容':''" maxlength="500" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col v-if="relatedData.status == 2" :span="24">
              <el-form-item style="text-align: right;margin-right: 20px;">
                <el-button size="mini" icon="el-icon-circle-close" @click="$emit('close')">取消</el-button>
                <el-button size="mini" type="primary" @click="visitDefine()">保存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-card>
  </basic-container>
</template>

<script>
import { getMyDictBiz } from '@/api/commonApi/common.js'
import { getSupplierInfo, getCateGoryChild, getDetail, visit, getUserList, audit } from '@/api/factoryVisitManagement/apply.js'
import httpRequest from '@/api/common/upload'
import { UploadImage, UploadFile } from 'global-components'

export default {
  name: 'CommonPssFactoryVisitRecordAdd',
  components: { UploadImage, UploadFile },
  props: {
    relatedData: Object,
    listAddress: Array
  },
  data() {
    return {
      loading: false,
      supplier: {
        supplierName: '',
        makeInvoice: '',
        qualification: '',
        setTime: ''
      },
      planUserAll: '',
      visitListAll: '',
      supplyTypeList: [], // 供货类型
      mainCategorylList: [], // 主营产品类目
      propertyList: [], // 产品属性
      visitReasonList: [], // 申请访厂原因
      productPropertyList: [],
      // 新增数据
      openData: {
        id: '',
        visitFactoryCode: '',
        supplierId: '',
        supplierProvince: '',
        supplierCity: '',
        supplierAddress: '',
        relationPeople: '',
        relationPhone: '',
        supplyType: '',
        mainCategory: '',
        productProperty: '',
        mainProduct: '',
        mainCategoryPathList: [],
        cooperationProduct: '',
        fileList: [],
        attachmentList: [],
        applyVisitReason: '',
        productPrice: '',
        expectedVisitTime: '',
        applyNote: ''
      },
      // 审核数据
      auditData: {
        id: '',
        auditResult: '',
        planVisitTime: '',
        auditNote: '',
        planVisitUserList: []
      },
      rules: {
        auditResult: [{ required: true, message: '审核结果不能为空', trigger: 'change' }],
        auditNote: [{ required: true, message: '审核备注不能为空', trigger: 'blur' }]
      },
      // 访厂数据
      visitData: {
        id: '',
        visitFactoryType: '',
        visitFactoryTime: '',
        visitFactoryNote: '',
        visitUserList: []
      },
      visitRules: {
        visitFactoryType: [{ required: true, message: '访厂类型不能为空', trigger: 'change' }],
        visitFactoryTime: [{ required: true, message: '访厂人员不能为空', trigger: 'change' }]
      },
      visitList: [],
      userList: [],
      planUserList: [],
      imageList: [],
      cityList: [], // 市
      httpRequest,
      imageUploading: false, // 上传状态
      filesList: [],
      attUploading: false, // 上传状态
      imgArr: [
        { title: '产品专利证书', container: [], imgStatus: false, mark: 'patent' },
        { title: '产品认证证书', container: [], imgStatus: false, mark: 'certification' },
        { title: '质量管理体系证书', container: [], imgStatus: false, mark: 'management' },
        { title: '开票资质', container: [], imgStatus: false, mark: 'invoice' },
        { title: '营业执照证书', container: [], imgStatus: false, mark: 'license' }
      ],
      getScc: true,
      auditResultList: [],
      back: false,
      auditPeopleName: '',
      auditTime: '',
      auditDetail: false,
      visitTypeList: [],
      visitDetail: false
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.dealWith()
  },
  methods: {
    getData() {
      // 主营产品类目
      getCateGoryChild().then(res => {
        res.data.forEach(item => {
          const obj = {
            value: item.id,
            label: item.name,
            children: []
          }
          item.categoryChildVOList.forEach(item => {
            const childobj = {
              value: item.id,
              label: item.name
            }
            obj.children.push(childobj)
          })
          this.mainCategorylList.push(obj)
        })
      })
      // 经营模式
      getMyDictBiz('pss_manage_model').then(res => {
        this.supplyTypeList = res.data
      })
      // 访厂原因
      getMyDictBiz('pss_visit_apply_reason').then(res => {
        this.visitReasonList = res.data
      })
      // 产品属性
      getMyDictBiz('pss_product_property').then(res => {
        this.productPropertyList = res.data
      })
      // 审核结果
      getMyDictBiz('pss_visit_audit_result').then(res => {
        this.auditResultList = res.data
      })
      // 访厂类型
      getMyDictBiz('pss_visit_factory_type').then(res => {
        this.visitTypeList = res.data
      })
      getUserList().then(res => {
        this.userList = res.data.records
      })
    },
    effectiveTimePicker() {
      return {
        disabledDate: (time) => {
          return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    },
    getSupplier(val) {
      if (val) {
        getSupplierInfo(val).then(res => {
          this.supplier.supplierName = res.data.supplierName
          this.supplier.setTime = res.data.registerTime
          if (res.data.companyType === 1) {
            this.supplier.qualification = '公司'
          } else if (res.data.companyType === 2) {
            this.supplier.qualification = '个体工商户'
          }
          if (res.data.ifInvoice === 1) {
            this.supplier.makeInvoice = '能'
          } else if (res.data.ifInvoice === 0) {
            this.supplier.makeInvoice = '否'
          }
        })
      } else {
        this.supplier.setTime = ''
        this.supplier.qualification = ''
        this.supplier.makeInvoice = ''
      }
    },
    changeRes(val) {
      if (val !== '' && val !== '1') {
        this.back = true
        this.planUserList = []
        this.auditData.planVisitTime = ''
      } else {
        this.back = false
      }
    },
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let isOk = false
          if (this.auditData.auditResult === '1') {
            if (this.planUserList.length && this.auditData.planVisitTime) {
              this.planUserList.forEach(item => {
                const obj = {
                  type: 'planVisitor',
                  userId: item
                }
                this.auditData.planVisitUserList.push(obj)
              })
            } else {
              isOk = true
            }
          }
          if (isOk) {
            this.$message.error('请先填写必填项！')
            this.loading = false
          } else {
            audit(this.auditData).then(() => {
              this.loading = false
              this.$emit('close', true)
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            }).catch(() => {
              this.$message.error('操作失败！')
              this.loading = false
            })
          }
        }
      })
    },
    visitDefine() {
      this.$refs.visitForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (!this.visitList.length) {
            this.$message.error('请选择访厂人员！')
          } else {
            this.visitList.forEach(item => {
              const obj = {
                type: 'visitor',
                userId: item
              }
              this.visitData.visitUserList.push(obj)
            })
            visit(this.visitData).then(() => {
              this.loading = false
              this.$emit('close', true)
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            }).catch(() => {
              this.$message.error('操作失败！')
              this.loading = false
            })
          }
        }
      })
    },
    // 处理编辑
    dealWith() {
      this.loading = true
      this.getScc = false
      this.filesList = []
      this.imageList = []
      getDetail(this.relatedData.id).then(res => {
        Object.keys(this.openData).forEach(item => {
          if (res.data[item]) {
            this.openData[item] = res.data[item]
          }
        })
        this.conversion(this.openData)
        this.getSupplier(this.openData.supplierId)
        this.openData.attachmentList.forEach(item => {
          this.filesList.push({
            name: item.fileName,
            url: item.link
          })
        })
        this.openData.fileList.forEach(item1 => {
          if (item1.fileName) {
            this.imgArr.forEach(item2 => {
              if (item2.mark === item1.fileName) {
                item2.container.push({
                  id: item1.id,
                  url: item1.link,
                  name: item1.fileName
                })
              }
            })
          } else {
            this.imageList.push({
              id: item1.id,
              url: item1.link,
              name: 'image' + item1.id
            })
          }
        })
        this.auditData.id = res.data.id
        this.getScc = true
        const address = this.listAddress.filter(item => { return item.id === this.openData.supplierProvince })[0]
        this.cityList = address ? address.citys : []
        if (this.relatedData.status === 4 || this.relatedData.status === 5 || this.relatedData.status === 2 || this.relatedData.status === 3) {
          this.auditDetail = true
          Object.keys(this.auditData).forEach(item => {
            if (res.data[item]) {
              this.auditData[item] = res.data[item]
            }
          })
          const nameArr = []
          this.auditData.planVisitUserList.forEach(item => {
            nameArr.push(item.userRealName)
          })
          this.planUserAll = nameArr.join(',')
          this.conversion(this.auditData)
          this.auditPeopleName = res.data.auditPeopleName
          this.auditTime = res.data.auditTime
        }
        this.visitData.id = res.data.id
        if (this.relatedData.status === 3) {
          this.visitDetail = true
          Object.keys(this.visitData).forEach(item => {
            if (res.data[item]) {
              this.visitData[item] = res.data[item]
            }
          })
          const visitArr = []
          this.visitData.visitUserList.forEach(item => {
            visitArr.push((item.userRealName))
          })
          this.visitListAll = visitArr.join(',')
          this.visitData.visitFactoryType = this.visitData.visitFactoryType + ''
        }
        this.loading = false
      })
    },
    // 数字转字符
    conversion(val) {
      Object.keys(val).forEach(item => {
        if (val[item] === +val[item]) {
          val[item] = val[item] + ''
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
*{
    box-sizing: border-box;
}
::v-deep .el-dialog__body{
    padding-top: 10px;
    padding-bottom: 40px;

}
.imgListBox{
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  p{
    margin: 0;
    text-align: center;
  }
}
::v-deep .el-card{
    box-shadow: none;
    border: none!important;
    ::v-deep .el-card__body{
      padding-bottom: 0px!important;
    }
}
</style>
