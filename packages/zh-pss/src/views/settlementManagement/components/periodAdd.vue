<template>
  <el-form ref="rulesForm" v-loading="loading" :model="openData" label-width="90px" size="mini">
    <el-row>
      <el-col :span="24">
        <el-form-item prop="supplierId" label="供应商名称" :rules="{ required: true, message: '供应商名称不能为空', trigger: 'change' }">
          <g-select v-model="openData.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" :disabled="!isAdd" value-field="supplierId" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="chargeoffType" label="结算账期" :rules="{ required: true, message: '结算账期不能为空', trigger: 'change' }">
          <el-select
            v-model="openData.chargeoffType"
            clearable
            style="width:100%"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in chargeoffTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="chargeoffDays" label="出账日" :rules="{ required: true, message: '出账日不能为空', trigger: 'blur' }">
          <el-input
            v-model="openData.chargeoffDays"
            v-input.positive.numeric
            clearable
            class="numBox"
            maxlength="2"
            placeholder="请输入"
          />
          <span>  号</span>
          <span style="color:red;">（只允许输入1-31号）</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="paymentCircle" label="付款周期" :rules="{ required: true, message: '付款周期不能为空', trigger: 'blur' }">
          <el-input
            v-model="openData.paymentCircle"
            v-input.positive.numeric
            clearable
            class="numBox"
            maxlength="3"
            placeholder="请输入"
          />
          <span>  天</span>
          <span style="color:red;">（最多为999天）</span>
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
import { save, update } from '@/api/settlementManagement/settlementPeriod.js'
import { supplier } from '@/api/commonApi/common.js'

export default {
  name: 'SettlementPeriodAdd',
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
      supplier().then(res => {
        this.supplierList = res.data
        this.loading = false
      })
    },
    // 保存
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.openData.chargeoffDays <= 0) {
            this.$message.error('出账日不能为0号！')
          } else if (this.openData.chargeoffDays > 31) {
            this.$message.error('出账日只允许输入1-31号！')
          } else if (this.openData.paymentCircle <= 0) {
            this.$message.error('付款周期不能为0日！')
          } else if (this.openData.paymentCircle > 1000) {
            this.$message.error('付款周期最多为999天！')
          } else {
            this.loading = true;
            (this.isAdd ? save : update)(this.openData).then(() => {
              this.$parent.$emit('close', true)
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            }).catch(() => {
              this.loading = false
            })
          }
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
