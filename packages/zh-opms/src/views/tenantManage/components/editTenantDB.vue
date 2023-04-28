<template>
  <el-form
    ref="dialogForm"
    :model="form"
    :rules="rules"
    label-width="126px"
  >
    <div class="el-form-box">
      <el-form-item label="租户ID" prop="tenantId">
        <el-select v-model="form.tenantId" :disabled="Boolean(current)" filterable placeholder="请选择租户">
          <el-option v-for="item in tenantList" :key="item.id" :label="item.tenantId" :value="item.tenantId" />
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称" prop="appCode">
        <el-select v-model="form.appCode" filterable placeholder="应用名称" popper-class="select-style">
          <el-option v-for="item in appList" :key="item.id" :label="item.appName" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" size="small">
        <el-input
          v-model="form.remark"
          type="textarea"
          class="w300"
          maxlength="100"
          show-word-limit
          placeholder="请输入备注"
        />
      </el-form-item>
    </div>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
      <el-button :disabled="current ? submitBtnEnable : false" size="medium" type="primary" @click="submitDialog('dialogForm')">保 存</el-button>
    </div>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { addTenantDB, updateTenantDB } from '@/api/tenantManagement.js'
export default {
  name: 'EditTenant',
  props: {
    current: {
      type: Object,
      default: null
    },
    tenantList: {
      type: Array,
      default: () => ([])
    },
    appList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      form: {
        // 租户名称
        tenantId: '',
        // 应用名称
        appCode: '',
        // 备注
        remark: ''
      },
      rules: {
        tenantId: [{ required: true, message: '租户名不能为空', trigger: 'blur' }],
        appCode: [{ required: true, message: '应用名称不能为空', trigger: 'change' }]
      },
      // 用于提交时判断是否修改
      oldForm: null
    }
  },
  computed: {
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  created() {
    // 编辑
    if (this.current) {
      const { tenantId, remark, id, appCode } = deepClone(this.current)
      this.form = Object.assign(this.form, {
        tenantId,
        appCode,
        remark,
        id
      })
      this.oldForm = deepClone(this.form)
    }
  },
  methods: {
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 修改
          if (this.current) {
            updateTenantDB(this.form).then((res) => {
              if (res.success) {
                this.$message.success('修改DB配置成功')
                this.$parent.$emit('close', true)
              }
            })
          } else {
            // 新增
            addTenantDB(this.form).then((res) => {
              if (res.success) {
                this.$message.success('添加DB配置成功')
                this.$parent.$emit('close', true)
              }
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-box {
  padding: 20px;
}
.el-input__inner {
  width: 300px;
}
.w300 {
  width: 300px;
}
</style>
