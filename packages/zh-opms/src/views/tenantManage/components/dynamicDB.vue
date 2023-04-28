<template>
  <div>
    <el-form ref="formData"
             label-width="100px"
             size="mini"
             :model="form"
             :rules="rules"
    >
      <el-row :gutter="10">
        <el-col :span="22">
          <el-form-item label="租户ID" prop="tenantIds">
            <el-select v-model="form.tenantIds" multiple collapse-tags clearable filterable style="width:100%" @change="tenantChange">
              <li :class="selectAll && 'selected'" class="el-select-dropdown__item" @click="changeCageAll"><span>全部</span></li>
              <el-option v-for="item in tenantList"
                         :key="item.tenantId"
                         :label="item.tenantId"
                         :value="item.tenantId"
                         :title="item.tenantId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="应用名称" prop="appId">
            <el-select v-model="form.appId" filterable clearable style="width:100%">
              <el-option
                v-for="item in appList"
                :key="item.id"
                :label="item.appName"
                :value="item.id"
                :title="item.appName"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="更新内容" prop="sqlContent">
            <el-input v-model="form.sqlContent" clearable placeholder="请输入" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" clearable placeholder="请输入" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <div style="text-align:right">
            <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
            <el-button type="primary" size="mini" @click="saveBtn">保存</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { dynamicApi } from '@/api/tenantManagement.js'
export default {
  name: 'DynamicDB',
  props: {
    tenantList: Array,
    appList: Array
  },
  data() {
    return {
      selectAll: false,
      form: {
        tenantIds: [],
        appId: '',
        sqlContent: ''
      },
      rules: {
        tenantIds: [{ required: true, message: '租户ID不能为空', trigger: ['change', 'blur'] }],
        appId: [{ required: true, message: '应用名称不能为空', trigger: ['change', 'blur'] }],
        sqlContent: [{ required: true, message: '更新内容不能为空', trigger: ['blur', 'change'] }]
      }
    }
  },
  methods: {
    // 全选类目事件
    changeCageAll() {
      this.selectAll = !this.selectAll
      if (this.selectAll) {
        this.form.tenantIds = this.tenantList.map(item => item.tenantId)
      } else {
        this.form.tenantIds = []
      }
    },
    tenantChange(value) {
      this.selectAll = (value?.length === this.tenantList.length)
    },
    saveBtn() {
      this.$refs.formData.validate(valid => {
        if (valid) { // 校验必填字段
          dynamicApi(this.form).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-col{
  margin-bottom: 0;
}
</style>
