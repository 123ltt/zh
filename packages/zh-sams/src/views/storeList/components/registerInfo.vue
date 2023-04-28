<template>
  <basic-container>
    <div class="btn-head">
      <p />
      <el-button type="primary" size="mini" :disabled="submitBtnEnable" @click="handleUpdate('formObjRef')">修 改</el-button>
    </div>
    <el-form ref="formObjRef" :model="formObj" :rules="rules" label-width="120px" size="mini" class="form-col">
      <el-row style="width:70%;margin: auto;">
        <el-col :span="12">
          <el-form-item label="公司名称/个人" prop="name">
            <el-input v-model.trim="formObj.name" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="phone">
            <el-input v-model.trim="formObj.phone" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司类型" prop="companyTypeName">
            <el-input v-model.trim="formObj.companyTypeName" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册时间" prop="regDate">
            <el-input v-model.trim="formObj.regDate" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用卡卡号" prop="ccNumber">
            <el-input v-model.trim="formObj.ccNumber" maxlength="16" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用卡有效期" prop="ccExpirationDate">
            <el-date-picker v-model="formObj.ccExpirationDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width:200px" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </basic-container>
</template>

<script>
import { getRegisterInfoById, updateRegisterInfoById } from '@/api/storeList'
import { deepClone } from '@/util/util'
export default {
  name: 'RegisterInfo',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    }
  },
  data() {
    return {
      oldForm: {},
      formObj: {
        type: '',
        name: '',
        legalPersonPhone: '',
        regDate: '',
        ccNumber: '',
        ccExpirationDate: ''
      },
      rules: {
        type: [{ required: true }],
        name: [{ required: true }],
        phone: [{ required: true }],
        regDate: [{ required: true }],
        ccNumber: [{ required: true, message: '信用卡卡号不能为空', trigger: 'blur' }, { pattern: /^[1-9]\d{13,16}$/, message: '请输入正确的信用卡卡号!' }],
        ccExpirationDate: [{ required: true, message: '信用卡有效期不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.formObj))
    }
  },
  mounted() {
    this.getRegisterInfoById()
  },
  methods: {
    getRegisterInfoById() {
      getRegisterInfoById({ id: this.compId }).then(res => {
        this.formObj = res.data
        this.oldForm = deepClone(this.formObj)
      })
    },
    handleUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.compId) {
            updateRegisterInfoById({ ...this.formObj }).then(res => {
              this.$message.success(res.msg)
              this.$emit('close', true)
            })
          }
        }
      })
    }
  }

}
</script>

<style>
.w200{
  width: 200px !important;
}

</style>
