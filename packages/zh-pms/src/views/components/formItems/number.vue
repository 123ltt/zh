<template>
  <el-col :span="span">
    <el-form-item :label="label" :prop="prop" :rules="rules">
      <el-input v-model="val"
                v-input.numeric.positive
                type="text"
                :placeholder="placeholder"
                size="mini"
                min="1"
      />
    </el-form-item>
  </el-col>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    prop: String,
    label: String,
    placeholder: String
  },
  data() {
    return {
      val: this.form[this.prop]
    }
  }
}
</script>
