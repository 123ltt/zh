<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="w-90 form-col">
    <el-row>
      <el-col :span="12">
        <el-form-item label="店铺名称" prop="account">
          <el-row class="m0">
            <el-col class="mb-0">
              <el-select v-model="form.account" :disabled="isEdit" filterable placeholder="请选择店铺" class="g-w100" @change="changeAccount">
                <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item v-loading="productLoading > 0" label="SKU" prop="productSku">
          <div class="d-flex justify-content-between">
            <el-input v-model="form.productSku" :disabled="!form.account || isEdit" placeholder="请输入新系统SKU，只能单个输入" @blur="productBlur" />
            <el-button :disabled="!form.account || isEdit" type="primary" class="ms-2" @click="$emit('selectSkuModal')">select</el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col v-if="childSkus" :span="24">
        <el-form-item label="子SKU">
          <el-input v-model="childSkus" disabled class="no-border" />
        </el-form-item>
      </el-col>
      <el-col v-if="isEdit" :span="12">
        <el-form-item label="平台SKU">
          <el-input v-model="baseProductInfo.sellerSku" disabled />
        </el-form-item>
      </el-col>
      <el-col v-if="baseProductInfo.itemId" :span="12">
        <el-form-item label="ItemID">
          <el-input v-model="baseProductInfo.itemId" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="标题" prop="name">
          <el-input v-model="form.name" placeholder="请输入标题" class="g-w100" maxlength="200" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="产品类目" prop="productCatePath">
          <el-input v-model="baseProductInfo.productCatePath" disabled class="g-w100 no-border" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="平台类目" prop="categoryId">
          <g-select
            v-model="form.categoryId"
            :items="cateSearchList"
            :item-title="true"
            key-field="id"
            label-field="categoryName"
            value-field="id"
            class="w-100"
            :disabled="cateDisabled"
            @change="selectPlatformCateId"
          />
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
    </el-row>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { storeOptionsWithPlatformCode } from '@/api/sams'
import { getCateogries, checkCategory } from '@/api/walmart/walmart.js'
import { getWareHouseList, isOverseasWarehouse } from '../addListing.handle.js'
export default {
  name: 'BaseInfo',
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    isEdit: Boolean,
    productLoading: Number,
    isVariation: Boolean,
    baseProductInfo: Object
  },
  data() {
    return {
      form: {
        platformCode: 'WM',
        account: '',
        accountCode: '',
        listingType: '', // Listing类型 Variation Normal Combo
        listingStatus: this.isEdit ? this.baseProductInfo.listingStatus : 1,
        productSku: '',
        name: '', // 标题
        categoryId: '',
        category: '', // 类目名
        warehouseId: '', // 本地仓
        overseasWarehouses: ''// 海外仓编码
      },
      rules: {
        account: [{ required: true, message: '店铺不能为空', trigger: 'blur' }],
        productSku: [{ required: true, message: 'SKU不能为空', trigger: ['blur', 'change'] }],
        name: [{ required: true, message: '标题不能为空', trigger: ['blur', 'change'] }],
        categoryId: [{ required: true, message: '平台类目不能为空', trigger: 'change' }],
        warehouseId: [{ required: true, message: '仓库不能为空', trigger: 'change' }]
      },
      storeList: [],
      cateId: '',
      cateSearchList: [],
      childSkus: '',
      warehouseList: []
    }
  },
  computed: {
    cateDisabled() {
      const { listingStatus } = this.baseProductInfo
      return listingStatus > 4
    }
  },
  watch: {
    // 选择产品后，更新sku
    'baseProductInfo.productSku'(val) {
      const data = deepClone(this.baseProductInfo)
      Object.keys(this.form).forEach((key) => {
        this.form[key] = data[key]
      })
      // 类目回显
      const { category } = this.form
      this.form.categoryId = this.cateSearchList.find(item => item.categoryName === category)?.id
      // 显示子sku
      this.childSkus = ''
      const { skuList, combineSku } = this.baseProductInfo
      if (this.isVariation) {
        this.childSkus = skuList.map(item => item.productSku).join(',')
      } else if (combineSku) {
        this.childSkus = combineSku.map(item => `${item.sku}*${item.count}`).join(',')
      }
      // sku 改变，清空类目，多变体，关键字等
      // this.form.categoryId = ''
      // this.$emit('updateCategoryId', this.form)
      this.changeAccount(this.form.account, true)
    }
  },
  created() {
    this.getAccount()
    this.getCateogries()
  },
  methods: {
    // 获取店铺列表
    getAccount() {
      this.$emit('productLoadingStart')
      storeOptionsWithPlatformCode({
        platformCode: this.form.platformCode
      }).then(res => {
        this.storeList = res.data
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 选择店铺事件
    changeAccount(value, isSkuChange) {
      this.form.account = ''
      setTimeout(() => {
        this.form.account = value
        this.$refs.form.validateField('account')
        this.storeList.find(item => {
          if (item.displayName === value) {
            this.form.accountCode = item.candidateDisplayName
            this.form.accountGrossProfit = item.publishGrossProfitRate
            if (!isSkuChange) this.$emit('updateAccount', this.form)
            if (this.isEdit) {
              const { category } = this.form
              const item = this.cateSearchList.find(item => item.categoryName === category)
              item && this.cateOperate(item, isSkuChange)
              this.form.saleProfitRate = item.grossProfit || this.form.accountGrossProfit
              this.$emit('updateRate', this.form.saleProfitRate)
            }
          }
        })
        this.baseProductInfo.site = this.form.accountCode.split('_')[1]
        this.getWareHouseList(this.baseProductInfo.site)
      })
    },
    // 手动输入sku获取详细信息
    productBlur(event) {
      const value = event.target.value
      if (value) {
        this.$emit('getSkuDetail', value)
      }
    },
    // 获取仓库列表
    getWareHouseList(countryCode) {
      return getWareHouseList(countryCode).then(res => {
        this.warehouseList = res
        // 仓库回显
        if (this.isEdit) {
          this.form.warehouseId = this.form.overseasWarehouses
          this.warehouseChange(this.form.overseasWarehouses, this.isEdit)
        }
        return res
      })
    },
    // 仓库切换事件
    warehouseChange(value, isEditInit) {
      let virtualWarehouse, warehouse, warehouseType, skuSuffix, isOverseasWarehouses
      this.warehouseList.findIndex(item => {
        if (item.warehouseId === value) {
          virtualWarehouse = item.virtualWarehouse
          warehouse = value
          skuSuffix = item.affixContent
          warehouseType = item.type
          isOverseasWarehouses = isOverseasWarehouse(item) // 是否海外仓
        }
      })
      const wh = warehouse ? warehouse.split(',') : ''
      warehouse = wh ? wh[wh.length - 1] : ''
      this.$emit('upateWarehouse', { warehouseId: this.form.warehouseId, virtualWarehouse, warehouse, warehouseType, skuSuffix, isOverseasWarehouses, isEditInit })
    },
    // 获取类目列表
    getCateogries(categoryName) {
      getCateogries({ categoryName, current: 1, size: 9999 }).then(res => {
        this.cateSearchList = res.data.records
      })
    },
    // 获取平台类目 (类目对照接口)
    getPlatformCateId(productCategoryId, isEditInit) {
      if (!productCategoryId) {
        return false
      }
      this.$emit('productLoadingStart')
      checkCategory({ productCategoryId }).then(res => {
        res.data && this.cateOperate(res.data, isEditInit)
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 手动选择平台类目（下拉框）
    selectPlatformCateId(data) {
      data && data.data && this.cateOperate(data.data)
    },
    cateOperate(data, isEditInit) {
      this.form.categoryId = data.id
      this.form.categoryName = data.categoryName
      this.form.saleProfitRate = data.grossProfit || this.baseProductInfo.accountGrossProfit
      this.form.isEditInit = isEditInit
      if (!isEditInit) this.$emit('updateCategoryId', this.form)
      this.$refs.form.validateField('categoryId')
    }
  }
}
</script>

<style lang="scss" scoped>
.w-90{
  width: 90%;
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
</style>
