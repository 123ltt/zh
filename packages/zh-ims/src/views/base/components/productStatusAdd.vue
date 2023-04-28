<template>
  <!-- 季节周期新增 -->
  <el-form ref="rulesForm" v-loading="loading" size="mini" :model="upData" label-width="90px">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item prop="seasonNatureCode" label="产品编码">
          <el-input :value="openData.productSku" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="seasonNatureCode" label="产品名称">
          <el-input :value="openData.skuInfo.productName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="productStatus" label="产品状态">
          <el-select v-model="openData.productStatus" clearable placeholder="请选择" filterable style="width:100%" disabled>
            <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="statusAfter" label="调整后状态" :rules="{ required: true, message: '请选择调整后状态', trigger: 'change' }">
          <el-select v-model="upData.statusAfter" clearable placeholder="请选择" filterable style="width:100%" :disabled="isAuit">
            <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="adjustReason" label="调整原因" :rules="{ required: true, message: '请填写调整原因', trigger: 'blur' }">
          <el-input v-model.trim="upData.adjustReason" :rows="2" type="textarea" clearable placeholder="请填写" :disabled="isAuit" />
        </el-form-item>
      </el-col>
      <el-col v-if="isAuit" :span="12">
        <el-form-item prop="auditOpinion" label="审核意见" :rules="{ required: true, message: '请填写审核意见', trigger: 'change' }">
          <el-select v-model="upData.auditOpinion" clearable placeholder="请选择" filterable style="width:100%">
            <el-option v-for="item in opinionList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="isAuit" :span="24">
        <el-form-item prop="auditRemark" label="审核备注">
          <el-input v-model.trim="upData.auditRemark" :rows="2" type="textarea" clearable placeholder="请填写" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;padding-right: 20px;">
          <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">保存</el-button>
        </el-form-item>
      </el-col>

    </el-row>

  </el-form>
</template>

<script>

import { adjustStatus, auditStatus } from '@/api/base/productStatus.js'
import { getDictBiz } from '@/api/public/public.js'

export default {
  name: 'ProductStatusAdd',
  props: {
    isAuit: Boolean,
    openData: Object,
    statusList: Array
  },
  data() {
    return {
      loading: false,
      upData: {
        id: this.openData.id,
        statusAfter: '',
        adjustReason: ''
      },
      opinionList: [],
      auitData: {
        adjustReason: this.openData.adjustReason,
        auditOpinion: '',
        auditRemark: '',
        hisId: this.openData.hisId,
        id: this.openData.id,
        statusAfter: this.openData.statusAfter
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.rulesForm.clearValidate() // 先清空校验
    })
    this.dealWith()
  },
  methods: {
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          (this.isAuit ? auditStatus : adjustStatus)(this.isAuit ? this.auitData : this.upData).then(() => {
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
    },
    // 编辑处理
    dealWith() {
      if (this.isAuit) {
        this.upData.statusAfter = this.openData.statusAfter
        this.upData.adjustReason = this.openData.adjustReason
        // 状态
        getDictBiz('audit_opinion').then(res => {
          this.opinionList = res.data
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
::v-deep .el-card__body{
    padding-bottom: 0!important;
  }

.divider{
  display: inline-block;
  width: 10%;
  text-align: center;
  color: #c4c7cf;
}

.redStar{
  color: red;
  font-size: 12px;
}
</style>
