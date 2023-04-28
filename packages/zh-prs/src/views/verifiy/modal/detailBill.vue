<template>
  <basic-container>
    <el-card header="基本信息">
      <g-list-group v-if="detailType==='order'" :cols="4" label-width="100px">

        <g-list-group-item
          v-for="item in orderList"
          :key="item.prop"
          :label="item.name"
        >
          {{ detailList[item.prop] }}
        </g-list-group-item>
        <template v-if="detailList.diffCause!=='--'">
          <g-list-group-item label="差异原因">
            {{ detailList.diffCause }}
          </g-list-group-item>
          <!-- <g-list-group-item :label="detailList.adjustAmountName">
            {{ detailList.adjustAmount }}
          </g-list-group-item> -->
          <g-list-group-item label="备注">
            {{ detailList.remark }}
          </g-list-group-item>

        </template>

      </g-list-group>
      <g-list-group v-else :cols="4" label-width="100px">

        <g-list-group-item
          v-for="item in flowList"
          :key="item.prop"
          :label="item.name"
        >
          <span>{{ detailList[item.prop] }}</span>
        </g-list-group-item>
        <template v-if="detailList.diffCause!=='--'">
          <g-list-group-item label="差异原因">
            {{ detailList.diffCause }}
          </g-list-group-item>
          <g-list-group-item label="备注">
            {{ detailList.remark }}
          </g-list-group-item>
          <g-list-group-item :label="detailList.causeFeeName+ '币种'">
            {{ detailList.diffCauseCurrency }}
          </g-list-group-item>
          <g-list-group-item :label="detailList.causeFeeName">
            {{ detailList.diffCauseAmount }}
          </g-list-group-item>
        </template>

      </g-list-group>

    </el-card>
    <tabDetail ref="tabDetail">
      <el-tab-pane label="操作记录">
        <g-table
          ref="tableRef"
          :fetch="fetch"
          :page-show="false"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :headers="headers"
        />
      </el-tab-pane>

    </tabDetail>
  </basic-container>
</template>

<script>
import { orderDetail, flowDetail } from '@/api/common'
import tabDetail from '@/views/components/tabDetail'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'DetailBill',
  components: {
    tabDetail
  },
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    detailType: {
      type: String,
      default: 'order'// 流水详情用flow
    }
  },
  data() {
    return {
      detailList: {
        diffCause: '--'
      },
      headers: [
        { label: '操作人', prop: 'operator' },
        { label: '操作时间', prop: 'operationTime' },
        { label: '操作记录', prop: 'record' }
      ],

      orderList: [
        { name: '平台名称', prop: 'platformName' },
        { name: '经营站点', prop: 'site' },
        { name: '店铺编码', prop: 'storeCode' },
        { name: '账单ID', prop: 'billId' },
        { name: '平台订单号', prop: 'platformOrderCode' },
        { name: '账单币种', prop: 'billCurrency' },
        { name: '平台订单额', prop: 'platformOrderAmount' },
        { name: '平台退款', prop: 'platformRefund' },
        { name: 'OMS币种', prop: 'omsCurrency' },
        { name: 'OMS订单额', prop: 'omsOrderAmount' },
        { name: 'OMS退款', prop: 'omsRefund' },
        { name: '核销金额', prop: 'verifyAmount' }
      ],
      flowList: [
        { name: '平台名称', prop: 'platformName' },
        { name: '经营站点', prop: 'site' },
        { name: '店铺编码', prop: 'storeCode' },
        { name: '账单ID', prop: 'billId' },
        { name: '账单币种', prop: 'billCurrency' },
        { name: '账单放款', prop: 'billAmount' },
        { name: '收款方式', prop: 'payeeTypeName' },
        { name: '收款账号', prop: 'payeeAccount' },
        { name: '到账时间', prop: 'receivedDate' },
        { name: '交易流水号', prop: 'flowNumber' },
        { name: '流水币种', prop: 'flowCurrency' },
        { name: '到账流水', prop: 'flowReceived' }
      ]
    }
  },
  mounted() {
    this.init()
  },
  updated() {
    this.$refs.tabDetail && this.$refs.tabDetail.updateHeight()
  },
  methods: {
    fetch({ current, size }, params) {
      return (this.detailType === 'order' ? orderDetail : flowDetail)(this.info).then(res => {
        if (res.data?.adjustDetail === undefined) {
          this.detailList = Object.assign(this.detailList, res.data)
        } else {
          this.detailList = Object.assign(this.detailList, res.data, JSON.parse(res.data?.adjustDetail || '{"diffCause":""}'))
        }
        filterData(this.detailList)
        return {
          records: res.data?.hisList
        }
      })
    },

    init() {
      this.$refs.tableRef.load(1)
    }
  }
}
</script>

<style>

</style>
