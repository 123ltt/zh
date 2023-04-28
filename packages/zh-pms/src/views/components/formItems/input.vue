<template>
  <el-col :span="span">
    <el-form-item :label="label" :prop="prop" :rules="rules">
      <el-input v-model="form[prop]"
                :maxlength="maxlength"
                type="textarea"
                :autosize="textareaRows"
                resize="none"
                :placeholder="placeholder||label"
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
    placeholder: String,
    maxlength: Number
  },
  data() {
    return {
      textareaRows: { minRows: 1, maxRows: 6 }
    }
  }
}
</script>
