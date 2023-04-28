<template>
  <el-form ref="openFrom" :model="listData" label-width="120px" size="mini">
    <el-row>
      <el-col :span="24">
        <el-form-item prop="duty" label="联系人职务" :rules="{ required: true, message: '联系人职务不能为空', trigger: 'blur' }">
          <el-input v-model="listData.duty" clearable placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="name" label="联系人名称" :rules="{ required: true, message: '联系人名称不能为空', trigger: 'blur' }">
          <el-input v-model="listData.name" clearable placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="telphone" label="手机号/固定电话" :rules="{ required: true, message: '手机号/固定电话不能为空', trigger: 'blur' }">
          <el-input v-model="listData.telphone" clearable placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="contact">
          <span slot="label">
            QQ/旺旺</span>
          <el-input v-model="listData.contact" clearable placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="mail">
          <span slot="label">
            邮箱地址</span>
          <el-input v-model="listData.mail" clearable placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;padding-right: 20px;">
          <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="defineadd()">保存</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

</template>

<script>

export default {
  name: 'TableAdd',
  props: {
    listData: Object
  },
  data() {
    return {

    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    defineadd() {
      this.$refs.openFrom.validate((valid) => {
        if (valid) {
          let isOk = true
          if (this.listData.telphone.charAt() === '0') {
            if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(this.listData.telphone)) {
              this.$message.error('所填的固定电话有误！')
              isOk = false
            }
          } else {
            if (!(/^1[3456789]\d{9}$/.test(this.listData.telphone))) {
              this.$message.error('所填的手机号有误！')
              isOk = false
            }
          }
          if (isOk) {
            this.$parent.$emit('close', this.listData)
          }
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
