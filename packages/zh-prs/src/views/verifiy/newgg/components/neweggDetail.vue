<template>
  <g-table ref="tableRef"
           :headers="headers"
           :fetch="fetch"
           :header-cell-style="{'text-align':'center'}"
           :cell-style="{'text-align':'center'}"
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
            <el-form-item label="Transaction Type">
              <el-select v-model="formInfo.transactionType" clearable>
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item>
              <div slot="label">
                <el-select v-model="formInfo.timeConditionType" style="width:100px !important">
                  <el-option v-for="item in dateOptions"
                             :key="item.label"
                             :label="item.label"
                             :value="item.value"
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
          </el-col>
          <el-col>
            <el-form-item>
              <div slot="label">
                <el-select v-model="idType" style="width:120px !important">
                  <el-option v-for="item in idOptions"
                             :key="item.label"
                             :label="item.label"
                             :value="item.value"
                  />
                </el-select>
              </div>
              <el-input v-model="formInfo.ids" clearable placeholder="多个用英文逗号隔开" class="small" />
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
import handelDownload from '@/views/components/handelDownload'
import { getStoreCodeList } from '@/api/common'
import { filterData } from '../../../../utils/filterData'
import { getNewggDetailList } from '@/api/newEgg/newEgg'
export default {
  components: { handelDownload },
  data() {
    return {
      formInfo: {
        storeCode: '',
        ids: '',
        transactionType: '',
        idConditionType: '',
        timeConditionType: 1
      },
      idType: 1,
      storeCodeList: [],
      typeList: [
        { label: 'ALL', value: '' },
        { label: 'Order', value: 'Order' },
        { label: 'Refund', value: 'Refund' },
        { label: 'Return Shipping Label Fee', value: 'Return Shipping Label Fee' },
        { label: 'Credit Request', value: 'Credit Request' }
      ],
      dateOptions: [
        { label: '账单日期', value: 1 },
        { label: 'date', value: 2 }
      ],
      dateType: 'billDate',
      idOptions: [
        { label: 'Settlement ID', value: 1 },
        { label: 'order ID', value: 2 }
      ],
      iDtype: 'settlementId',
      dateTime: [],
      allData: [],
      exportData: [],
      headers: [
        { width: 55, type: 'selection' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '账单日期', prop: 'fileUploadDate' },
        { label: 'Date', prop: 'billDate' },
        { label: 'Transaction Type', prop: 'transactionType' },
        { label: 'Order ID', prop: 'orderId' },
        { label: 'Invoice ID', prop: 'invoiceId' },
        { label: 'Seller Part#', prop: 'sellerPart' },
        { label: 'Newegg Item #', prop: 'neweggItem' },
        { width: 100, label: 'Item Title', prop: 'itemTitle' },
        { label: 'Amounts($)', prop: 'amounts' },
        { label: 'Shipping($)', prop: 'shipping' },
        { label: 'Commission Fee($)', prop: 'commissionFee' },
        { label: 'Settlement ID', prop: 'settlementId' }
      ]
    }
  },
  mounted() {
    this.getStoreList()
    this.init()
  },
  methods: {
    // 表格数据初始化
    init() {
      this.formInfo.startDate = this.dateTime?.[0]
      this.formInfo.endDate = this.dateTime?.[1]?.replace(/00:00:00/, '23:59:59')
      !this.formInfo.ids ? this.formInfo.idConditionType = '' : this.formInfo.idConditionType = this.idType
      this.$refs.tableRef.load(1, this.formInfo)
    },
    search() {
      this.init()
    },
    reset() {
      this.dateTime = []
      this.formInfo = {}
      this.init()
    },
    fetch({ current, size }, params) {
      return getNewggDetailList(current, size, params).then(res => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    // 导出全部数据
    getAllData() {
      getNewggDetailList(1, 50000, this.formInfo).then(res => {
        // filterData(res.data.records)
        this.allData = res.data.records
      })
    },
    // 获取店铺列表
    getStoreList() {
      getStoreCodeList({ platformCode: 'NE' }).then(res => {
        this.storeCodeList = res.data
      })
    },
    // 获取选中数据
    handleSelectionChange(val) {
      this.exportData = val
    }
  }
}
</script>
<style scoped lang="scss">
  .small{
    width: 245px!important;
  }
  .el-select{
    width:245px!important;
  }
  .el-range-editor--mini.el-input__inner{
    width: 245px !important;
  }
</style>
