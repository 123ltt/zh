<template>
  <div v-loading="loading">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form class="no-message" size="mini" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input :value="detail.productSku" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input :value="detail.productName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="产品类目">
              <el-input :value="detail.categoryName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月周转天数">
              <el-input :value="detail.monthlyTurnoverDays" disabled>
                <template slot="prepend">大于等于</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="创建人">
              <el-input :value="detail.createUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input :value="detail.createTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="最后修改人">
              <el-input :value="detail.updateUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后修改时间">
              <el-input :value="detail.updateTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span style="font-weight: 600;">操作记录</span>
      </div>
      <el-table :data="recordData" max-height="400px" size="mini" stripe style="width: 100%" border class="g-table">
        <el-table-column prop="createUserName" label="操作人" align="center" min-width="150" />
        <el-table-column prop="createTime" label="操作时间" align="center" min-width="150" />
        <el-table-column prop="opRecord" label="操作记录" align="center" min-width="300" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script>

import { getDetail } from '@/api/basicManagement/turnoverRules.js'
export default {
  name: 'SalesRulesDetail',
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
        this.recordData = data.hisList
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
</style>
