<template>
  <el-form size="mini" label-width="86px" :modal="formInfo" class="form-col">
    <el-form-item label="物流商">
      <el-select v-model="formInfo.wls" style="width:245px">
        <el-option label="111" value="111" clearable />
      </el-select>
    </el-form-item>
    <el-form-item class="double-input" label-width="86px" label="重量差异">
      <el-select v-model="formInfo.hex" clearable style="width: 85px">
        <el-option v-for="item in list" :key="item" :label="item" :value="item" clearable />
      </el-select>
      <el-input v-model="formInfo.bb" style="width: 160px">
        <template slot="append">%</template>
      </el-input>
    </el-form-item>
    <el-form-item class="double-input" label-width="86px" label="金额差异">
      <el-select v-model="formInfo.aa" clearable style="width: 85px">
        <el-option v-for="item in list" :key="item" :label="item" :value="item" clearable />
      </el-select>
      <el-input v-model="formInfo.ff" style="width: 160px">
        <template slot="append">%</template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      formInfo: {},
      list: ['>', '>=', '<', '='],
      rules: {

      }
    }
  },
  methods: {
    cancel() {
      this.$parent.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
