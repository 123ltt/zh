<template>
  <div class="spuBasicsInfo">
    <el-form ref="formRef"
             :model="form"
             :rules="rules"
             :disabled="disabled"
             size="mini"
             label-width="150px"
             :class="{'form-readonly':disabled}"
             class="info-form"
    >
      <div class="info-div">
        <el-row>
          <el-col :span="isEdit?16:24">
            <el-row>
              <template v-if="isEdit">
                <!-- spu编码或组合sku编码 -->
                <el-col :span="form.type===1?24:12">
                  <el-form-item :label="getProductCodeName(1)">
                    <el-input v-model="form.productSpu" disabled type="text" :placeholder="getProductCodeName(1)" />
                  </el-form-item>
                </el-col>
                <!-- sku编码 -->
                <el-col v-if="form.type===2" :span="12">
                  <el-form-item :label="getProductCodeName(2)">
                    <el-input v-model="form.productSku" disabled type="text" :placeholder="getProductCodeName(2)" />
                  </el-form-item>
                </el-col>
              </template>
              <el-col>
                <el-form-item label="类目" prop="categoryId">
                  <category-cascader v-model="form.categoryId" show-all-levels :multiple="false" check-strictly width="100%" />
                </el-form-item>
              </el-col>
              <el-col v-if="isEdit" :span="12">
                <el-form-item label="状态" prop="status">
                  <el-select v-model="form.status" :disabled="!canUpdateStatus">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isEdit?12:24">
                <el-form-item label="是否可售" prop="ifOnSale">
                  <el-select v-model="form.ifOnSale">
                    <el-option :value="1" label="可售" />
                    <el-option :value="0" label="不可售" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item :label="getNwCodeName()" prop="nwSku">
                  <el-input v-model="form.nwSku" type="text" max="100" :placeholder="getNwCodeName()" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col v-if="isEdit" :span="8" class="el-col-img m-0 text-center">
            <el-image :src="form.imageUrl" style="width:160px;height:160px" />
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="中文名称" prop="productName">
              <el-input v-model="form.productName" :maxlength="LIMIT.title" type="textarea" :autosize="textareaRows" resize="none" placeholder="请输入中文名称" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="英文名称" prop="productNameEn">
              <el-input v-model="form.productNameEn" :maxlength="LIMIT.title" type="textarea" :autosize="textareaRows" resize="none" placeholder="请输入英文名称" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-for="(item,index) in form.subTitleObjList" v-show="index<showNum" :key="index" :gutter="5" :label="'副标题'+(index+1)">
              <div class="d-flex">
                <el-input v-model="item.title" :maxlength="LIMIT.title" type="textarea" :autosize="textareaRows" resize="none" :placeholder="'请输入副标题'+(index+1)" />
                <el-button v-show="index===form.subTitleObjList.length-1" size="mini" class="mx-1 el-icon-plus" @click="titleDeal('add')" />
                <el-button v-show="form.subTitleObjList.length!==1" size="mini" class=" mx-1 el-icon-minus" @click="titleDeal('del',index)" />
                <el-button v-show="index>=4&&index===showNum-1" class="mx-1" type="text" size="mini">
                  <i v-if="showNum===defaultNum&&form.subTitleObjList.length>defaultNum" class="el-icon-arrow-down text-primary" @click="showTitle(form.subTitleObjList.length)">展示</i>
                  <i v-if="showNum>defaultNum" class="el-icon-arrow-up text-primary" @click="showTitle(defaultNum)">收起</i>
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="型号" prop="model">
              <el-input v-model="form.model" type="text" maxlength="100" placeholder="型号" />
            </el-form-item>
          </el-col>
          <el-col :span="isSaas?5:10">
            <el-form-item label="退税">
              <el-switch v-model="form.isRefundDuty" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
          <el-col v-if="!isSaas" :span="14">
            <el-row :gutter="10">
              <el-col :span="14" style="padding-right:12px;">
                <el-form-item label="SKU归属" prop="ascription">
                  <el-select v-model="form.ascription" :disabled="addInfo.type===1" class="w-100">
                    <el-option v-for="item in ascriptionOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.ascription!=='2'" :span="10">
                <el-form-item label-width="0" prop="ascriptionTenantOrDeptIds">
                  <g-select v-if="form.ascription==='1'"
                            v-model="form.ascriptionTenantOrDeptIds"
                            multiple
                            :items="tenantList"
                            key-field="tenantId"
                            label-field="tenantName"
                            value-field="tenantId"
                            :readonly="disabled"
                            placeholder="请选择租户"
                            class="w-100"
                  />
                  <g-cascader v-if="form.ascription==='3'"
                              v-model="form.ascriptionTenantOrDeptIds"
                              is-leaf
                              size="mini"
                              class="w-100"
                              collapse-tags
                              clearable
                              placeholder="请选择部门"
                              :disabled="form.type===2"
                              :show-all-levels="false"
                              :options="departmentList"
                              :props="{label: 'title', value: 'id', multiple: true}"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="isSaas?5:10">
            <el-form-item label="限制刊登范围">
              <el-tooltip placement="top" content="勾选表示使此产品使用刊登约束条件">
                <el-switch v-model="form.isRestrictPublish" active-text="是" inactive-text="否" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="开发模式" prop="devType">
              <el-radio-group v-model="form.devType">
                <el-radio :label="1">精品</el-radio>
                <el-radio :label="0">精铺</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最小起订量" prop="minimumOrder">
              <el-input v-model="form.minimumOrder" v-input.numeric.positive type="text" placeholder="输入数量" size="mini" min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="deliveryDay" label="交期(天)">
              <el-input v-model="form.deliveryDay" v-input.numeric.positive type="text" placeholder="输入天数" size="mini" min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否欧代产品">
              <el-select v-model="form.productIsCe">
                <el-option :value="2" label="否" />
                <el-option :value="1" label="是" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="分销SKU">
              <el-select v-model="form.isnwSku" disabled>
                <el-option :value="0" label="否" />
                <el-option :value="1" label="是" />
              </el-select>
              <el-select v-if="form.distributionType !== 0" v-model="form.distributionType" disabled class="mx-2">
                <el-option v-for="(item,index) in distributionOptions" :key="index" :value="+item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.distributionType !== 0" :span="12">
            <el-form-item label="分销平台SKU编码">
              <el-input :value="form.nwSku" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否采样" prop="isSampling">
              <el-tooltip placement="top" content="系统根据此条件和当前是否已经采样决定采样">
                <el-radio-group v-model="form.isSampling">
                  <el-radio :label="false">无需采样</el-radio>
                  <el-radio :label="true">需要采样</el-radio>
                </el-radio-group>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="样品SPU编码">
              <el-input :value="form.sampleSku" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采购价格(RMB)">
              <el-input :value="form.purchasePrice" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品成本价(RMB)">
              <el-input :value="form.productCost" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="平台参考链接">
              <DynamicInput :items.sync="form.referenceUrls" placeholder="平台参考链接" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="品牌类型" prop="brandType">
              <el-select v-model="form.brandType" placeholder="请选择" @change="changeBrandType">
                <el-option v-for="item in brandTypeOptions" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌名">
              <el-autocomplete v-if="form.brandType==='3'"
                               v-model="brandNameKeyword"
                               :fetch-suggestions="fetchBrandName"
                               placeholder="输入后自动搜索"
                               @select="handleSelectBrandName"
                               @blur="handleBlurBrandName"
              />
              <el-input v-else v-model="form.brandName" :disabled="form.brandType!=='2'" maxlength="100" placeholder="请输入品牌名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="关键词" prop="keywords">
              <el-input v-model="form.keywords" :maxlength="LIMIT.content" type="textarea" :autosize="textareaRows" resize="none" placeholder="关键词" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="富文本描述（中文）" prop="__descriptionCn">
              <editor v-model="form.descriptionCn"
                      :http-request="httpRequest"
                      image-protocol="https"
                      :text-content.sync="form.__descriptionCn"
                      :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="富文本描述（英文）" prop="__descriptionHtml">
              <editor v-model="form.descriptionHtml"
                      :http-request="httpRequest"
                      image-protocol="https"
                      :text-content.sync="form.__descriptionHtml"
                      :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="包裹描述 （英文）" prop="__packageDescription">
              <editor v-model="form.packageDescription"
                      :http-request="httpRequest"
                      image-protocol="https"
                      :text-content.sync="form.__packageDescription"
                      :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" :maxlength="LIMIT.content" type="textarea" :autosize="{minRows:3}" resize="none" placeholder="请输入备注内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <display-field-group v-model="chekcedAttrList" :items="form.lstAttr" />
      </div>
      <el-row v-if="!disabled" class="position-sticky bottom-0 bg-white py-1" style="z-index:3">
        <el-col :span="24" class="text-center">
          <el-button :loading="submitting" type="primary" size="mini" @click="save">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, customRule } from '@/util/formRules'
import { updateBaseInfo, getTenantList, getDepartmentList } from '@/api/info'
import { getDicts } from '@/api/common/dict'
import httpRequest from '@/api/common/upload'
import { queryBrand } from '@/api/brandManagement'
import CategoryCascader from '@/components/category-cascader/index.vue'
import { basicsInfoFields } from './fields'
import DisplayFieldGroup from '@/components/display-field-group/index.vue'
import infoMixin from './mixin'
import { LIMIT } from '@/config/form'
import { Editor } from 'global-components'
import DynamicInput from '../components/dynamicInput.vue'
import { deepClone } from '@/util/util'
import { isSaas } from '@/config/env'

export default {
  components: { CategoryCascader, DisplayFieldGroup, Editor, DynamicInput },
  mixins: [infoMixin],
  inject: ['addInfo'],
  props: {
    formData: Object,
    isEdit: {
      type: Boolean,
      default: false
    },
    readonly: Boolean,
    isAudit: Boolean
  },
  data() {
    const requiredRule = required()
    const form = basicsInfoFields(this.formData)
    form.productIsCe = form.productIsCe === 0 ? '' : form.productIsCe
    form.isnwSku = form.distributionType !== 0 ? 1 : 0
    form.subTitleObjList = form.subTitleObjList.length === 0 ? [{ title: '' }] : form.subTitleObjList
    const dynamicRule = this.ascription === '2' || !this.ascription ? null : required(['blur', 'change'])
    return {
      LIMIT,
      initTenantOrDept: [],
      preTenantOrDept: {},
      form,
      httpRequest,
      links: [],
      brandNameKeyword: form.brandName,
      submitting: false,
      rules: {
        categoryId: requiredRule,
        productName: requiredRule,
        productNameEn: requiredRule,
        ascription: requiredRule,
        ascriptionTenantOrDeptIds: dynamicRule,
        minimumOrder: [{}],
        deliveryDay: [{}],
        devType: requiredRule,
        isSampling: requiredRule,
        brandType: requiredRule,
        keywords: requiredRule,
        feature: requiredRule,
        descriptionPlain: requiredRule,
        __packageDescription: requiredRule,
        __descriptionHtml: requiredRule,
        __descriptionCn: requiredRule
      },
      filterFields: ['categoryFullId', 'updateTime', 'createTime', 'lstAttr', 'attrValueList'],
      chekcedAttrList: [],
      canUpdateStatus: true, // 只有 有效和无效 的状态才能进行修改
      statusOptions: [],
      ascriptionOptions: [],
      brandTypeOptions: [],
      textareaRows: { minRows: 1, maxRows: 6 },
      tenantList: [],
      departmentList: [],
      isSaas,
      showNum: 5,
      defaultNum: 5,
      ids: [],
      distributionOptions: []
    }
  },
  computed: {
    /** @return {boolean} */
    disabled() {
      return this.readonly || this.formData.ifCanUpdate === false
    },
    ...mapGetters(['userInfo'])
  },
  watch: {
    'form.devType': {
      handler(val) {
        let d = [{}]
        if (val === 1) {
          d = required().concat(customRule(value => Number(value) < 1, '不能小于1'))
        } else {
          this.$refs.formRef && this.$refs.formRef.clearValidate(['minimumOrder', 'deliveryDay'])
        }
        this.rules.minimumOrder = d
        this.rules.deliveryDay = d
      },
      immediate: true
    },
    ascriptionOptions(val) {
      const r = customRule(val.map(item => item.value), '请选择SKU归属', 'change')
      this.rules.ascription = [...required(), r]
    },
    'form.ascription'(newVal, oldVal) {
      this.preTenantOrDept[oldVal] = (oldVal === '3' ? this.flatRootIds : deepClone)(this.form.ascriptionTenantOrDeptIds)
      this.form.ascriptionTenantOrDeptIds = this.preTenantOrDept[newVal]

      this.rules.ascriptionTenantOrDeptIds = newVal === '2' || !newVal ? null : required(['blur', 'change'])
    }
  },
  created() {
    const { ascriptionTenantOrDeptIds } = this.form
    this.getStatusList()
    getTenantList().then(res => {
      this.tenantList = res.data
    })
    getDepartmentList({ tenantId: this.userInfo.tenant_id }).then(res => {
      this.departmentList = res.data
    })
    this.initTenantOrDept = [].concat(ascriptionTenantOrDeptIds)
  },
  methods: {
    titleDeal(type, index) {
      if (type === 'add') {
        this.form.subTitleObjList.push({ title: '' })
      } else {
        this.form.subTitleObjList[index]?.id && this.ids.push(this.form.subTitleObjList[index]?.id)
        this.form.subTitleObjList.splice(index, 1)
      }
      this.showNum = this.form.subTitleObjList.length
    },
    showTitle(len) {
      this.showNum = len
    },
    /**
     * @param {1|2} pos 1为第一个位置(spu或组合sku)，2为第二个位置(sku)
     */
    getProductCodeName(pos) {
      const type = this.form.type
      const index = type === 2 && pos === 1 ? 1 : type
      return ['SPU', 'SKU', '组合SKU'][index - 1] + '编码'
    },
    fetchBrandName(queryString, cb) {
      const params = {
        brandName: queryString,
        size: queryString ? 20 : 5,
        status: 3
      }
      queryBrand(params).then(res => {
        cb(res.data.records.map(item => ({
          value: item.brandName
        })))
      })
    },
    handleSelectBrandName($data) {
      this.form.brandName = $data.value
    },
    // 失去焦点时 如果选中的内容与输入框的内容不一致，则清空
    handleBlurBrandName() {
      setTimeout(() => {
        if (this.brandNameKeyword !== this.form.brandName) {
          this.brandNameKeyword = ''
          this.form.brandName = ''
        }
      }, 200)
    },
    // 切换品牌类型时处理输入框的内容
    changeBrandType() {
      const type = this.form.brandType
      if (type === this.formData.brandType) {
        const defaultName = this.formData.brandName
        this.brandNameKeyword = type === 3 ? defaultName : ''
        this.form.brandName = defaultName
      } else {
        this.form.brandName = ''
        this.brandNameKeyword = ''
      }
    },
    getStatusList() {
      const checkedVal = this.form.status !== undefined ? this.form.status : '-1'
      const canUpdateStatusList = ['2', '3']
      this.canUpdateStatus = canUpdateStatusList.indexOf(checkedVal) > -1

      getDicts(['sku_status', 'sku_belong', 'sku_brand_type', 'distribution_type'], 'pms').then(res => {
        this.statusOptions = res.sku_status.filter(item => {
          return [...canUpdateStatusList, checkedVal].indexOf(item.value) > -1
        })
        this.ascriptionOptions = res.sku_belong
        this.brandTypeOptions = res.sku_brand_type
        this.distributionOptions = res.distribution_type
      })
    },
    flatRootIds(arr) {
      return arr.reduce((pre, cur) => {
        pre.push(cur[cur.length - 1])
        return pre
      }, [])
    },
    save() {
      // 验证表单
      this.validate().then(valid => {
        if (valid) {
          // 过滤字段
          const d = this.filterFieldHandler(this.form, this.filterFields)
          d.referenceUrls = d.referenceUrls.map(item => item.trim()).filter(item => !!item)
          d.lstAttr = this.chekcedAttrList
          if (d.ascription === '3') {
            d.ascriptionTenantOrDeptIds = this.flatRootIds(d.ascriptionTenantOrDeptIds)
          }

          const params = Object.entries(d).reduce((prev, [key, val]) => {
            if (!/^__/.test(key)) {
              prev[key] = val
            }
            return prev
          }, {})
          delete params.isnwSku
          if (this.ids.length) {
            this.ids.forEach(item => {
              params.subTitleObjList.push({ id: item })
            })
          }
          params.subTitleObjList = params.subTitleObjList.map(item => {
            if (item.title) {
              return item
            } else {
              if (item.id && !item.title) return { id: item.id }
            }
          })
          // 提交表单
          this.submit(updateBaseInfo, params).then(res => {
            this.addInfo.getDetail()
          })
        }
      })
    },
    getNwCodeName() {
      return `牛蛙${this.form.type === 2 ? 'SKU' : 'SPU'}编码`
    }
  }
}
</script>
