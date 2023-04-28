<template>
  <div v-loading="loading">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form size="small" label-width="auto" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="原币种">
              <el-input :value="detail.origCurrName+detail.origCurrCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标币">
              <el-input :value="detail.trgtCurrName+detail.trgtCurrCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最新汇率">
              <el-input :value="detail.latestRate" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="涨跌">
              <el-input :value="detail.upDown" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">操作记录</span>
      </div>
      <el-table
        :data="recordData"
        max-height="400px"
        stripe
        class="g-table"
        size="small"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="updateUserName"
          label="操作人"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="floatingRate"
          label="浮动汇率"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="effectiveDate"
          label="生效时间"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="updateTime"
          label="操作时间"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="opRecord"
          label="操作记录"
          show-overflow-tooltip
          align="center"
        />
      </el-table>
    </el-card>

  </div>
</template>

<script>
import { getDetail } from '@/api/floatRate.js'
export default {
  name: 'FloatRateDetails',
  props: {
    // rulesType: Array,
    detailData: Object // 父传子的表格参数
  },
  data() {
    return {
      detail: {},
      recordData: [],
      detailType: '',
      loading: false
    }
  },
  mounted() {
    this.getData(this.detailData.id, this.detailData.origCurrCode, this.detailData.trgtCurrCode)
  },
  methods: {
    getData(val1, val2, val3) {
      this.loading = true
      getDetail(val1, val2, val3).then(res => {
        console.log(1111)
        console.log(val1)
        console.log(val2)
        console.log(val3)
        if (res.code === 200) {
          const data = res.data
          console.log(data, 111111)
          this.detail = data
          this.recordData = data.floatingRateHisVOList
          this.loading = false
        } else {
          this.loading = false
          this.$message.error('加载失败!')
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  *{
    box-sizing: border-box;
  }
  .closeBtn {
    cursor: pointer;
    &:hover{
      color: #409eff;
    }
    i {
      size: 16px;
    }
  }
  .cardBox{
    ::v-deep .el-card__body{
      padding-bottom: 0;
    }
  }
</style>
