<template>
  <div>
    <el-form ref="formValid" size="mini" label-width="120px" :rules="rules" :model="formData">
      <el-row :gutter="10">
        <el-col :span="20">
          <el-form-item label="角色别名" prop="roleAlias">
            <el-input v-model="formData.roleAlias" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="formData.roleName" />
          </el-form-item>
        </el-col>
        <!-- 留白一个选项 -->
        <el-col :span="20">
          <el-form-item label="角色状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="角色分组" prop="rolePostCategory">
            <el-select v-model="formData.rolePostCategory" style="width:100%">
              <el-option v-for="item in list" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="自动分配" prop="postIdList">
            <el-select v-model="formData.postIdList" style="width:100%" placeholder="请选择岗位" multiple>
              <el-option v-for="item in list" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item prop="platformIdList">
            <el-select v-model="formData.platformIdList" style="width:100%" placeholder="请选择平台" multiple>
              <el-option v-for="item in list" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item prop="positionIdList">
            <el-select v-model="formData.positionIdList" style="width:100%" placeholder="请选择职位" multiple>
              <el-option v-for="item in list" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="角色职责" prop="remark">
            <el-input v-model="formData.remark" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <div style="text-align:right">
            <el-button size="mini" @click="reset">重置</el-button>
            <el-button size="mini" @click="cancel">取消</el-button>
            <el-button size="mini" type="primary" @click="buttonSure">确定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { addSecond } from '@/api/role'
export default {
  data() {
    return {
      formData: {
        status: '1'
      },
      list: [
        { value: 1, label: '示例1' },
        { value: 2, label: '示例2' },
        { value: 3, label: '示例3' }
      ],
      rules: {
        roleAlias: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        roleName: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        rolePostCategory: [{ required: true, message: '角色不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {
    reset() {
      this.formData = {}
    },
    buttonSure() {
      this.$refs.formValid.validate(valid => {
        if (valid) {
          addSecond(this.formData).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    },
    cancel() {
      this.$parent.$emit('close', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-col{
  margin-bottom:0px ;
}
</style>
