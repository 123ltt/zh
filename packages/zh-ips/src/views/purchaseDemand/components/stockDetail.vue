<template>
  <!-- 备货采购详情 -->
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-form size="mini" label-width="120px" class="no-message">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="需求编码">
                <el-input :value="detail.rqmtCode" disabled />
              </el-form-item>
            </el-col>
            <el-col v-if="!isSaas" :span="8">
              <el-form-item label="需求方货权">
                <el-input :value="detail.productAuthName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求方货主">
                <el-input :value="detail.demander" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求人">
                <el-input :value="detail.rqmtUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求数量">
                <el-input :value="detail.rqmtTotalQty" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="目的仓库">
                <el-input :value="detail.destWarehouse" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求时间">
                <el-input :value="detail.createTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="需求产品审核" name="2">
        <el-form v-if="!audit" size="mini" label-width="120px">
          <el-row v-if="!isSaas" :gutter="20">
            <el-col :span="8">
              <el-form-item label="审核人">
                <el-input :value="openData.updateUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审核时间">
                <el-input :value="openData.updateTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="recordData" size="mini" max-height="400px" stripe style="width: 100%" border :header-cell-style="{background:'#fff'}" class="g-table">
          <el-table-column prop="productSku" label="产品编码" align="center" min-width="100" />
          <el-table-column prop="productImg" label="产品图片" align="center" width="70">
            <template slot-scope="scope">
              <g-thumb class="d-table-cell" :url="scope.row.productImg" />
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" align="center" min-width="130" show-overflow-tooltip />
          <el-table-column prop="category" label="产品类目" align="center" min-width="100" show-overflow-tooltip />
          <el-table-column align="center">
            <template slot="header">
              <el-select v-model="situation" size="mini">
                <el-option v-for="item in situationList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </template>
            <el-table-column label="产品销量-月/周/48小时" width="110" align="center">
              <template slot-scope="scope">
                <div v-if="situation == 1">
                  <span>{{ scope.row.monthlyDiff>0?'+'+ scope.row.monthlyDiff: scope.row.monthlyDiff }}</span> /
                  <span>{{ scope.row.weeklyDiff>0?'+'+ scope.row.weeklyDiff: scope.row.weeklyDiff }}</span> /
                  <span>{{ scope.row.twoDaysDiff>0?'+'+ scope.row.twoDaysDiff: scope.row.twoDaysDiff }}</span>
                </div>
                <div v-if="situation == 2">
                  <span>{{ scope.row.monthlyActual }}</span> /
                  <span>{{ scope.row.weeklyActual }}</span> /
                  <span>{{ scope.row.twoDaysActual }}</span>
                </div>
                <div v-if="situation == 3">
                  <span>{{ scope.row.monthlyRule }}</span> /
                  <span>{{ scope.row.weeklyRule }}</span> /
                  <span>{{ scope.row.twoDaysRule }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="日均销量-前4周/3周/2周/1周" width="110" align="center">
              <template slot-scope="scope">
                <div v-if="situation == 1">
                  <span>{{ scope.row.dlyInLst4WkAvgDiff>0?'+'+ scope.row.dlyInLst4WkAvgDiff: scope.row.dlyInLst4WkAvgDiff }}</span> /
                  <span>{{ scope.row.dlyInLst3WkAvgDiff>0?'+'+ scope.row.dlyInLst3WkAvgDiff: scope.row.dlyInLst3WkAvgDiff }}</span> /
                  <span>{{ scope.row.dlyInLst2WkAvgDiff>0?'+'+ scope.row.dlyInLst2WkAvgDiff: scope.row.dlyInLst2WkAvgDiff }}</span> /
                  <span>{{ scope.row.dlyInLst1WkAvgDiff>0?'+'+ scope.row.dlyInLst1WkAvgDiff: scope.row.dlyInLst1WkAvgDiff }}</span>
                </div>
                <div v-if="situation == 2">
                  <span>{{ scope.row.dlyInLst4WkAvgActual }}</span> /
                  <span>{{ scope.row.dlyInLst3WkAvgActual }}</span> /
                  <span>{{ scope.row.dlyInLst2WkAvgActual }}</span> /
                  <span>{{ scope.row.dlyInLst1WkAvgActual }}</span>
                </div>
                <div v-if="situation == 3">
                  <span>{{ scope.row.dlyInLst4WkAvgRule }}</span> /
                  <span>{{ scope.row.dlyInLst3WkAvgRule }}</span> /
                  <span>{{ scope.row.dlyInLst2WkAvgRule }}</span> /
                  <span>{{ scope.row.dlyInLst1WkAvgRule }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="本地-采购中/在途/可用/备用" width="110" align="center">
              <template slot-scope="scope">
                <div v-if="situation == 1">
                  <span>{{ scope.row.localProcurementInvDiff>0?'+'+ scope.row.localProcurementInvDiff: scope.row.localProcurementInvDiff }}</span> /
                  <span>{{ scope.row.localTransitInvDiff>0?'+'+ scope.row.localTransitInvDiff: scope.row.localTransitInvDiff }}</span> /
                  <span>{{ scope.row.localAvailableInvDiff>0?'+'+ scope.row.localAvailableInvDiff: scope.row.localAvailableInvDiff }}</span> /
                  <span>{{ scope.row.localReserveInvDiff>0?'+'+ scope.row.localReserveInvDiff: scope.row.localReserveInvDiff }}</span>
                </div>
                <div v-if="situation == 2">
                  <span>{{ scope.row.localProcurementInvActual }}</span> /
                  <span>{{ scope.row.localTransitInvActual }}</span> /
                  <span>{{ scope.row.localAvailableInvActual }}</span> /
                  <span>{{ scope.row.localReserveInvActual }}</span>
                </div>
                <div v-if="situation == 3">
                  <span>{{ scope.row.localProcurementInvRule }}</span> /
                  <span>{{ scope.row.localTransitInvRule }}</span> /
                  <span>{{ scope.row.localAvailableInvRule }}</span> /
                  <span>{{ scope.row.localReserveInvRule }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="海外-采购中/在途/可用/备用" width="110" align="center">
              <template slot-scope="scope">
                <div v-if="situation == 1">
                  <span>{{ scope.row.overseaProcurementInvDiff>0?'+'+ scope.row.overseaProcurementInvDiff: scope.row.overseaProcurementInvDiff }}</span> /
                  <span>{{ scope.row.overseaTransitInvDiff>0?'+'+ scope.row.overseaTransitInvDiff: scope.row.overseaTransitInvDiff }}</span> /
                  <span>{{ scope.row.overseaAvailableInvDiff>0?'+'+ scope.row.overseaAvailableInvDiff: scope.row.overseaAvailableInvDiff }}</span> /
                  <span>{{ scope.row.overseaReserveInvDiff>0?'+'+ scope.row.overseaReserveInvDiff: scope.row.overseaReserveInvDiff }}</span>
                </div>
                <div v-if="situation == 2">
                  <span>{{ scope.row.overseaProcurementInvActual }}</span> /
                  <span>{{ scope.row.overseaTransitInvActual }}</span> /
                  <span>{{ scope.row.overseaAvailableInvActual }}</span> /
                  <span>{{ scope.row.overseaReserveInvActual }}</span>
                </div>
                <div v-if="situation == 3">
                  <span>{{ scope.row.overseaProcurementInvRule }}</span> /
                  <span>{{ scope.row.overseaTransitInvRule }}</span> /
                  <span>{{ scope.row.overseaAvailableInvRule }}</span> /
                  <span>{{ scope.row.overseaReserveInvRule }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="全部库存" width="80" align="center">
              <template slot-scope="scope">
                <span v-if="situation == 1">{{ scope.row.allInvActualDiff>0?'+'+ scope.row.allInvActualDiff: scope.row.allInvActualDiff }}</span>
                <span v-if="situation == 2">{{ scope.row.allInvActual }}</span>
                <span v-if="situation == 3">{{ scope.row.allInvRule }}</span>
              </template>
            </el-table-column>
            <el-table-column label="月周转天数" width="80" align="center">
              <template slot-scope="scope">
                <span v-if="situation == 1">{{ scope.row.monthlyTurnoverDaysDiff>0?'+'+ scope.row.monthlyTurnoverDaysDiff: scope.row.monthlyTurnoverDaysDiff }}</span>
                <span v-if="situation == 2">{{ scope.row.monthlyTurnoverDaysActual }}</span>
                <span v-if="situation == 3">{{ scope.row.monthlyTurnoverDaysRule }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="rqmtQty" label="需求数量" align="center" min-width="55" fixed="right" />
          <el-table-column prop="proposedQty" label="建议数量" align="center" min-width="55" fixed="right" />
          <el-table-column prop="status" fixed="right" label="采购意见" align="center" min-width="110">
            <template slot-scope="scope">
              <el-select v-model="scope.row.status" size="mini" :disabled="!audit">
                <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="采购数量" align="center" min-width="90">
            <template slot-scope="scope">
              <el-input v-if="scope.row.status === 1" v-model="scope.row.purchaseQty" v-input.numeric.positive :disabled="!audit" clearable size="mini" />
              <el-input v-else v-model="fixedVal" disabled size="mini" />
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" min-width="120" fixed="right">
            <template slot-scope="scope">
              <el-input v-model="scope.row.rqmtComment" :disabled="!audit" clearable size="mini" :placeholder="audit?'拒绝备注必填':''" />
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <div v-if="audit" class="footer">
      <el-button size="mini" type="primary" @click="$emit('close')">取消</el-button>
      <el-button size="mini" type="primary" @click="saveData">确认</el-button>
    </div>
  </basic-container>
</template>

<script>

import { getDetail, getVerifyDetail, verify } from '@/api/purchaseDemand/stock.js'

export default {
  name: 'SalesRulesDetail',
  props: {
    audit: Boolean,
    isSaas: Boolean,
    openData: Object
  },
  data() {
    return {
      detail: {},
      recordData: [],
      loading: false,
      statusList: [
        { id: 1, name: '同意采购' },
        { id: 2, name: '拒绝采购' }
      ],
      situation: '',
      situationList: [
        { id: 1, name: '偏差' },
        { id: 2, name: '实际数量' },
        { id: 3, name: '规则数量' }
      ],
      fixedVal: 0,
      activeNames: ['1', '2']
    }
  },
  mounted() {
    this.getData(this.openData.id)
    this.situation = 1
  },
  methods: {
    getData(val) {
      this.loading = true
      if (this.audit) {
        getVerifyDetail(val).then(res => {
          const data = res.data
          this.detail = data
          this.recordData = data.requirementDetailVOList
          this.loading = false
        })
      } else {
        getDetail(val).then(res => {
          const data = res.data
          this.detail = data
          this.recordData = data.requirementDetailVOList
          this.recordData.forEach(item => {
            if (item.status === -1) {
              item.status = ''
            }
          })
          this.loading = false
        })
      }
    },
    saveData() {
      // eslint-disable-next-line no-unused-vars
      let isOk = true
      this.recordData.forEach(item => {
        if (item.status === 2) {
          if (item.rqmtComment === '') {
            this.$message.error('请填写对应的拒绝备注！')
            isOk = false
          }
        } else if (item.status === 1) {
          if (item.purchaseQty <= 0) {
            this.$message.error('请填写正确的采购数量！')
            isOk = false
          } else if (item.rqmtQty < item.purchaseQty) {
            this.$message.error('采购数量不能大于需求数量！')
            isOk = false
          }
        }
      })
      if (isOk) {
        const obj = {
          rqmtId: this.openData.id,
          rqmtType: this.openData.rqmtType,
          requirementDetailDTOList: this.recordData
        }
        verify(obj).then(res => {
          this.$emit('close', true)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }
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
::v-deep .el-collapse-item__content {
  padding-bottom: 0;
}

.caozuo{
  ::v-deep .el-table td, .el-table th{
    padding: 5px 0;
  }
}
.footer{
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
::v-deep .el-table th, .el-table td{
  padding: 2px 0;
}
</style>
