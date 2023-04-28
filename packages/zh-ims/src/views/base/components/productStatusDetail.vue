<template>
  <!-- 产品状态详情 -->
  <basic-container ref="box" v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="100px" size="mini" class="no-message" :model="dateil" disabled>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="货权">
              <el-input :value="dateil.productAuthName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货主">
              <el-input :value="dateil.productOwnerName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库名称">
              <el-input :value="dateil.warehouse.warehouseName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品编码">
              <el-input :value="dateil.productSku" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称">
              <el-input :value="dateil.skuInfo.productName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品状态">
              <el-input :value="getStatu(dateil.productStatus)" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-table :data="tableData" size="mini" stripe style="width: 100%" border>
        <el-table-column label="调整前状态" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ getStatu(row.statusBefore) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="调整后状态" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ getStatu(row.statusAfter) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="adjustReason" label="调整原因" align="center" min-width="100" />
        <el-table-column prop="applyUserName" label="申请人" align="center" min-width="110" />
        <el-table-column prop="applyTime" label="申请时间" align="center" min-width="130" />
        <el-table-column prop="auditUserName" label="审核人" align="center" min-width="100" />
        <el-table-column prop="auditOpinion" label="审核意见" align="center" min-width="100" />
        <el-table-column prop="auditRemark" label="审核备注" align="center" min-width="130" show-overflow-tooltip />
        <el-table-column prop="auditTime" label="审核时间" align="center" min-width="130" />>
      </el-table>
    </el-card>

  </basic-container>

</template>

<script>
import { getDetail } from '@/api/base/productStatus.js'

export default {
  name: 'SafetyDaysDateil',
  props: {
    dateil: Object,
    statusObj: Object
  },
  data() {
    return {
      loading: false,
      tableData: [],
      warehouseObj: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getDetail(this.dateil.id).then(res => {
        this.tableData = res.data
      })
    },
    getStatu(val) {
      return this.statusObj[val]
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-collapse-item__header{
  padding: 0 30px;
  font-weight: 600;
  ::v-deep .el-collapse-item__arrow{
    margin: 0 auto 0 20px;
    font-weight: 600;
  }
}
</style>
