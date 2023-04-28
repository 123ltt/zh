<template>
  <el-form ref="form" :model="form" size="mini" :label-width="labelWidth" class="attr-form form-col">
    <div class="el-form-item tr">
      <el-button v-if="form.attr.length" size="mini" @click="resetAttr()">属性重置</el-button>
      <load-attr :product-sku="baseProductInfo.productSku" />
      <el-button :disabled="!baseProductInfo.primaryCateId"
                 :loading="loading"
                 type="primary"
                 size="mini"
                 class="load-attr"
                 @click="upateCateAttr"
      >获取最新属性 <el-tooltip class="item" effect="dark" content="根据以上所选类目从eBay获取最新属性" placement="top">
        <i class="el-alert__icon el-icon-info" />
      </el-tooltip></el-button>
    </div>
    <el-row v-if="form.attr.length" :gutter="10" class="attr-box">
      <div v-for="(item, index) in form.attr" :key="item.id">
        <!-- 优先展示所有的必填项，必填项不足非必填补上/超过10条折叠 -->
        <el-col v-if="isCollapse ? (!hasRequired && index < 10) || (item.required || index < 10) : true" :span="12">
          <!-- select选择器 多选 -->
          <el-row v-if="item.type == 'select'">
            <el-col :span="20">
              <el-form-item
                :label="item.name"
                :prop="'attr.'+index+'.defaultValueSelect'"
                :rules="item.required ? [{ required: true, message: '请输入'+item.name }] : []"
              >
                <el-input v-if="item.diy" slot="label" v-model="item.name" placeholder="自定义属性名" class="g-w100 item-label text-end" />
                <el-select
                  v-if="item.maxValues === 1"
                  v-model="item.defaultValueSelect"
                  :placeholder="item.name"
                  filterable
                  :clearable="item && !item.required"
                  class="g-w100"
                >
                  <el-option v-for="opt in item.optionValueList" :key="opt.id" :label="opt.name" :value="opt.id" />
                </el-select>
                <el-select
                  v-if="item.maxValues > 1"
                  v-model="item.defaultValueSelect"
                  :placeholder="item.name"
                  multiple
                  filterable
                  :clearable="item && !item.required"
                  class="g-w100"
                >
                  <el-option v-for="opt in item.optionValueList" :key="opt.id" :label="opt.name" :value="opt.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="!item.required" :span="2" style="height:40px;min-height:40px;text-align:right" class="mb-0">
              <el-button size="mini" icon="el-icon-minus" class="icon-btn" @click="remove(index)" />
            </el-col>
            <el-col v-if="form.attr.length === index + 1" :span="2" style="height:40px;min-height:40px;text-align:right" class="float-end mb-0">
              <el-button size="mini" icon="el-icon-plus" class="icon-btn" @click="addDiyAttr()" />
            </el-col>
          </el-row>
          <!-- 其他 类型 -->
          <el-row v-else>
            <!-- {{ index }} -->
            <el-col :span="20">
              <!-- <set-attr v-model="form.attr[index]" :index="index" /> -->
              <div v-for="(valueObj, idx) in item.defaultValueList" :key="idx">
                <el-form-item
                  :label="idx === 0 ? item.name : ''"
                  :prop="'attr.'+index+'.defaultValueList.'+idx+'.value'"
                  :rules="item.required ? [{ required: true, message: '请输入'+item.name}] : []"
                >
                  <el-input v-if="item.diy" slot="label" v-model="item.name" placeholder="自定义属性名" class="g-w100 item-label text-end" />
                  <!-- number输入框 -->
                  <el-input v-if="item.type == 'number'" v-model="valueObj.value" v-input.positive.numeric :placeholder="item.name" class="g-w100" />
                  <!-- text输入框 -->
                  <template v-if="item.type == 'text'">
                    <inputAutocomplete
                      v-if="item.optionValueList && item.optionValueList.length"
                      :item="item"
                      :val.sync="valueObj.value"
                      :list="item.optionValueList"
                      :placeholder="item.name"
                      class="g-w100"
                    />
                    <el-input v-else v-model="valueObj.value" :placeholder="item.name" class="g-w100" />
                  </template>
                  <!-- 年月日时间选择器 -->
                  <el-date-picker
                    v-if="item.type == 'date'&&item.valueFormat=='FULL_DATE'"
                    v-model="valueObj.value"
                    :placeholder="item.name"
                    type="date"
                    class="g-w100"
                    value-format="yyyy-MM-dd"
                  />
                  <!-- 年月时间选择器 -->
                  <el-date-picker
                    v-if="item.type == 'date'&&item.valueFormat=='PARTIAL_DATE'"
                    v-model="valueObj.value"
                    :placeholder="item.name"
                    type="month"
                    class="g-w100"
                    value-format="yyyy-MM"
                  />
                  <!-- 年时间选择器 -->
                  <el-date-picker
                    v-if="item.type == 'date'&&item.valueFormat=='YEAR'"
                    v-model="valueObj.value"
                    :placeholder="item.name"
                    type="year"
                    class="g-w100"
                    value-format="yyyy"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col v-if="!item.required" :span="2" style="height:40px;min-height:40px;text-align:right" class="mb-0">
              <el-button size="mini" icon="el-icon-minus" class="icon-btn" @click="remove(index)" />
            </el-col>
            <el-col v-if="form.attr.length === index + 1" :span="2" style="height:40px;min-height:40px;text-align:right" class="float-end mb-0">
              <el-button size="mini" icon="el-icon-plus" class="icon-btn" @click="addDiyAttr()" />
            </el-col>
          </el-row>
        </el-col>
      </div>
    </el-row>
    <el-row v-if="itemCompatibilityEnabled && itemCompatibilityEnabled === 'ByApplication'">
      <el-col :span="11">
        <el-form-item label="Compatibility" prop="compatibilityTemplateId">
          <el-select
            v-model="form.compatibilityTemplateId"
            placeholder="请选择"
            filterable
            clearable
            class="g-w100"
          >
            <el-option v-for="opt in compatibilityTemplateList" :key="opt.id" :label="opt.name" :value="opt.id" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="">
      <el-button v-if="(arrtLen > 10 && !hasRequired) || (noRequired && arrtLen > 10) " @click="isCollapse = !isCollapse">{{ isCollapse ? '点我展开' : '点我折叠' }}</el-button>
    </div>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import loadAttr from '@/views/components/loadAttr/loadAttr.vue'
import inputAutocomplete from './inputAutocomplete.vue'
import { getCateSpecificList, upateCateAttr, getCompatibilityTemplateList } from '@/api/ebay/category.js'
import { setCategoryAttr, diyAttr } from './addEbayListing.handle.js'
export default {
  name: 'CategoryAttr',
  components: { loadAttr, inputAutocomplete },
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    // 请求详细信息加载状态
    productLoading: Number,
    isVariation: Boolean,
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      itemCompatibilityEnabled: '',
      cateSpecificList: [],
      // 是否折叠
      isCollapse: true,
      form: {
        attr: [],
        compatibilityTemplateId: '' // 车型库模板ID
      },
      diyAttrList: [],
      loading: false,
      compatibilityTemplateList: []
    }
  },
  computed: {
    // 是否存在必填项
    hasRequired() {
      return this.form.attr.find(item => item.required)
    },
    // 是否存在非必填项
    noRequired() {
      return this.form.attr.find(item => !item.required)
    },
    arrtLen() {
      return this.form.attr.length
    }
  },
  methods: {
    // 获取车型库模板列表
    getCompatibilityTemplateList(data, { itemCompatibilityEnabled }) {
      const { primaryCateId, publishSiteCode, productSku, lstSku } = data
      let skus = []
      if (this.isVariation && lstSku) {
        skus = lstSku.map(item => item.productSku)
      } else {
        productSku && skus.push(productSku)
      }
      if (!skus.length || !primaryCateId || !publishSiteCode || !itemCompatibilityEnabled) return
      this.itemCompatibilityEnabled = itemCompatibilityEnabled
      this.$emit('productLoadingStart')
      getCompatibilityTemplateList({
        platCategoryId: primaryCateId,
        siteCode: publishSiteCode,
        skus
      }).then(res => {
        this.compatibilityTemplateList = res.data
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    resetAttr() {
      this.form.attr = deepClone(this.cateSpecificList)
    },
    remove(index) {
      if (this.form.attr[index].diy) {
        this.diyAttrList.shift(1)
      }
      this.form.attr.splice(index, 1)
    },
    // 添加我自定义类目属性
    addDiyAttr() {
      const name = 'name' + (this.diyAttrList.length + 1)
      this.diyAttrList.push(name)
      this.form.attr.push(diyAttr(name, '', true))
    },
    // 编辑显示listing详情属性
    showDetailSpecificList(productAttrs, compatibilityTemplateId) {
      this.form.compatibilityTemplateId = compatibilityTemplateId
      const attrs = JSON.parse(productAttrs)
      this.form.attr = []
      attrs.forEach(item => {
        const defaultValueList = []
        item.value.forEach(val => {
          defaultValueList.push({ value: val })
        })
        this.form.attr.push({
          name: item.name,
          type: 'text',
          defaultValueList
        })
      })
    },
    // 获取类目属性列表
    getCateSpecificList(site, platCategoryId, productAttrs) {
      if (!site || !platCategoryId) return
      // mock platCategoryId: '12576'
      this.$emit('productLoadingStart')
      getCateSpecificList({ site, platCategoryId, size: -1 }).then(res => {
        res.data && this.dealCate(res.data.records, productAttrs)
        // res.data && this.dealCate(res.data.records)
        // !productAttrs && this.resetAttr()
        // productAttrs && this.resetAttr()// 展示全部的属性
        // this.dealCate(res.data, productAttrs)
        this.resetAttr()
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 更新属性
    upateCateAttr() {
      const { publishSiteCode, primaryCateId, productAttrs } = this.baseProductInfo
      this.$emit('productLoadingStart')
      this.loading = true
      upateCateAttr({ site: publishSiteCode, platCategoryId: primaryCateId }).then(res => {
        this.$message.success('同步类目属性成功')
        // this.getCateSpecificList(publishSiteCode, primaryCateId, productAttrs)
        this.getCateSpecificList(publishSiteCode, primaryCateId)
        this.dealCate(res.data, productAttrs)
        this.resetAttr()
      }).finally(() => {
        this.$emit('productLoadingEnd')
        this.loading = false
      })
    },
    dealCate(data = [], productAttrs) {
      const cateSpecificList = data.map(item => {
      // 是否必填
        item.required = (item.usageConstraint === 'REQUIRED')
        item.optionValueList = item.valueRecommendation ? JSON.parse(item.valueRecommendation) : []
        if (item.selectionMode === 'SELECTION_ONLY') {
          item.type = 'select'
          item.defaultValueSelect = item.maxValues > 1 ? [] : ''
        } else if (item.selectionMode === 'FREE_TEXT') {
          if (item.valueType === 'DATE') {
            item.type = 'date'
          } else if (item.valueType === 'TEXT') {
            item.type = 'text'
          } else {
            item.type = 'number'
          }
          item.defaultValueList = [{ value: '' }]
        }
        return item
      })
      // productAttrs && setCategoryAttr(cateSpecificList, productAttrs)
      setCategoryAttr(cateSpecificList, productAttrs)
      this.cateSpecificList = []
      const varAttr = [] // 多变体属性
      if (this.isVariation) {
        cateSpecificList.forEach(item => {
          if (item.variationSpecifics) {
            this.cateSpecificList.push(item)
          } else if (item.required) {
            varAttr.push(item)
          }
        })
        this.$emit('updateVarAttr', varAttr)
      } else {
        this.cateSpecificList = cateSpecificList
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// .attr-form{
//   width: 80%;
// }
::v-deep .el-form-item__label {
    line-height: 15px;
}
// .load-attr{
  // margin-left: 20px;
// }
.el-col{
  min-height: 51px;
}
.attr-box{
  max-height: 550px;
  overflow-y: scroll;
}
.text-end{
  ::v-deep input{
    text-align: right;
  }
}
.el-alert__icon {
  font-size: 11px;
  width: 11px;
}
</style>
