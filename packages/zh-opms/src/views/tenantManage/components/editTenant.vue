<template>
  <el-form
    ref="dialogForm"
    :model="form"
    :rules="rules"
    label-width="110px"
  >
    <div class="el-form-box">
      <el-form-item label="租户名称" prop="tenantName" size="small">
        <el-input
          v-model="form.tenantName"
          class="w300"
          maxlength="30"
          show-word-limit
          placeholder="请输入租户名称"
        />
      </el-form-item>
      <el-form-item label="租户域名前缀" prop="domainPrefix" size="small">
        <el-input
          v-model="form.domainPrefix"
          class="w300"
          maxlength="15"
          show-word-limit
          placeholder="请输入租户域名前缀"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="linkman" size="small">
        <el-input
          v-model="form.linkman"
          class="w300"
          maxlength="10"
          show-word-limit
          placeholder="请输入联系人"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="contactNumber" size="small">
        <el-input v-model="form.contactNumber" class="w300" placeholder="请输入联系电话" />
      </el-form-item>
      <!-- <el-form-item label="租户LOGO" prop="logo" size="small">
        <el-upload
          :accept="acceptImgType"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          action="/blade-resource/oss/endpoint/put-file?code=minio"
          list-type="picture-card"
          class="avatar-uploader"
        >
          <img v-if="form.logo" :src="form.logo" class="logo-img" />
          <i v-else class="el-icon-plus" />
        </el-upload>
      </el-form-item> -->
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
import { isPhone, isMobile } from '@/util/validate'
import website from '@/config/website'
import { getToken } from '@/util/auth'
import { deepClone } from '@/util/util'
import { saveTenant, updateTenant } from '@/api/tenantManagement.js'
export default {
  name: 'EditTenant',
  props: {
    current: {
      type: Object,
      default: null
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isMobile(value) || isPhone(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的联系电话'))
      }
    }
    const validateDomainPrefix = (rule, value, callback) => {
      if (/^[a-z]{1,15}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入域名前缀小写字母,1-15位'))
      }
    }
    return {
      acceptImgType: '.jpg,.jpeg,.png,.bmp',
      headers: {
        [website.tokenHeader]: getToken()
      },
      form: {
        // 租户名称
        tenantName: '',
        // 租户域名前缀
        domainPrefix: '',
        // 联系人
        linkman: '',
        // 联系电话
        contactNumber: '',
        // 租户LOGO
        // logo: '',
        // 备注
        remark: ''
      },
      fileList: [],
      rules: {
        tenantName: [{ required: true, message: '租户名不能为空', trigger: 'blur' }],
        domainPrefix: [{ required: true, trigger: 'blur', validator: validateDomainPrefix }],
        linkman: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        contactNumber: [{ required: true, trigger: 'blur', validator: validatePhone }],
        logo: [{ required: true, message: '租户LOGO不能为空', trigger: 'blur' }]
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
      const { tenantName, linkman, contactNumber, remark, id, domainPrefix } = deepClone(this.current)
      this.form = Object.assign(this.form, {
        tenantName,
        domainPrefix,
        linkman,
        contactNumber,
        // logo,
        remark,
        id
      })
      this.oldForm = deepClone(this.form)
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      if (res.success) {
        this.form.logo = res.data.link
      } else {
        this.$message.error('图片上传失败')
      }
      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      // console.log(file)
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 1

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传Logo图片大小不能超过1MB!')
      }
      // return isJPG && isLt2M
      return isLt2M
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.current) {
            updateTenant(this.form).then((res) => {
              if (res.success) {
                this.$message.success('修改租户成功')
                this.$parent.$emit('close', true)
              }
            })
          } else {
            saveTenant(this.form).then((res) => {
              if (res.success) {
                this.$message.success('添加租户成功')
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
::v-deep .tenant-form .el-image__preview {
  display: block;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto !important;
  height: auto !important;
  max-width: 90%;
  max-height: 90%;
}
.el-input__inner {
  width: 300px;
}
.w300 {
  width: 300px;
}
.logo-img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
