<template>
  <basic-container>
    <el-tabs class="autoHeight">
      <el-tab-pane>
        <span slot="label" style="font-size:15px ">汇总</span>
        <g-table ref="tableRef"

                 :headers="headers"
                 :fetch="fetch"
                 :header-cell-style="{'text-align':'center'}"
                 :cell-style="{'text-align':'center'}"
                 @selection-change="handleSelectionChange"
        >
          <template #header>
            <cols-form ref="formRef" :form-info="formInfo" :form-item="formItem" :form-handler="formHandler" />

            <handel-download :all-data="allData" :part-data="exportData" :headers="headers" @getAllData="getAllData" />

          </template>
          <el-table-column v-for="item in headers" :slot="item.slot&&item.slotName" :key="item.slot&&item.slotName" :label="item.field">
            <template v-slot="{row}">
              <span>{{ filterData(row.detailList,item.slotName) }}</span>
            </template>
          </el-table-column>
        </g-table>
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label" style="font-size:15px">明细</span>
        <joom-detail />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import colsForm from '@/views/components/colsForm'
import joomDetail from './components/joomDetail'
import { getJoomBill } from '@/api/joom/joom'
import handelDownload from '@/views/components/handelDownload'
export default {
  name: 'PrsVerifiyJoomBillData',
  components: { joomDetail, colsForm, handelDownload },
  data() {
    return {
      allData: [],
      getJoomBill,
      exportData: [],
      headers: [
        { width: 55, type: 'selection' },
        { label: '主账号', prop: 'mainAccountNumber' },
        // { label: '店铺编码', prop: 'storeName' },
        { label: '账单日期', prop: 'accountingPeriod' },
        { label: '类型', prop: 'subType' },
        { label: '币种', prop: 'billCurrency' },
        { slot: true, slotName: 'ORDER_AMOUNT', field: '订单金额' }, // 避免导出label和slotName混用
        { slot: true, slotName: 'TOTAL_COMMISSION', field: '佣金合计' },
        { slot: true, slotName: 'LOAN_AMOUNT', field: '订单放款' },
        { slot: true, slotName: 'REFUND_ORDER', field: '退款订单' },
        { slot: true, slotName: 'COMMISSION_REFUND', field: '佣金退还' },
        { slot: true, slotName: 'REFUND_AMOUNT', field: '退款金额' },
        { slot: true, slotName: 'ADVERT', field: '广告费' },
        { slot: true, slotName: 'LOGISTICS', field: '物流费' },
        { slot: true, slotName: 'INSURANCE_INDEMNITY', field: '保险赔偿' },
        { slot: true, slotName: 'BILL_LENDING', field: '账单放款' },
        { label: '文件名称', prop: 'fileName' }
      ],
      formInfo: {
      },
      formItem: [

        { type: 'input', label: '主账户', prop: 'mainAccountNumber', placeholder: '多个用英文逗号隔开' },
        { type: 'input', label: '文件名称', prop: 'fileName', placeholder: '多个用英文逗号隔开' },
        { type: 'datePicker', label: '账单日期', prop: 'date' }],
      formHandler: [
        {
          label: '查询',
          handler: () => { this.search() }
        },
        {
          label: '重置',
          handler: () => { this.reset() }
        }

      ]
    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.startDate = val?.[0]
      this.formInfo.endDate = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    getAllData() {
      getJoomBill(1, 50000, this.formInfo).then(res => {
        this.allData = this.dynamicData(res.data.records)
      })
    },
    // 导出过滤数据方法
    dynamicData(list) {
      list.forEach(ele => {
        ele.detailList.forEach(
          item => {
            ele[item.costType.value] = Number((item.costAmount)).toFixed(2)
          }
        )
      })
      return list
    },
    // 过滤数据
    filterData(list, val) {
      const data = (list.find(item => item.costType.value === val)?.costAmount)
      return data && Number(data).toFixed(2)
    },
    handleSelectionChange(val) {
      this.exportData = this.dynamicData(val)
    },
    reset() {
      this.formInfo = {}
      this.init()
    },
    search() {
      this.init()
    },

    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    fetch({ current, size }, params) {
      return getJoomBill(current, size, params).then(res => {
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
::v-deep.autoHeight{
display: flex;
 flex-direction: column;
 height:100%;
 .el-tabs__content{
   flex: 1;
   .el-tab-pane{
    height: 100%;
   }
 }
}
</style>
