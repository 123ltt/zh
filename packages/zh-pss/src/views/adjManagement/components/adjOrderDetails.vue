<template>
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="120px" size="mini" class="no-message">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="调整编码">
              <el-input :value="detailData.purchaseAdjustmentCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购编码">
              <el-input :value="detailData.purchaseCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求方">
              <el-input :value="detailData.demandSideName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供货方">
              <el-input :value="detailData.supplierName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调整人">
              <el-input :value="detailData.moderator" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调整前数量">
              <el-input :value="detailData.adjustFrontQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调整数量">
              <el-input :value="detailData.adjustQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调整后数量">
              <el-input :value="detailData.adjustAfterQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调整时间">
              <el-input :value="detailData.adjustTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调整生效时间">
              <el-input :value="detailData.handleTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">采购调整明细</span>
      </div>
      <el-table :data="recordData"
                max-height="600px"
                stripe
                style="width: 100%"
                border
                class="g-table"
                size="mini"
      >
        <el-table-column prop="goodsCode" label="商品编码" align="center" min-width="110" />
        <el-table-column prop="goodsName" label="商品名称" align="center" min-width="130" show-overflow-tooltip />
        <el-table-column prop="adjustFrontQty" label="调整前数量" align="center" min-width="80" />
        <el-table-column prop="adjustQty" label="调整数量" align="center" min-width="80" />
        <el-table-column prop="adjustAfterQty" label="调整后数量" align="center" min-width="90" />
      </el-table>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">采购处理</span>
      </div>
      <el-form label-width="120px" size="mini" class="no-message">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="调整意愿">
              <el-input :value="detailData.adjustIntention" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供货方式">
              <el-input :value="detailData.supplyWay" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注">
              <el-input :value="detailData.remarks" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="处理人">
              <el-input :value="detailData.handlePeople" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购合同">
              <el-input :value="detailData.purchaseContract" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计发货时间">
              <el-input :value="detailData.estimatedDeliveryTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计到仓时间">
              <el-input :value="detailData.estimatedArrivalTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/adjManagement/purchaseAdj.js'
export default {
  name: 'OpenBox',
  props: {
    detailData: Object, // 父传子的表格参数
    close: { // 父传子的关闭函数
      type: Function,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      recordData: [],
      handleDetail: false
    }
  },
  mounted() {
    this.getData(this.detailData.id)
  },
  methods: {
    getData(val) {
      this.loading = true
      getDetail(val).then(res => {
        if (res.code === 200) {
          this.recordData = res.data.adjustDetail
        } else {
          this.$message.error('加载失败!')
        }
        if (res.data.status === 2 || res.data.status === 3) {
          this.handleDetail = true
        } else {
          this.handleDetail = false
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
*{
    box-sizing: border-box;
}

</style>
