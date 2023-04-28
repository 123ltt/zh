<template>
  <!-- 平台汇率系数配置 -->
  <el-form ref="rulesForm" :model="openData" size="small" label-width="auto">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item prop="platformCode" label="平台" :rules="{ required: true, message: '类型', trigger: 'change' }">
          <el-select v-model="openData.platformCode" clearable placeholder="请选择" :disabled="!isAdd" filterable style="width:100%">
            <el-option v-for="item in platformList" :key="item.id" :label="item.platformName" :value="item.platformCode" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item prop="adjType" label="调整" :rules="{ required: true, message: '类型', trigger: 'change' }">
          <el-select v-model="openData.adjType" clearable placeholder="请选择" filterable style="width:28%">
            <el-option v-for="item in platformRateType" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
          <el-select v-model="openData.adjStatus" clearable placeholder="请选择" filterable style="width:28%">
            <el-option v-for="item in rateFitType" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
          <el-input v-model="openData.adjValue" v-input.positive clearable type="text" style="width:40%" placeholder="输入非负数" show-word-limit>
            <label v-if="openData.adjType===2" slot="append">%</label>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item prop="status" label="启用状态">
          <el-radio-group v-model="openData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item style="text-align: right;">
          <el-button size="small" @click="$parent.$emit('close')">返回</el-button>
          <el-button size="small" type="primary" @click="define">保存</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { listPlatForm, getMyDictBiz } from '@/api/commonApi.js'
import { add, update } from '@/api/platformRate.js'

export default {
  props: {
    isAdd: Boolean,
    openData: Object
  },
  data() {
    return {
      loading: false,
      platformRateType: [],
      rateFitType: [],
      platformList: []
    }
  },
  created() {
    this.getData()
  },
  mounted() {

  },
  methods: {
    //   获取信息
    getData() {
      listPlatForm().then(res => {
        if (res.code === 200) {
          this.platformList = res.data
        } else {
          this.$message.error('状态获取失败')
        }
      })
      getMyDictBiz('platform_rate_type').then(res => {
        this.platformRateType = res.data
        this.platformRateType.map(item => { this.$set(item, 'dictKey', Number(item.dictKey)) })
      })
      getMyDictBiz('rate_fit_type').then(res => {
        this.rateFitType = res.data
        this.rateFitType.map(item => { this.$set(item, 'dictKey', Number(item.dictKey)) })
      })
    },
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.openData.adjStatus === undefined || this.openData.adjValue === undefined) {
            this.$message.error('请填写完必填项!')
          } else {
            if (this.isAdd) {
              add(this.openData).then(() => {
                this.$parent.$emit('close', true)
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            } else {
              update(this.openData).then(res => {
                this.$parent.$emit('close', true)
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  *{
    font-size: 12px;
  }
  .header{
    height: 50px;
    line-height: 50px;
  }
  .el-select{
    margin-right: 2%;
  }
  ::v-deep .el-form-item{
    margin-bottom: 10px!important;
  }
  .redStar{
    color: red;
    font-size: 12px;
  }
  .cardBox{
    ::v-deep .el-card__body{
      padding-bottom: 0;
    }
  }
  .hiddenWord{
    display: -webkit-box;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
  }
  .el-button {
    width:60px;
  }
  .btnBox{
    ::v-deep .el-form-item__content{
      margin-left: 20px!important;
    }
    .btn{
      width: 60px;
    }
  }
  ::v-deep .el-dialog__body{
    padding-top: 10px;
    padding-bottom: 40px;
  }
  .file{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
</style>
