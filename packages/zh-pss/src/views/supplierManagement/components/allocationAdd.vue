<template>
  <el-form ref="rulesForm" v-loading="loading" :model="openData" label-width="120px" size="mini">
    <el-row>
      <el-col :span="24">
        <el-form-item prop="assignUserId" label="供应商归属人" :rules="{ required: true, message: '供应商归属人不能为空', trigger: 'change' }">
          <g-select v-model="openData.assignUserId" style="width:100%;" :items="userList" key-field="id" label-field="name" value-field="id" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="supplierIdentifyCode" label="识别码" :rules="{ required: true, message: '识别码不能为空', trigger: 'blur' }">
          <el-input
            v-model="openData.supplierIdentifyCode"
            clearable
            placeholder="请填写"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="supplierMainCode" label="主编码" :rules="{ required: true, message: '主编码不能为空', trigger: 'blur' }">
          <el-input
            v-model="openData.supplierMainCode"
            clearable
            placeholder="请填写"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;padding-right: 20px;">
          <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">{{ isAdd?'保存':'修改' }}</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { save, update, getUserlist } from '@/api/supplierManagement/supplierAllocation.js'

export default {
  name: 'SupplierAllocationAdd',
  props: {
    isAdd: Boolean,
    openData: Object // 父传子的表格参数
  },
  data() {
    return {
      supplierList: [],
      chargeoffTypeList: [
        { name: '月结', value: 1 },
        { name: '半月结', value: 2 }
      ],
      loading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    //   获取数据
    getData() {
      this.loading = true
      getUserlist().then(res => {
        this.userList = res.data.records
        this.loading = false
      })
    },
    // 保存
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.openData.assignUserId === '') {
            this.openData.status = 0
          } else {
            this.openData.status = 1
          }
          (this.isAdd ? save : update)(this.openData).then(() => {
            this.loading = false
            this.$parent.$emit('close', true)
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
*{
    box-sizing: border-box;
}
.numBox{
          width: 40%;
          // margin-right: 10px;
          ::v-deep .el-form-item__content{
            ::v-deep .el-input-group__prepend{
                width: 25%;
                padding: 0;
                text-align: center;
            }
        }
      }
</style>
