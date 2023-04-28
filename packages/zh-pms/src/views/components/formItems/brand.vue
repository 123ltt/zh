<template>
  <el-col>
    <el-row>
      <el-col :span="12">
        <el-form-item ref="type" label="品牌类型" :prop="brandType" :rules="rules">
          <el-select v-model="form[brandType]"
                     placeholder="请选择"
                     @change="changeBrandType"
                     @blur="selectBlur('type')"
          >
            <el-option v-for="item in brandTypeOptions"
                       :key="item.value"
                       :value="item.value"
                       :label="item.label"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="['2','3'].includes(form[brandType])" :span="12">
        <el-form-item ref="elFormItem" label="品牌名" :prop="brandName" :rules="rules">
          <el-autocomplete v-if="form[brandType]==='3'"
                           v-model="brandNameKeyword"
                           :fetch-suggestions="fetchBrandName"
                           placeholder="输入后自动搜索"
                           @select="handleSelectBrandName"
                           @blur="handleBlurBrandName"
          />
          <el-input v-else
                    v-model="form[brandName]"
                    :disabled="form[brandType]!=='2'"
                    maxlength="100"
                    placeholder="请输入品牌名称"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import { getDict } from '@/api/common/dict'
import { queryBrand } from '@/api/brandManagement'
import mixin from './mixin'

export default {
  name: 'FormItemsBrand',
  mixins: [mixin],
  data() {
    return {
      brandTypeOptions: [],
      brandNameKeyword: '',
      brandType: this.prop[0],
      brandName: this.prop[1]
    }
  },
  created() {
    getDict('sku_brand_type', 'pms').then(res => {
      this.brandTypeOptions = res
    })
  },
  methods: {
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
      this.form[this.brandName] = $data.value
      this.$refs.elFormItem.$emit('el.form.blur')
    },
    // 失去焦点时 如果选中的内容与输入框的内容不一致，则清空
    handleBlurBrandName() {
      setTimeout(() => {
        if (this.brandNameKeyword !== this.form[this.brandName]) {
          this.brandNameKeyword = ''
          this.form[this.brandName] = ''
        }
      }, 200)
    },
    // 切换品牌类型时处理输入框的内容
    changeBrandType() {
      this.form[this.brandName] = ''
      this.brandNameKeyword = ''
    }
  }
}
</script>
