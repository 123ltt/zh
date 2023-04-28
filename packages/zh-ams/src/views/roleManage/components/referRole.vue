<template>
  <el-form ref="form" label-width="150px" size="mini" :model="form" :rules="rules">
    <el-row :gutter="10">
      <el-col :span="23" style="margin-bottom: 120px">
        <el-form-item label="请选择要引入的角色" prop="id">
          <el-select v-model="form.id" class="w-100" filterable>
            <el-option v-for="item in roleList" :key="item.id" :value="item.id" :label="item.roleName" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="23" class="text-end">
        <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
        <el-button type="primary" size="mini" @click="submit('form')">确定</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { roleGetAll, getRoleMenuList } from '@/api/role'
export default {
  name: 'ReferRole',
  data() {
    return {
      form: {},
      roleList: [],
      rules: {
        id: [{ required: true, message: '请选择要引用的角色', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      roleGetAll().then(res => {
        this.roleList = res.data
      })
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getRoleMenuList({ roleId: this.form.id }).then(res => {
            this.$parent.$emit('close', res.data)
          })
        }
      })
    }
  }
}
</script>
