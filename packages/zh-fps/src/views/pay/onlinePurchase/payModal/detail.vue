<template>
  <basic-container>
    <el-row>
      <el-col v-for="(items,index) in detailRow1" :key="index">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <g-list-group v-for="(item,i) in items" :key="i" :cols="4" :label-width="index===0?'80px':'90px'">
            <g-list-group-item v-for="(e,j) in item" :key="j" :label="e.label">
              <g-text-ellipsis>{{ basicInfoList[e.prop] }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>采购明细</span>
        </div>
        <el-table
          v-if="name=='unimprest'"
          :data="purchaseDetailList"
          border
          style="width: 100%"
          :cell-style="{'text-align':'center'}"
          class="g-table"
          :header-cell-style="{'text-align':'center'}"
        >

          <el-table-column
            label="产品图片"
          >
            <template v-slot="scope">
              <img :src="scope.row.productUrl" alt="" min-width="70" height="70">
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in purchaseCol2"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
          />

        </el-table>

        <el-table
          v-else
          :data="purchaseDetailList"
          border
          style="width: 100%"
          :cell-style="{'text-align':'center'}"
          class="g-table"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column
            label="产品图片"
          >
            <template v-slot="scope">
              <img :src="scope.row.productUrl" alt="" min-width="70" height="70">
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in purchaseCol"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
          />
        </el-table>
        <div style="background-color: #f7f7f7;display: flex;justify-content: space-between;height:30px;text-align: center;line-height:30px;padding: 0 20px;">
          <span>采购总数：{{ total.purchaseTotalNumber }}</span>
          <span>产品金额：{{ total.productTotalAmount }}</span>
          <span>物流运费：{{ total.shippingAmount }}</span>
          <span>优惠金额：{{ total.discountAmount }}</span>
          <span>订单总额：{{ total.orderTotalAmount }}</span>
        </div>
      </el-card>
    </el-row>
    <el-row>
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>操作记录</span>
        </div>
        <el-table
          :data="operationList"
          border
          style="width: 100%"
          :cell-style="{'text-align':'center'}"
          class="g-table"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column
            v-for="item in col"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
          />
        </el-table>
      </el-card>
    </el-row>
  </basic-container>
</template>
<script>
import { detailInfo } from '@/api/payList'
export default {
  props: {
    row: Object,
    name: String
  },
  data() {
    return {
      total: {},
      detailRow1: Object.freeze([
        [
          [
            { label: '付款编码', prop: 'payCode' },
            { label: '付款单状态', prop: 'paymentStatusName' },
            { label: '申请编码', prop: 'applyCode' },
            { label: '采购编码', prop: 'purchaseCode' }
          ],
          [
            { label: '采购平台', prop: 'purchasePlatformName' },
            { label: '第三方单号', prop: 'orderCode' },
            { label: '采购主体名称', prop: 'purchaseCompanyName' },
            { label: '供应商名称', prop: 'supplierName' }
          ],
          [
            { label: '采购金额', prop: 'purchaseAmount' },
            { label: '付款类型', prop: 'paymentTypeName' },
            { label: '已付金额', prop: 'createTime' },
            { label: '请款金额', prop: 'applyAmount' }
          ]
        ]
      ]),
      //  预付款采购明细
      purchaseCol: [
        { prop: 'productCode', label: '产品编码' },
        { prop: 'productName', label: '产品名称' },
        { prop: 'productCategory', label: '产品类目' },
        { prop: 'purchaseNumber', label: '采购数量' },
        { prop: 'purchaseUnitPrice', label: '采购单价' },
        { prop: 'productAmount', label: '商品金额' }
      ],
      //  非预付款采购明细
      purchaseCol2: [
        { prop: 'productCode', label: '产品编码' },
        { prop: 'productName', label: '产品名称' },
        { prop: 'productCategory', label: '产品类目' },
        { prop: 'purchaseNumber', label: '采购数量' },
        { prop: 'purchaseUnitPrice', label: '采购单价' },
        { prop: 'productAmount', label: '商品金额' },
        { prop: 'arrivalNumber', label: '到货数量' },
        { prop: 'arrivalAmount', label: '到货金额' },
        { prop: 'returnNumber', label: '退货数量' },
        { prop: 'returnAmount', label: '退款金额' }
      ],

      //  操作记录每一列数据
      col: [
        { prop: 'processNode', label: '操作属性' },
        { prop: 'processHandler', label: '操作人' },
        { prop: 'processDate', label: '操作时间' },
        { prop: 'processContent', label: '操作记录' }
      ],
      basicInfoList: {}, // 基本信息列表
      operationList: [], // 操作列表
      purchaseDetailList: []
    }
  },
  created() {
    this.getData()
  },

  methods: {
  // 接口集合
    getData() {
      detailInfo(this.row.id).then(res => {
        this.total.shippingAmount = res.data.shippingAmount
        this.total.orderTotalAmount = res.data.orderTotalAmount
        this.total.purchaseTotalNumber = res.data.purchaseTotalNumber
        this.total.discountAmount = res.data.discountAmount
        this.total.productTotalAmount = res.data.productTotalAmount
        this.operationList = res.data.processLogList// 操作列表
        this.basicInfoList = res.data.paymentApplyInfoVO
        this.purchaseDetailList = res.data.purchaseDetailList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    width:100%;

  }

</style>
