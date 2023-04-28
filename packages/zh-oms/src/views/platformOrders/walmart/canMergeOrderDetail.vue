<template>
  <basic-container>
    <g-table ref="table"
             row-key="id"
             :headers="headers"
             :fetch="fetch"
             :dense="true"
             :span-method="spanMethod"
             :page-show="false"
             :fixed-height="false"
    >
      <div slot="header" class="text-end mb-2">
        <el-button v-if="$auth('oms_plat_wm_merge')" :disabled="checkedData.storeCode===''" type="primary" size="mini" @click="mergeHandler">合并订单</el-button>
      </div>

      <el-table-column slot="indexSlot" label="序号" width="45">
        <template slot-scope="{row, $index}">
          <el-checkbox v-model="row.isChecked" @change="changeChecked($index)" /><br>
          可合单组{{ row.index }}
        </template>
      </el-table-column>
      <el-table-column slot="recipientInfo" label="收件人信息" width="180">
        <template slot-scope="{row}">
          <g-list-group label-width="60px" label-align="center">
            <g-list-group-item label="收件人姓名">
              <g-text-ellipsis>{{ row.name }}</g-text-ellipsis>
            </g-list-group-item>

            <g-list-group-item label="国家">
              <g-text-ellipsis>{{ row.country }}</g-text-ellipsis>
            </g-list-group-item>

            <g-list-group-item label="地址">
              <g-text-ellipsis>{{ row.address1 }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <component :is="platItem[item.path]" v-for="(item,index) in pageConfig" :slot="item.path" :key="index" :arr-key="item.key" :item-data="item.itemData" :currency="item.currency" />
    </g-table>
  </basic-container>
</template>

<script>
import { getStoreByPlatform } from '@/api/common.js'
import { getWmPlatMergeList, getWmPlatMerge } from '@/api/walmart.js'
import { getDicts } from '@/api/common/dict'
import platItem from '../../components/platItem/index.js'
import formGroup from '../../components/form-group/index.vue'

export default {
  name: 'OmsPlatformOrdersWalmartCanMergeOrderDetail',
  components: {
    formGroup
  },
  data() {
    return {
      checkedData: {
        storeCode: '',
        orderIds: ''
      },
      platItem: platItem,
      headers: [
        { slot: true, slotName: 'indexSlot' },
        { slot: true, slotName: 'storeInfo' },
        { slot: true, slotName: 'orderInfo' },
        { slot: true, slotName: 'recipientInfo' },
        { slot: true, slotName: 'productInfo' },
        { slot: true, slotName: 'moneyInfo' },
        { slot: true, slotName: 'timeInfo' }
      ],
      storeList: [],
      orderTypeList: [], // 订单来源
      platOrderTypeList: [], // 订单类型
      pageConfig: [
        {
          path: 'storeInfo',
          itemData: [
            { label: '销售店铺', key: 'storeName', type: 'text' },
            { label: '销售站点', key: 'siteCode', type: 'text' },
            { label: '订单来源', key: 'orderType', type: 'text' },
            { label: '订单类型', key: 'platOrderType', type: 'text' }
          ]
        },
        {
          path: 'orderInfo',
          itemData: [
            { label: '平台单号', key: 'purchaseOrderId', type: 'copy', url: 'oms/platformOrders/walmart/details' },
            { label: '交易号', key: 'customerOrderId', type: 'text' },
            { label: '平台订单状态', key: 'orderStatus', type: 'text' }
          ]
        },
        {
          path: 'productInfo',
          key: 'goods',
          currency: 'shippingCurrency',
          itemData: [
            { label: '', key: 'productImgUrl', type: 'image' },
            { label: '商品名称', key: 'productName', type: 'text' },
            { label: 'ItemID', key: 'lineNumber', type: 'text' },
            { label: '在线SKU', key: 'sku', type: 'text' },
            { label: '数量', key: 'quantity', type: 'text' },
            { label: '单价', key: 'itemPrice', type: 'money' },
            { label: 'item状态', key: 'lineStatus', type: 'text' }
          ]
        },
        {
          path: 'moneyInfo',
          itemData: [
            { label: '订单总金额', key: 'orderAmount', type: 'text', currency: 'shippingCurrency' },
            { label: '客付运费', key: 'freightChargesAmount', type: 'text', currency: 'shippingCurrency' },
            { label: '税费', key: 'taxAmount', type: 'text', currency: 'shippingCurrency' }
          ]
        },
        {
          path: 'timeInfo',
          itemData: [
            { label: '创建时间', key: 'orderDate', type: 'text' },
            { label: '抓单时间', key: 'firstGrabDate', type: 'text' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    // 表格的单选处理
    changeChecked(index) {
      let maxIndex = index
      ;(this.$refs.table.tableList ?? []).map((row, i) => {
        if (index === i) {
          maxIndex += row.len
          row.isChecked = true
          this.checkedData.storeCode = row.storeCode
          this.checkedData.orderIds = row.purchaseOrderId
        } else if (maxIndex > i && i > index) {
          this.checkedData.orderIds += ',' + row.purchaseOrderId
        } else {
          row.isChecked = false
        }
        return row
      })
    },
    mergeHandler() {
      getWmPlatMerge(this.checkedData).then(res => {
        this.checkedReset()
        this.search(-1)
        this.$message.success(res.msg)
      })
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return row.len !== 0 ? [row.len, 1] : [0, 0]
      }
    },
    getStoreCodeList(resolve) { // 获取walmart的销售店铺
      getStoreByPlatform('WM').then(res => {
        this.storeList = res.data
        resolve(res.data)
      })
    },
    // 字典获取
    getDicts(type, resolve) {
      getDicts(['wm_plat_search_type', 'plat_order_type'], 'oms').then(res => {
        const data = [
          [{ label: '全部', value: '' }, ...res.plat_order_type],
          res.wm_plat_search_type
        ][type]
        this.orderTypeList = res.plat_order_type
        resolve(data)
      })
    },
    toOrderDetails({ purchaseOrderId }) {
      this.$newPage({
        path: 'oms/platformOrders/walmart/details',
        data: { purchaseOrderId }
      })
    },
    search(page = 1) {
      this.checkedReset()
      this.$refs.table.load(page)
    },
    formatterType(type, list) {
      list ??= []
      for (let i = 0; i < list.length; i++) {
        if (+list[i].value === type) return list[i].label
      }
    },
    fetch(query, data) {
      return getWmPlatMergeList({}).then(({ data }) => {
        const d = (data || []).reduce((pre, cur, index) => {
          cur = cur.map((item, i) => {
            if (i === 0) {
              item.len = cur.length
              item.isChecked = false
            } else item.len = 0
            item.index = index + 1
            item.orderType = this.formatterType(item.orderType, this.orderTypeList)
            item.shippingCurrency = Array.isArray(item.goods) && item.goods[0]?.shippingCurrency
            return item
          })
          pre.push.apply(pre, cur)
          return pre
        }, [])
        return { records: d }
      })
    },
    checkedReset() {
      this.checkedData.orderIds = ''
      this.checkedData.storeCode = ''
    },
    reset(formName) {
      const { resetFields } = this.$refs[formName].ref
      resetFields()
      this.formData.searchType = '1'
      this.formData.searchContent = ''
      this.checkedReset()
      this.$nextTick(this.search)
    }
  }
}
</script>
