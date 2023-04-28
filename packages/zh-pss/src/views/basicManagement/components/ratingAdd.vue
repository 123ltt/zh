<template>
  <el-form ref="rulesForm" v-loading="loading" :model="openData" label-width="90px" size="mini">
    <el-row>
      <el-col :span="24">
        <el-form-item prop="name" label="等级名称" :rules="{ required: true, message: '等级名称不能为空', trigger: 'blur' }">
          <el-input
            v-model="openData.name"
            maxlength="20"
            :disabled="!isAdd"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="beginScore" label="起始分值" :rules="{ required: true, message: '起始分值不能为空', trigger: 'blur' }">
          <el-input
            v-model="openData.beginScore"
            v-input.positive.numeric
            maxlength="3"
            clearable
            placeholder="请输入"
          >
            <template slot="prepend">大于</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="endScore" label="截止分值" :rules="{ required: true, message: '截止分值不能为空', trigger: 'blur' }">
          <el-input
            v-model="openData.endScore"
            v-input.positive.numeric
            maxlength="3"
            clearable
            placeholder="请输入"
          >
            <template slot="prepend">小于等于</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="等级说明" prop="description">
          <el-input
            v-model="openData.description"
            :autosize="{ minRows: 4, maxRows: 6}"
            type="textarea"
            clearable
            maxlength="500"
            placeholder="请输入"
          />
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
import { save, update } from '@/api/basicManagement/ratingRules.js'

export default {
  name: 'RatingRulesAdd',
  props: {
    isAdd: Boolean,
    openData: Object // 父传子的表格参数
  },
  data() {
    return {
      loading: false
    }
  },

  created() {
  },
  methods: {
    // 保存
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (parseInt(this.openData.beginScore) >= parseInt(this.openData.endScore)) {
            this.$message.error('起始分值不能大于或等于截止分值')
          } else {
            this.loading = true;
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
.address{
          width: 31%;
          margin-right: 5px;
      }
      .smallAddress{
          margin-top: 10px;
      }
      .telCode{
          width: 30%;
      }
      .divider{
          display: inline-block;
          width: 10%;
          text-align: center;
          color: #c4c7cf;
      }
      .telNumber{
          width: 60%;
      }
</style>
