<template>
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="120px" size="mini" class="no-message">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="发货运单号：">
              <el-input :value="formData.logisticsWaybillNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购编码：" style="width:100%">
              <el-input :value="formData.purchaseCode" disabled style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购数量：">
              <el-input :value="formData.purchaseNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货人：">
              <el-input :value="formData.consignor" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货时间：">
              <el-input :value="formData.deliveryTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货数量：">
              <el-input :value="formData.deliveryNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：">
              <el-input :value="formData.logisticsStatus===1?'派送中':formData.logisticsStatus===2?'已收货':formData.logisticsStatus===3?'已退货':''" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货人：">
              <el-input :value="formData.receiptPeople" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货时间：">
              <el-input :value="formData.receiptTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货数量：">
              <el-input :value="formData.receiptNumber" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">发货明细</span>
      </div>
      <el-table :data="formData.waybillDetails" border stripe class="g-table" max-height="400px" size="mini">
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="110" />
        <el-table-column prop="productName" label="产品名称" align="center" min-width="150" show-overflow-tooltip />
        <el-table-column prop="purchaseNumber" label="采购数量" align="center" min-width="80" />
        <el-table-column prop="deliveryNumber" label="发货数量" align="center" min-width="80" />
        <el-table-column prop="receivingGoodsNumber" label="收货数量" align="center" min-width="80" />
        <el-table-column label="良品数量" align="center" min-width="80">
          <template slot-scope="slot">
            <label> {{ slot.row.receivingGoodsNumber - slot.row.rejectsNumber }}</label>
          </template>
        </el-table-column>
        <el-table-column prop="rejectsNumber" label="不良品数量" align="center" min-width="90" />
      </el-table>
    </el-card>

  </basic-container>
</template>

<script>
import { detailApi } from '@/api/orderManagement/deliveryOrder'
import { getDictBiz } from '@/api/commonApi/common'
export default {
  name: 'DeliveryDetail',
  props: {
    id: String
  },
  data() {
    return {
      statusList: [],
      detailShow: false,
      loading: false,
      formData: {
        waybillDetails: [],
        logisticsWaybillNumber: '', // 物流运单号
        purchaseCode: '', // 采购编码
        purchaseNumber: '', // 采购数量
        consignor: '', // 发货人
        logisticsStatus: '', // 状态
        deliveryTime: '', // 发货时间
        deliveryNumber: '', // 发货数量
        receiptPeople: '', // 收货人
        receiptTime: '', // 收货时间
        receiptNumber: '' // 收货数量
      }

    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(id) {
      this.loading = true
      detailApi(id).then(res => {
        this.formData = res.data
        this.loading = false
      })
        .catch(err => {
          console.log(err)
        })
      this.getDictBiz('pss_logistics_status')
    },
    getDictBiz(val) {
      getDictBiz(val).then(res => {
        if (res.code === 200) {
          const data = res.data
          if (val === 'pss_logistics_status') {
            this.statusList = data
          }
        } else {
          this.$message.error('获取业务字典数据失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mainHeader {
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  font-weight: 600;
  // background-color: #409eff;
  // color: #fff;
}
</style>
