// 销售信息
<template>
  <div>
    <el-form :disabled="disabled"
             size="mini"
             label-width="130px"
             :class="{'form-readonly':readonly}"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="当前刊登次数">
            <el-input />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="7天销量">
            <el-input />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="7天销售额">
            <el-input />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="15天销量">
            <el-input />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="15天销售额">
            <el-input />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="30天销量">
            <el-input />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="30天销售额">
            <el-input />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="累计销量">
            <el-input />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="累计销售额">
            <el-input />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    formData: Object,
    readonly: Boolean
  },
  data() {
    return {
      form: Object.assign({ }, this.formData)
    }
  },
  computed: {
    /** @return {boolean} */
    disabled() {
      return this.readonly || this.formData.ifCanUpdate === false
    }
  }
}
</script>
