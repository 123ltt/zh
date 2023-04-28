<template>
  <!-- 安全天数详情 -->
  <basic-container ref="box" v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item ref="infoBox" title="基本信息" name="1">
        <el-form label-width="100px" size="mini" class="no-message" :model="sharedData" disabled>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="货权">
                <el-input :value="sharedData.productAuthName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货主">
                <el-input :value="sharedData.productOwnerName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品编码">
                <el-input :value="sharedData.productSku" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品名称">
                <el-input :value="sharedData.skuInfo.productName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品类目">
                <el-input :value="sharedData.skuInfo.categoryName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="分仓配置">
                <el-input :value="sharedData.divWarehouseSet ==0?'否':'是'" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人">
                <el-input :value="sharedData.createUserName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间">
                <el-input :value="sharedData.createTime" />
              </el-form-item>
            </el-col>
            <el-col v-if="sharedData.divWarehouseSet ==0" :span="8">
              <el-form-item label="安全天数">
                <el-input :value="sharedData.safeDay" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="最后修改人">
                <el-input :value="sharedData.updateUserName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最后修改时间">
                <el-input :value="sharedData.updateTime" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>

      <el-collapse-item v-show="sharedData.divWarehouseDetailList.length" title="分仓安全库存" name="2">
        <el-table :data="sharedData.divWarehouseDetailList" size="mini" max-height="350px" stripe style="width: 100%" border>
          <el-table-column prop="warehouse.warehouseType.desc" label="仓库类型" align="center" min-width="110" />
          <el-table-column prop="warehouse.warehouseBelong" label="仓库归属" align="center" min-width="110">
            <template slot-scope="{row}">
              <span>{{ warehouseObj[row.warehouse.warehouseBelong] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="warehouse.warehouseName" label="仓库名称" align="center" min-width="120" />
          <el-table-column prop="safeDay" label="安全天数" align="center" min-width="110" />
        </el-table>
      </el-collapse-item>

      <el-collapse-item title="操作记录" name="3">
        <el-table :data="sharedData.safeDayHisVOList" size="mini" max-height="350px" stripe style="width: 100%" border>
          <el-table-column prop="updateUserName" label="操作人" align="center" min-width="100" />
          <el-table-column prop="updateTime" label="操作时间" align="center" min-width="130" />
          <el-table-column prop="content" label="操作记录" align="center" min-width="250" />
        </el-table>

      </el-collapse-item>
    </el-collapse>
  </basic-container>

</template>

<script>
import { getDetail } from '@/api/base/safetyDays.js'
import { getDictBiz } from '@/api/public/public.js'

export default {
  name: 'SafetyDaysDateil',
  props: {
    dateil: Object
  },
  data() {
    return {
      loading: false,
      sharedData: {
        skuInfo: {}
      },
      warehouseObj: {},
      activeNames: ['1', '2', '3']
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        res.data.forEach(item => {
          this.warehouseObj[item.dictKey] = item.dictValue
        })
      })
      getDetail(this.dateil.id).then(res => {
        this.sharedData = res.data
      })
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
