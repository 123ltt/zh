<template>
  <!-- 库存预警详情 -->
  <el-form v-loading="loading" size="mini" :model="detail" label-width="100px" class="no-message">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
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
        <el-col :span="12">
          <el-form-item label="产品类目">
            <el-input :value="detail.category" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库类型">
            <el-input :value="detail.warehouseType.desc" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库归属">
            <el-input :value="warehouseBelongObj[detail.warehouseBelong]" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库名称">
            <el-input :value="detail.warehouseName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="货权">
            <el-input :value="detail.productAuthName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="货主">
            <el-input :value="detail.productOwnerName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存上限">
            <el-input :value="detail.stockUpperLimit" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存下限">
            <el-input :value="detail.stockLowerLimit" disabled />
          </el-form-item>
        </el-col>
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
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">操作日志</span>
      </div>
      <el-table :data="recordData" size="mini" max-height="400px" stripe border class="g-table">
        <el-table-column prop="updateUserName" label="操作人" align="center" min-width="120" />
        <el-table-column prop="updateTime" label="操作时间" align="center" min-width="150" />
        <el-table-column prop="record" label="操作记录" align="center" min-width="350" show-overflow-tooltip />
      </el-table>
    </el-card>

  </el-form>
</template>

<script>

import { getDetail } from '@/api/base/imsWarehouseWarn.js'
export default {
  name: 'ImsWarehouseWarnDetail',
  props: {
    id: String,
    warehouseBelongObj: Object
  },
  data() {
    return {
      detail: {
        warehouseType: { desc: '' }
      },
      recordData: [],
      categoryName: '',
      loading: false,
      productName: ''
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
        this.recordData = res.data.stockForewarnHisVOList
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
