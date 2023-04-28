<template>
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-form label-width="100px" size="mini" :model="params" class="no-message">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="异常编码">
                <el-input :value="params.abnormalCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入库编码">
                <el-input :value="params.warehousingCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物流运单号">
                <el-input :value="params.logisticsCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购编码">
                <el-input :value="params.purCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称">
                <el-input :value="params.supplierName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货数量">
                <el-input :value="params.receiveQty" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="不良品数量">
                <el-input :value="params.rejectQty" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上架数量">
                <el-input :value="params.upFrameQty" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="质检人">
                <el-input :value="params.inspectPeople" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="质检时间">
                <el-input :value="params.inspectTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="质检结果">
                <el-input :value="params.verifyResultValue" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="供应商质检确认信息" name="2">
        <el-form label-width="100px" size="mini" :model="params" class="no-message">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="处理结果">
                <el-input :value="params.verifyResultValue" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货物处理">
                <el-input :value="params.cargoHandleValue" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运费承担方">
                <el-input :value="params.undertakerValue" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商备注">
                <el-input :value="params.inspectComment" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="不良品明细" name="3">
        <el-table :data="params.orderAbnormalDetailVOList" border stripe class="g-table">
          <el-table-column prop="productSku" label="产品编码" align="center" min-width="90" />
          <el-table-column prop="productName" label="产品名称" align="center" min-width="90" show-overflow-tooltip />
          <el-table-column prop="receiveQty" label="收货数量" align="center" min-width="90" />
          <el-table-column prop="rejectQty" label="不良品数量" align="center" min-width="90" />
          <el-table-column prop="upFrameQty" label="上架数量" align="center" min-width="90" />
          <el-table-column prop="rejectsPicUrl" label="不良品图片" align="center" width="95">
            <template slot-scope="slot">
              <g-thumb class="d-table-cell" :url="slot.row.rejectsPicUrl?slot.row.rejectsPicUrl:''" />
            </template>
          </el-table-column>
          <el-table-column prop="abnormalRemark" label="不良品说明" align="center" min-width="90" />
        </el-table>
      </el-collapse-item>
      <el-collapse-item v-if="detailData.status === 3" title="不良品处理" name="4">
        <el-form label-width="140px" size="mini" :model="params" class="no-message">
          <el-row>
            <el-col :span="8">
              <el-form-item label="处理人">
                <el-input :value="params.handlePeople" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="处理时间">
                <el-input :value="params.updateTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="处理意见">
                <el-input :value="newhandleSuggestion" disabled />
              </el-form-item>
            </el-col>
            <el-col v-if="params.abnormalHandle == 1" :span="16">
              <el-form-item label="退货地址">
                <div>
                  <p>
                    <span>{{ returnAddress.returnRecipient }}, </span>
                    <span>{{ returnAddress.phoneNumber }}</span>
                    <span v-if="returnAddress.telCode != ''"> / {{ returnAddress.telCode }} - {{ returnAddress.telNumber }}</span>
                  </p>
                  <p>
                    <span>{{ returnAddress.countryName }}{{ returnAddress.provinceName }}{{ returnAddress.cityName }}{{ returnAddress.returnAddress }}</span>
                  </p>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="不良品处理">
                <el-input :value="newabnormalHandle" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="备注">
                <el-input :value="params.remark" disabled type="textarea" :rows="2" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>

  </basic-container>

</template>
<script>
import { dictionary } from '@/api/commonApi'
import { detail } from '@/api/exceptionManagement/checkFail'
export default {
  props: {
    detailData: Object
  },
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      params: {},
      returnAddress: {},
      newhandleSuggestion: '',
      newabnormalHandle: '',
      handleAfterList: [],
      handleBeforeList: [],
      abnormalList: [],
      loading: false
    }
  },
  mounted() {
    this.getList()
    this.getData()
  },
  methods: {
    getList() {
      dictionary('ips_in_wms_handle_suggestion_status').then(res => {
        this.handleAfterList = res.data
      })
      dictionary('ips_handle_suggestion_status').then(res => {
        this.handleBeforeList = res.data
      })
      dictionary('ips_handle_abnormal_status').then(res => {
        this.abnormalList = res.data
      })
    },
    getData() {
      this.loading = true
      detail(this.detailData.id).then(res => {
        this.params = res.data
        if (+this.detailData.abnormalType === 1) {
          this.handleBeforeList.forEach(item => {
            if (item.dictKey === (this.params.handleSuggestion + '')) {
              this.newhandleSuggestion = item.dictValue
            }
          })
        } else if (+this.detailData.abnormalType === 2) {
          this.handleAfterList.forEach(item => {
            if (item.dictKey === (this.params.handleSuggestion + '')) {
              this.newhandleSuggestion = item.dictValue
            }
          })
        }

        this.abnormalList.forEach(item => {
          if (item.dictKey === (this.params.abnormalHandle + '')) {
            this.newabnormalHandle = item.dictValue
          }
        })
        this.params.supplierReturnAddressVOList.forEach(item => {
          if (item.id === (this.params.supplierReturnId + '')) {
            this.returnAddress = item
          }
        })
        this.loading = false
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
  p{
    margin: 0;
    margin-bottom: 5px;
  }
</style>
