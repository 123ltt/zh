<template>
  <!-- 季节周期详情 -->
  <el-form v-loading="loading" size="mini" :model="detail" label-width="120px" class="no-message">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="季节属性">
            <el-input :value="detail.seasonNatureName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="季节周期">
            <el-input :value="seasonPeriodDate" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">操作日志</span>
      </div>
      <el-table :data="detail.seasonPeriodHislList" size="mini" max-height="250px" stripe border class="g-table">
        <el-table-column prop="updateUserName" label="操作人" align="center" min-width="120" />
        <el-table-column prop="updateTime" label="操作时间" align="center" min-width="150" />
        <el-table-column prop="content" label="操作记录" align="center" min-width="350" show-overflow-tooltip />
      </el-table>
    </el-card>

  </el-form>
</template>

<script>

import { getDetail } from '@/api/base/seasonPeriod.js'
export default {
  name: 'SeasonPeriodDetail',
  props: {
    id: String
  },
  data() {
    return {
      detail: {},
      seasonPeriodDate: '',
      loading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      getDetail(this.id).then(res => {
        this.detail = res.data
        this.seasonPeriodDate = `${this.replaceDate(this.detail.seasonPeriodStartDate)}  至  ${this.replaceDate(this.detail.seasonPeriodEndDate)}`
        this.loading = false
      })
    },
    replaceDate(val) {
      if (val) {
        const strA = val.split('-')[0]
        const strB = val.split('-')[1]
        return `${strA}月 ${strB}日`
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
