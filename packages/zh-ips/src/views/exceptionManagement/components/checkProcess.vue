
<template>
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-form label-width="140px" size="mini" :model="params" class="no-message">
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
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="供应商质检确认信息" name="2">
        <el-form label-width="140px" size="mini" :model="params" class="no-message">
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
        <el-table :data="params.orderAbnormalDetailVOList" border stripe>
          <el-table-column prop="productSku" label="产品编码" align="center" min-width="90" />
          <el-table-column prop="productName" label="产品名称" align="center" min-width="90" />
          <el-table-column prop="receiveQty" label="收货数量" align="center" min-width="90" />
          <el-table-column prop="rejectQty" label="不良品数量" align="center" min-width="90" />
          <el-table-column prop="upFrameQty" label="上架数量" align="center" min-width="90" />
          <el-table-column prop="rejectsPicUrl" label="不良品图片" align="center" width="90">
            <template slot-scope="slot">
              <g-thumb class="d-table-cell" :url="slot.row.rejectsPicUrl?slot.row.rejectsPicUrl:''" />
            </template>
          </el-table-column>
          <el-table-column prop="abnormalRemark" label="不良品说明" align="center" min-width="90" />
        </el-table>
      </el-collapse-item>

      <el-collapse-item title="不良品处理" name="4">
        <el-form label-width="140px" size="mini" :model="sumbit">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item prop="handleSuggestion">
                <span slot="label"><span class="redStar">* </span>处理意见</span>
                <el-radio-group v-model="sumbit.handleSuggestion">
                  <el-radio v-for="item in handleList" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="abnormalHandle">
                <span slot="label"><span class="redStar">* </span>不良品处理</span>
                <el-radio-group v-model="sumbit.abnormalHandle">
                  <el-radio v-for="item in abnormalList" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item v-if="sumbit.abnormalHandle==1" prop="returnAddress">
                <span slot="label"><span class="redStar">* </span>退货地址</span>
                <el-radio-group v-model="sumbit.returnAddress">
                  <el-radio v-for="item in addressList" :key="item.id" :label="item.id" class="address">
                    <div>
                      <p>
                        <span style="color:red;">{{ item.isDefault == 0?'默认  ':'' }}</span>
                        <span>{{ item.returnRecipient }}, </span>
                        <span>{{ item.phoneNumber }}</span>
                        <span v-if="item.telCode != ''"> / {{ item.telCode }} - {{ item.telNumber }}</span>
                      </p>
                      <p>
                        <span>{{ item.countryName }}{{ item.provinceName }}{{ item.cityName }}{{ item.returnAddress }}</span>
                      </p>
                    </div>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item prop="remark" label="备注">
                <el-input v-model="sumbit.remark" type="textarea" style="width:100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <div style="text-align:right">
            <el-button size="mini" @click="$emit('close')">关 闭</el-button>
            <el-button size="mini" type="primary" @click="refresh">确 定</el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>

  </basic-container>
</template>
<script>
import { detail, update } from '@/api/exceptionManagement/checkFail'
import { dictionary } from '@/api/commonApi'
export default {
  props: {
    checkData: Object
  },
  data() {
    return {
      loading: false,
      params: {},
      addressList: [],
      sumbit: {
        handleSuggestion: '',
        abnormalHandle: '',
        remark: '',
        returnAddress: ''
      },
      handleList: [],
      abnormalList: [],
      returnAddress: {},
      activeNames: ['1', '2', '3', '4'],
      isShow: false
    }
  },
  mounted() {
    this.showProcess(this.checkData.id)
    this.getDictionary()
  },
  methods: {
    async getDictionary() {
      let str = ''
      if (+this.checkData.abnormalType === 1) {
        str = 'ips_handle_suggestion_status'
      } else if (+this.checkData.abnormalType === 2) {
        str = 'ips_in_wms_handle_suggestion_status'
      }
      await dictionary(str).then(res => {
        this.handleList = res.data
      })
      await dictionary('ips_handle_abnormal_status').then(res => {
        this.abnormalList = res.data
      })
    },
    refresh() {
      if (this.sumbit.handleSuggestion === '' || this.sumbit.abnormalHandle === '') {
        this.$message.error('请选择必选项！')
      } else if (this.sumbit.abnormalHandle === '1' && this.sumbit.returnAddress === '') {
        this.$message.error('请选择退货地址！')
      } else {
        this.params.supplierReturnId = this.sumbit.returnAddress
        this.params.handleSuggestion = this.sumbit.handleSuggestion
        this.params.abnormalHandle = this.sumbit.abnormalHandle
        this.params.remark = this.sumbit.remark
        update(this.params).then(res => {
          this.$emit('close', true)
          this.$message({
            message: res.msg,
            type: 'success'
          })
        })
      }
    },
    showProcess(id) {
      this.loading = true
      detail(id).then(res => {
        this.params = res.data
        this.addressList = this.params.supplierReturnAddressVOList
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
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
*{
  box-sizing: border-box;
}
.redStar{
  color: red;
}
.address{
  display: flex!important;
  align-items: center;
  margin-bottom: 10px;
  p{
    margin: 0;
    margin-bottom: 5px;
  }
}
</style>
