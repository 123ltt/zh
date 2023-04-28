<template>
  <el-col :span="span">
    <el-form-item :label="label" :prop="prop" :rules="arrRules">
      <DynamicInput :items.sync="form[prop]" :placeholder="label" />
    </el-form-item>
  </el-col>
</template>

<script>
import DynamicInput from '../../components/dynamicInput.vue'
import mixin from './mixin'
import { customRule } from '@/util/formRules'

export default {
  name: 'FormItemsPlatRefUrls',
  components: { DynamicInput },
  mixins: [mixin],
  props: {
    prop: {
      type: String,
      default: 'referenceUrls'
    },
    label: {
      type: String,
      default: '平台参考链接'
    }
  },
  data() {
    return {
      arrRules: [customRule(v => v.some(s => s.trim() === ''))]
    }
  }
}
</script>
