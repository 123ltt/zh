<template>
  <basic-container>
    <div class="box">
      <el-form
        ref="ruleForm"
        v-loading="loading"
        :model="ruleForm"
        :rules="rules"
        status-icon
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="原密码"
          prop="oldPassword"
        >
          <el-input
            v-model="ruleForm.oldPassword"
            :disabled="disabled"
            :placeholder="`${disabled? '刚才提交':'请输入'}原密码`"
            type="password"
            auto-complete="off"
            show-password
          />
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPassword"
        >
          <el-input
            v-model="ruleForm.newPassword"
            :disabled="disabled"
            :placeholder="`${disabled? '刚才提交':'请输入'}新密码`"
            type="password"
            auto-complete="off"
            show-password
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="newPassword1"
        >
          <el-input
            v-model="ruleForm.newPassword1"
            :disabled="disabled"
            :placeholder="`${disabled? '刚才提交':'请输入'}确认密码`"
            type="password"
            auto-complete="off"
            show-password
          />
        </el-form-item>
        <el-form-item v-if="disabled">
          <el-button
            type="primary"
            @click="$refs['ruleForm'].resetFields();disabled = false"
          >再次修改</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </basic-container>
</template>

<script>
import { updatePassWord } from '@/api/userManange.js'
import { mapGetters } from 'vuex'
export default {
  name: 'UserManage',
  data() {
    // 密码规则：大小写，数字，特殊字符4种任意选三种长度8-16
    const reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/
    var valOldPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else if (value === this.ruleForm.newPassword) {
        callback(new Error('新密码与原密码不能一致'))
      } else {
        // if (this.ruleForm.oldPassword !== '') {
        //   this.$refs.ruleForm.validateField('oldPassword')
        // }
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value === this.ruleForm.oldPassword) {
        callback(new Error('新密码与原密码不能一致'))
      } else if (!reg.test(value)) {
        callback(new Error('密码规则：大小写，数字，特殊字符4种任意选三种长度8-16'))
      } else {
        if (this.ruleForm.newPassword1 !== '') {
          this.$refs.ruleForm.validateField('newPassword1')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else if (!reg.test(value)) {
        callback(new Error('密码规则：大小写，数字，特殊字符4种任意选三种长度8-16'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: {
        oldPassword: '',
        newPassword: '',
        newPassword1: '',
        userId: '1'
      },
      rules: {
        // oldPassword: [{ required: false, message: '原密码不能为空', trigger: 'blur' }],
        oldPassword: [{ validator: valOldPassword, trigger: 'blur' }],
        newPassword: [{ validator: validatePass, trigger: 'blur' }],
        newPassword1: [{ validator: validatePass2, trigger: 'blur' }]
      },
      // 修改密码状态
      disabled: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    submitForm() {
      // console.log(this.userInfo)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          updatePassWord(Object.assign({}, this.ruleForm, { userId: this.userInfo.user_id })).then(res => {
            this.$message.success('修改密码成功')
            this.disabled = true
          }).finally(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 20px 0;
  background: #fff;
}
.demo-ruleForm {
  width: 500px;
}
</style>
