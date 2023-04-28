<template>
  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item label="加入不可调价" prop="noPriceChangeType">
      <el-radio-group v-model="form.noPriceChangeType">
        <el-radio v-for="item in noPriceChangeTypeOption" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <div class="text-end">
      <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
      <el-button type="primary" size="mini" @click="submitDialog('form')">保存</el-button>
    </div>
  </el-form>
</template>

<script>
import { updateIsNoPriceChange } from '@/api/aliExpress/list.js'
export default {
  name: 'ChangeIsNoPrice',
  props: {
    checkIds: {
      type: Array
    }
  },
  data() {
    return {
      form: {
        noPriceChangeType: []
      },
      noPriceChangeTypeOption: [{ label: '加入系统不可调价', value: 1 }, { label: '加入手动不可调价', value: 2 }],
      rules: { noPriceChangeType: [{ required: true, message: '加入不可调价不能为空', trigger: 'change' }] }
    }
  },
  methods: {
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let noPriceChangeType = this.form.noPriceChangeType
          noPriceChangeType = noPriceChangeType.length === 2 ? 3 : noPriceChangeType
          updateIsNoPriceChange({ ids: this.checkIds, noPriceChangeType: noPriceChangeType }).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    }
  }

}
</script>

<style>

</style>
