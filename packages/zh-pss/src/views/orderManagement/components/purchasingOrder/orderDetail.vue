<template>
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-card>
          <el-form label-width="100px" size="mini" class="no-message">
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
                  <el-input :value="params.purchaseNumber" disabled />
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
      <el-collapse-item title="采购明细" name="2">
        <el-card>
          <el-table :data="params.purchaseDetails" border stripe max-height="400px" class="g-table" size="mini">
            <el-table-column prop="productSku" label="产品编码" align="center" min-width="110" />
            <el-table-column prop="productName" label="产品名称" align="center" min-width="150" show-overflow-tooltip />
            <el-table-column prop="goodsCode" label="商品编码" align="center" min-width="110" />
            <el-table-column prop="goodsName" label="商品名称" align="center" min-width="150" show-overflow-tooltip />
            <el-table-column prop="purchaseNumber" label="采购数量" align="center" min-width="80" />
            <el-table-column prop="purchasePrice" label="采购单价" align="center" min-width="80" />
            <el-table-column prop="purchaseAmount" label="商品金额" align="center" min-width="80" />
          </el-table>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="收货人信息" name="3">
        <el-card>
          <el-form label-width="100px" size="mini" class="no-message">
            <el-row :gutter="10">
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
      <el-collapse-item v-if="handleDetail" title="采购处理" name="4">
        <el-card>
          <el-form label-width="100px" size="mini" class="no-message">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="供货意愿：">
                  <el-input :value="params.supplyIntention===1?'同意供货':''" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供货方式：">
                  <el-input :value="params.supplyWay===1?'分批供货':params.supplyWay===2?'全部供货':''" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供货备注：">
                  <el-input :value="params.supplyRemarks" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="处理人：">
                  <el-input :value="params.handlePeople" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="处理时间：">
                  <el-input :value="params.handleTime" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购生效时间：">
                  <el-input :value="params.purchaseEffectiveTime" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="采购合同：">
                  <el-link size="mini" type="primary" :href="params.purchaseContract">采购供货合同.pdf</el-link>
                  <!-- <span style="color:blue;cursor:pointer" @click="download">采购供货合同.pdf</span> -->
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预计发货时间：">
                  <el-input :value="params.estimatedDeliveryTime" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="预计到货时间：">
                  <el-input :value="params.estimatedArrivalTime" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item v-if="supplyDetail" title="供货明细" name="5">
        <el-card>
          <el-table :data="params.supplyDetails" border stripe max-height="400px" class="g-table">
            <el-table-column prop="logisticsWaybillNumber" label="物流运单号" align="center" min-width="110" />
            <el-table-column prop="lpName" label="物流商名称" align="center" min-width="150" show-overflow-tooltip />
            <el-table-column prop="consignor" label="发货人" align="center" min-width="100" />
            <el-table-column prop="deliveryTime" label="发货时间" align="center" min-width="135" />
            <el-table-column prop="deliveryNumber" label="发货数量" align="center" min-width="80" />
            <el-table-column prop="logisticsStatus" label="物流状态" align="center" min-width="90">
              <template slot-scope="slot">
                <div v-for="item in logisticsStatusList" :key="item.dictKey">
                  <span v-if="slot.row.logisticsStatus == item.dictKey">{{ item.dictValue }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="receiptPeople" label="收货人" align="center" min-width="90" />
            <el-table-column prop="receiptNumber" label="收货数量" align="center" min-width="80" />
            <el-table-column label="良品数量" align="center" min-width="80">
              <template slot-scope="slot">
                <label> {{ slot.row.receiptNumber - slot.row.rejectsNumber }}</label>
              </template>
            </el-table-column>
            <el-table-column prop="rejectsNumber" label="不良品数量" align="center" min-width="80" />
            <el-table-column prop="receiptTime" label="收货时间" align="center" min-width="135" />
            <el-table-column label="操作" align="center" fixed="right" min-width="80">
              <template slot-scope="slot">
                <el-button type="text" @click="pageChange(slot.row.id)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-collapse-item>
    </el-collapse>

  </basic-container>
</template>

<script>
import smallDetail from './smallDetail'
import { mapGetters } from 'vuex'
import { detail } from '@/api/orderManagement/purchasingOrder'
import { getDictBiz } from '@/api/commonApi/common.js'

export default {
  name: 'OrderDetail',
  props: {
    id: String
  },
  data() {
    return {
      isdetail: false,
      loading: false,
      isSmall: false,
      tableData: [],
      activeNames: ['1', '2', '3', '4', '5'],
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
        supplyIntention: '',
        supplyDetails: [], // 表单数据
        purchaseDetails: [], // 表单数据
        supplyWay: '', // 供货方式
        supplyRemarks: '', // 供货备注
        handlePeople: '', // 处理人
        handleTime: '', // 处理时间
        purchaseContract: '', // 采购合同
        estimatedDeliveryTime: '', // 预计发货时间
        estimatedArrivalTime: '' // 预计到货时间
      },
      handleDetail: false,
      supplyDetail: false,
      supplyIntentionList: [], // 供货意愿
      supplyWayList: [], // 供货方式
      logisticsStatusList: [] // 物流状态
    }
  },
  computed: {
    ...mapGetters(['menu', 'website'])
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(id) {
      this.loading = true
      detail(id).then(res => {
        this.params = res.data
        const status = Number(res.data.status)
        if ([2, 3, 4, 5, 6, 7, 8].indexOf(status) > -1) {
          this.handleDetail = true
          if ([4, 5, 6, 7, 8].indexOf(status) > -1) {
            this.supplyDetail = true
          } else {
            this.supplyDetail = false
          }
        } else {
          this.supplyDetail = false
          this.handleDetail = false
        }
        this.loading = false
      })
      this.getDictBiz('pss_supply_intention')
      this.getDictBiz('pss_supplier_supply_way')
      this.getDictBiz('pss_logistics_status')
    },
    getDictBiz(val) {
      getDictBiz(val).then(res => {
        if (res.code === 200) {
          const data = res.data
          if (val === 'pss_supply_intention') {
            this.supplyIntentionList = data
          }
          if (val === 'pss_supplier_supply_way') {
            this.supplyWayList = data
          }
          if (val === 'pss_logistics_status') {
            this.logisticsStatusList = data
          }
        } else {
          this.$message.error('获取业务字典数据失败')
        }
      })
    },
    smallCancel() {
      this.isSmall = false
    },
    download() {
      window.open(`${this.params.purchaseContract}`, '_blank')
    },
    pageChange(id) {
      this.$modal({
        title: '发货订单详情',
        component: smallDetail,
        data: { id },
        callback: () => {}
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
