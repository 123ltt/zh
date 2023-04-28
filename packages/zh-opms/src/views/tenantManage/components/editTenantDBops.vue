<template>
  <el-form
    ref="dialogForm"
    :model="form"
    :rules="rules"
    label-width="126px"
  >
    <div class="el-form-box">
      <el-form-item label="租户ID" prop="tenantId">
        <el-input v-model="form.tenantId" disabled placeholder="租户ID" />
      </el-form-item>
      <el-form-item label="数据库集群地址" prop="dbDomain" size="small">
        <el-input v-model="form.dbDomain" maxlength="128" show-word-limit placeholder="请输入数据库集群地址" />
      </el-form-item>
      <el-form-item label="数据库名称" prop="dbSchema" size="small">
        <el-input v-model="form.dbSchema" disabled maxlength="30" show-word-limit placeholder="数据库名称" />
      </el-form-item>
      <el-form-item label="数据库用户名" prop="username" size="small">
        <el-input v-model="form.username" disabled maxlength="30" show-word-limit placeholder="数据库用户名" />
      </el-form-item>
      <el-form-item label="数据库密码" prop="password" size="small">
        <el-input v-model="form.password" maxlength="12" show-word-limit placeholder="请输入数据库密码" />
      </el-form-item>
    </div>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
      <el-button :disabled="submitBtnEnable" size="medium" type="primary" @click="submitDialog('dialogForm')">保 存</el-button>
    </div>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { isIp } from '@/util/validate'
import { opsUpdateDb } from '@/api/tenantManagement.js'
export default {
  name: 'EditTenantOps',
  props: {
    current: {
      type: Object,
      default: null
    }
  },
  data() {
    const regPass = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{12}$/
    const passwordValidator = (rule, value, callback) => {
      if (!regPass.test(value)) {
        callback(new Error('请确认12位个数，且包含大小写字母、数字、特殊符号'))
      } else {
        callback()
      }
    }
    // 验证ip+端口
    // eslint-disable-next-line
    const regIpPort = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/
    // 验证域名地址
    // eslint-disable-next-line
    const regDomain = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/
    const dbDomainValidator = (rule, value, callback) => {
      if (isIp(value) || regIpPort.test(value) || regDomain.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的IP地址'))
      }
    }
    return {
      form: {
        // 租户名称
        tenantId: '',
        // 数据库集群地址
        dbDomain: '',
        // 数据库密码
        password: ''
      },
      rules: {
        tenantId: [{ required: true }],
        dbSchema: [{ required: true }],
        username: [{ required: true }],
        dbDomain: [{ required: true, validator: dbDomainValidator, trigger: 'blur' }],
        password: [{ required: true, validator: passwordValidator, trigger: 'blur' }]
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
      const { tenantId, dbDomain, dbSchema, username, id } = deepClone(this.current)
      this.form = Object.assign(this.form, {
        tenantId,
        dbDomain,
        dbSchema,
        username,
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
          opsUpdateDb({
            id: this.current.id,
            dbDomain: this.form.dbDomain,
            password: this.form.password
          }).then(res => {
            this.$message.success('操作成功')
            this.$parent.$emit('close', true)
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
.el-form-box {
  padding: 20px 50px 20px;
}
</style>
