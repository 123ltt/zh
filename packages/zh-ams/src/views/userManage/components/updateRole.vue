<template>
  <el-form
    ref="dialogForm"
    :model="form"
    :rules="rules"
    size="mini"
    label-width="110px"
  >
    <el-form-item label="选择角色" prop="roleIds">
      <el-select v-model="form.roleIds" filterable multiple placeholder="请选择角色" class="w-75">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="`${item.roleName}（${item.roleAlias}）`"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <div class="bottom-btn">
      <span class="el-button el-button--default el-button--small" @click="$parent.$emit('close')">
        <span>取消</span>
      </span>
      <el-button
        size="small"
        type="primary"
        @click="submitDialog('dialogForm')"
      >保 存</el-button>
    </div>
  </el-form>
</template>

<script>
import { setUserRole } from '@/api/userManange.js'
export default {
  name: 'UpdateRole',
  props: {
    current: Object,
    roleList: Array
  },
  data() {
    return {
      form: {
        // 设置角色值
        roleIds: []
      },
      rules: {
        roleIds: [{ required: true, message: '角色不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.form.roleIds = this.current.roles.map(item => item.id)
  },
  methods: {
    submitDialog() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          setUserRole({
            roleIds: this.form.roleIds.toString(),
            userIds: this.current.id.toString()
          }).then((res) => {
            if (res.success) {
              this.$message.success('操作成功')
              this.$parent.$emit('close', true)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form{
  margin: 20px 10px 0 10px;
}
.bottom-btn{
  padding-bottom: 20px;
  text-align: right;
  margin-top: 248px;
  margin-right: 20px;
}
::v-deep .el-select .el-tag .el-select__tags-text {
    max-width: 17em;
}
</style>
