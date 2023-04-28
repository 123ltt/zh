<template>
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
    <template #header>
      <el-form
        ref="rulesForm"
        size="mini"
        :model="formInfo"
        label-width="100px"
        class="form-col no-message"
      >
        <el-row type="flex">
          <el-col>
            <el-form-item label="paypal账号:">
              <el-input
                v-model="mainAccountNumber"
                class="small"
                clearable
                placeholder="多个用英文逗号隔开"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="交易号:">
              <el-input
                v-model="transactionNumber"
                class="small"
                clearable
                placeholder="多个用英文逗号隔开"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item label="交易时间:">
              <el-date-picker
                v-model="dateTime"
                type="daterange"
                clearable
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="币种:">
              <el-select
                v-model="formInfo.ebayCurrency"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in currencyList"
                  :key="item.dictKey"
                  :label="item.dictKey"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item label="余额影响:">
              <el-select
                v-model="formInfo.causeChangesBalance"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in causeChangesBalanceList"
                  :key="item.dictKey"
                  :label="item.dictKey"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="文件名称:">
              <el-input
                v-model="formInfo.fileName"
                clearable
                class="small"
                placeholder="模糊查询"
              />
              <el-button
                size="mini"
                type="primary"
                class="ml-2"
                @click="search"
              >查询</el-button>
              <el-button size="mini"
                         type="primary"
                         @click="reset"
              >重置</el-button>
            </el-form-item>
          </el-col>
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
</template>
<script>
import { getEbayOriginalBill } from '@/api/ebay/ebay'
import handelDownload from '@/views/components/handelDownload'
import { filterData } from '../../../../utils/filterData'
import { getMyDictBiz } from '@/api/common'
export default {
  name: 'PaypalBill',
  components: { handelDownload },
  data() {
    return {

      headers: [
        { width: '55', type: 'selection' },
        { label: 'Paypal账号', prop: 'mainAccountNumber', width: '150' },
        { label: '名称', prop: 'ebayName', width: '150' },
        { label: '交易时间', prop: 'ebayDate' },
        { label: '类型', prop: 'ebayType', width: '150' },
        { label: '状态', prop: 'ebayState' },
        { label: '余额影响', prop: 'causeChangesBalance' },
        { label: '币种', prop: 'ebayCurrency' },
        { label: '总额', prop: 'ebayTotal' },
        { label: '费用', prop: 'ebayCost' },
        { label: '净额', prop: 'ebayNet' },
        {
          label: '发件人邮箱地址',
          prop: 'senderEmailAddress',
          width: '150'
        },
        {
          label: '收件人邮箱地址',
          prop: 'recipientEmailAddress',
          width: '150'
        },
        { label: '交易号', prop: 'transactionNumber', width: '150' },
        { label: '物品号', prop: 'itemNumber' },
        { label: '运费和手续费金额', prop: 'amountCharges' },
        { label: '保险金额', prop: 'insuranceAmount' },
        { label: '营业税', prop: 'salesTax' },
        { label: '参考交易号', prop: 'referenceNumber' },
        {
          label: '数量',
          prop: ''
        },
        { label: '余额', prop: 'balance' },
        { label: '文件名', prop: 'fileName', width: '150' }
      ],
      exportData: [], // 导出数据
      allData: [],
      downloadLoading: '',
      dateTime: [],
      transactionNumber: '',
      mainAccountNumber: '',
      causeChangesBalanceList: [],
      currencyList: [],
      formInfo: {
        mainAccountNumber: '',
        causeChangesBalance: '',
        startDate: '',
        endDate: '',
        transactionNumber: '',
        fileName: ''
      },
      fn: getEbayOriginalBill // 接口名
    }
  },
  mounted() {
    this.init()
    this.getData()
  },
  methods: {
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
      this.transactionNumber = ''
      this.mainAccountNumber = ''
      this.dateTime = []
      this.init()
    },
    // 搜索
    search() {
      this.formInfo.transactionNumber = this.transactionNumber
      this.formInfo.mainAccountNumber = this.mainAccountNumber
      if (this.dateTime) {
        this.formInfo.startDate = this.dateTime[0]
        this.formInfo.endDate = this.dateTime[1]?.replace(
          /00:00:00/,
          '23:59:59'
        )
      } else {
        this.formInfo.startDate = ''
        this.formInfo.endDate = ''
      }
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

    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    getData() {
      getMyDictBiz('cause_changes_balance').then((res) => {
        if (res.data) {
          this.causeChangesBalanceList = res.data
        }
      })
      getMyDictBiz('account_currency').then((res) => {
        if (res.data) {
          this.currencyList = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
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
