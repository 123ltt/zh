<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="demo-form-inline form-col">
    <el-row>
      <el-col :span="12">
        <el-form-item label="店铺名称" prop="storeName">
          <!-- <el-row :gutter="isEdit ? 0 : 4" class="ms-0 me-0">
            <el-col v-if="!isEdit" :span="8" class="mb-0">
              <el-select v-model="form.siteCode" :disabled="isEdit" filterable placeholder="请选择站点" class="g-w100" @change="(value) => changeSite(value, 'siteCode')">
                <el-option v-for="item in siteList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
              </el-select>
            </el-col>
            <el-col :span="isEdit ? 24 : 16" class="mb-0">
              <el-select v-model="form.storeName" :disabled="isEdit" filterable placeholder="请选择店铺" class="g-w100" @change="changeAccount">
                <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
              </el-select>
            </el-col>
          </el-row> -->
          <el-select v-model="form.storeName" :disabled="isEdit" filterable placeholder="请选择店铺" class="g-w100" @change="changeAccount">
            <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="刊登站点" prop="publishSiteCode">
          <el-select v-model="form.publishSiteCode" :disabled="isEdit" filterable placeholder="请选择站点" class="g-w100" @change="(value) => changePublishSiteCode(value)">
            <el-option v-for="item in publishSiteList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="isVariation ? 'SPU' : 'SKU'" prop="productSku">
          <el-row :gutter="isEdit ? 0 : 4" class="ms-0 me-0">
            <el-col :span="isEdit ? 24: 20" class="mb-0">
              <el-input v-if="combineSkus" v-model="combineSkus" :disabled="isEdit || !baseProductInfo.publishSiteCode" placeholder="请输入SKU" />
              <el-input v-else v-model="form.productSku" :disabled="isEdit || !form.storeName||!baseProductInfo.publishSiteCode" :placeholder="isVariation ? '请输入SPU' : '请输入SKU'" @blur="productBlur" />
            </el-col>
            <el-col v-if="!isEdit || !baseProductInfo.publishSiteCode" :span="4" class="mb-0">
              <el-button :disabled="!form.storeName || !form.publishSiteCode" type="primary" @click="selectSkuModal">select</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col v-if="isVariation" :span="12">
        <el-form-item v-loading="productLoading > 0" label="SKU" prop="productSku">
          <el-input v-model="productSkus" placeholder="请输入SKU" disabled />
        </el-form-item>
      </el-col>
      <el-col v-if="baseProductInfo.sellerSku" :span="12">
        <el-form-item label="平台SKU" prop="sellerSku">
          <el-input v-model="baseProductInfo.sellerSku" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="仓库" prop="warehouseId">
          <el-select v-model="form.warehouseId"
                     filterable
                     placeholder="请选择仓库"
                     class="g-w100"
                     @change="warehouseChange"
          >
            <el-option v-for="(item, index) in warehouseList" :key="index" :label="item.warehouseName" :value="item.warehouseId" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="isVariation" :span="12">
        <el-form-item label="刊登天数" prop="listingDuration">
          <el-select v-model="form.listingDuration" placeholder="请选择刊登天数" class="g-w100">
            <el-option v-for="(k, v) in listingDurationList" :key="k" :value="v" :label="k" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="isEdit && form.asin" :span="12">
        <el-form-item label="ASIN" prop="ASIN">
          <el-input v-model="form.asin" disabled />
        </el-form-item>
      </el-col>
      <el-col v-if="isEdit" :span="12">
        <el-form-item label="状态" prop="productStatus">
          <el-input :value="status[baseProductInfo.productStatus-1]" disabled />
        </el-form-item>
      </el-col>
      <el-col v-if="isEdit && baseProductInfo.itemId" :span="12">
        <el-form-item label="ItemId" prop="itemId">
          <el-input :value="baseProductInfo.itemId" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" class="g-w100" maxlength="80" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="类目" prop="primaryCateId">
          <el-row :gutter="4" class="ms-0 me-0">
            <el-col :span="6" class="cate d-flex justify-content-between">
              <el-input v-model="form.primaryCateId"
                        v-input.positive.numeric
                        :disabled="!form.publishSiteCode"
                        class="w-100"
                        placeholder="请选择"
                        @blur="findPrimaryCate"
                        @focus="getFocusCateId"
              />
              <div v-loading="cateSearchLoading" class="cate ms-2 me-2">
                <g-select
                  :loading="cateSearchLoading"
                  :disabled="!form.publishSiteCode"
                  :item-title="true"
                  :items="cateSearchList"
                  dropdown-width="calc(100% - 500px)"
                  placement="bottom-start"
                  key-field="platCategoryId"
                  label-field="platCategoryPath"
                  value-field="platCategoryId"
                  class="cate-change"
                  @keyword="queryCategorySearch"
                  @change="selectPlatformCateId"
                />
                <el-button :disabled="!form.publishSiteCode" icon="el-icon-search" />
              </div>
              <div>
                <div v-if="form.publishSiteCode">
                  <el-cascader ref="setPlatformCate" :props="cateProps" class="cate-cascader cate-change" @change="changePlatformCateId" @blur="cateBlur" />
                </div>
                <el-button :disabled="!form.publishSiteCode" icon="el-icon-menu" />
              </div>
            </el-col>
            <el-col v-if="primaryCatePath" :span="18">
              <el-input v-model="primaryCatePath" disabled class="no-border" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="类目二" prop="secondCateId">
          <el-row :gutter="4" class="ms-0 me-0">
            <el-col :span="19" class="mb-0 cate d-flex justify-content-between">
              <!-- <div v-if="form.publishSiteCode">
                <el-cascader :props="cateProps" clearable class="g-w100 cate-change" @change="changeSecodCoteId" />
              </div>
              <el-input v-model="form.secondCateId" readonly clearable class="g-w100" /> -->
              <div v-loading="cateSearchLoading2" class="cate w-100 me-2">
                <g-select
                  :loading="cateSearchLoading2"
                  :disabled="!form.publishSiteCode"
                  :item-title="true"
                  :items="cateSearchList2"
                  dropdown-width="calc(100% - 500px)"
                  placement="bottom-start"
                  key-field="platCategoryId"
                  label-field="platCategoryPath"
                  value-field="platCategoryId"
                  class="cate-change"
                  @keyword="queryCategorySearch2"
                  @change="selectPlatformCateId2"
                />
                <el-input v-model="form.secondCateId" readonly class="w-100" placeholder="请选择" style="width:88% !important" />
                <el-button size="mini" :disabled="!form.publishSiteCode" icon="el-icon-search" class="psb-8" style="position:absolute;left:90%;margin-right:.5rem;" />
              </div>
              <div>
                <div v-if="form.publishSiteCode">
                  <el-cascader :props="cateProps" class="cate-cascader cate-change" @change="changePlatformCateId2" @blur="cateBlur" />
                </div>
                <el-button :disabled="!form.publishSiteCode" icon="el-icon-menu" class="h28 psb-8" />
              </div>
            </el-col>
            <el-col :span="5" class="mb-0">
              <el-button type="primary" class="w-100" @click="updateCategory">更新类目</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col v-if="!isVariation && !baseProductInfo.asin" :span="12">
        <el-form-item label="产品通用编码" :prop="isEdit ? '' : 'productIdTypeValue'">
          <div>
            <el-row :gutter="4" class="ms-0 me-0">
              <el-col :span="6" class="mb-0">
                <el-select v-model="form.productIdType" :disabled="isEdit" placeholder="请选择" class="g-w100" @change="$refs.form.validateField('productIdTypeValue')">
                  <el-option v-for="item in standardProdcutIdTypeList" :key="item" :label="item" :value="item" />
                </el-select>
              </el-col>
              <el-col :span="isEdit ? 18 : 11" class="mb-0">
                <el-input v-model="form.productIdTypeValue" :disabled="isEdit || form.isFromNumPool" />
              </el-col>
              <el-col v-if="!isEdit" :span="7" class="mb-0">
                <el-checkbox v-model="form.isFromNumPool" @change="form.productIdTypeValue='',$refs.form.validateField('productIdTypeValue')">从号码池自动获取</el-checkbox>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="店铺类目一" prop="storePrimaryCateId">
          <el-row :gutter="4" class="ms-0 me-0">
            <el-col :span="18" class="mb-0 cate">
              <div v-if="form.storeName" @mouseenter="$refs.storePrimaryCate.hovering = true" @mouseleave="$refs.storePrimaryCate.hovering = false">
                <el-cascader
                  :props="storeCateProps"
                  :show-all-levels="false"
                  class="g-w100 cate-change"
                  clearable
                  @change="(value) => form.storePrimaryCateId = value[value.length - 1]"
                />
              </div>
              <el-input ref="storePrimaryCate" v-model="form.storePrimaryCateId" clearable class="g-w100 readonly" />
            </el-col>
            <el-col :span="6" class="mb-0">
              <el-button type="primary" class="w-100" @click="updateStoreCategory">更新店铺类目</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="店铺类目二" prop="storeSecondCateId">
          <div v-if="form.storeName" @mouseenter="$refs.storeSecondCate.hovering = true" @mouseleave="$refs.storeSecondCate.hovering = false">
            <el-cascader
              :props="storeCateProps"
              :show-all-levels="false"
              class="g-w100 cate-change"
              clearable
              @change="(value) => form.storeSecondCateId = value[value.length - 1]"
            />
          </div>
          <el-input ref="storeSecondCate" v-model="form.storeSecondCateId" clearable class="g-w100 readonly" />
        </el-form-item>
      </el-col>
      <el-col v-if="!isVariation" :span="12">
        <el-form-item label="销售类型" prop="saleType">
          <el-radio-group v-model="form.saleType" :disabled="Boolean(baseProductInfo.itemId)" class="ms-3" @change="listingDurationChange">
            <el-radio v-for="(k, v,index) in saleTypeList" :key="index" :label="v" @change="getDefaultStock">{{ k }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col v-if="!isVariation" :span="12">
        <el-form-item :label="form.saleType === '1' ? '固定价天数' : '拍卖天数'" prop="listingDuration">
          <el-select v-model="form.listingDuration" placeholder="请选择刊登天数" class="g-w100">
            <el-option v-for="(k, v) in listingDurationList" :key="k" :value="v" :label="k" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!isVariation" :span="12">
        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" v-input.positive.numeric :disabled="form.saleType==='2'" placeholder="请输入库存" maxlength="4" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Condition">
          <el-input v-if="isEdit" v-model="baseProductInfo.conditionName" disabled />
          <el-select v-else v-model="form.conditionId" :disabled="isEdit" filterable placeholder="请选择" class="g-w100">
            <el-option v-for="(v, k) in conditionList" :key="v" :label="v" :value="k" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!isVariation" :span="12">
        <el-form-item label="EPID" prop="epid">
          <el-input v-model="form.epid" placeholder="请输入epid" />
        </el-form-item>
      </el-col>
      <el-col v-if="form.publishSiteCode && form.publishSiteCode === 'UK'" :span="12">
        <el-form-item label="VAT" prop="vatPercent">
          <el-row>
            <el-col :span="12">
              <el-input
                v-model="form.vatPercent"
                v-input.positive
                placeholder="请输入vatPercent"
                @input="() => {form.vatPercent = toFixed1(form.vatPercent)}"
              />
            </el-col>
            <el-col :span="12">%(最多保留1位小数)</el-col>
          </el-row>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { storeOptionsWithPlatformCode } from '@/api/sams'
import { optionsSiteCode } from '@/api/amazon/amazon.js'
import { checkPaypal } from '@/api/ebay/ebayAdd.js'
import { getLevelCategory, checkCategory, updateStoreCategory, getStoreLevelCategory, updateCategory, getCateogries, getCategoryList } from '@/api/ebay/category.js'
import selectSkuModal from '@/views/components/selectSkuModal/selectSkuModal.vue'
import { getWareHouseList, listingDurationList, toFixed1, saleTypeList } from './addEbayListing.handle.js'
export default {
  name: 'BaseInfo',
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    // 请求详细信息加载状态
    productLoading: Number,
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    },
    conditionList: Object,
    isVariation: Boolean,
    isEdit: Boolean,
    hasSku: Boolean,
    standardProdcutIdTypeList: Array
  },
  data() {
    const that = this
    const standardProdcutType = (rule, value, callback) => {
      if ((this.form.productIdTypeValue || this.form.isFromNumPool) && this.form.productIdType) {
        callback()
      } else {
        callback(new Error('产品通用编码不能为空'))
      }
    }
    const productSkuValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error('SKU不能为空'))
      } else {
        callback()
      }
      // else if (!this.hasSku) {
      //   callback(new Error('暂无承载数据'))
      // }
    }
    const vatPercentValid = (rule, value, callback) => {
      if (value < 0 || value > 27) {
        callback(new Error('VAT只可填写大于等于0.0%且小于等于27.0%之间的数值'))
      } else {
        callback()
      }
    }
    const warehouseIdValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error('仓库不能为空'))
      } else if (this.warehouseList.findIndex(item => item.warehouseId === value) === -1) {
        callback(new Error('无效的仓库，请重选'))
      } else {
        callback()
      }
    }
    const cateValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error('类目不能为空'))
      } else if (!this.isEffectCateId) {
        callback(new Error('无效的类目id'))
      } else {
        callback()
      }
    }
    return {
      toFixed1,
      warehouseList: [],
      cateSearchLoading: false,
      cateSearchLoading2: false,
      cateSearchList: [],
      cateSearchList2: [],
      saleTypeList,
      focusCateId: '',
      blurCateId: '',
      listingDurationList: deepClone(listingDurationList),
      form: {
        epid: '',
        vatPercent: '',
        siteCode: '', // 店铺站点
        storeName: '', // 店铺
        storeCode: '',
        publishSiteCode: '',
        productSku: '', // 产品SKU
        warehouseId: '',
        title: '', // 标题
        stock: '',
        primaryCateId: '',
        secondCateId: '',
        storePrimaryCateId: '',
        storeSecondCateId: '',
        conditionId: '', // 物品状况
        productIdType: 'UPC', // 对应标准产品id类型
        productIdTypeValue: 'Does Not Apply',
        isFromNumPool: false,
        listingDuration: 'GTC',
        saleType: '1',
        customerUser: undefined
      },
      cateId: '',
      primaryCatePath: '', // 平台类目名称树
      rules: {
        publishSiteCode: [{ required: true, message: '刊登站点不能为空', trigger: 'blur' }],
        warehouseId: [{ required: true, validator: warehouseIdValid, trigger: 'change' }],
        saleType: [{ required: true, message: '销售类型不能为空', trigger: 'blur' }],
        productSku: [{ required: true, validator: productSkuValid, trigger: ['blur', 'change'] }],
        storeName: [{ required: true, message: '店铺名称不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        primaryCateId: [{ required: true, validator: cateValid, trigger: 'blur' }],
        productIdTypeValue: [{ required: true, validator: standardProdcutType, trigger: 'blur' }],
        stock: [{ required: true, message: '库存不能为空', trigger: 'blur' }],
        vatPercent: [
          { required: true, message: 'VAT不能为空', trigger: 'blur' },
          { required: true, validator: vatPercentValid, trigger: 'blur' }
        ],
        listingDuration: [{ required: true, message: '刊登天数不能为空', trigger: 'blur' }]
      },
      siteList: [],
      publishSiteList: [],
      storeList: [],
      combineSkus: '',
      status: ['Draft', 'Approving', 'Uploading', 'Upload Failed', 'Online', 'Updating', 'Update Failed', 'Match Failed', 'Canceling', 'Canceled'],
      // 类目选择列表配置
      cateProps: {
        lazy: true,
        leaf: 'leafCategory',
        label: 'platCategoryName',
        value: 'platCategoryId',
        lazyLoad(node, resolve) {
          getLevelCategory({
            site: that.form.publishSiteCode,
            platCategoryId: node.data && node.data.platCategoryId
          }).then(res => {
            resolve(res.data)
          })
        }
      },
      // 店铺类目选择列表配置
      storeCateProps: {
        lazy: true,
        leaf: 'leafCategory',
        label: 'categoryName',
        value: 'categoryId',
        lazyLoad(node, resolve) {
          getStoreLevelCategory({
            storeAccount: that.form.storeName,
            categoryId: node.data && node.data.categoryId
          }).then(res => {
            resolve(res.data)
          })
        }
      },
      // 子SKU编码
      productSkus: '',
      isEffectCateId: true // 输入的类目id是否有效
    }
  },
  watch: {
    conditionList() {
      const conditonKeys = Object.keys(this.conditionList)
      if (!this.isEdit && conditonKeys.length) {
        this.form.conditionId = conditonKeys[0]
      }
    },
    'baseProductInfo.productSku'(old, yy) {
      const baseProductInfo = deepClone(this.baseProductInfo)
      // this.form = Object.assign(this.form, baseProductInfo)
      Object.keys(this.form).forEach((key) => {
        this.form[key] = baseProductInfo[key]
        if (this.isEdit && key === 'warehouseId') {
          this.warehouseChange(baseProductInfo[key], 'init')
        }
      })
      this.primaryCatePath = baseProductInfo.primaryCatePath
      // this.$refs.form.validateField('productSku')
      if (this.$refs.setPlatformCate) {
        this.$refs.setPlatformCate.checkedValue = []
      }
      setTimeout(() => {
        this.form.publishSiteCode && (this.$refs.setPlatformCate.inputValue = this.form.primaryCateId)
      }, 600)
      if (this.isVariation) {
        this.productSkus = this.baseProductInfo.skuList && this.baseProductInfo.skuList.map(item => item.productSku).join(',')
      }
      if (this.baseProductInfo.combineSku && this.isEdit) {
        this.combineSkus = `${this.baseProductInfo.productSku}[${this.baseProductInfo.combineSku}]`
      }
      // this.form.primaryCateId = ''
      // this.$emit('updateCategoryId', this.form)
    }
  },
  created() {
    if (!this.isEdit) {
      this.getSiteList()
      this.getOptionsWithPlatformCode()
    }
  },
  mounted() {
    // document.querySelector('.readonly input').setAttribute('readonly')
  },
  methods: {
    getDefaultStock() { // 销售类型选“拍卖”，库存默认填写1且不允许修改
      this.form.stock = this.form.saleType === '2' ? 1 : ''
    },
    // 选择产品sku弹窗
    selectSkuModal() {
      this.$modal({
        title: '选择产品',
        component: selectSkuModal,
        width: '1000px',
        data: {
          isVariation: this.isVariation,
          showType: this.isVariation ? 'spu' : 'sku',
          platformCode: 'EB',
          account: this.baseProductInfo.storeCode,
          siteCode: this.baseProductInfo.publishSiteCode
        },
        callback: (row) => {
          if (row) {
            this.$emit('getSkuDetail', row.productSku, row.type)
            setTimeout(() => { // 清空仓库
              this.$set(this.form, 'warehouseId', '')
              this.$emit('upateWarehouse', {})
            }, 600)
          }
        }
      })
    },
    // 选择销售类型
    listingDurationChange(value) {
      if (value === '1') {
        this.form.listingDuration = 'GTC'
        this.listingDurationList = {
          ...this.listingDurationList,
          30: '30 day',
          GTC: 'GTC'
        }
      }
      if (value === '2') {
        this.form.listingDuration = '10'
        delete this.listingDurationList[30]
        delete this.listingDurationList.GTC
      }

      !this.isVariation && this.$emit('updateSaleType', this.form)
    },
    // 选择店铺事件
    changeAccount(value) {
      this.form.storeName = ''
      const { siteCode, publishSiteCode } = deepClone(this.form)
      this.reset()
      setTimeout(() => {
        this.form.siteCode = siteCode
        this.form.publishSiteCode = publishSiteCode
        this.form.storeName = value
        this.$refs.form.validateField('storeName')
        this.storeList.find(item => {
          if (item.displayName === value) {
            this.form.accountGrossProfit = item.publishGrossProfitRate
            this.form.storeCode = item.candidateDisplayName
            this.form.customerUser = item.customerServiceId
            this.getIsShowPay().then(res => {
              this.$emit('updateAccount', this.form, res)
            })
          }
        })
      }, 200)
    },
    // 获取支付模板是否显示
    getIsShowPay() {
      const { storeName } = this.form
      return new Promise((resolve, reject) => {
        checkPaypal({ storeName }).then(res => {
          resolve(res.data)
        })
      })
    },
    // 仓库切换事件
    warehouseChange(value, init) {
      let virtualWarehouse, warehouse, warehouseType, skuSuffix, isOversea
      this.warehouseList.findIndex(item => {
        if (item.warehouseId === value) {
          virtualWarehouse = item.virtualWarehouse
          warehouse = value
          skuSuffix = item.affixContent
          warehouseType = item.type
          isOversea = item.type === 'OVERSEA' // 是否海外仓
        }
      })
      const wh = warehouse ? warehouse.split(',') : ''
      warehouse = wh ? wh[wh.length - 1] : ''
      // 将warehouse截取最后一级
      this.$emit('upateWarehouse', { warehouseId: this.form.warehouseId, virtualWarehouse, warehouse, warehouseType, skuSuffix, isOversea }, init)
    },
    // 获取仓库列表
    getWareHouseList(countryCode) {
      return getWareHouseList(countryCode).then(res => {
        this.warehouseList = res
        return res
      })
    },
    // 查询当前平台的站点code
    getSiteList() {
      // platformCode: 平台简码（亚马逊-AM）
      optionsSiteCode({ platformCode: this.baseProductInfo.platformCode }).then(res => {
        this.siteList = res.data
        this.publishSiteList = [...res.data, {
          displayName: 'eBayMotors',
          hiddenValue: 'eBayMotors'
        }]
      })
    },
    // 选择刊登站点
    changePublishSiteCode(value) {
      this.primaryCatePath = ''
      this.cateId = ''
      this.cateSearchList = []
      this.cateSearchList2 = []
      const { siteCode, storeName, storeCode } = deepClone(this.form)
      this.reset()
      this.form.siteCode = siteCode
      this.form.storeName = storeName
      this.form.storeCode = storeCode
      this.getWareHouseList(value)
      setTimeout(() => {
        this.form.publishSiteCode = value
        this.getPlatformCateId()
        this.$emit('upatePublishSite', this.form)
      }, 200)
    },
    reset() {
      this.productSkus = ''
      this.combineSkus = ''
      this.$refs.form.resetFields()
    },
    // 选择站点时 获取店铺列表
    changeSite(value, siteType) {
      let siteId = ''
      setTimeout(() => {
        this.reset()
        this.form[siteType] = value
        this.$emit('updateSite', this.form)
        this.siteList.find(item => {
          if (item.displayName === value) {
            siteId = item.hiddenValue
          }
        })
        this.$emit('productLoadingStart')
        storeOptionsWithPlatformCode({
          platformCode: this.baseProductInfo.platformCode,
          siteId: siteId
        }).then(res => {
          this.storeList = res.data
        }).finally(() => {
          this.$emit('productLoadingEnd')
        })
      }, 200)
    },
    // 店铺列表
    getOptionsWithPlatformCode() {
      this.$emit('productLoadingStart')
      storeOptionsWithPlatformCode({
        platformCode: this.baseProductInfo.platformCode
      }).then(res => {
        this.storeList = res.data
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 获取平台类目 (类目对照接口)
    getPlatformCateId(isNewSku = '') {
      if (!this.form.publishSiteCode || !this.baseProductInfo.productCategoryId) {
        return false
      }
      this.$emit('productLoadingStart')
      checkCategory({
        site: this.form.publishSiteCode,
        categoryId: this.baseProductInfo.productCategoryId
      }).then(res => {
        const cateObj = res.data.find(item => !item.hasChildren) || {}
        this.cateId = cateObj.id
        this.form.primaryCateId = cateObj.platCategoryId || ''
        this.primaryCatePath = cateObj.platCategoryPath || ''
        this.isEffectCateId = true
        this.$refs.setPlatformCate.inputValue = cateObj.platCategoryId || ''
        this.form.saleProfitRate = cateObj.profitRate || this.baseProductInfo.accountGrossProfit
        this.form.actualProfitRate = cateObj.profitRate || this.baseProductInfo.accountGrossProfit
        this.$emit('updateCategoryId', this.form, {
          itemCompatibilityEnabled: cateObj.itemCompatibilityEnabled,
          isVariationsEnabled: cateObj.isVariationsEnabled
        })
        if (isNewSku && this.form.primaryCateId) {
          this.$refs.form.validateField('storeName')
        }
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 类目模糊搜索 (限制输入最少10个字母才能搜索)
    queryCategorySearch(platCategoryPath) {
      if (!platCategoryPath || platCategoryPath.length < 3) {
        // this.$message.error('输入最少3个字母才能搜索')
        return false
      }
      this.cateSearchLoading = true
      getCateogries({
        site: this.form.publishSiteCode,
        leafCategory: true,
        platCategoryPath
      }).then(res => {
        this.cateSearchList = res.data.sort((a, b) => a.platCategoryPath.localeCompare(b.platCategoryPath))
      }).finally(() => {
        this.cateSearchLoading = false
      })
    },
    // 手动选择平台类目(模糊搜索)
    selectPlatformCateId({ data }, selectedList) {
      if (!data || !data.platCategoryId) {
        return
      }
      this.isEffectCateId = true
      this.form.primaryCateId = data.platCategoryId
      this.primaryCatePath = data.platCategoryPath
      this.cateId = data.id
      // 获取类目的毛利率
      this.form.saleProfitRate = data.profitRate || this.baseProductInfo.accountGrossProfit
      this.form.actualProfitRate = data.profitRate || this.baseProductInfo.accountGrossProfit
      if (data.profitRate) {
        this.form.saleProfitRate = data.profitRate
      }
      this.$emit('updateCategoryId', this.form, {
        itemCompatibilityEnabled: data.itemCompatibilityEnabled,
        isVariationsEnabled: data.isVariationsEnabled
      })
      this.$refs.form.validateField('primaryCateId')
    },
    // 类目模糊搜索 (限制输入最少10个字母才能搜索)
    queryCategorySearch2(platCategoryPath) {
      if (!platCategoryPath || platCategoryPath.length < 3) {
        // this.$message.error('输入最少3个字母才能搜索')
        return false
      }
      this.cateSearchLoading2 = true
      getCateogries({
        site: this.form.publishSiteCode,
        leafCategory: true,
        platCategoryPath
      }).then(res => {
        this.cateSearchList2 = res.data.sort((a, b) => a.platCategoryPath.localeCompare(b.platCategoryPath))
      }).finally(() => {
        this.cateSearchLoading2 = false
      })
    },
    // 手动选择平台类目(模糊搜索)
    selectPlatformCateId2(data, selectedList) {
      this.form.secondCateId = data.platCategoryId
      this.$refs.form.validateField('secondCateId')
    },
    // 手动选择平台类目
    changePlatformCateId(value) {
      this.isEffectCateId = true
      if (value && value.length) {
        setTimeout(() => {
          const data = this.$refs.setPlatformCate.getCheckedNodes(true)[0].data
          // 获取类目的毛利率
          this.form.saleProfitRate = data.profitRate || this.baseProductInfo.accountGrossProfit
          this.form.actualProfitRate = data.profitRate || this.baseProductInfo.accountGrossProfit

          this.form.primaryCateId = data.platCategoryId
          this.cateId = data.id
          this.primaryCatePath = this.$refs.setPlatformCate.presentText.replace(/\s\/\s/g, '/')
          this.$emit('updateCategoryId', this.form, {
            itemCompatibilityEnabled: data.itemCompatibilityEnabled,
            isVariationsEnabled: data.isVariationsEnabled
          })
          this.$refs.form.validateField('primaryCateId')
        }, 200)
      }
    },
    // 手动输入平台类目ID
    findPrimaryCate(event, isInit) {
      const platCategoryId = event?.target?.value
      this.blurCateId = event?.target?.value
      if (!platCategoryId || this.blurCateId === this.focusCateId) return
      getCategoryList({ size: -1, platCategoryId, site: this.baseProductInfo.publishSiteCode }).then(res => {
        let index = -1
        if (res.data) {
          const list = res.data.records
          list.some((item, i) => {
            if (item.leafCategory && item.platCategoryId === platCategoryId) {
              index = i
              this.form.saleProfitRate = item.profitRate || this.baseProductInfo.accountGrossProfit
              this.form.actualProfitRate = item.profitRate || this.baseProductInfo.accountGrossProfit

              this.form.primaryCateId = item.platCategoryId
              this.cateId = item.id
              this.primaryCatePath = item.platCategoryPath
              this.$emit('updateCategoryId', this.form, {
                itemCompatibilityEnabled: item.itemCompatibilityEnabled,
                isVariationsEnabled: item.isVariationsEnabled,
                isInit
              })
              this.isEffectCateId = true
              return i
            }
          })
        }
        if (index === -1) {
          this.isEffectCateId = false
        }
        this.$refs.form.validateField('primaryCateId')
      })
    },
    getFocusCateId(event) {
      this.focusCateId = event?.target?.value
    },
    // 手动选择平台类目
    changePlatformCateId2(value) {
      this.form.secondCateId = value[value.length - 1]
      this.$refs.form.validateField('secondCateId')
    },
    changeSecodCoteId(value) {
      if (value && value.length) {
        this.form.secondCateId = value[value.length - 1]
      }
    },
    cateBlur(value) {
      setTimeout(() => {
        this.$refs.setPlatformCate.inputValue = this.form.primaryCateId
      }, 600)
    },
    // 手动输入sku获取详细信息
    productBlur(event) {
      const value = event?.target?.value
      if (value) {
        this.$emit('getSkuDetail', value)
      }
    },
    // 更新类目
    updateCategory() {
      const { publishSiteCode } = this.baseProductInfo
      if (!publishSiteCode) return
      updateCategory({ site: publishSiteCode }).then(res => {
        this.$message.success('更新类目成功')
      })
    },
    // 更新店铺类目
    updateStoreCategory() {
      const { storeName } = this.baseProductInfo
      if (!storeName) return
      updateStoreCategory({ storeAccount: storeName }).then(res => {
        this.$message.success('更新店铺类目成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-form-inline{
  width: 90%;
}
.psb-8{
  padding-left:8px;
  padding-right:8px
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
