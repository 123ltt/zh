<template>
  <basic-container>
    <el-row v-for="(items,index) in detailRow1" :key="index">
      <el-card shadow="hover">
        <div slot="header" class="clearFix">
          <span>基本信息</span>
        </div>
        <g-list-group v-for="(item,i) in items" :key="i" :cols="4" :label-width="'80px'">
          <g-list-group-item v-for="(e,j) in item" :key="j" :label="e.label" />
        </g-list-group>
      </el-card>
    </el-row>
    <el-row>
      <el-card shadow="hover">
        <div slot="header" class="clearFix">
          <span>产品明细</span>
        </div>
        <el-table
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
            v-for="item in product"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
          />
        </el-table>
      </el-card>
    </el-row>
    <el-row>
      <el-card shadow="hover">
        <div slot="header" class="clearFix">操作记录</div>
        <el-table
          border
          style="width: 100%"
          :cell-style="{'text-align':'center'}"
          class="g-table"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column
            v-for="item in operation"
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
import { detail } from '@/api/purchasingRefund'
export default {
  data() {
    return {
      input: '',
      detailRow1: Object.freeze([
        [
          [
            { label: '退款编码', prop: 'refundCode' },
            { label: '状态', prop: 'status' },
            { label: '采购编码', prop: 'purchaseNumber' },
            { label: '采购平台', prop: 'purchasePlatformName' }
          ],
          [
            { label: '第三方单号', prop: 'paidAmount' },
            { label: '采购主体名称', prop: 'purchaseCompanyName' },
            { label: '供应商名称', prop: 'supplierName' },
            { label: '采购类型', prop: 'purchaseTypeName' }
          ],
          [
            { label: '退款方式', prop: 'refundTypeName' },
            { label: '退款账号', prop: 'refundAccount' },
            { label: '退款金额', prop: 'refundAmount' },
            { label: '退款备注', prop: '5' }

          ],
          [
            { label: '交易流水号', prop: 'transactionId' }

          ]
        ]
      ]),
      // 产品明细
      product: [
        { label: '产品编码', prop: 'productCode' },
        { label: '产品名称', prop: 'productName' },
        { label: '产品类目', prop: 'productCategory' },
        { label: '采购数量', prop: 'purchaseNumber' },
        { label: '采购单价', prop: 'purchaseUnitPrice' },
        { label: '商品金额', prop: 'productAmount' },
        { label: '到货数量', prop: 'arrivalNumber' },
        { label: '到货金额', prop: 'arrivalAmount' },
        { label: '退货数量', prop: 'refundNumber' },
        { label: '退款金额', prop: 'refundAmount' }
      ],
      // 操作记录
      operation: [
        { label: '操作人', prop: 'processHandler' },
        { label: '操作时间', prop: 'processDate' },
        { label: '操作记录', prop: 'v' }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      detail().then(res => {
      })
    }

  }
}
</script>

<style>

</style>
