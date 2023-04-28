<template>
  <basic-container>
    <!-- <down-or-up /> -->
    <el-tabs class="autoHeight">
      <el-tab-pane type="border-card">
        <span slot="label" style="font-size: 15px">汇总</span>
        <g-table
          ref="tableRef"
          stripe
          border
          :headers="headers"
          :fetch="fetch"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          @selection-change="handleSelectionChange"
        >
          <template slot="header">
            <el-form
              ref="rulesForm"
              size="mini"
              :model="formInfo"
              label-width="100px"
              class="form-col"
            >
              <el-row type="flex">
                <el-col>
                  <el-form-item label="店铺编码:">
                    <el-select
                      v-model="stores"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option v-for="item in storeList" :key="item.value" :label="item.value" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="账单ID:">
                    <el-input
                      v-model="invoiceNumberList"
                      class="small"
                      clearable
                      placeholder="多个用英文逗号隔开"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="账单日期:">
                  <el-date-picker
                    v-model="dateTime"
                    type="daterange"
                    placeholder="选择日期"
                    style="width: 240px !important"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                  <el-button
                    size="mini"
                    type="primary"
                    @click="search"
                  >查询</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="reset"
                  >重置</el-button>
                </el-form-item>
              </el-row>
            </el-form>
            <handel-download
              :all-data="allData"
              :part-data="exportData"
              :headers="headers"
              @getAllData="getAllData"
            />
          </template>
        </g-table>
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label" style="font-size: 15px">明细</span>
        <wish-detail />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import wishDetail from './components/wishDetail.vue'
import { getWishBill } from '@/api/wish/wish'
import { getStoreCodeList } from '@/api/common'
import handelDownload from '@/views/components/handelDownload'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyWishBillData',
  components: { wishDetail, handelDownload },
  data() {
    return {
      headers: [
        { width: '55', type: 'selection' },
        { label: '店铺编码', prop: 'storeCode', width: '150' },
        { label: '账单日期', prop: 'invoiceDate', width: '150' },
        { label: '账单ID', prop: 'invoiceNumber', width: '200' },
        { label: '币种', prop: 'currency' },
        {
          label: '交易金额(payment_for_transactions)',
          prop: 'totalPaid',
          width: '150'
        },
        {
          label: '释放扣除金额(withheld_transactions_released)',
          prop: 'totalWithheldReleased',
          width: '150'
        },
        {
          label: '扣除数额(Amount Withheld)',
          prop: 'totalWithheld',
          width: '150'
        }, //
        {
          label: '其他款项(Other payments)',
          prop: 'totalOtherPayments',
          width: '150'
        },
        {
          label: '退款(Refund Deduction)',
          prop: 'totalRefunded',
          width: '150'
        },
        { label: '罚款(Fines)', prop: 'totalFines', width: '150' },
        { label: '费用(Fees)', prop: 'totalFees', width: '150' }, //
        {
          label: '现金返还(Wish Express Cash Back)',
          prop: 'expressCashBack',
          width: '150'
        },
        {
          label: '账单放款（gross_amount）',
          prop: 'grossAmount',
          width: '200'
        },
        {
          label: '总售价(Price & Shipping)',
          prop: 'priceShipping',
          width: '200'
        },
        {
          label: '交易费(Commission)',
          prop: 'commission',
          width: '150'
        },
        {
          label: '支付总额(Paid Amount)',
          prop: 'paidAmount',
          width: '150'
        },
        { label: '文件名', prop: 'fileName', width: '150' }
      ],
      exportData: [], // 导出数据
      allData: [],
      dateTime: [],
      downloadLoading: '',
      invoiceNumberList: '',
      storeList: [],
      stores: '',
      formInfo: {
        storeCode: '',
        invoiceNumberList: '',
        invoiceDateBegin: '',
        invoiceDateEnd: ''
      },
      fn: getWishBill
    }
  },
  mounted() {
    this.getData()
    this.init()
  },
  methods: {
    // 选择获取数据
    // 选择获取数据
    getAllData() {
      this.fn(1, 50000, this.formInfo).then((res) => {
        this.allData = res.data.records
      })
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    // 重置
    reset() {
      this.formInfo = {}
      this.invoiceNumberList = ''
      this.dateTime = []
      this.stores = ''
      this.init()
    },
    // 搜索
    search() {
      if (this.dateTime) {
        this.formInfo.invoiceDateBegin = this.dateTime[0]
        this.formInfo.invoiceDateEnd = this.dateTime[1]?.replace(
          /00:00:00/,
          '23:59:59'
        )
      } else {
        this.formInfo.invoiceDateBegin = ''
        this.formInfo.invoiceDateEnd = ''
      }
      this.formInfo.invoiceNumberList = this.invoiceNumberList
      this.formInfo.storeCode = this.stores
      this.init()
    },
    fetch({ current, size }, params) {
      return this.fn(current, size, params).then((res) => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    getData() {
      getStoreCodeList({ platformCode: 'WH' }).then((res) => {
        if (res.success && res.data) {
          this.storeList = res.data
        }
      })
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.autoHeight {
    display: flex;
    flex-direction: column;
    height: 100%;
    .el-tabs__content {
        flex: 1;
        .el-tab-pane {
            height: 100%;
        }
    }
}
.small {
    width: 245px !important;
}
.g-select {
    width: 245px !important;
}
.el-select {
    width: 245px !important;
}
.el-date-editor--daterange.el-input__inner {
    width: 245px;
}
</style>
