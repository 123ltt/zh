<template>
  <basic-container>
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
              <el-form-item label="交易类型:">
                <el-select
                  v-model="formInfo.transactionType"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in dealOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item>
                <div slot="label">
                  <el-select
                    v-model="formInfo.dateType"
                    placeholder="请选择"
                    clearable
                    style="width: 100px !important"
                  >
                    <el-option
                      v-for="item in dateOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <el-date-picker
                  v-model="dateTime"
                  clearable
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="daterange"
                  placeholder="选择日期"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="订单编号:">
                <el-input
                  v-model="platformOrderCode"
                  class="small"
                  clearable
                  placeholder="多个用英文逗号隔开"
                />
                <el-button
                  size="mini"
                  type="primary"
                  class="ml-2"
                  @click="search"
                >查询</el-button>
                <el-button
                  size="mini"
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
  </basic-container>
</template>

<script>
import { getAlibabaBill } from '@/api/ali/ali'
import { getStoreCodeList } from '@/api/common'
import handelDownload from '@/views/components/handelDownload'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyAliBillData',
  components: { handelDownload },
  data() {
    return {
      headers: [
        { type: 'selection' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '账单时间', prop: 'accountingPeriod' },
        { label: '交易时间', prop: 'transactionTime' },
        { label: '交易账户', prop: 'transactionAccount' },
        { label: '交易类型', prop: 'transactionType' },
        { label: '交易说明', prop: 'transactionExplain' },
        { label: '币种', prop: 'currency' },
        { label: '交易金额', prop: 'transactionMoney' },
        { label: '交易前余额', prop: 'beforeTransactionMoney' },
        { label: '交易后余额', prop: 'afterTransactionMoney' },
        { label: '备注', prop: 'remark' },
        { label: '文件名称', prop: 'fileName' }
      ],
      allData: [],
      exportData: [], // 导出数据
      downloadLoading: '',
      dateTime: [],
      storeList: [],
      platformOrderCode: '',
      stores: '',
      formInfo: {
        storeCode: '',
        dateType: 1,
        startDate: '',
        endDate: '',
        platformOrderCode: '',
        transactionType: ''
      },
      fn: getAlibabaBill,
      dateOptions: [
        { label: '账单时间', value: 1 },
        { label: '交易时间', value: 2 }
      ],
      dealOptions: [
        { label: '冻结', value: '冻结' },
        { label: '解冻', value: '解冻' },
        { label: '提现', value: '提现' },
        { label: '扣款', value: '扣款' },
        { label: '放款&收款', value: '放款&收款' },
        { label: '退款', value: '退款' }
      ]
    }
  },
  mounted() {
    this.getData()
    this.init()
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
      this.stores = ''
      this.platformOrderCode = ''
      this.dateTime = []
      this.transactionType = ''
      this.init()
    },
    search() {
      this.formInfo.platformOrderCode = this.platformOrderCode
      this.formInfo.storeCode = this.stores
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
    getData() {
      getStoreCodeList({ platformCode: 'AI' }).then((res) => {
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
