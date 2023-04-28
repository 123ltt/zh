<template>
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-form ref="formRef" :model="params" label-width="120px" size="mini" class="no-message">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="采购编码">
                <el-input :value="params.purchaseCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购方名称">
                <el-input :value="params.purchaseSquareName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称">
                <el-input :value="params.supplierName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购数量">
                <el-input :value="params.purchaseNumber " disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购人">
                <el-input :value="params.purchasePeople" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品金额">
                <el-input :value="params.goodsAmount" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购金额">
                <el-input :value="params.purchaseAmount" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物流运费">
                <el-input :value="params.logisticsFreight" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购时间">
                <el-input :value="params.purchaseTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="期望到货时间">
                <el-input :value="params.expectArrivalTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最后修改人">
                <el-input :value="params.updateUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最后修改时间">
                <el-input :value="params.updateTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划备注">
                <el-input :value="params.purchaseRemarks" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="收货人信息" name="2">
        <el-form ref="formRef" class="no-message" :model="params" label-width="120px" size="mini">
          <el-row>
            <el-col :span="8">
              <el-form-item label="收件人">
                <el-input :value="params.receiptPeople" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="固定电话">
                <el-input :value="params.phone" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="移动电话">
                <el-input :value="params.mobile" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货地址">
                <el-input :value="params.shippingAddress" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="发货明细" name="3" disabled>
        <el-card>
          <el-form ref="formRef" :model="params" label-width="120px" size="mini">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item :rules="{ required: true, message: '物流运单号不能为空', trigger: 'blur' }" prop="logisticsWaybillNumber" style="width:92%" label="物流运单号">
                  <el-input v-model="params.logisticsWaybillNumber" v-input="changeVal" type="text" style="width:100%" maxlength="30" minlength="5" placeholder="请输入5-30位的英文或数字" />
                </el-form-item>
              </el-col>
              <el-col :span="15">
                <el-form-item :rules="{ required: true, message: '物流商名称不能为空', trigger: 'blur' }" prop="lpId" style="width:50%;" label="物流商名称">
                  <g-select v-model="params.lpId" style="width:100%;" :items="logisticsProviderList" key-field="id" label-field="lpFullname" value-field="id" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table :data="params.waybillDetails" class="g-table" border stripe size="mini">
            <el-table-column prop="goodsCode" label="商品编码" align="center" min-width="100" />
            <el-table-column prop="goodsName" label="商品名称" align="center" min-width="180" show-overflow-tooltip />
            <el-table-column prop="productSku" label="产品编码" align="center" min-width="100" />
            <el-table-column prop="productName" label="产品名称" align="center" min-width="200">
              <tmeplate slot-scope="scope">
                <g-text-ellipsis :lines="2">{{ scope.row.productName }}</g-text-ellipsis>
              </tmeplate>
            </el-table-column>
            <el-table-column prop="purchaseNumber" label="采购数量" align="center" min-width="80" />
            <el-table-column prop="receivingGoodsNumber" label="收货数量" align="center" min-width="80" />
            <el-table-column prop="stayDeliveryNumber" label="待发货数量" align="center" min-width="80" />
            <el-table-column label="发货数量" align="center" min-width="100">
              <template slot-scope="slot">
                <el-input v-model="slot.row.deliveryNumber" v-input.numeric.positive size="mini" placeholder="请输入" />
              </template>
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-button size="mini" @click="$emit('close')">取 消</el-button>
            <el-button type="primary" size="mini" @click="saves">确 定</el-button>
          </div>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </basic-container>
</template>

<script>
import { detail, deliverGoods } from 'zh-pss/src/api/orderManagement/purchasingOrder'
import { logisticsProvider } from '@/api/ordermanagement/purchasingOrder'

export default {
  name: 'OrderDelivery',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      processId: '',
      activeNames: ['1', '2', '3'],
      tableData: [],
      isdelivery: false,
      logisticsProviderList: [],
      params: {}
    }
  },
  watch: {
    isDelivery(val) {
      this.isdelivery = val
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.formRef.clearValidate() // 先清空校验
    })
    this.getData(this.id)
  },
  methods: {
    changeVal(inputStr) {
      const val = inputStr.replace(/[^\w]/g, '')
      // 返回最终输入的内容
      return val
    },
    getData(id) {
      this.loading = true
      this.processId = id
      detail(id).then(res => {
        this.params = res.data
        this.params.lpId = ''
        this.loading = false
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
            deliverGoods(this.processId, this.params).then(res => {
              if (res.code === 200) {
                this.$emit('close', true)
                this.$message({
                  message: '处理成功',
                  type: 'success'
                })
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
    // background-color: #409eff;
    // color: #fff;
  }
  .biaozhi {
    color: red;
    font-size: 12px;
  }
.footer {
        text-align: right;
        //   margin-top: 30px;
        padding-top: 20px;
        }
::v-deep .el-collapse-item__header{
  padding: 0 30px;
  font-weight: 600;
  ::v-deep .el-collapse-item__arrow{
    margin: 0 auto 0 20px;
    font-weight: 600;
  }
}
</style>
