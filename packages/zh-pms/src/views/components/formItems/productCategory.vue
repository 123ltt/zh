<template>
  <el-col :span="span">
    <el-form-item :label="label" :prop="prop" :rules="rules">
      <CategoryCascader v-model="form[prop]"
                        :multiple="multiple"
                        check-strictly
                        width="100%"
      />
    </el-form-item>
  </el-col>
</template>

<script>
import CategoryCascader from '@/components/category-cascader/index.vue'
import mixin from './mixin'

export default {
  name: 'FormItemsProductCategory',
  components: { CategoryCascader },
  mixins: [mixin],
  props: {
    prop: {
      type: String,
      default: 'categoryId'
    },
    label: {
      type: String,
      default: '类目'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  }
}
</script>
