<template>
  <div>
    <el-card>
      <div slot="header">
        <span>基本信息</span>
      </div>
      <section class="basic">
        <el-form size="mini" label-width="100px" class="no-message">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="供应商名称">
                <el-input :value="detail.supplierName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结算账期">
                <el-input :value="type" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出账日">
                <el-input :value="detail.chargeoffDays" style="width:80%;margin-right:10px" disabled />
                <span>号</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款周期">
                <el-input style="width:80%;margin-right:10px" :value="detail.paymentCircle" disabled />
                <span>天</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
    </el-card>
    <el-card>
      <div slot="header">
        <span>操作记录</span>
      </div>
      <section class="record">
        <el-table
          :data="recordData"
          max-height="400px"
          stripe
          style="width: 100%"
          class="g-table"
          size="mini"
          border
        >
          <el-table-column
            prop="updateUserName"
            label="操作人"
            align="center"
            min-width="100"
          />
          <el-table-column
            prop="updateTime"
            label="操作时间"
            align="center"
            min-width="150"
          />
          <el-table-column
            prop="record"
            label="操作记录"
            align="center"
            min-width="300"
            show-overflow-tooltip
          />
        </el-table>
      </section>
    </el-card>
  </div>
</template>

<script>
import { getDetail } from '@/api/settlementManagement/settlementPeriod.js'
export default {
  name: 'PeriodDetails',
  props: {
    detailData: Object // 父传子的表格参数
  },
  data() {
    return {
      detail: {},
      recordData: [],
      detailType: '',
      type: '',
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
        if (this.detail.chargeoffType === 1) {
          this.type = '月结'
        } else if (this.detail.chargeoffType === 2) {
          this.type = '半月结'
        }
        this.recordData = data.supplierChargeoffHisVOList
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
