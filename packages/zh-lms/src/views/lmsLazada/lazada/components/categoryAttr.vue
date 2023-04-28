<template>
  <el-form ref="form" :model="form" size="mini" :label-width="'150px'" class="attr-form form-col">
    <div class="el-form-item tr">
      <el-button v-if="form.property.length" size="mini" @click="resetAttr()">属性重置</el-button>
      <load-attr :product-sku="baseProductInfo.productSku" />
      <el-button
        v-if="!baseProductInfo.itemId"
        :disabled="!(baseProductInfo.categoryId || categoryId)"
        :loading="loading"
        size="mini"
        type="primary"
        @click="getAttrByPlatform()"
      >从平台获取属性</el-button>
    </div>
    <el-row v-if="form.property.length" :gutter="10" class="attr-box">
      <div v-for="(item, index) in form.property" :key="index">
        <!-- 优先展示所有的必填项，必填项不足非必填补上/超过10条折叠 -->
        <el-col v-if="isCollapse ? (!hasRequired && index < 10) || (item.isMandatory || index < 10) : true" :span="12">
          <el-row class="ms-0 me-0">
            <el-col :span="20" class="mb-0">
              <el-form-item
                :label="item.label"
                :prop="'property.'+index+'.value'"
                :rules="item.isMandatory ? [{ required: true, message: '请输入'+item.label, trigger: ['change', 'blur'] }] : []"
              >
                <!-- number输入框 -->
                <el-input v-if="item.inputType == 'numeric'" v-model="item.value" v-input.number.numeric :placeholder="item.label" class="g-w100" />
                <!-- text输入框  非descrition的richText用text -->
                <el-input v-if="['text', 'richText'].includes(item.inputType)" v-model="item.value" :placeholder="item.label" class="g-w100" />
                <!-- 下拉选择框 -->
                <template v-if="['multiEnumInput', 'multiSelect', 'singleSelect','enumInput'].includes(item.inputType)">
                  <inputAutocomplete
                    v-if="item.label == 'Brand' || item.label == 'brand'"
                    :val.sync="item.value"
                    :list="[{name: 'No Brand', id: 'No Brand'}]"
                    :placeholder="item.label"
                    class="g-w100"
                  />
                  <el-select
                    v-else
                    v-model="item.value"
                    :placeholder="item.name"
                    :allow-create="['multiEnumInput','enumInput'].includes(item.inputType)"
                    :multiple="['multiEnumInput', 'multiSelect'].includes(item.inputType)"
                    filterable
                    clearable
                    class="g-w100"
                  >
                    <el-option v-for="(opt, i) in item.options" :key="i" :label="opt" :value="opt" />
                  </el-select>
                </template>
                <!-- date时间选择器 -->
                <el-date-picker
                  v-if="item.inputType == 'date'"
                  v-model="item.value"
                  :placeholder="item.label"
                  type="date"
                  class="g-w100"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="!item.isMandatory" :span="2" style="height:40px;min-height:40px;text-align:right" class="mb-0">
              <el-button size="mini" icon="el-icon-minus" class="icon-btn" @click="remove(index)" />
            </el-col>
          </el-row>
        </el-col>
      </div>
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
import { getCategoryAttribute, syncCategoryAttribute } from '@/api/lazada/category.js'
import * as addListingHandle from './addListing.handle.js'
export default {
  name: 'CategoryAttr',
  components: { loadAttr, inputAutocomplete },
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      attrList: [],
      // 是否折叠
      isCollapse: true,
      form: {
        property: []
      },
      diyAttrList: [],
      categoryId: ''
    }
  },
  computed: {
    // 是否存在必填项
    hasRequired() {
      return this.form.property.find(item => item.isMandatory)
    },
    // 是否存在非必填项
    noRequired() {
      return this.form.property.find(item => !item.isMandatory)
    },
    arrtLen() {
      return this.form.property.length
    }
  },
  methods: {
    resetAttr() {
      this.form.property = deepClone(this.attrList)
    },
    remove(index) {
      if (this.form.property[index].diy) {
        this.diyAttrList.shift(1)
      }
      this.form.property.splice(index, 1)
    },
    // 获取类目属性列表
    getCateogAttr(categoryId, attributes, siteCode) {
      if (!categoryId) {
        this.form.property = []
        return
      }
      this.categoryId = categoryId // 解决baseProductInfo.categoryId为空的情况
      this.$emit('productLoadingStart')
      getCategoryAttribute({ categoryId, siteCode }).then(res => {
        if (res.data) {
          const data = res.data.lazadaCategoryVOList || []
          const { varAttr, attrList } = addListingHandle.setAttrValue(data, this, attributes)
          this.attrList = attrList
          this.baseProductInfo.listingType === 'Variation' && !res.data.isVariation && this.$message.error('该类目不能创建vary 多变体listing，请修改')
          this.$emit('getVarAttr', varAttr)
        }
        this.resetAttr()
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 提交表单获取产品属性值
    getPropertyValue() {
      let attributes = {}
      this.form.property.filter(item => {
        if (item.value?.length) {
          attributes = Object.assign(attributes, { [item.name]: item.value })
        }
      })
      return this.form.property.length ? JSON.stringify(attributes) : ''
    },
    getAttrByPlatform() {
      const { categoryId, listingStatus, site } = this.baseProductInfo
      this.$emit('productLoadingStart')
      this.loading = true
      const siteCode = listingStatus && listingStatus > 4 ? site : 'MY'
      syncCategoryAttribute({ categoryId: categoryId || this.categoryId, siteCode }).then(res => {
        this.$message.success('获取产品属性成功')
        if (res.data) {
          const data = res.data || []
          const { varAttr, attrList } = addListingHandle.setAttrValue(data, this)
          this.attrList = attrList
          this.$emit('getVarAttr', varAttr)
        }
        this.resetAttr()
      }).finally(() => {
        this.$emit('productLoadingEnd')
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.attr-form{
  width: 90%;
}
.item-label {
  margin-top: -5px;
}
::v-deep .el-form-item__label {
    line-height: 15px;
    margin-top: 5px;
}
.load-attr{
  margin-left: 20px;
}
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
</style>
