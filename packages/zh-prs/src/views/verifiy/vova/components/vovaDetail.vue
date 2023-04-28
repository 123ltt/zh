<template>
  <g-table ref="tableRef"
           :key="headers.length"
           :fetch="fetch"
           :header-cell-style="{'text-align':'center'}"
           :cell-style="{'text-align':'center'}"
           :headers="headers"
           row-key="id"
           @selection-change="handleSelectionChange"
  >
    <template #header>
      <cols-form ref="formRef" :form-item="formItem" :form-info="formInfo" :form-handler="formHandler">
        <template slot="dateTime">
          <el-form-item>
            <div slot="label">

              <el-select v-model="formInfo.dateType" placeholder="请选择" style="width:100px !important">
                <el-option
                  v-for="item in dateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  clearable
                />
              </el-select>

            </div>
            <el-date-picker v-model="dateTime"
                            type="daterange"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
            />
          </el-form-item>
        </template>
      </cols-form>
      <handel-download :all-data="allData" :part-data="exportData" :headers="headers" @getAllData="getAllData" />
    </template>
  </g-table>
</template>

<script>
import { getVovabillFine, getVovabillTotal } from '@/api/vova/vova'
import { getStoreCodeList } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import handelDownload from '@/views/components/handelDownload'
export default {
  name: 'VovaDetail',
  components: { colsForm, handelDownload },
  data() {
    return {
      fn: getVovabillTotal,
      getVovabillFine,
      dateOptions: [{ label: '账单日期', value: 1 }, { label: '日期', value: 2 }],
      exportData: [],
      allData: [],
      formInfo: {
        type: 'total', dateType: ''
      },
      formItem: [{
        type: 'gselect',
        optionValue: 'value',
        label: '店铺编码',
        prop: 'storeCode',
        options: []
      },
      {
        type: 'input',
        label: '订单ID',
        prop: 'orderIdList',
        placeholder: '多个用英文逗号隔开'
      },
      {
        type: 'slot',
        slotName: 'dateTime'
      },
      {
        type: 'bselect',
        label: '账单类型',
        prop: 'type',
        options: ['total', 'fine']
      }
      ],
      formHandler: [{
        label: '查询',
        handler: () => {
          this.search()
        }
      }, {
        label: '重置',
        handler: () => {
          this.reset()
        }
      }],
      dateTime: [],
      headers: [],
      headerTotal: [
        { width: '55', type: 'selection' },
        { label: '账单日期', prop: 'billDate' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '币种', prop: 'currency' },
        { label: '日期', prop: 'payDate' },
        { label: 'Order SN', prop: 'orderSn' },
        { label: '订单ID', prop: 'orderId' },
        { label: '数量', prop: 'num' },
        { label: '商品分类ID', prop: 'goodsCateId' },
        { label: '商品单价', prop: 'goodsPrice' },
        { label: '运费单价', prop: 'shipfeePrice' },
        { label: '订单总金额(含佣金)', prop: 'orderTotal' },
        { label: '订单总金额(不含佣金)', prop: 'orderTotalNotCommission', width: '100' },
        { label: '佣金', prop: 'commission' },
        { label: '结账类型', prop: 'type' },
        { label: '支付金额', prop: 'payAmount' },
        { label: '扣除金额', prop: 'deductAmount' },
        { label: '扣除原因', prop: 'deductReason' },
        { label: '退款时间', prop: 'refundTime' },
        { label: '放款日期', prop: 'loanTime' },
        { label: '扣款日期', prop: 'deductTime' }

      ],
      headerFina: [
        { width: '55', type: 'selection' },
        { label: '账单日期', prop: 'billDate' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '扣款/补款类型', prop: 'type' },
        { label: '日期', prop: 'orderDate' }, //
        { label: 'Order SN', prop: 'orderSn' },
        { label: '订单ID', prop: 'orderId' },
        { label: '操作人', prop: 'operationUser' },
        { label: '金额', prop: 'amount' },
        { label: '奖惩理由', prop: 'reason' }
      ]

    }
  },

  watch: {
    dateTime(val) {
      this.formInfo.billBegin = val?.[0]
      this.formInfo.billEnd = val?.[1]?.replace(/00:00:00/, '23:59:59')
    },
    'formInfo.type'(val) {
      if (val === 'fine') {
        this.headers = this.headerFina
        this.fn = getVovabillFine
      } else {
        this.headers = this.headerTotal

        this.fn = getVovabillTotal
      }
      this.$nextTick(() => {
        this.$refs.tableRef.load(1, this.formInfo)
      })
    }

  },
  created() {
    this.headers = this.headerTotal
  },
  mounted() {
    this.init()
    this.getData()
  },
  methods: {
    getAllData() {
      this.fn(1, 50000, this.formInfo).then(res => {
        this.allData = res.data.records
      })
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    getData() {
      getStoreCodeList({ platformCode: 'VV' }).then(res => {
        this.formItem[0].options = res.data
      })
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    search() {
      this.init()
    },
    reset() {
      this.dateTime = []
      this.formInfo = {

      }
      this.$nextTick(() => {
        this.init()
      })
    },
    fetch({ current, size }, params) {
      return this.fn(current, size, params).then((res) => {
        this.$refs.formRef.filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-select{
  width:245px!important;
}
.el-date-editor--daterange.el-input__inner{
   width: 245px  !important;
 }
</style>
