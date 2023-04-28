<template>
  <basic-container>
    <!-- 公司信息 -->
    <div class="btn-head">
      <p />
      <el-button
        type="primary"
        size="mini"
        :disabled="submitBtnEnable"
        @click="handleSave('formObjRef')"
      >保存</el-button>
    </div>
    <el-form
      ref="formObjRef"
      :model="formObj"
      :rules="rules"
      label-width="120px"
      size="mini"
      class="form-col"
    >
      <div class="comp-box">
        <div class="comp-head" @click="compDown = !compDown">
          <div class="comp-title">基础信息</div>
          <el-button :icon="compDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
        </div>
        <el-row v-show="compDown" style="width:70%;margin: auto;">
          <el-col :span="12">
            <el-form-item label="平台" prop="baseInfo.platformId">
              <el-select v-model="formObj.baseInfo.platformId" filterable clearable placeholder="请选择" size="mini" style="width:200px" @change="changePlatformId">
                <el-option v-for="(item,index) in findForm.platformOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="站点" prop="baseInfo.siteId" :rules="!isShowSite ? [{required: true, message: '站点不能为空', trigger: 'change'}]:[]">
              <el-select v-model="formObj.baseInfo.siteId" filterable clearable placeholder="请选择" size="mini" style="width:200px" :disabled="isShowSite">
                <el-option v-for="(item,index) in findForm.siteOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺名" prop="baseInfo.name">
              <el-input v-model.trim="formObj.baseInfo.name" :maxlength="LIMIT.name" :disabled="compId?true:false" placeholder="请输入" clearable class="w200" />
            </el-form-item>
          </el-col>
          <el-col v-if="isPlatformCode" :span="12">
            <el-form-item label="刊登站点" prop="baseInfo.sitePublishIds">
              <el-select v-model="formObj.baseInfo.sitePublishIds" multiple filterable clearable default-first-option placeholder="请选择" size="mini" style="width:200px">
                <el-option v-for="(item,index) in findForm.siteOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否FBA店铺" prop="baseInfo.isFba">
              <el-radio-group v-model="formObj.baseInfo.isFba">
                <el-radio v-for="(item,index) in findForm.fbaOption" :key="index" :label="item.value" :value="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属组织" prop="baseInfo.organizationId">
              <el-select v-model="formObj.baseInfo.organizationId" filterable clearable placeholder="请选择" size="mini" style="width:200px" @change="changeOrganization">
                <el-option v-for="(item,index) in findForm.compOption" :key="index" :label="item.orgName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="FBA店铺库存" prop="baseInfo.fbaStock">
              <el-input v-model.trim="formObj.baseInfo.fbaStock" maxlength="8" placeholder="请输入" clearable class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款币种" prop="baseInfo.receiptCurrencyCode">
              <el-select v-model="formObj.baseInfo.receiptCurrencyCode" clearable filterable default-first-option placeholder="请选择" size="mini" style="width:200px">
                <el-option v-for="(item,index) in findForm.regCurrencyOption" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申购/注册日期" prop="baseInfo.bidDate">
              <el-date-picker v-model="formObj.baseInfo.bidDate" type="date" placeholder="选择日期" format="yyyy-MM-dd " value-format="yyyy-MM-dd" size="mini" style="width:200px" :picker-options="pickerOptions" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="添加时间" prop="baseInfo.createTime">
              <el-date-picker v-model="formObj.baseInfo.createTime"
                              :disabled="true"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              style="width: 200px"
                              size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="baseInfo.remark">
              <el-input v-model.trim="formObj.baseInfo.remark" :maxlength="LIMIT.title" type="textarea" class="w200" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="comp-head" @click="operateDown = !operateDown">
          <div class="comp-title">运营信息</div>
          <el-button :icon="operateDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
        </div>
        <el-row v-show="operateDown" :gutter="20" style="width:70%;margin: auto;">
          <el-col :span="12">
            <el-form-item label="销售人员" prop="operationInfo.mainSellerId">
              <el-select v-model="formObj.operationInfo.mainSellerId" filterable default-first-option clearable placeholder="请选择" size="mini" style="width:200px">
                <el-option v-for="(item,index) in findForm.mainSellerOption" :key="index" :label="item.label" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客服人员" prop="operationInfo.customerServiceId">
              <el-select v-model="formObj.operationInfo.customerServiceId" filterable default-first-option clearable placeholder="请选择" size="mini" style="width:200px">
                <el-option v-for="(item,index) in findForm.mainSellerOption" :key="index" :label="item.label" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品线" prop="operationInfo.productLineId">
              <el-select v-model="formObj.operationInfo.productLineId" filterable clearable placeholder="请选择" size="mini" style="width:200px">
                <el-option v-for="(item,index) in findForm.productLineOption" :key="index" :label="item.lineName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类目" prop="operationInfo.categoryIds">
              <el-select v-model="formObj.operationInfo.categoryIds" clearable collapse-tags multiple filterable default-first-option placeholder="请选择" size="mini" style="width:200px">
                <el-option v-for="(item,index) in findForm.categorOptions" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外部SKU前缀" prop="operationInfo.externalSkuPrefix">
              <el-input v-model.trim="formObj.operationInfo.externalSkuPrefix" class="w200" :disabled="true" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺链接" prop="operationInfo.storeUrl">
              <el-input v-model.trim="formObj.operationInfo.storeUrl" class="w200" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水印码" prop="operationInfo.watermark">
              <el-input v-model.trim="formObj.operationInfo.watermark" class="w200" :disabled="true" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺邮箱" prop="operationInfo.storeEmail">
              <el-input v-model.trim="formObj.operationInfo.storeEmail" placeholder="请输入" clearable class="w200" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="刊登利润率" prop="operationInfo.publishGrossProfitRate">
              <el-input v-model.trim="formObj.operationInfo.publishGrossProfitRate" class="w200" maxlength="4" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="网络类型" prop="operationInfo.net">
              <el-select v-model="formObj.operationInfo.net" clearable placeholder="请选择" size="mini" style="width:200px">
                <el-option v-for="(item,index) in findForm.NetworkTypeOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IP" prop="operationInfo.ip">
              <el-input v-model.trim="formObj.operationInfo.ip" placeholder="请输入" clearable class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺风险等级" prop="registerInfo.storeRiskLevel">
              <el-radio-group v-model="formObj.registerInfo.storeRiskLevel">
                <el-radio v-for="(item,index) in findForm.storeRiskLevelOption" :key="index" :label="item.value" :value="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="使用的品牌" prop="operationInfo.trademarkNames">
              <el-tag
                v-for="(tag,index) in formObj.operationInfo.trademarkNames"
                :key="index"
                closable
                :disable-transitions="false"
                @close="handleTagsClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputTagsVisible"
                ref="saveTagInput"
                v-model="tagsInputVal"
                class="input-new-tag"
                size="mini"
                maxlength="30"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag" :disabled="formObj.operationInfo.trademarkNames &&formObj.operationInfo.trademarkNames.length === 3" size="mini" @click="showInput">+ 品牌</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="comp-head" @click="registerDown = !registerDown">
          <div class="comp-title">注册信息</div>
          <el-button :icon="registerDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
        </div>
        <el-row v-show="registerDown" :gutter="20" style="width:70%;margin: auto;">
          <el-col :span="12">
            <el-form-item label="公司名称/个人" prop="registerInfo.companyId">
              <el-select v-model="formObj.registerInfo.companyId" filterable clearable placeholder="请选择" size="mini" style="width:200px" @change="changeCompany">
                <el-option v-for="(item,index) in findForm.companyOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="registerInfo.phone">
              <el-input v-model.trim="formObj.registerInfo.phone" placeholder="请输入" clearable class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="position:relatvie">
            <i style="color:#F56C6C;position: absolute;left: 62px;top: 52px;">*</i>
            <el-form-item label="公司类型" prop="registerInfo.type">
              <el-select v-model="formObj.registerInfo.type" clearable :disabled="true" placeholder="" size="mini" style="width:200px">
                <el-option v-for="(item,index) in findForm.typeOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册日期" prop="registerInfo.registerTime" :rules="formObj.registerInfo.nature==='公司'?[{ required: true, message: '注册日期不能为空', trigger: 'blur' }] :[{required:false}]">
              <el-date-picker v-model="formObj.registerInfo.registerTime" :disabled="true" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width:200px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信用卡卡号" prop="registerInfo.ccNumber">
              <el-input v-model.trim="formObj.registerInfo.ccNumber" placeholder="请输入" :maxlength="16" clearable class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信用卡有效期" prop="registerInfo.ccExpirationDate">
              <el-date-picker v-model="formObj.registerInfo.ccExpirationDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width:200px" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { deepClone } from '@/util/util'
import { isPhone, isMobile, isEmail, isIp } from '@/util/validate'
import { dictionary, currencyList, compList, getCategorListLevel1 } from '@/api/public'
import { addApprove, updateApprove, approveDetails, companyOptions, approveCode, updateUnimproved } from '@/api/storeAudit'
import { companyDetail } from '@/api/companyInfo'
import { queryLine } from '@/api/pms'
import { getUserList } from '@/api/ams'
import { siteOption } from '@/api/site' // 站点
import { platformOption } from '@/api/platform' // 平台
import { LIMIT } from '@/config/form'

export default {
  name: 'Apply',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    },
    auditTabActiveName: {
      type: String
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('电话不能为空'))
      }
      if (isMobile(value) || isPhone(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的联系电话'))
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('店铺邮箱不能为空'))
      }
      if (isEmail(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的店铺邮箱'))
      }
    }
    const validateIP = (rule, value, callback) => {
      if (!value) {
        callback(new Error('IP不能为空'))
      }
      if (isIp(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的IP地址'))
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      LIMIT,
      compDown: true,
      operateDown: true,
      registerDown: true,
      isSiteId: false, // 站点
      isPlatformId: false, // 平台
      // 用于提交时判断是否修改
      oldForm: null,
      formObj: {
        baseInfo: {
          platformId: '',
          platformCode: '',
          sitePublishList: [],
          sitePublishIds: null,
          siteId: '',
          siteCode: '',
          name: '',
          code: '',
          isFba: null,
          fbaStock: null,
          receiptCurrencyCode: '',
          organizationId: '',
          orgCode: '',
          bidDate: '',
          remark: ''
        },
        operationInfo: {
          categoryIds: [],
          mainSellerName: '',
          productLineId: '',
          customerServiceId: '',
          publishGrossProfitRate: '',
          net: '',
          ip: '',
          trademarkNames: [], // 品牌
          externalSkuPrefix: '',
          mainSellerId: '',
          storeUrl: '',
          storeEmail: '',
          watermark: ''
        },
        registerInfo: {
          companyId: '',
          phone: '',
          ccNumber: '',
          type: '',
          registerTime: '',
          ccExpirationDate: ''
        }
      },
      findForm: {
        fbaOption: [{ label: '是', value: true }, { label: '否', value: false }],
        regCurrencyOption: [],
        NetworkTypeOption: [],
        platformOption: [],
        siteOption: [],
        compOption: [],
        companyOption: [], // 公司名称
        typeOption: [], // 公司类型
        storeRiskLevelOption: [{ label: '低级', value: 1 }, { label: '中级', value: 2 }, { label: '高级', value: 3 }],
        mainSellerOption: [], // 客服销售人员
        productLineOption: [], // 产品线
        categorOptions: [], // 类目
        natureOption: [] // 公司属性
      },
      showSiteCode: ['WH', 'SM', 'LZ'],
      sitePublishCode: ['EB', 'LZ'],
      tagsInputVal: '',
      inputTagsVisible: false,
      rules: {
        'baseInfo.platformId': [{ required: true, message: '平台不能为空', trigger: 'change' }],
        'baseInfo.name': [{ required: true, message: '店铺不能为空', trigger: 'blur' }],
        'baseInfo.isFba': [{ required: true, message: '是否Fba不能为空', trigger: 'change' }],
        'baseInfo.fbaStock': [{ trigger: 'blur', message: '请输入有效FBA店铺库存', pattern: /^[1-9]\d*$/ }],
        'baseInfo.organizationId': [{ required: true, message: '所属组织不能为空', trigger: 'change' }],
        'operationInfo.mainSellerId': [{ required: true, message: '销售不能为空', trigger: 'change' }],
        'operationInfo.customerServiceId': [{ required: true, message: '客服不能为空', trigger: 'change' }],
        'operationInfo.externalSkuPrefix': [{ required: true, message: '外部SKU前缀不能为空', trigger: 'blur' }],
        'operationInfo.storeUrl': [{ required: true, message: '店铺链接不能为空', trigger: 'blur' },
          { pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确的店铺链接', trigger: 'blur' }],
        'operationInfo.watermark': [{ required: true, message: '水印码不能为空', trigger: 'blur' }],
        'operationInfo.storeEmail': [{ required: true, trigger: 'blur', validator: validateEmail }],
        'operationInfo.categoryIds': [{ required: true, message: '类目不能为空', trigger: 'change' }],
        'operationInfo.publishGrossProfitRate': [{ required: true, message: '刊登利润率不能为空', trigger: 'blur' },
          { pattern: /0\.\d+/g, message: '请输入0.01-0.99之间', trigger: 'blur' }
        ],
        'operationInfo.net': [{ required: true, message: '网络类型不能为空', trigger: 'change' }],
        'operationInfo.ip': [{ required: true, trigger: 'blur', validator: validateIP }],
        'registerInfo.companyId': [{ required: true, message: '公司名称/个人不能为空', trigger: 'change' }],
        'registerInfo.phone': [{ required: true, trigger: 'blur', validator: validatePhone }],
        'registerInfo.ccNumber': [{ required: true, message: '信用卡卡号不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d{13,16}$/, message: '请输入正确的信用卡卡号!', trigger: 'blur' }],
        'registerInfo.ccExpirationDate': [{ required: true, message: '信用卡有效期不能为空', trigger: 'change' }]
      }

    }
  },
  computed: {
    // 是否显示
    isShowSite() {
      return this.showSiteCode.includes(this.formObj.baseInfo.platformCode)
    },
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.formObj))
    },
    isPlatformCode() {
      return this.sitePublishCode.includes(this.formObj.baseInfo.platformCode)
    }
  },
  mounted() {
    if (this.compId) {
      this.isSiteId = false // 平台
      this.isPlatformId = false // 站点
      this.getApproveDetails()
    } else {
      this.getApproveCode()
      this.getCategorAll()
      this.getCompList()
      this.dictionary('sams_net_type')
      this.dictionary('sams_company_nature')
      this.dictionary('sams_company_type')
      this.getCurrencyList()
      this.getPlatformOption()
      this.getCompanyOptions()
      this.getQueryLine()
    }
  },
  methods: {
    handleTagsClose(tag) {
      this.formObj.operationInfo.trademarkNames.splice(this.formObj.operationInfo.trademarkNames.indexOf(tag), 1)
    },
    handleInputConfirm() {
      const tagsInputVal = this.tagsInputVal
      if (tagsInputVal && this.formObj.operationInfo.trademarkNames.length <= 3) {
        this.formObj.operationInfo.trademarkNames.push(tagsInputVal)
      }
      this.inputTagsVisible = false
      this.tagsInputVal = ''
    },
    // tag 标签处理
    showInput() {
      this.inputTagsVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
      this.$refs.formObjRef.validateField('operationInfo.trademarkNames') // 再次校验tag的正则
    },
    // 详情
    getApproveDetails() {
      approveDetails({ id: this.compId }).then(res => {
        const data = res.data
        data.baseInfo.sitePublishIds = data.baseInfo.sitePublishList.map(item => item.siteId)
        if (data.baseInfo.platformId) {
          this.getSiteOption(data.baseInfo.platformId)
        }
        data.baseInfo.fbaStock = parseInt(data.baseInfo.fbaStock)
        if (data.baseInfo.fbaStock === 0) {
          data.baseInfo.fbaStock = ''
        }
        data.baseInfo.platformId = data.baseInfo.platformId === 0 ? '' : data.baseInfo.platformId + ''
        data.baseInfo.siteId = data.baseInfo.siteId === 0 ? '' : data.baseInfo.siteId
        data.operationInfo.mainSellerId = data.operationInfo.mainSellerId === 0 ? '' : data.operationInfo.mainSellerId + ''
        data.operationInfo.customerServiceId = data.operationInfo.customerServiceId === 0 ? '' : data.operationInfo.customerServiceId + ''

        data.baseInfo.organizationId && this.getUserList(data.baseInfo.organizationId)
        if (typeof data.registerInfo.companyId === 'number') {
          data.registerInfo.companyId = data.registerInfo.companyId + ''
        }

        if (data.registerInfo.companyId === 0) {
          data.registerInfo.companyId = ''
        } else {
          this.getCompanyDetail(data.registerInfo.companyId)
        }
        this.formObj = data
        this.getCompList()
        this.getCategorAll()
        this.dictionary('sams_net_type')
        this.dictionary('sams_company_nature')
        this.dictionary('sams_company_type')
        this.getCurrencyList()
        this.getPlatformOption()
        this.getCompanyOptions()
        this.getQueryLine()
        this.oldForm = deepClone(this.formObj) // 备份数据
      })
    },
    // 保存
    handleSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const siteCode = this.findForm.siteOption.filter(acc => acc.hiddenValue === this.formObj.baseInfo.siteId)

          if (siteCode && siteCode.length) {
            this.formObj.baseInfo.siteCode = siteCode[0].displayName
          }

          if (this.formObj.baseInfo.bidDate) {
            this.formObj.baseInfo.bidDate = `${this.formObj.baseInfo.bidDate} 00:00:00`
          }
          if (this.formObj.registerInfo.registerTime) {
            this.formObj.registerInfo.registerTime = `${this.formObj.registerInfo.registerTime} 00:00:00`
          }
          if (this.formObj.registerInfo.ccExpirationDate) {
            this.formObj.registerInfo.ccExpirationDate = `${this.formObj.registerInfo.ccExpirationDate} 00:00:00`
          }
          this.formObj.registerInfo.companyName = this.findForm.companyOption.filter(acc => acc.hiddenValue === this.formObj.registerInfo.companyId)[0].displayName
          const mainSellerName = this.findForm.mainSellerOption.filter(acc => acc.id === this.formObj.operationInfo.mainSellerId)
          this.formObj.operationInfo.mainSellerName = mainSellerName[0].name + mainSellerName[0].jobNumber
          // 刊登站点
          const sitePublishIds = Array.from(new Set(this.formObj.baseInfo.sitePublishIds))
          const sitePublishItem = []
          this.findForm.siteOption.forEach(item => {
            if (sitePublishIds.includes(item.hiddenValue)) {
              const obj = {}
              obj.siteId = item.hiddenValue
              obj.siteCode = item.displayName
              sitePublishItem.push(obj)
            }
          })
          this.formObj.baseInfo.sitePublishList = sitePublishItem
          // 产品线
          if (this.formObj.operationInfo.productLineId) {
            const list = this.findForm.productLineOption.filter(item => item.id === this.formObj.operationInfo.productLineId)
            this.formObj.operationInfo.productLine = list.length ? list[0].lineName : ''
          }

          if (this.formObj.operationInfo.categoryIds) {
            this.formObj.operationInfo.categoryNames = []
            this.findForm.categorOptions.filter(item => {
              if (this.formObj.operationInfo.categoryIds.indexOf(item.id) > -1) {
                this.formObj.operationInfo.categoryNames.push(item.name)
              }
            })
          }
          if (this.formObj.baseInfo.organizationId) {
            if (this.formObj.baseInfo.organizationId === 0) {
              this.formObj.baseInfo.organizationId = ''
            } else {
              this.formObj.baseInfo.organizationCode = this.findForm.compOption.filter(item => item.id === this.formObj.baseInfo.organizationId)[0].orgName
            }
          }
          const customerServiceName = this.findForm.mainSellerOption.filter(acc => acc.id === this.formObj.operationInfo.customerServiceId)
          this.formObj.operationInfo.customerServiceName = customerServiceName[0].name + customerServiceName[0].jobNumber
          if (this.compId) {
            if (this.auditTabActiveName === '1') {
              updateUnimproved({ ...this.formObj.baseInfo, ...this.formObj.operationInfo, ...this.formObj.registerInfo }).then(res => {
                this.$message.success(res.msg)
                this.$emit('close', true)
              })
            } else {
              updateApprove({ ...this.formObj.baseInfo, ...this.formObj.operationInfo, ...this.formObj.registerInfo }).then(res => {
                this.$message.success(res.msg)
                this.$emit('close', true)
              })
            }
          } else {
            addApprove({ ...this.formObj.baseInfo, ...this.formObj.operationInfo, ...this.formObj.registerInfo }).then(res => {
              this.$message.success(res.msg)
              this.$emit('close', true)
            })
          }
        } else {
          this.operateDown = true
          this.registerDown = true
          this.compDown = true
        }
      })
    },
    // 获取外链SKU前缀,水印码
    getApproveCode() {
      approveCode().then(res => {
        const data = res.data
        this.formObj.operationInfo.externalSkuPrefix = data.externalSkuPrefix
        this.formObj.operationInfo.watermark = data.watermark
      })
    },
    // 获取公司信息
    getCompanyOptions() {
      companyOptions().then(res => {
        const data = res.data
        this.findForm.companyOption = data
        if (this.formObj.registerInfo.companyId && this.formObj.registerInfo.companyId.length) {
          if (this.formObj.registerInfo.companyId === 0) {
            this.formObj.registerInfo.companyId = ''
          } else {
            const filterCompId = this.findForm.companyOption.filter(acc => acc.hiddenValue === this.formObj.registerInfo.companyId)
            this.formObj.registerInfo.companyId = filterCompId && filterCompId.length ? this.formObj.registerInfo.companyId : ''
          }
        }
      })
    },
    // 产品线
    getQueryLine() {
      queryLine({ current: 1, size: 9999 }).then(res => {
        const records = res.data.records
        this.findForm.productLineOption = records
        if (this.formObj.operationInfo.productLineId) {
          const list = records.filter(item => item.id === this.formObj.operationInfo.productLineId)
          this.formObj.operationInfo.productLineId = list.length ? list[0].lineName : ''
        }
      })
    },
    // 切换公司
    changeCompany(val) {
      if (val) {
        this.getCompanyDetail(val)
      } else {
        this.formObj.registerInfo.type = null
        this.formObj.registerInfo.registerTime = ''
      }
    },
    // 获取公司详细信息
    getCompanyDetail(val) {
      companyDetail({ id: val }).then(res => {
        const data = res.data
        this.formObj.registerInfo.type = typeof data.type === 'number' ? data.type + '' : data.type
        this.formObj.registerInfo.nature = data.nature
        this.findForm.natureOption.forEach(item => {
          if (item.hiddenValue === this.formObj.registerInfo.nature) {
            this.formObj.registerInfo.nature = item.displayName
            this.$set(this.formObj, this.formObj.registerInfo, this.formObj.registerInfo.nature)
          }
        })
        const registerTime = data.regDate
        this.formObj.registerInfo.registerTime = registerTime && registerTime.split('00:00:00')[0]
      })
    },
    // 组织架构列表
    getCompList() {
      compList({ category: 2 }).then(res => {
        const data = res.data
        this.findForm.compOption = data
        if (this.formObj.baseInfo.organizationId) {
          const filterCompId = this.findForm.compOption.filter(acc => acc.id === this.formObj.baseInfo.organizationId + '')
          this.formObj.baseInfo.organizationId = filterCompId && filterCompId.length ? this.formObj.baseInfo.organizationId.toString() : ''
          if (!this.formObj.baseInfo.organizationId) {
            this.formObj.operationInfo.mainSellerId = ''
            this.formObj.operationInfo.customerServiceId = ''
            this.$nextTick(() => { this.$refs.formObjRef.clearValidate(['baseInfo.organizationId', 'operationInfo.mainSellerId', 'operationInfo.customerServiceId', 'operationInfo.categoryIds']) })
          }
        } else {
          this.formObj.baseInfo.organizationId = this.formObj.baseInfo.organizationId === 0 ? '' : this.formObj.baseInfo.organizationId + ''
        }
      })
    },
    // 查询所有层级的类目
    getCategorAll() {
      getCategorListLevel1().then(res => {
        const data = res.data
        this.findForm.categorOptions = data
        if (this.formObj.operationInfo.categoryIds && this.formObj.operationInfo.categoryIds.length) {
          const arr = []
          this.findForm.categorOptions.forEach((item, index) => {
            if (this.formObj.operationInfo.categoryIds.indexOf(item.id) > -1) {
              arr.push(item.id)
            }
          })
          this.formObj.operationInfo.categoryIds = arr
        }
      })
    },
    // 组织架构切换
    changeOrganization(val) {
      val && this.getUserList(val)
      this.formObj.operationInfo.mainSellerId = ''
      this.formObj.operationInfo.customerServiceId = ''
    },
    // 销售客服下拉
    getUserList(organizationId) {
      getUserList({ organizationId: organizationId }).then(res => {
        const data = res.data
        data.records.forEach(acc => {
          acc.label = acc.name + acc.jobNumber
        })
        this.findForm.mainSellerOption = data.records
        if (this.formObj.operationInfo.mainSellerId) {
          const filterCompId = this.findForm.mainSellerOption.filter(acc => acc.id === this.formObj.operationInfo.mainSellerId + '')
          this.formObj.operationInfo.mainSellerId = filterCompId && filterCompId.length ? this.formObj.operationInfo.mainSellerId + '' : ''
        }
        if (this.formObj.operationInfo.customerServiceId) {
          const filterUserId = this.findForm.mainSellerOption.filter(acc => acc.id === this.formObj.operationInfo.customerServiceId + '')
          this.formObj.operationInfo.customerServiceId = filterUserId && filterUserId.length ? this.formObj.operationInfo.customerServiceId + '' : ''
        }
      })
    },

    // 币别
    getCurrencyList() {
      currencyList().then(res => {
        this.findForm.regCurrencyOption = res.data
      })
    },
    // 平台下拉列表
    getPlatformOption() {
      platformOption().then(res => {
        this.findForm.platformOption = res.data
        var filterPlatformId = this.formObj.baseInfo.platformId && this.findForm.platformOption.filter(acc => acc.hiddenValue === this.formObj.baseInfo.platformId)
        if (filterPlatformId && !filterPlatformId.length && this.auditTabActiveName === '1') {
          this.formObj.baseInfo.platformId = ''
          this.isPlatformId = false
        }
      })
    },
    // 平台切换
    changePlatformId(id) {
      this.formObj.baseInfo.platformCode = this.findForm.platformOption.find(item => item.hiddenValue === id).candidateDisplayName
      if (this.formObj.baseInfo.platformCode === 'LZ') {
        this.$refs.formObjRef.clearValidate()
      }
      if (this.compId && this.formObj.baseInfo.sitePublishIds) {
        this.formObj.baseInfo.sitePublishIds = ''
      }
      id && this.getSiteOption(id)
      this.formObj.baseInfo.siteId = null
    },
    // 站点下拉列表
    getSiteOption(id) {
      siteOption({ platform: id }).then(res => {
        const data = res.data
        if (data.length) {
          this.findForm.siteOption = data
        }

        if (this.compId && this.formObj.baseInfo.siteId && this.formObj.baseInfo.siteId.length) { // 如果站点跟获取的数据对不上就置空
          const filterSite = this.findForm.siteOption.filter(acc => acc.hiddenValue === this.formObj.baseInfo.siteId)
          if (filterSite && !filterSite.length && this.auditTabActiveName === '1') {
            this.formObj.baseInfo.siteId = ''
            this.isSiteId = false
          }
        }
      })
    },
    // 字典
    dictionary(code) {
      dictionary({ code: code }).then(res => {
        const arr = res.data
        switch (code) {
          case 'sams_company_nature':
            this.findForm.natureOption = arr

            break
          case 'sams_company_type':
            this.findForm.typeOption = arr
            break
          case 'sams_net_type':
            this.findForm.NetworkTypeOption = arr
            if (this.formObj.operationInfo.net && this.formObj.operationInfo.net.length) {
              var filterNet = this.findForm.NetworkTypeOption.filter(acc => acc.hiddenValue === this.formObj.operationInfo.net)
              if (filterNet && !filterNet.length) {
                this.formObj.operationInfo.net = ''
              }
            }
            break
          case 'sams_yes_or_not':
            this.findForm.fbaOption = arr
            break
        }
      })
    }

  }

}
</script>

<style>

.comp-head {
  display: flex;
  justify-content: space-between;
  height: 40px;
  border-bottom:1px solid #ebeef5;
  padding: 0 20px;
  margin-bottom: 20px;
  cursor:pointer;
}
.comp-title {
  font-size: 15px;
  font-weight: bold;
  line-height: 40px;
}
.w200{
  width: 200px !important;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
