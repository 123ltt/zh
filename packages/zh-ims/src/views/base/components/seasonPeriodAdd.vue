<template>
  <!-- 季节周期新增 -->
  <el-form ref="rulesForm" v-loading="loading" size="mini" :model="openData" label-width="120px" :rules="rules">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item prop="seasonNatureCode" label="季节属性">
          <el-select v-model="openData.seasonNatureCode" clearable placeholder="请选择" filterable :disabled="!isAdd" style="width:100%">
            <el-option v-for="item in seasonNatureList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="startDate" label="季节周期开始时间">
          <el-cascader v-model="openData.startDate" :options="options" clearable placeholder="请选择" style="width:100%" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="endDate" label="季节周期结束时间">
          <el-cascader v-model="openData.endDate" :options="options" clearable placeholder="请选择" style="width:100%" />
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

import { update, save, getDetail } from '@/api/base/seasonPeriod.js'
import { getDictBiz } from '@/api/public/public.js'
import { dataData } from '@/api/base/dateData.js'

export default {
  name: 'SeasonPeriodAdd',
  props: {
    isAdd: Boolean,
    upData: Object
  },
  data() {
    return {
      loading: false,
      openData: {
        id: '',
        seasonNatureCode: '',
        seasonPeriodStartDate: '',
        startDate: [],
        endDate: [],
        seasonPeriodEndDate: ''
      },
      options: dataData,
      seasonNatureList: [],
      rules: {
        seasonNatureCode: [{ required: true, message: '请选择季节属性', trigger: 'change' }],
        startDate: [{ required: true, message: '请选择季节周期开始时间', trigger: 'change' }],
        endDate: [{ required: true, message: '请选择季节周期结束时间', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.rulesForm.clearValidate() // 先清空校验
    })
    this.dealWith()
  },
  methods: {
    getData() {
      getDictBiz('season_nature').then(res => {
        this.seasonNatureList = res.data
      })
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.openData.seasonPeriodStartDate = this.openData.startDate[0].slice(0, 2) + '-' + this.openData.startDate[1].slice(0, 2)
          this.openData.seasonPeriodEndDate = this.openData.endDate[0].slice(0, 2) + '-' + this.openData.endDate[1].slice(0, 2);
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
    },
    replaceDate(val) {
      if (val) {
        const strA = val.split('-')[0]
        const strB = val.split('-')[1]
        return `${strA}月 ${strB}日`
      }
    },
    // 编辑处理
    dealWith() {
      if (!this.isAdd) {
        this.loading = true
        getDetail(this.upData.id).then(res => {
          const data = res.data
          this.openData.id = data.id
          this.openData.seasonNatureCode = data.seasonNatureCode
          this.openData.startDate = this.replaceDate(data.seasonPeriodStartDate).split(' ')
          this.openData.endDate = this.replaceDate(data.seasonPeriodEndDate).split(' ')
          this.loading = false
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
