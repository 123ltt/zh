<template>
  <basic-container>
    <el-card v-loading="loading" shadow="never">
      <el-form ref="rulesForm" :model="openData" :rules="rules" label-width="120px" size="mini">
        <el-card shadow="never">
          <div slot="header">
            <span style="font-weight: 600;">基础信息</span>
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="openData.supplierId" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" style="width:100%" :disabled="!isAdd" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="visitTime" label="访厂日期">
                <el-date-picker v-model="openData.visitTime" style="width:100%" type="date" placeholder="选择期望访厂日期" value-format="yyyy-MM-dd" :picker-options="effectiveTimePicker()" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="auditor" label="稽核人员" class="is-required">
                <g-select v-model="auditor" :items="userList" key-field="id" label-field="name" value-field="id" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="visitList" label="陪同人员" class="is-required">
                <g-select v-model="visitList" :items="userList" key-field="id" label-field="name" value-field="id" style="width:100%" multiple />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="score" label="评分">
                <el-input v-model="openData.score" v-input.positive.!0 placeholder="请输入内容" style="width:100%" @input="getNum(openData.score,'score')" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="qalDeptEvaluation" label="质量部评价">
                <el-input v-model="openData.qalDeptEvaluation" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" maxlength="500" style="width:100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <el-card>
          <div slot="header">
            <span style="font-weight: 600;">实地/视频情况</span>
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="supplierType" label="供货类型">
                <el-select v-model="openData.supplierType" placeholder="请选择" style="width:100%">
                  <el-option v-for="item in supplyTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="factoryArea" label="厂房面积">
                <el-input v-model="openData.factoryArea" v-input.positive placeholder="请输入内容" style="width:100%" @input="getNum(openData.factoryArea,'factoryArea')" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="employeeNum" label="员工数">
                <el-input v-model="openData.employeeNum" v-input.numeric.positive placeholder="请输入内容" style="width:100%" maxlength="6" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="mainProduct" label="主营产品">
                <el-input v-model="openData.mainProduct" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" maxlength="500" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="coopProduct" label="合作产品">
                <el-input v-model="openData.coopProduct" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" maxlength="500" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="mainCoopCustomer" label="主要合作客户(至少头部3家)" label-width="210px">
                <el-input v-model="openData.mainCoopCustomer" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" maxlength="500" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="isCrossBorder" label="是否自营跨境平台" label-width="150px">
                <el-radio-group v-model="openData.isCrossBorder">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="isTortiousContraband" label="是否做侵权(违禁)产品" label-width="150px">
                <el-radio-group v-model="openData.isTortiousContraband">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="canSignAgreement" label="能否签订框架协议" label-width="150px">
                <el-radio-group v-model="openData.canSignAgreement">
                  <el-radio :label="1">能</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="canInvoice" label="是否能开票" label-width="150px">
                <el-radio-group v-model="openData.canInvoice">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <el-card>
          <div slot="header">
            <span style="font-weight: 600;">研发设计能力</span>
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="brandName" label="品牌名称">
                <el-input v-model="openData.brandName" placeholder="请输入内容" style="width:100%" maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="designerNum" label="研发/设计师数量">
                <el-input v-model="openData.designerNum" v-input.number.positive placeholder="请输入内容" style="width:100%" maxlength="6" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="patentInForceNum" label="有效专利数">
                <el-input v-model="openData.patentInForceNum" v-input.number.positive placeholder="请输入内容" style="width:100%" maxlength="6" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="monthUpdateNum" label="月上新能力">
                <el-input v-model="openData.monthUpdateNum" v-input.number.positive placeholder="请输入内容" style="width:100%" maxlength="6" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="includeCoreEquipment" label="实验设备是否包含核心设备" label-width="200px">
                <el-radio-group v-model="openData.includeCoreEquipment">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <el-card>
          <div slot="header">
            <span style="font-weight: 600;">质量保障</span>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="haveProductLine" label="是否有生产线" label-width="150px">
                <el-radio-group v-model="openData.haveProductLine">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="haveSemiFinishedProduct" label="是否有半成品" label-width="150px">
                <el-radio-group v-model="openData.haveSemiFinishedProduct">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="canSignQalAgreement" label="能否签订品质协议" label-width="150px">
                <el-radio-group v-model="openData.canSignQalAgreement">
                  <el-radio :label="1">能</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="canSignQalStd" label="能否签订质量标准书" label-width="150px">
                <el-radio-group v-model="openData.canSignQalStd">
                  <el-radio :label="1">能</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="passQalManagementSys" label="是否通过质量管理体系" label-width="150px">
                <el-radio-group v-model="openData.passQalManagementSys">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="independentQalDept" label="是否有独立品质部" label-width="150px">
                <el-radio-group v-model="openData.independentQalDept">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="qalInspectorNum" label="质检员数" label-width="150px">
                <el-input v-model="openData.qalInspectorNum" v-input.number.positive placeholder="请输入内容" style="width:100%" maxlength="6" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <el-card shadow="never">
          <div slot="header">
            <span style="font-weight: 600;">访厂图片</span>
          </div>
          <el-row>
            <el-col :span="24">
              <upload-image v-if="getScc" :images.sync="imageList" :primary="false" :http-request="httpRequest" :uploading.sync="imageUploading" :limit="12" :size="5242880" />
            </el-col>

            <el-col :span="24">
              <el-form-item style="text-align: right;margin-right: 20px;">
                <el-button size="mini" icon="el-icon-circle-close" @click="$emit('close')">取消</el-button>
                <el-button size="mini" type="primary" @click="define()">保存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </el-card>
  </basic-container>
</template>

<script>
import { supplier, getMyDictBiz } from '@/api/commonApi/common.js'
import { save, update, getUserList, getDetail } from '@/api/factoryVisitManagement/record.js'
import httpRequest from '@/api/common/upload'
import { UploadImage } from 'global-components'

export default {
  name: 'CommonPssFactoryVisitRecordAdd',
  components: { UploadImage },
  props: {
    isAdd: Boolean,
    addData: Object
  },
  data() {
    return {
      loading: false,
      rules: {
        supplierId: [{ required: true, message: '供应商名称不能为空', trigger: 'change' }],
        visitTime: [{ required: true, message: '访厂日期不能为空', trigger: 'change' }],
        score: [{ required: true, message: '评分不能为空', trigger: 'change' }],
        qalDeptEvaluation: [{ required: true, message: '质量部评价不能为空', trigger: 'blur' }],
        supplierType: [{ required: true, message: '供货类型不能为空', trigger: 'blur' }],
        factoryArea: [{ required: true, message: '厂房面积不能为空', trigger: 'blur' }],
        employeeNum: [{ required: true, message: '员工数不能为空', trigger: 'change' }],
        mainProduct: [{ required: true, message: '主营产品不能为空', trigger: 'change' }],
        coopProduct: [{ required: true, message: '合作产品不能为空', trigger: 'change' }],
        mainCoopCustomer: [{ required: true, message: '主要合作客户不能为空', trigger: 'blur' }],
        isCrossBorder: [{ required: true, message: '请选择是否自营跨境平台', trigger: 'blur' }],
        isTortiousContraband: [{ required: true, message: '是否做侵权(违禁)产品', trigger: 'blur' }],
        canSignAgreement: [{ required: true, message: '请选择能否签订框架协议', trigger: 'blur' }],
        canInvoice: [{ required: true, message: '请选择是否能开票', trigger: 'blur' }],
        brandName: [{ required: true, message: '品牌名称不能为空', trigger: 'change' }],
        designerNum: [{ required: true, message: '研发/设计师数量不能为空', trigger: 'blur' }],
        patentInForceNum: [{ required: true, message: '有效专利数不能为空', trigger: 'change' }],
        monthUpdateNum: [{ required: true, message: '月上新能力不能为空', trigger: 'change' }],
        includeCoreEquipment: [{ required: true, message: '请选择实验设备是否包含核心设备', trigger: 'blur' }],
        haveProductLine: [{ required: true, message: '请选择是否有生产线', trigger: 'blur' }],
        haveSemiFinishedProduct: [{ required: true, message: '请选择是否有半成品', trigger: 'blur' }],
        canSignQalAgreement: [{ required: true, message: '请选择能否签订品质协议', trigger: 'blur' }],
        canSignQalStd: [{ required: true, message: '请选择能否签订质量标准书', trigger: 'blur' }],
        passQalManagementSys: [{ required: true, message: '请选择是否通过质量管理体系', trigger: 'blur' }],
        independentQalDept: [{ required: true, message: '请选择是否有独立品质部', trigger: 'blur' }],
        qalInspectorNum: [{ required: true, message: '质检员数不能为空', trigger: 'change' }]
      },
      supplierList: [],
      auditor: '',
      visitList: [], // 人员
      userList: [],
      supplyTypeList: [], // 供货类型
      openData: {
        id: '',
        supplierId: '',
        visitTime: '',
        users: [],
        score: '',
        qalDeptEvaluation: '',
        supplierType: '',
        factoryArea: '',
        employeeNum: '',
        mainProduct: '',
        coopProduct: '',
        mainCoopCustomer: '',
        isCrossBorder: '',
        isTortiousContraband: '',
        files: [],
        canSignAgreement: '',
        canInvoice: '',
        brandName: '',
        designerNum: '',
        patentInForceNum: '',
        monthUpdateNum: '',
        includeCoreEquipment: '',
        haveProductLine: '',
        haveSemiFinishedProduct: '',
        canSignQalAgreement: '',
        canSignQalStd: '',
        passQalManagementSys: '',
        independentQalDept: '',
        qalInspectorNum: ''
      },
      imageList: [],
      httpRequest,
      imageUploading: false, // 上传状态
      getScc: true,
      oldScore: '',
      oldArea: ''
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
      // 经营模式
      getMyDictBiz('pss_supplier_type').then(res => {
        this.supplyTypeList = res.data
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
    getNum(val, str) {
      if (val) {
        if (str === 'score') {
          if (val.split('.')[1] && val.split('.')[1].length > 3) {
            this.openData.score = this.oldScore
          } else if (+val >= 1000) {
            this.openData.score = this.oldScore
          } else {
            this.oldScore = val
          }
        } else if (str === 'factoryArea') {
          if (val.split('.')[1] && val.split('.')[1].length > 3) {
            this.openData.factoryArea = this.oldArea
          } else if (+val >= 1000000) {
            this.openData.factoryArea = this.oldArea
          } else {
            this.oldArea = val
          }
        }
      }
    },
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!this.auditor || !this.visitList.length) {
            this.$message.error('请选择相关人员！')
          } else if (!this.imageList.length) {
            this.$message.error('请上传对应图片！')
          } else {
            this.openData.files = []
            this.openData.users = []
            if (this.imageUploading) return this.$message.error('文件正在上传中，请稍后')
            if (this.imageList.length) {
              this.imageList.forEach(item => {
                const obj = {
                  id: '' || item.id,
                  link: typeof item.url === 'object' ? item.url.link : item.url,
                  fileType: 'image'
                }
                this.openData.files.push(obj)
              })
            }
            this.openData.users.push({
              type: 'auditor',
              userId: this.auditor
            })
            this.visitList.forEach(item => {
              const obj = {
                type: 'entourage',
                userId: item
              }
              this.openData.users.push(obj)
            })
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
            }
          }
        } else {
          this.$message.error('完成相关信息！')
        }
      })
    },
    // 处理编辑
    dealWith() {
      if (!this.isAdd) {
        this.getScc = false
        this.imageList = []
        getDetail(this.addData.id).then(res => {
          Object.keys(this.openData).forEach(item => {
            if (res.data[item]) {
              this.openData[item] = res.data[item]
            }
          })
          this.openData.supplierId = this.openData.supplierId + ''
          this.openData.users.forEach(item => {
            if (item.type === 'entourage') {
              this.visitList.push((item.userId + ''))
            } else if (item.type === 'auditor') {
              this.auditor = item.userId + ''
            }
          })
          this.openData.files.forEach(item1 => {
            this.imageList.push({
              id: item1.id,
              url: item1.link,
              name: 'image' + item1.id
            })
          })
          Object.keys(this.openData).forEach(item => {
            if (!this.openData[item]) {
              this.openData[item] = 0
            }
          })
          this.getScc = true
        })
      }
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
