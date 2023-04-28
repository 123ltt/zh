<template>
  <g-table ref="tableRef"
           :key="orderType"
           :header-cell-style="{'text-align':'center'}"
           :cell-style="{'text-align':'center'}"
           stripe
           border
           :headers="headers"
           :fetch="fetch"
           row-key="id"
           @selection-change="handleSelectionChange"
  >
    <div slot="header">
      <el-form size="mini" :model="formInfo" label-width="150px" class="form-col no-message form-search">
        <el-row type="flex">
          <el-col>
            <el-form-item label="店铺编码">
              <el-select v-model="formInfo.storeCode" clearable>
                <el-option v-for="item in storeCodeList" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="订单编号">
              <el-input v-model="formInfo.orderIdList" clearable class="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item label="账单日期">
              <el-date-picker v-model="dateTime"
                              type="daterange"
                              placeholder="选择日期"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="账单类型">
              <el-select v-model="orderType">
                <el-option v-for="item in orderTypeData"
                           :key="item.label"
                           :label="item.label"
                           :value="item.value"
                />
              </el-select>
              <el-button size="mini" type="primary" @click="search">查询</el-button>
              <el-button size="mini" type="primary" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <handel-download :all-data="allData" :part-data="exportData" :headers="headers" @getAllData="getAllData" />
    </div>
  </g-table>
</template>

<script>
import * as jdApi from '@/api/jd/jd'
import handelDownload from '@/views/components/handelDownload'
import { getStoreCodeList } from '@/api/common'
import { filterData } from '../../../../utils/filterData'
export default {
  components: { handelDownload },
  data() {
    return {
      formInfo: {
        storeCode: '',
        orderIdList: ''
      },
      storeCodeList: [],
      dateTime: [],
      orderTypeData: [
        { label: '妥投销货清单明细', value: 1 },
        { label: '差异调整结算数据', value: 2 },
        { label: '非销售单结算数据', value: 3 },
        { label: '拒收结算数据', value: 4 },
        { label: '妥投结算数据', value: 5 },
        { label: '退货结算数据', value: 6 }
      ],
      orderType: 1,
      exportData: [],
      allData: [],
      headers: [],
      headersSale: [
        { width: 55, type: 'selection' },
        { label: '账单日期', prop: 'billDate' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '结算单号', prop: 'settlementNumber' },
        { width: 60, label: '币种', prop: 'currency' },
        { label: '订单编号', prop: 'orderCode' },
        { label: '结算金额', prop: 'settlementAmount' },
        { label: '商品应结金额', prop: 'payableAmount' },
        { width: 100, label: '商品佣金', prop: 'commission' },
        { width: 110, label: '一级类目', prop: 'oneCategory' },
        { width: 100, label: '二级类目', prop: 'twoCategory' },
        { width: 100, label: '三级类目', prop: 'threeCategory' },
        { width: 100, label: 'SKU编号', prop: 'skuCode' },
        { label: '货号', prop: 'itemNo' },
        { width: 100, label: '商品名称', prop: 'itemName' },
        { width: 100, label: 'SKU单价', prop: 'skuPrice' },
        { width: 100, label: '数量', prop: 'quantity' },
        { label: '汇率(美元/人民币)', prop: 'exchangeRate' }
      ],
      headersDifferences: [
        { width: 55, type: 'selection' },
        { label: '账单日期', prop: 'billDate' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '结算单号', prop: 'settlementNumber' },
        { width: 60, label: '币种', prop: 'currency' },
        { label: '计费时间', prop: 'billableTime' },
        { label: '单据编号', prop: 'receiptNumber' },
        { label: '费用类型', prop: 'feeType' },
        { width: 100, label: '调账金额', prop: 'adjustAmount' },
        { width: 110, label: '调账类型', prop: 'adjustType' },
        { width: 100, label: '汇率(美元/人民币)', prop: 'exchangeRate' }
      ],
      headersNoSales: [
        { width: 55, type: 'selection' },
        { label: '账单日期', prop: 'billDate' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '结算单号', prop: 'settlementNumber' },
        { width: 60, label: '币种', prop: 'currency' },
        { label: '发生时间', prop: 'happenTime' },
        { label: '计费时间', prop: 'billableTime' },
        { label: '平台订单号', prop: 'orderCode' },
        { width: 100, label: '单据编号', prop: 'receiptNumber' },
        { width: 110, label: '费用类型', prop: 'feeType' },
        { width: 100, label: '费用金额', prop: 'feeAmount' },
        { width: 100, label: '汇率(美元/人民币)', prop: 'exchangeRate' }
      ],
      headersReject: [
        { width: 55, type: 'selection' },
        { label: '账单日期', prop: 'billDate' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '结算单号', prop: 'settlementNumber' },
        { width: 60, label: '币种', prop: 'currency' },
        { label: '计费时间', prop: 'billableTime' },
        { label: '计费时间1', prop: 'billableTimeTwo' },
        { label: '订单编号', prop: 'orderCode' },
        { width: 100, label: '配送费', prop: 'deliveryAmount' },
        { width: 110, label: '汇率(美元/人民币)', prop: 'exchangeRate' }
      ],
      headersVote: [
        { width: 55, type: 'selection' },
        { label: '账单日期', prop: 'billDate' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '结算单号', prop: 'settlementNumber' },
        { width: 60, label: '币种', prop: 'currency' },
        { label: '计费时间', prop: 'billableTime' },
        { label: '完成时间', prop: 'finishTime' },
        { label: '订单编号', prop: 'orderCode' },
        { width: 100, label: '订单总金额', prop: 'orderAmount' },
        { width: 110, label: '商家促销金额', prop: 'promotionAmount' },
        { width: 100, label: '满减优惠金额', prop: 'discountAmount' },
        { width: 110, label: '店铺京券金额', prop: 'jingSecuritie' },
        { width: 110, label: '店铺东券金额', prop: 'dongSecuritie' },
        { width: 100, label: '货款', prop: 'paymentForGoods' },
        { width: 110, label: '佣金', prop: 'delieveredCommission' },
        { width: 110, label: '应结货款', prop: 'shouldPay' },
        { width: 100, label: '汇率(美元/人民币)', prop: 'exchangeRate' }
      ],
      headersReturn: [
        { width: 55, type: 'selection' },
        { label: '账单日期', prop: 'billDate' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '结算单号', prop: 'settlementNumber' },
        { width: 60, label: '币种', prop: 'currency' },
        { label: '计费时间', prop: 'billableTime' },
        { label: '退货时间', prop: 'returnTime' },
        { label: '订单编号', prop: 'orderCode' },
        { width: 100, label: '返修单号', prop: 'returnCode' },
        { width: 110, label: '退款金额', prop: 'refundAmount' },
        { width: 100, label: '返还佣金', prop: 'refundCommission' },
        { width: 110, label: '退货配送费', prop: 'returnDeliveryAmount' },
        { width: 110, label: '一级类目', prop: 'oneCategory' },
        { width: 100, label: '二级类目', prop: 'twoCategory' },
        { width: 110, label: '三级类目', prop: 'threeCategory' },
        { width: 110, label: 'SKU编号', prop: 'skuCode' },
        { width: 100, label: '货号', prop: 'itemNo' },
        { width: 110, label: '商品名称', prop: 'itemName' },
        { width: 110, label: 'SKU单价', prop: 'skuPrice' },
        { width: 100, label: '汇率(美元/人民币)', prop: 'exchangeRate' }
      ],
      fn: jdApi.getJdSales
    }
  },
  watch: {
    // 监听账单类型，获取不同类型下的数据
    orderType(val) {
      this.formInfo.storeCode = ''
      this.formInfo.orderIdList = ''
      this.$refs.tableRef.tableList = []
      if (val === 6) {
        this.headers = this.headersReturn
        this.fn = jdApi.getJdReturn
      } else if (val === 2) {
        this.headers = this.headersDifferences
        this.fn = jdApi.getJdDifferences
      } else if (val === 3) {
        this.headers = this.headersNoSales
        this.fn = jdApi.getJdNoSales
      } else if (val === 4) {
        this.headers = this.headersReject
        this.fn = jdApi.getJdRejection
      } else if (val === 5) {
        this.headers = this.headersVote
        this.fn = jdApi.getJdVote
      } else {
        this.headers = this.headersSale
        this.fn = jdApi.getJdSales
      }
      this.$nextTick(() => {
        this.init()
      })
    }
  },
  mounted() {
    this.headers = this.headersSale
    this.init()
    this.getStoreList()
  },
  methods: {
    // 表格数据初始化
    init() {
      this.formInfo.billBegin = this.dateTime?.[0]
      this.formInfo.billEnd = this.dateTime?.[1]?.replace(/00:00:00/, '23:59:59')
      this.$refs.tableRef.load(1, this.formInfo)
    },
    // 获取店铺列表
    getStoreList() {
      getStoreCodeList({ platformCode: 'JD' }).then(res => {
        this.storeCodeList = res.data
      })
    },
    reset() {
      this.formInfo = {}
      this.dateTime = []
      this.init()
    },
    search() {
      this.init()
    },
    // 导出全部
    getAllData() {
      this.fn(1, 50000, this.formInfo).then(res => {
        // filterData(res.data.records)
        this.allData = res.data.records
      })
    },
    fetch({ current, size }, params) {
      return this.fn(current, size, params).then(res => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    // 获取选中的数据
    handleSelectionChange(val) {
      this.exportData = val
    }
  }
}
</script>
<style scoped lang="scss">
  .small{
    width: 245px !important;
  }
  .el-select{
    width:245px!important;
  }
  .el-range-editor--mini.el-input__inner{
    width: 245px !important;
  }
.clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
