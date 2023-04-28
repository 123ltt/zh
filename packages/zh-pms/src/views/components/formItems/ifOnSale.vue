<template>
  <el-col :span="span">
    <el-form-item ref="formItem" :label="label" :prop="prop" :rules="rules">
      <el-select v-model="val" @blur="selectBlur('formItem')">
        <el-option :value="1" label="可售" />
        <el-option :value="0" label="不可售" />
      </el-select>
    </el-form-item>
  </el-col>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'FormItemsIfOnSale',
  mixins: [mixin],
  props: {
    prop: {
      type: String,
      default: 'ifOnSale'
    },
    label: {
      type: String,
      default: '是否可售'
    }
  },
  data() {
    return {
      val: this.form[this.prop]
    }
  }
}
</script>
