<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="40px" :rules="rules">
      <el-form-item label="刊登站点" prop="templateSite">
        {{ form.templateSite }}
      </el-form-item>
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" :disabled="!shops.length" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;" />
      <el-checkbox-group v-model="checkedShops" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="item in shops" :key="item.hiddenValue" :label="item.candidateDisplayName">{{ item.displayName }}</el-checkbox>
      </el-checkbox-group>
      <div class="text-end mt-5">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" :disabled="row ? submitBtnEnable : false" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>

export default {
  name: 'ShopModal',
  props: {
    row: {
      type: Object
    },
    storeList: {
      type: Array
    }
  },
  data() {
    return {
      rules: {
      },
      form: {},
      oldForm: null,
      // 多选框组
      checkAll: false,
      isIndeterminate: false,
      shops: this.storeList,
      checkedShops: []
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  created() {
    if (this.row.templateShopCodes) { // 已选中店铺code
      this.checkedShops = this.row.templateShopCodes.split(',')
    }
    this.form.templateSite = this.row.templateSite // 站点
    // 选择框状态
    if (this.shops.length && this.shops.length === this.checkedShops.length) { // 全选
      this.checkAll = true
      this.isIndeterminate = false
    } else if (this.checkedShops.length) { // 半选
      this.checkAll = false
      this.isIndeterminate = true
    } else { // 不选
      this.checkAll = false
      this.isIndeterminate = false
    }
  },
  methods: {
    // 全选
    handleCheckAllChange(val) {
      this.checkedShops = val ? this.shops.map(item => item.candidateDisplayName) : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.shops.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.shops.length
    },
    cancel() {
      this.$parent.$emit('close')
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$parent.$emit('close', this.checkedShops)
        } else {
          return false
        }
      })
    }
  }
}
</script>
