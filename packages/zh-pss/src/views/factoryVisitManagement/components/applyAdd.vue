<template>
  <basic-container>
    <el-card v-loading="loading" shadow="never">
      <el-card shadow="never">
        <div slot="header">
          <span style="font-weight: 600;">供应商信息</span>
        </div>
        <el-form ref="informationForm" :model="openData" :rules="rules" label-width="120px" size="mini">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="openData.supplierId" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" style="width:100%" :disabled="!isAdd" @input="getSupplier" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司资质" class="is-required">
                <el-input v-model="supplier.qualification" disabled style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="auditors" label="成立时间" class="is-required">
                <el-input v-model="supplier.setTime" disabled style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item prop="supplierAddress" label="详细地址">
                <el-select v-model="openData.supplierProvince" clearable placeholder="请选择省" filterable style="width:25%" @input="changeProvince">
                  <el-option v-for="item in listAddress" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-select v-model="openData.supplierCity" clearable placeholder="请选择市" filterable style="width:25%">
                  <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-input v-model="openData.supplierAddress" placeholder="请输入详细地址" clearable style="width:48%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否能开票" class="is-required">
                <el-input v-model="supplier.makeInvoice" disabled style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="relationPeople" label="联系人">
                <el-input v-model="openData.relationPeople" clearable maxlength="50" placeholder="请填写" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="relationPhone" label="联系方式">
                <el-input v-model="openData.relationPhone" clearable maxlength="50" placeholder="请填写" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="supplyType" label="供货类型">
                <el-select v-model="openData.supplyType" clearable placeholder="请选择" filterable style="width:100%">
                  <el-option v-for="item in supplyTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="mainCategoryPathList" label="主营产品类目">
                <el-cascader v-model="openData.mainCategoryPathList" :options="mainCategoryList" clearable placeholder="请选择" filterable style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="productProperty" label="产品属性">
                <el-select v-model="openData.productProperty" clearable placeholder="请选择" filterable style="width:100%">
                  <el-option v-for="item in productPropertyList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="mainProduct" label="主营产品">
                <el-input v-model="openData.mainProduct" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" maxlength="500" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="cooperationProduct" label="合作产品">
                <el-input v-model="openData.cooperationProduct" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" maxlength="500" style="width:100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card shadow="never">
        <div slot="header">
          <span style="font-weight: 600;">访厂申请</span>
        </div>
        <el-form ref="rulesForm" :model="openData" :rules="rules" label-width="120px" size="mini">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="applyVisitReason" label="申请访厂原因">
                <el-select v-model="openData.applyVisitReason" clearable placeholder="请选择" filterable style="width:100%">
                  <el-option v-for="item in visitReasonList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="productPrice" label="产品价格(均价)">
                <el-input v-model="openData.productPrice" v-input.positive placeholder="请输入内容" style="width:100%" @input="getNum">
                  <template slot="append">RMB</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="expectedVisitTime" label="期望访厂日期">
                <el-date-picker v-model="openData.expectedVisitTime" style="width:100%" type="date" placeholder="选择期望访厂日期" value-format="yyyy-MM-dd" :picker-options="effectiveTimePicker()" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="applyNote" label="申请备注">
                <el-input v-model="openData.applyNote" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" maxlength="500" style="width:100%" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="申请资料">
                <div class="imgListBox">
                  <div v-for="item in imgArr" :key="item.make">
                    <p>{{ item.title }}</p>
                    <upload-image v-if="getScc" :images.sync="item.container" :primary="false" :is-remove="true" :http-request="httpRequest" :uploading.sync="item.imgStatus" :avatar="true" :size="5242880" />
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
                <upload-file v-if="getScc" :files.sync="filesList" :http-request="httpRequest" :uploading.sync="attUploading" :size="5242880" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item style="text-align: right;margin-right: 20px;">
                <el-button size="mini" icon="el-icon-circle-close" @click="$emit('close')">取消</el-button>
                <el-button size="mini" type="primary" @click="define()">保存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-card></basic-container>
</template>

<script>
import { supplier, getMyDictBiz } from '@/api/commonApi/common.js'
import { save, update, getCateGoryChild, adjust, getSupplierInfo, getDetail } from '@/api/factoryVisitManagement/apply.js'
import httpRequest from '@/api/common/upload'
import { UploadImage, UploadFile } from 'global-components'

export default {
  name: 'CommonPssFactoryVisitRecordAdd',
  components: { UploadImage, UploadFile },
  props: {
    isAdd: Boolean,
    addData: Object, // 父传子的表格参数
    listAddress: Array
  },
  data() {
    const missionPass = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号！'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      rules: {
        supplierId: [{ required: true, message: '供应商名称不能为空', trigger: 'change' }],
        supplierProvince: [{ required: true, message: '供应商名称不能为空', trigger: 'change' }],
        supplierCity: [{ required: true, message: '供应商名称不能为空', trigger: 'change' }],
        supplierAddress: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
        relationPeople: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        relationPhone: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' },
          { validator: missionPass, trigger: 'blur' }
        ],
        supplyType: [{ required: true, message: '供货类型不能为空', trigger: 'change' }],
        mainCategoryPathList: [{ required: true, message: '主营产品类目不能为空', trigger: 'change' }],
        productProperty: [{ required: true, message: '产品属性不能为空', trigger: 'change' }],
        mainProduct: [{ required: true, message: '主营产品不能为空', trigger: 'blur' }],
        cooperationProduct: [{ required: true, message: '合作产品不能为空', trigger: 'blur' }],
        applyVisitReason: [{ required: true, message: '申请访厂原因不能为空', trigger: 'change' }],
        productPrice: [{ required: true, message: '产品价格不能为空', trigger: 'blur' }],
        expectedVisitTime: [{ required: true, message: '期望访厂日期不能为空', trigger: 'change' }]
      },
      cityList: [], // 市
      supplier: {
        makeInvoice: '',
        qualification: '',
        setTime: ''
      },
      supplierList: [],
      supplyTypeList: [], // 供货类型
      mainCategoryList: [], // 主营产品类目
      propertyList: [], // 产品属性
      visitReasonList: [], // 申请访厂原因
      productPropertyList: [],
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
        mainCategoryPathList: [],
        productProperty: '',
        mainProduct: '',
        cooperationProduct: '',
        fileList: [],
        attachmentList: [],
        applyVisitReason: '',
        productPrice: '',
        expectedVisitTime: '',
        applyNote: ''
      },
      imageList: [],
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
      oldPrice: ''
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
      this.loading = true
      // 供应商
      supplier().then(res => {
        this.supplierList = res.data
        this.loading = false
      })
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
          this.mainCategoryList.push(obj)
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
    },
    effectiveTimePicker() {
      return {
        disabledDate: (time) => {
          return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    },
    changeProvince(val) {
      if (val) {
        this.cityList = this.listAddress.filter(item => { return item.id === val })[0].citys
      } else {
        this.cityList = []
      }
    },
    getSupplier(val) {
      if (val) {
        getSupplierInfo(val).then(res => {
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
    getNum(val) {
      if (val) {
        if (val.split('.')[1] && val.split('.')[1].length > 3) {
          this.openData.productPrice = this.oldPrice
        } else {
          this.oldPrice = val
        }
      }
    },
    define() {
      this.$refs.informationForm.validate((valid1) => {
        if (valid1) {
          this.$refs.rulesForm.validate((valid2) => {
            if (valid2) {
              this.openData.attachmentList = []
              this.openData.fileList = []
              let upStatus = false
              this.imgArr.forEach(item => {
                if (item.imgStatus) {
                  upStatus = true
                }
              })
              if (this.imageUploading || this.attUploading || upStatus) return this.$message.error('文件正在上传中，请稍后')
              if (this.filesList.length) {
                this.filesList.forEach(item => {
                  const name = item.name.split('.')[1]
                  const obj = {
                    id: '' || item.id,
                    link: typeof item.url === 'object' ? item.url.link : item.url,
                    fileType: name,
                    fileName: item.name
                  }
                  this.openData.attachmentList.push(obj)
                })
              }
              if (this.imageList.length) {
                this.imageList.forEach(item => {
                  const obj = {
                    id: '' || item.id,
                    link: typeof item.url === 'object' ? item.url.link : item.url,
                    fileType: 'image'
                  }
                  this.openData.fileList.push(obj)
                })
              }
              this.imgArr.forEach(item => {
                if (item.container.length) {
                  const obj = {
                    fileName: item.mark,
                    id: '' || item.container[0].id,
                    link: typeof item.container[0].url === 'object' ? item.container[0].url.link : item.container[0].url,
                    fileType: 'image'
                  }
                  this.openData.fileList.push(obj)
                }
              })
              this.openData.mainCategory = this.openData.mainCategoryPathList[1]
              if (this.isAdd) {
                this.loading = true
                save(this.openData).then(() => {
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
              } else {
                if (this.addData.status === 0) {
                  this.loading = true
                  update(this.openData).then(() => {
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
                } else if (this.addData.status === 4) {
                  this.loading = true
                  adjust(this.openData).then(() => {
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
            } else {
              this.$message.error('完成相关信息！')
            }
          })
        } else {
          this.$message.error('完成相关信息！')
        }
      })
    },
    // 处理编辑
    dealWith() {
      if (!this.isAdd) {
        this.getScc = false
        this.filesList = []
        getDetail(this.addData.id).then(res => {
          Object.keys(this.openData).forEach(item => {
            if (res.data[item]) {
              this.openData[item] = res.data[item]
            }
          })
          this.conversion(this.openData)
          this.getSupplier(this.openData.supplierId)
          this.openData.supplierId = this.openData.supplierId + ''
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
          this.getScc = true
          const address = this.listAddress.filter(item => { return item.id === this.openData.supplierProvince })[0]
          this.cityList = address ? address.citys : []
        })
      }
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
::v-deep .el-card{
    box-shadow: none;
    border: none!important;
    ::v-deep .el-card__body{
      padding-bottom: 0px!important;
    }
}
.imgListBox{
  display: flex;
  flex-wrap: wrap;
  p{
    margin: 0;
    text-align: center;
  }
}

</style>
