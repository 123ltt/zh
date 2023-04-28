<template>
  <basic-container>
    <g-table ref="tableRef" :fetch="fetch" :headers="headers" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
      <template #header>
        <cols-form ref="formRef" :cols="3" :form-item="formItem" :form-info="formInfo" :form-handler="formHandler">

          <template #orderId>
            <el-form-item style="width:780px">
              <template #label>
                <el-select v-model="formInfo.orderCodeType">
                  <el-option
                    v-for="item in orderCodeTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    clearable
                  />
                </el-select>
              </template>
              <el-input v-model="formInfo.orderCodeList" style="width:245px" clearable placeholder="多个用英文逗号隔开" />
              <el-button v-for="itemHandle in formHandler" :key="itemHandle.label" :type="itemHandle.type||'primary'" size="mini" @click="itemHandle.handler&&itemHandle.handler()">{{ itemHandle.label }}</el-button>
            </el-form-item>

          </template>
        </cols-form>
        <el-tabs v-model="formInfo.status">
          <el-tab-pane name="''" label="全部" />
          <el-tab-pane name="1" label="待匹配" />
          <el-tab-pane name="2" label="匹配异常" />
          <el-tab-pane name="3" label="待核销" />
          <el-tab-pane name="4" label="已核销" />
          <el-tab-pane name="5" label="超龄未核销" />
        </el-tabs>
      </template>
      <el-table-column slot="orderCode" label="订单号" width="170">
        <template v-slot="{row}">
          <p align="left">平台:{{ row.platformOrderCode }}</p>
          <p align="left">OMS:{{ row.omsOrderCode }}</p>
        </template>
      </el-table-column>
      <el-table-column slot="operation" label="操作">
        <template v-slot="{row}">
          <el-button type="text" @click="showDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import colsForm from '@/views/components/colsForm'
import { getStoreCodeList, getSiteNameList, getPlatformList, getTenantList } from '@/api/common'
import { getOmsList } from '@/api/oms'
import orderDetail from './orderDetail'
import { filterData } from '../..//utils/filterData'

export default {
  name: 'PrsOmsOrderOmsOrder',
  components: { colsForm },
  data() {
    return {
      orderCodeTypeList: [{
        label: '平台单号', value: 1
      },
      {
        label: 'OMS单号', value: 2
      }
      ],
      formItem: [
        {
          type: 'gselect',
          label: '租户ID',
          prop: 'tenantId',
          options: [],
          optionValue: 'value',
          optionLabel: 'value'

        },
        {
          type: 'gselect',
          label: '平台名称',
          prop: 'platformCode',
          options: [],
          optionValue: 'platformCode',
          optionLabel: 'platformName'
        },
        {
          type: 'bselect',
          label: '经营站点',
          prop: 'site',
          options: []
        },

        {
          type: 'gselect',
          optionValue: 'value',
          label: '店铺编码',
          prop: 'storeCode',
          options: []
        },
        {
          type: 'slot',
          slotName: 'orderId'

        }
      ],
      headers: [
        { label: '租户ID', prop: 'tenantId' },
        { label: '平台', prop: 'platformName' },
        { label: '站点', prop: 'site' },
        { label: '店铺编码', prop: 'storeCode' },
        { slot: true, slotName: 'orderCode' },
        { label: '订单时间', prop: 'orderTime' },
        { label: '收款币种', prop: 'omsAmountCurrency' },
        { label: '订单额', prop: 'omsAmount' },
        { label: '退款币种', prop: 'omsRefundCurrency' },
        { label: '退款', prop: 'omsRefund' },
        { slot: true, slotName: 'operation' }
      ],
      formHandler: [{
        label: '查询',
        handler: () => {
          this.search()
        }
      },
      {
        label: '重置',
        handler: () => {
          this.reset()
        },
        type: 'plan'
      }],
      formInfo: {
        status: "''",
        storeCode: '',
        site: '',
        platformCode: '',
        tenantId: ''
      }
    }
  },
  watch: {
    'formInfo.status'() {
      this.$nextTick(() => {
        this.init()
      })
    },
    'formInfo.platformCode'(val) {
      this.formInfo.storeCode = ''
      this.formInfo.site = ''
      if (val) {
        getStoreCodeList({ platformCode: val }).then(res => {
          this.formItem[3].options = res.data
        })
        getSiteNameList({ platformCode: val }).then(res => {
          this.formItem[2].options = res.data
        })
      } else {
        this.formItem[2].options = []
        this.formItem[3].options = []
      }
    }

  },
  mounted() {
    this.getData()
    // this.init()
  },
  methods: {
    getData() {
      getTenantList().then(res => {
        this.formItem[0].options = res.data
      })
      getPlatformList().then(res => {
        this.formItem[1].options = res.data
        this.formInfo.platformCode = res.data[0]?.platformCode
        this.init()
      })
    },
    fetch({ current, size }, params) {
      return getOmsList(current, size, params).then((res) => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    search() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    reset() {
      this.formInfo = {
        status: "''",
        storeCode: '',
        site: '',
        platformCode: '',
        tenantId: ''
      }
      this.init()
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    showDetail(row) {
      this.$newTab({
        path: '/omsOrder/all',
        title: '订单详情',
        component: orderDetail,
        clearCache: true,
        data: {
          id: row.id
        }

      })
    }
  }
}
</script>

<style scoped lang="scss">

// .el-input{
//    width: 245px  !important;
//  }
</style>
