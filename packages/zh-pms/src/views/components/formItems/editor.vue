<template>
  <el-col :span="span">
    <el-form-item :label="label"
                  :rules="rules"
                  :prop="validateProp"
    >
      <Editor v-model="form[prop]"
              :http-request="httpRequest"
              image-protocol="https"
              :text-content.sync="form[validateProp]"
      />
    </el-form-item>
  </el-col>
</template>

<script>
import { Editor } from 'global-components'
import httpRequest from '@/api/common/upload'
import mixin from './mixin'

export default {
  components: { Editor },
  mixins: [mixin],
  props: {
    prop: String,
    label: String
  },
  computed: {
    validateProp() {
      return '__' + this.prop
    },
    httpRequest() {
      return httpRequest
    }
  }
}
</script>
