<template>
  <!-- 仓库信息详情 -->
  <el-form v-loading="loading" size="mini" :model="detail" label-width="120px" class="no-message">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">虚拟仓配置</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="虚拟仓名称">
            <el-input :value="detail.warehouseName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="虚拟仓代码">
            <el-input :value="detail.warehouseCode" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属国家">
            <el-input :value="country" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">对应实体仓</span>
      </div>
      <el-table :data="warehousData" size="mini" max-height="250px" stripe border class="g-table">
        <el-table-column prop="warehouseVO.warehouseName" label="仓库名称" align="center" min-width="100" />
        <el-table-column prop="warehouseVO.warehouseCode" label="仓库代码" align="center" min-width="80" />
        <el-table-column prop="warehouseVO.warehouseType.desc" label="仓库类型" align="center" min-width="80" show-overflow-tooltip />
        <el-table-column prop="warehouseVO.warehouseBelongDesc" label="仓库归属" align="center" min-width="80" show-overflow-tooltip />
        <el-table-column label="国家编码" align="center" min-width="80" show-overflow-tooltip>
          <template v-slot="{row}">
            <span>{{ row.warehouseVO.countryCode }}  ( {{ row.warehouseVO.countryName }} )</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">操作日志</span>
      </div>
      <el-table :data="recordData" size="mini" max-height="250px" stripe border class="g-table">
        <el-table-column prop="updateUserName" label="操作人" align="center" min-width="120" />
        <el-table-column prop="updateTime" label="操作时间" align="center" min-width="150" />
        <el-table-column prop="content" label="操作记录" align="center" min-width="350" show-overflow-tooltip />
      </el-table>
    </el-card>

  </el-form>
</template>

<script>

import { getDetail } from '@/api/base/collocation.js'
export default {
  name: 'ImsWarehouseDetail',
  props: {
    id: String,
    warehouseObj: Object
  },
  data() {
    return {
      detail: {},
      recordData: [],
      warehousData: [],
      country: '',
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
        this.recordData = res.data.virtualWarehouseHisVOList
        this.warehousData = this.detail.warehouseRelationVOList
        this.country = `${this.detail.countryCode} ( ${this.detail.countryName} )`
        this.loading = false
      })
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
