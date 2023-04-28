<template>
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-card>
          <el-form ref="formRef" :model="params" label-width="120px" size="mini" class="no-message">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="采购编码：">
                  <el-input :value="params.purchaseCode" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购方名称：">
                  <el-input :value="params.purchaseSquareName" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商名称：">
                  <el-input :value="params.supplierName" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购数量：">
                  <el-input :value="params.purchaseNumber " disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购人：">
                  <el-input :value="params.purchasePeople" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="物流运费：">
                  <el-input :value="params.logisticsFreight" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品金额：">
                  <el-input :value="params.goodsAmount" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购金额：">
                  <el-input :value="params.purchaseAmount" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购时间：">
                  <el-input :value="params.purchaseTime" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="期望到货时间：">
                  <el-input :value="params.expectArrivalTime" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="收货人信息" name="2">
        <el-card>
          <el-form ref="formRef" :model="params" label-width="120px" size="mini" class="no-message">
            <el-row>
              <el-col :span="8">
                <el-form-item label="收件人：">
                  <el-input :value="params.receiptPeople" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="固定电话：">
                  <el-input :value="params.phone" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="移动电话：">
                  <el-input :value="params.mobile" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="收货地址：">
                  <el-input :value="params.shippingAddress" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="发货明细" name="3" disabled>
        <el-card>
          <el-form ref="formRef" :model="params" label-width="120px" size="mini" class="no-message">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'blur' }" prop="logisticsWaybillNumber" style="width:92%" label="物流运单号：">
                  <el-input v-model="params.logisticsWaybillNumber" type="text" style="width:100%" />
                </el-form-item>
              </el-col>
              <el-col :span="15">
                <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'change' }" prop="lpId" style="width:50%;display:inline-block" label="物流商名称：">
                  <el-select v-model="params.lpId" placeholder="请选择" filterable clearable style="width:100%">
                    <el-option v-for="(item,index) in logisticsProviderList" :key="index" :value="item.id" :label="item.lpFullname" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table :data="params.waybillDetails" border stripe size="mini" class="g-table" max-height="400px">
            <el-table-column prop="goodsCode" label="商品编码" align="center" min-width="110" />
            <el-table-column prop="goodsName" label="商品名称" align="center" min-width="150" show-overflow-tooltip />
            <el-table-column prop="productSku" label="产品编码" align="center" min-width="110" />
            <el-table-column prop="productName" label="产品名称" align="center" min-width="150" show-overflow-tooltip />
            <el-table-column prop="purchaseNumber" label="采购数量" align="center" />
            <el-table-column prop="receivingGoodsNumber" label="收货数量" align="center" min-width="80" />
            <el-table-column label="良品数量" align="center" min-width="80">
              <template slot-scope="slot">
                <label> {{ slot.row.receivingGoodsNumber - slot.row.rejectsNumber }}</label>
              </template>
            </el-table-column>
            <el-table-column prop="rejectsNumber" label="不良品数量" align="center" min-width="90" />
            <el-table-column prop="stayDeliveryNumber" label="待发货数量" align="center" min-width="90" />
            <el-table-column label="发货数量" align="center" min-width="110">
              <template slot-scope="slot">
                <el-input v-model="slot.row.deliveryNumber" v-input.numeric.positive placeholder="请输入" size="mini" />
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align:right;margin:10px">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button type="primary" size="mini" @click="saves">确 定</el-button>
          </div>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </basic-container>
</template>

<script>
import { detailByPurCode, deliverGoods, logisticsProvider } from '@/api/orderManagement/purchasingOrder'
export default {
  props: {
    purchaseCode: String
  },
  data() {
    return {
      activeNames: ['1', '2', '3'],
      processId: '',
      tableData: [],
      isdelivery: false,
      logisticsProviderList: [],
      params: {
        purchaseCode: '', // 采购编码
        purchaseSquareName: '', // 采购方名称
        supplierName: '', // 供应商名称
        purchaseNumber: '', // 采购数量
        purchasePeople: '', // 采购人
        purchaseAmount: '', // 采购金额
        purchaseEffectiveTime: '', // 采购生效时间
        expectArrivalTime: '', // 期望到货时间
        receiptPeople: '', // 收件人
        phone: '', // 固定电话
        mobile: '', // 移动电话
        shippingAddress: '', // 收货地址
        waybillDetails: [], // 表单值
        supplyDetails: [],
        logisticsWaybillNumber: '', // 物流单号
        lpId: '', // 物流商
        supplyIntention: '', // 供货意愿
        supplyWay: '', // 供货方式
        estimatedDeliveryTime: '', // 预计发货时间
        estimatedArrivalTime: '', // 预计到货时间
        supplyRemarks: '' // 供货备注
      }
    }
  },
  watch: {
    isDelivery(val) {
      this.isdelivery = val
    }
  },
  mounted() {
    this.getData(this.purchaseCode)
  },
  methods: {
    getSlot(data) {
    },
    getData(purchaseCode) {
      this.purchaseCode = purchaseCode
      detailByPurCode(purchaseCode).then(res => {
        this.params = res.data
        this.params.lpId = ''
      })
      logisticsProvider().then(res => {
        this.logisticsProviderList = res.data
      })
    },
    cancel() {
      this.$emit('close', true)
    },
    saves() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          if (this.validation(this.params)) {
            this.loading = true
            deliverGoods(this.processId, this.params).then(res => {
              if (res.code === 200) {
                this.loading = false
                this.$message({
                  message: '处理成功',
                  type: 'success'
                })
                this.cancel()
                this.params = {}
              }
            })
          }
        }
      })
    },
    // 验证
    validation(val) {
      for (let i = 0; i < val.waybillDetails.length; i++) {
        const num = i + 1
        if (val.waybillDetails[i].deliveryNumber === '' || val.waybillDetails[i].deliveryNumber === 0) {
          this.$message.error('请填写第' + num + '行的发货数量！')
          return false
        }
        if (!/^[1-9]\d*$/.test(val.waybillDetails[i].deliveryNumber)) {
          this.$message.error('第' + num + '行的发货数量必须是正整数！')
          return false
        }
      }
      return true
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
}
::v-deep .el-collapse-item__header{
  padding: 0 30px;
  font-weight: 600;
  ::v-deep .el-collapse-item__arrow{
    margin: 0 auto 0 20px;
    font-weight: 600;
  }
}
.biaozhi {
  color: red;
  font-size: 12px;
}
</style>
