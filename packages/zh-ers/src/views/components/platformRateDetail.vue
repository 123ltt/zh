<template>
  <div v-loading="loading">
    <el-card>
      <div slot="header">
        <span>基本信息</span>
      </div>
      <el-form ref="rulesForm" :model="detail" size="small" label-width="auto">
        <el-row :gutter="10">
          <el-col :span="15">
            <el-form-item prop="platformName" label="平台" :rules="{ required: true, message: '请选择平台名称', trigger: 'change' }">
              <el-select v-model="detail.platformName" :disabled="true" clearable placeholder="请选择" filterable style="width:100%">
                <el-option :label="detail.platformName" :value="detail.platformName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item prop="adjTypeName" label="调整" :rules="{ required: true, message: '请选择调整类型', trigger: 'change' }">
              <el-select v-model="detail.adjTypeName" :disabled="true" clearable placeholder="请选择" filterable style="width:28%">
                <el-option :label="detail.adjTypeName" :value="detail.adjTypeName" />
              </el-select>
              <el-select v-model="detail.adjStatusName" :disabled="true" clearable placeholder="请选择" filterable style="width:28%">
                <el-option :label="detail.adjStatusName" :value="detail.adjStatusName" />
              </el-select>
              <el-input v-model="detail.adjValue" clearable type="text" style="width:40%" show-word-limit disabled>
                <label v-if="detail.adjType===2" slot="append">%</label>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item prop="status" label="启用状态">
              <el-radio-group v-model="detail.status" disabled>
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="2">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span>操作记录</span>
      </div>
      <el-table :data="recordData" max-height="400px" stripe style="width: 100%" border class="g-table">
        <el-table-column prop="createUserName" label="操作人" align="center" min-width="120" />
        <el-table-column prop="createTime" label="操作时间" align="center" min-width="120" />
        <el-table-column prop="opRecord" label="操作记录" align="center" min-width="350" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script>

import { getDetail } from '@/api/platformRate.js'
export default {
  name: 'ProductCostDetail',
  props: {
    detailData: Object
  },
  data() {
    return {
      detail: {},
      recordData: [],
      loading: false
    }
  },
  mounted() {
    this.getData(this.detailData.id)
  },
  methods: {
    getData(val) {
      this.loading = true
      getDetail(val).then(res => {
        const data = res.data
        this.detail = data
        this.recordData = data.configHisDetails
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-form-item{
    margin-bottom: 10px!important;
  }
  .caozuo{
    ::v-deep .el-table td, .el-table th{
      padding: 5px 0;
    }
  }
  .el-select{
    margin-right: 2%;
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
</style>
