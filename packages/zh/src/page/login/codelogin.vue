<template>
  <el-form ref="loginForm"
           :rules="loginRules"
           :model="loginForm"
           class="login-form"
           status-icon
           label-width="0"
  >
    <el-form-item prop="phone">
      <el-input v-model="loginForm.phone"
                :placeholder="$t('login.phone')"
                size="small"
                auto-complete="off"
                @keyup.enter.native="handleLogin"
      >
        <i slot="prefix"
           class="icon-shouji"
        />
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input v-model="loginForm.code"
                :placeholder="$t('login.code')"
                size="small"
                auto-complete="off"
                @keyup.enter.native="handleLogin"
      >
        <i slot="prefix"
           class="icon-yanzhengma"
           style="margin-top:6px;"
        />
        <template slot="append">
          <span :class="[{display:msgKey}]"
                class="msg-text"
                @click="handleSend"
          >{{ msgText }}</span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button size="small"
                 type="primary"
                 class="login-submit"
                 @click.native.prevent="handleLogin"
      >{{ $t('login.submit') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isvalidatemobile } from '@/util/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'Codelogin',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('请输入4位数的验证码'))
      } else {
        callback()
      }
    }
    return {
      msgText: '',
      msgTime: '',
      msgKey: false,
      loginForm: {
        phone: '',
        code: ''
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      }
    }
  },
  computed: {
    ...mapGetters(['tagWel']),
    config() {
      return {
        MSGINIT: this.$t('login.msgText'),
        MSGSCUCCESS: this.$t('login.msgSuccess'),
        MSGTIME: 60
      }
    }
  },
  created() {
    this.msgText = this.config.MSGINIT
    this.msgTime = this.config.MSGTIME
  },
  methods: {
    handleSend() {
      if (this.msgKey) return
      this.msgText = this.msgTime + this.config.MSGSCUCCESS
      this.msgKey = true
      const time = setInterval(() => {
        this.msgTime--
        this.msgText = this.msgTime + this.config.MSGSCUCCESS
        if (this.msgTime === 0) {
          this.msgTime = this.config.MSGTIME
          this.msgText = this.config.MSGINIT
          this.msgKey = false
          clearInterval(time)
        }
      }, 1000)
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('LoginByPhone', this.loginForm).then(() => {
            this.$router.push({ path: this.tagWel.value })
          })
        }
      })
    }
  }
}
</script>

<style>
.msg-text {
  display: block;
  width: 60px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.msg-text.display {
  color: #ccc;
}
</style>
