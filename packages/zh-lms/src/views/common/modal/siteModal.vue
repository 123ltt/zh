<template>
  <el-form ref="formName" :model="form" label-width="80px" size="mini" :rules="rules">
    <el-form-item label="平台" prop="platform">
      <el-select v-model="form.platform" :disabled="disable" class="w-100" filterable>
        <el-option v-for="item in platformList" :key="item.hiddenValue" :label="item.platformEnName" :value="item.platformEnName" />
      </el-select>
    </el-form-item>
    <el-form-item label="店铺编号" prop="accountCode">
      <el-select v-model="form.accountCode" :disabled="disable" class="w-100" @change="codeChange">
        <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
      </el-select>
    </el-form-item>
    <el-form-item label="图片域名" prop="imageDomain">
      <el-input v-model="form.imageDomain" />
    </el-form-item>
    <el-form>
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="close">取消</el-button>
        <el-button type="primary" size="mini" @click="submit('formName')">确定</el-button>
      </el-row>
    </el-form>
  </el-form>
</template>

<script>
import { imgAddorUpdate } from '@/api/common.js'
import { optionsWithPlatformCode } from '@/api/amazon/amazon.js'
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    platformList: Array,
    row: Object
  },
  data() {
    return {
      rules: {
        platform: [{ required: true, message: '平台不能为空' }],
        accountCode: [{ required: true, message: '店铺编号不能为空' }],
        imageDomain: [{ required: true, message: '图片域名不能为空' }]
      },
      form: {
        platform: '',
        account: '',
        accountCode: '',
        imageDomain: ''
      },
      storeList: [],
      disable: false
    }
  },
  watch: {
    'form.platform': {
      handler(val, oldVal) {
        val && this.storeChange()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (this.row) {
      const { platform, accountCode, imageDomain } = this.row
      this.disable = true
      this.form.platform = platform
      this.form.accountCode = accountCode
      this.form.imageDomain = imageDomain
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {}
          params = Object.assign({}, this.form)
          if (this.type === 'edit') {
            params.id = this.row.id
          }
          imgAddorUpdate(this.type, params).then(res => {
            if (res.success) {
              this.close()
            }
          })
        } else {
          return false
        }
      })
    },
    storeChange() {
      const platformCode = this.platformList.filter(item => item.platformEnName === this.form.platform)[0].platformCode
      optionsWithPlatformCode({ platformCode: platformCode }).then(res => {
        this.storeList = res.data
      })
    },
    codeChange() {
      this.form.account = this.storeList.filter(item => item.candidateDisplayName === this.form.accountCode)[0].displayName
    },
    close() {
      this.$parent.$emit('close', true)
    }
  }
}
</script>

<style>

</style>
