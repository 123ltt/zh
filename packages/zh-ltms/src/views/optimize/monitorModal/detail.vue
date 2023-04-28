<template>
  <basic-container class="monitorDetail">
    <el-radio-group v-model="type" size="mini" class="mb-3">
      <el-radio-button v-for="item in tabList" :key="item.dictKey" ref="buttonref" :label="item.dictKey">{{ item.dictValue }}</el-radio-button>
    </el-radio-group>
    <el-table
      v-show="type==='1'"
      ref="dealTable"
      border
      stripe
      class="g-table g-table-dense "
      highlight-current-row
      :data="dealData"
      default-expand-all
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div>
            <el-table
              border
              stripe
              class="g-table g-table-dense priceExpandsTable"
              highlight-current-row
              :data="props.row.list"
            >
              <el-table-column label="筛选信息" align="center" min-width="120px">
                <template slot-scope="{row}">
                  <g-text-ellipsis>{{ row.msg }}</g-text-ellipsis>
                </template>
              </el-table-column>

              <el-table-column prop="name" label="筛选名称" align="center" min-width="100px" />
              <el-table-column prop="timeConsume" label="筛选耗时(ms)" align="center" min-width="100px" />
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="筛选类种" prop="name" />

    </el-table>

    <el-table v-show="type==='2'"
              ref="priceLogTable"
              border
              stripe
              class="g-table g-table-dense"
              :data="priceLogList"
              style="width: 100%"
    >
      <el-table-column label="渠道名称" align="center" min-width="120px">
        <template slot-scope="props">
          <g-text-ellipsis>{{ props.row.name }}</g-text-ellipsis>
        </template>
      </el-table-column>

      <template v-for="(item,index) in priceLogHeaders">

        <el-table-column v-if="item.slotName==='firstCost'" :key="index" :label="item.label" align="center">
          <template slot-scope="props">
            <g-link v-if="props.row.firstCost &&props.row.channelCode"
                    color="primary"
                    @click="detailBtn(props.row, item.value)"
            >
              {{ props.row.firstCost }}
            </g-link>
            <span v-else :disable="true">
              {{ props.row.firstCost }}
            </span>
          </template>
        </el-table-column>

        <el-table-column v-if="item.slotName==='tailCost'" :key="index" :label="item.label" align="center">
          <template slot-scope="props">
            <g-link v-if="props.row.tailCost && props.row.channelCode"
                    color="primary"

                    @click="detailBtn(props.row, item.value)"
            >
              {{ props.row.tailCost }}
            </g-link>
            <span v-else :disable="true">
              {{ props.row.tailCost }}
            </span>
          </template>
        </el-table-column>

        <el-table-column v-if="item.slotName==='fullCost'" :key="index" :label="item.label" align="center">
          <template slot-scope="props">
            <g-link v-if="props.row.fullCost && props.row.channelCode"

                    color="primary"
                    @click="detailBtn(props.row, item.value)"
            >
              {{ props.row.fullCost }}
            </g-link>
            <span v-else :disable="true">
              {{ props.row.fullCost }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :key="index" v-bind="item" />
      </template>

    </el-table>

  </basic-container>

</template>
<script>

import channelPriceDetail from '@/views/provider/costOfferModal/priceDetail'
import { dictionary, logisticsChannel } from '@/api/common'
import { idAddressDetail } from '@/api/costOffer'
export default {
  name: 'MonitorDetail',
  props: {
    detailInfo: Object
  },
  data() {
    return {
      loading: false,
      type: '1',
      tabList: [
        { dictKey: '1', dictValue: '处理详情' },
        { dictKey: '2', dictValue: '价格日志' }
      ],
      dealData: [],
      priceLogList: [],
      expands: [],
      channelList: [],
      priceLogHeaders: [
        { prop: 'totalCost', label: '总费用', align: 'center', minWidth: '90px' },
        { slot: true, slotName: 'firstCost', minWidth: '90px', label: '头程费' },
        { slot: true, slotName: 'tailCost', minWidth: '90px', label: '尾程费' },
        { slot: true, slotName: 'fullCost', minWidth: '90px', label: '全段费用' },
        { prop: 'additionCost', label: '总附加费', align: 'center', minWidth: '90px' },
        { prop: 'fuelRate', label: '燃油费率', align: 'center', minWidth: '90px' },
        { prop: 'fuelCost', label: '燃油费', align: 'center', minWidth: '90px' },
        { prop: 'tax', label: '关税', align: 'center', minWidth: '90px' },
        { prop: 'discount', label: '折扣', align: 'center', minWidth: '90px' },
        { prop: 'rate', label: '汇率', align: 'center', minWidth: '90px' }
      ]
    }
  },
  created() {
    this.getData()
  },

  methods: {
    getData() {
      Promise.all([
        logisticsChannel(),
        dictionary('tms_base_channel_price_item_name')
      ]).then(res => {
        this.channelList = res[0].data
        this.priceLogHeaders.forEach(item => {
          const arr = ['firstCost', 'tailCost', 'fullCost']
          arr.forEach((e, i) => {
            if (item.slotName === e) {
              item.value = res[1].data[i].dictKey
            }
          })
        })
        this.init()
      })
    },

    init() {
      if (this.detailInfo.channelPriceLogList) {
        this.priceLogList = this.detailInfo.channelPriceLogList
        this.priceLogList.forEach(item => {
          item.name = this.channelList.find(e => e.channelCode === item.channelCode)?.name
        })
      }

      const handlerMap = this.detailInfo.channelOptimizeHandlerMap
      for (const prop in handlerMap) {
        const array = [
          {
            prop: 'IChannelFilterHandler',
            name: '总筛选'
          },
          {
            prop: 'IChannelOptimizeHandler',
            name: '渠道筛选'
          },
          {
            prop: 'priceFilter',
            name: '价格筛选'
          }]
        array.forEach(item => {
          if (item.prop === prop) {
            this.dealData.push({
              name: item.name,
              list: handlerMap[prop]
            })
          }
        })
      }
    },

    detailBtn(row, val) {
      const list = this.detailInfo.channelPriceDetailMap[row.channelCode]
      const data = list.find(item => item.chargeItemCode === val)
      idAddressDetail({ id: data.priceId }).then(res => {
        const itemEdition = res.data.itemEditionVO
        const channelInfo = {
          itemId: data.priceId,
          ...itemEdition,
          itemName: res.data.itemVO.itemCode,
          current: res.data.page || ''
        }
        this.$newTab({
          path: '/provider/costOffModal/priceDetail',
          title: '渠道价格详情',
          component: channelPriceDetail,
          clearCache: true,
          data: {
            row: channelInfo
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .g-table.el-table.g-table-dense td .cell {
    line-height: 24px;
}
</style>
