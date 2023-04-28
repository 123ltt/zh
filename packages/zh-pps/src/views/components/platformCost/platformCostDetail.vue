<template>
  <basic-container v-loading="loading">
    <el-card class="cardBox">
      <div slot="header" style="height:20px;line-height:20px;">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-table :data="tableData" size="mini" stripe style="width: 100%" border>
        <el-table-column prop="platformName" label="平台名称" align="center" min-width="80" />
        <el-table-column prop="storeSiteName" label="经营站点" align="center" min-width="80" />

        <el-table-column prop="platformLevelName" label="平台店铺级别" align="center" min-width="80" />
        <el-table-column prop="storeCode" label="店铺编码" align="center" min-width="80">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.storeCode }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column v-for="item in openData.baseCostConfigList" :key="item.id" :prop="item.costValue" :label="item.costName" align="center" min-width="80">
          <template>
            <span>{{ item.costValue }}</span>
            <span v-if="item.costType === 1">{{ item.costCurrencyName }}</span>
            <span v-if="item.costType === 2">%</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">自定义成本</span>
      </div>
      <el-table :data="openData.customCostConfigList" size="mini" max-height="400px" stripe style="width: 100%" border>
        <el-table-column prop="categoryName" label="产品类目" align="center" min-width="80" />
        <el-table-column prop="productName" label="产品名称" align="center" min-width="100" />
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="200" />
        <el-table-column prop="costName" label="费用名称" align="center" min-width="150" />
        <el-table-column prop="costTypeName" label="费用类型" align="center" min-width="150" show-overflow-tooltip />
        <el-table-column prop="costValueShow" label="费用值" align="center" min-width="100" />
      </el-table>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span>操作记录</span>
      </div>
      <el-table :data="recordData" max-height="400px" stripe style="width: 100%" border>
        <el-table-column prop="createUserName" label="操作人" align="center" min-width="150" />
        <el-table-column prop="createTime" label="操作时间" align="center" min-width="150" />
        <el-table-column prop="opRecord" label="操作记录" align="center" min-width="300" show-overflow-tooltip />
      </el-table>
    </el-card>
  </basic-container>
</template>

<script>
// import { getStoreInfoByPlatformCode } from '@/api/commonApi.js'
import { getDetail } from '@/api/platform/platform-cost'
export default {
  name: 'PlatformCostDetail',
  props: {
    detailData: Object
  },
  data() {
    return {
      loading: false,
      recordData: [],
      openData: {
        baseCostConfigList: null,
        customCostConfigList: null
      },
      tableData: []
    }
  },
  mounted() {
    this.detailInit()
  },
  methods: {
    detailInit() {
      this.loading = true
      getDetail(this.detailData.id).then(res => {
        const data = res.data
        this.tableData = [data]
        this.openData = JSON.parse(JSON.stringify(data))
        this.tableData.length && this.$set(this.tableData[0], 'platformLevelName', this.detailData.platformLevelName)
        this.recordData = data.platformCostOpHisVOList
        this.openData.customCostConfigList.forEach(item => {
          if (item.costType === 1) {
            item.costValueShow = item.costValue + ' ' + item.costCurrencyName
          } else if (item.costType === 2) {
            item.costValueShow = item.costValue + ' %'
          }
        })
        this.loading = false
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
  .btnBox{
    ::v-deep .el-form-item__content{
      margin-left: 20px!important;
    }
    .btn{
      width: 30%;
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
