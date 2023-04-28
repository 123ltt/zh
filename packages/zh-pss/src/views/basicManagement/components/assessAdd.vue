<template>
  <el-form ref="rulesForm" v-loading="loading" :model="openData" label-width="90px" size="mini">
    <el-row>
      <el-col :span="24">
        <el-form-item prop="name" :rules="{ required: true, message: '规则名称不能为空', trigger: 'change' }" label="规则名称">
          <el-select
            ref="input"
            v-model="openData.name"
            :disabled="!isAdd"
            clearable
            placeholder="请选择"
            style="width:100%"
            filterable
          >
            <el-option
              v-for="item in rulesName"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="type" :rules="{ required: true, message: '规则类型不能为空', trigger: 'change' }" label="规则类型">
          <el-select
            v-model="openData.type"
            clearable
            style="width:100%"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in rulesType"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="score" :rules="{ required: true, message: '规则分值不能为空', trigger: 'blur' }" label="规则分值">
          <el-input
            v-model="openData.score"
            v-input.positive.numeric
            clearable
            style="width:100%"
            maxlength="3"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="description" :rules="{ required: true, message: '规则说明不能为空', trigger: 'blur' }" label="规则说明">
          <el-input
            v-model="openData.description"
            :autosize="{ minRows: 4, maxRows: 6}"
            type="textarea"
            style="width:100%"
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
import { save, update } from '@/api/basicManagement/assessmentRules.js'

export default {
  name: 'AssessmentRulesAdd',
  props: {
    isAdd: Boolean,
    rulesName: Array,
    rulesType: Array,
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
          if (this.openData.score <= 0) {
            this.$message.error('分值要大于0！')
          } else {
            this.loading = true
            this.rulesName.forEach(item => {
              if (+item.dictKey === +this.openData.name) {
                this.openData.nameDictValue = item.dictValue
              }
            });
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
