<template>
  <!-- 仓库信息详情 -->
  <el-form v-loading="loading" size="mini" :model="detail" label-width="100px" class="no-message">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="仓库类型">
            <el-input :value="detail.warehouseTypeDesc" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库归属">
            <el-input :value="warehouseObj[detail.warehouseBelong]" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国家编码">
            <el-input :value="country" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库名称">
            <el-input :value="detail.warehouseName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库代码">
            <el-input :value="detail.warehouseNumber" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">仓库地址</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="联系人">
            <el-input :value="detail.contacter" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="移动电话">
            <el-input :value="detail.mobilePhone" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="固定电话">
            <el-input :value="detail.telephone" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="仓库地址">
            <el-input :value="detail.address" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">操作日志</span>
      </div>
      <el-table :data="recordData" size="mini" max-height="300px" stripe border class="g-table">
        <el-table-column prop="updateUserName" label="操作人" align="center" min-width="120" />
        <el-table-column prop="updateTime" label="操作时间" align="center" min-width="150" />
        <el-table-column prop="content" label="操作记录" align="center" min-width="350" show-overflow-tooltip />
      </el-table>
    </el-card>

  </el-form>
</template>

<script>

import { getDetail } from '@/api/base/imsWarehouse.js'
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
        this.detail.warehouseTypeDesc = this.detail.warehouseType.desc
        this.recordData = res.data.warehouseHisVOList
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
