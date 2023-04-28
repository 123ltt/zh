<template>
  <basic-container>
    <el-row type="flex" :gutter="8" class="row">
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <template>
            <g-list-group v-for="(item,i) in detailRow1[0]" :key="i" :cols="2" label-width="90px">
              <g-list-group-item v-for="(e,j) in item" :key="j" :label="e.label">
                <g-text-ellipsis>{{ baseInfo[e.prop] }}</g-text-ellipsis>
              </g-list-group-item>
            </g-list-group>
          </template>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" style="height:200px;overflow:auto;width:100%">
          <div slot="header" class="clearfix">
            <span>包裹明细</span>

          </div>
          <template>
            <el-table
              :data="parcelList"
              dense
              border
              stripe
              default-expand-all
              class="g-table g-table-dense"
            >
              <el-table-column type="expand">
                <el-table
                  :data="productsList"
                  border
                  stripe
                  class="g-table g-table-dense"
                >
                  <el-table-column
                    v-for="(item,i) in headers[1]"
                    :key="i"
                    :label="item.label"
                    :prop="item.prop"
                    :align="item.align"
                  />
                </el-table>
              </el-table-column>
              <el-table-column v-for="(item,i) in headers[0]"
                               :key="i"
                               v-bind="item"
              >
                <template #default="{row}">
                  <g-text-ellipsis>{{ row[item.prop] }}</g-text-ellipsis>
                </template>
              </el-table-column>
            </el-table>

          </template>

        </el-card>
      </el-col>
    </el-row>

    <el-row type="flex" :gutter="8" class="row">
      <el-col v-for="(items, index) in detailRow2" :key="index" :span="12">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span v-if="index===0">收件信息</span>
            <span v-else>费用明细</span>
          </div>
          <g-list-group v-for="(item,i) in items" :key="i" :cols="2" :label-width="index===0?'60px':'120px'">
            <g-list-group-item v-for="(e,j) in item" :key="j" :label="e.label">
              <g-text-ellipsis>
                {{ index===0?receiverDetailList[e.prop]:logisticsRules[e.prop] }}
              </g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </el-card>
      </el-col>
    </el-row>

    <!-- 可用渠道不可用渠道组件 -->
    <el-tabs id="diffChannels" v-model="activeName">
      <el-tab-pane label="可用渠道" name="availChannel" lazy class="heightControl">
        <el-table
          :data="successChannels"
          border
          stripe
          class="g-table g-table-dense"
        >
          <el-table-column v-for="(item,i) in headers[2]"
                           :key="i"
                           v-bind="item"
          >
            <template #default="{row}">
              <g-text-ellipsis>{{ row[item.prop] }}</g-text-ellipsis>
            </template>
          </el-table-column>

        </el-table>

      </el-tab-pane>
      <el-tab-pane label="不可用渠道" name="unavailChannel" lazy class="heightControl">
        <el-table
          :data="failedChannels"
          border
          stripe
          class="g-table g-table-dense"
        >
          <el-table-column v-for="(item,i) in headers[3]"
                           :key="i"
                           v-bind="item"
          >
            <template #default="{row}">
              <g-text-ellipsis>{{ row[item.prop] }}</g-text-ellipsis>
            </template>
          </el-table-column>

        </el-table>

      </el-tab-pane>

    </el-tabs>

    <!-- 优选日志组件 -->
    <el-tabs id="preferredLogs" v-model="activeName1">
      <el-tab-pane label="优选日志" name="preferredLog" lazy class="heightControl">
        <el-table
          :data="preferredLogList"
          border
          stripe
          class="g-table g-table-dense"
        >
          <el-table-column label="请求方" align="center">
            <template #default="{row}">
              {{ row.requestType }}
            </template>
          </el-table-column>
          <el-table-column label="请求" align="center">
            <template #default="{row}">
              <g-link color="primary" @click="request(row.request,'请求')">查看请求</g-link>
            </template>
          </el-table-column>
          <el-table-column label="响应" align="center">
            <template #default="{row}">
              <g-link color="primary" @click="request(row.response,'响应')">查看响应</g-link>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template #default="{row}">
              {{ row.createTime }}
            </template>
          </el-table-column>
          <el-table-column label="响应" align="center">
            <template #default="{row}">
              {{ row.finishTime }}
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>

    </el-tabs>

  </basic-container>
</template>
<script>
import { getDetail } from '@/api/orderOpt.js'
import { getDictVal } from '@/views/until'
import { dictionary, getWarehouseTypeTree, logisticsProperty, logisticsChannel } from '@/api/common'
import showJson from './showJson'
export default {
  name: 'LogisticsListDetail',
  props: {
    detailInfo: Object,
    requestTypeList: Array
  },
  data() {
    return {
      loading: false,
      baseInfo: [],
      receiverDetailList: [],
      logisticsRules: [],
      productsList: [],
      expands: [],
      parcelList: [],
      successChannels: [],
      failedChannels: [],
      list: [],
      preferredLogList: [],
      activeName: 'availChannel',
      activeName1: 'preferredLog',
      headers: [
        [
          { label: '包裹重量', prop: 'weight', minWidth: '70px', align: 'center' },
          { label: '包裹长', prop: 'length', minWidth: '70px', align: 'center' },
          { label: '包裹宽', prop: 'width', minWidth: '70px', align: 'center' },
          { label: '包裹高', prop: 'height', minWidth: '70px', align: 'center' },
          { label: '包裹体积', prop: 'volume', minWidth: '70px', align: 'center' },
          { label: '包裹运费', prop: 'paidCost', minWidth: '70px', align: 'center' },
          { label: '包裹总金额', prop: 'totalPrice', minWidth: '90px', align: 'center' },
          { label: '包裹物流属性', prop: 'logisticsProperty', minWidth: '100px', align: 'center' }
        ],
        [
          { label: '产品编码', prop: 'sku', align: 'center' },
          { label: '商品单价', prop: 'price', align: 'center' },
          { label: '产品数量', prop: 'num', align: 'center' },
          { label: '产品运费', prop: 'freight', align: 'center' },
          { label: '产品属性', prop: 'logisticsProperty', align: 'center' }
        ],
        [
          { label: '渠道代码', prop: 'channelCode', align: 'center', minWidth: '90px' },
          { label: '渠道名称', prop: 'channelName', align: 'center', minWidth: '120px' },
          { label: '物流总费用', prop: 'cost', align: 'center', minWidth: '80px' },
          { label: '头程费', prop: 'firstCost', align: 'center', minWidth: '80px' },
          { label: '尾程费', prop: 'tailCost', align: 'center', minWidth: '80px' },
          { label: '全段费用', prop: 'fullCost', align: 'center', minWidth: '80px' },
          { label: '附加费', prop: 'additionCost', align: 'center', minWidth: '80px' },
          { label: '燃油费', prop: 'fuelCost', align: 'center', minWidth: '80px' },
          { label: '关税', prop: 'tax', align: 'center', minWidth: '80px' },
          { label: '折扣', prop: 'discount', align: 'center', minWidth: '80px' }
        ],
        [
          { label: '渠道代码', prop: 'channelCode', align: 'center', minWidth: '90px' },
          { label: '渠道名称', prop: 'channelName', align: 'center', minWidth: '120px' },
          { label: '异常原因', prop: 'illegalReason', align: 'center', minWidth: '200px' }
        ]
      ],
      detailRow1: Object.freeze([
        [
          [
            { label: '租户ID', prop: 'tenantId' },
            { label: '平台', prop: 'platformName' }
          ],
          [
            { label: '包裹号', prop: 'parcelNumber' },
            { label: 'OMS订单号', prop: 'referenceNumber' }
          ],
          [
            { label: '虚拟仓标识', prop: 'virtualWarehouse' },
            { label: '发货仓库', prop: 'warehouseCode' }
          ],
          [
            { label: '店铺', prop: 'storeCode' },
            { label: '线上服务名', prop: 'onlineServiceName' }
          ]
        ]
      ]),
      detailRow2: Object.freeze([
        [
          [
            { label: '收件人', prop: 'name' },
            { label: '国家简称', prop: 'countryCode' }
          ],
          [
            { label: '省/州', prop: 'province' },
            { label: '城市', prop: 'city' }
          ],
          [
            { label: '邮编', prop: 'postCode' }
          ]
        ],
        [
          [
            { label: '指定渠道', prop: 'channelCodes' },
            { label: '指定泽汇海外仓渠道ID', prop: 'owmsChannelId' }

          ],
          [
            { label: '排序策略', prop: 'sortType' }
          ]
        ]
      ])
    }
  },

  mounted() {
    this.getData()
  },
  methods: {
    initShipment(val) {
      function getParentCode(list, code) {
        for (const i in list) {
          if (list[i].code + '' === code + '') return [list[i].desc]
          if (list[i].warehouseChildVOList) {
            const node = getParentCode(list[i].warehouseChildVOList, code)
            if (node !== undefined) return node.concat(list[i].desc)
          }
        }
      }
      return getParentCode(this.list, val)?.shift()
    },
    initProperty(val) {
      function getParentCode(list, id) {
        for (const i in list) {
          if (list[i].id + '' === id + '') return [list[i].propertyName]
          if (list[i].children) {
            const node = getParentCode(list[i].children, id)
            if (node !== undefined) return node.concat(list[i].propertyName)
          }
        }
      }
      return getParentCode(this.propertyList, val)?.shift()
    },
    getData() {
      const referenceNumber = this.detailInfo.referenceNumber
      Promise.all([
        getDetail({ referenceNumber }),
        getWarehouseTypeTree(),
        logisticsProperty(),
        logisticsChannel(),
        dictionary('logistics_surcharge_type'),
        dictionary('tms_base_channel_price_item_name'),
        dictionary('channel_sort_type')
      ]).then(res => {
        const detailList = res[0].data.optimizeDocument
        this.list = res[1].data
        this.propertyList = res[2].data
        const senderInfo = JSON.parse(detailList.sender)
        this.baseInfo = Object.assign(detailList, this.detailInfo, {
          virtualWarehouse: senderInfo.virtualWarehouse ? '是' : '否',
          warehouseCode: senderInfo.warehouseCode
            ? this.initShipment(senderInfo.warehouseCode)
            : ''
        })

        const parcel = JSON.parse(detailList.parcel)
        this.parcelList = [
          {
            weight: parcel.weight + 'kg',
            height: parcel.height + 'cm',
            width: parcel.width + 'cm',
            length: parcel.length + 'cm',
            volume: parcel.volume + 'cm^3',
            paidCost: detailList.paidCost ? detailList.paidCost + 'USD' : '',
            totalPrice: parcel.totalPrice + 'USD',
            logisticsProperty: detailList.logisticsProperty.map(item => this.initProperty(item)).join('、')
          }
        ]
        this.productsList = parcel.products.map(item => {
          const logisticsProperty = Array.isArray(item.logisticsProperty)
            ? item.logisticsProperty
            : [item.logisticsProperty]
          return {
            ...item,
            logisticsProperty: logisticsProperty.map(e => this.initProperty(e)).join('、')
          }
        })

        this.receiverDetailList = JSON.parse(detailList.receiver)

        this.logisticsRules = JSON.parse(detailList.logistics)
        this.logisticsRules.sortType = getDictVal(res[6].data, this.logisticsRules.sortType)

        if (this.logisticsRules.channelCodes) {
          const channelCodes = this.logisticsRules.channelCodes.map(e =>
            res[3].data.find(i => i.channelCode === e).name
          )
          this.logisticsRules.channelCodes = channelCodes.length ? channelCodes : ''
        }

        this.logisticsRules.owmsChannelId = this.logisticsRules.owmsChannelId &&
            res[3].data.find(i => i.owmsChannelId === this.logisticsRules.owmsChannelId)?.name

        // 可用渠道和不可用数据
        this.successChannels = detailList.successChannels.map(item => {
          const A1 = +item.priceBO.priceDetails.find(item => item.itemCode === 'A00001')?.price || 0
          const A2 = +item.priceBO.priceDetails.find(item => item.itemCode === 'A00002')?.price || 0
          const A3 = +item.priceBO.priceDetails.find(item => item.itemCode === 'A00003')?.price || 0
          const A4 = +item.priceBO.priceDetails.find(item => item.itemCode === 'A00004')?.price || 0
          return {
            channelCode: item.channelCode,
            channelName: item.channelName,
            cost: item.priceBO.cost || '--',
            tax: item.priceBO.tax || '--',
            discount: item.priceBO.discount || '--',
            firstCost: item.priceBO.priceDetails.find(item => item.itemCode === 'C00001')?.price || '--',
            tailCost: item.priceBO.priceDetails.find(item => item.itemCode === 'C00002')?.price || '--',
            fullCost: item.priceBO.priceDetails.find(item => item.itemCode === 'C00003')?.price || '--',
            fuelCost: item.priceBO.priceDetails.find(item => item.itemCode === 'B00001')?.price || '--',
            additionCost: (A1 + A2 + A3 + A4) || '--'
          }
        })
        this.failedChannels = detailList.failedChannels

        // 优选日志 数据
        this.preferredLogList = res[0].data.history.map(item => {
          item.requestType = getDictVal(this.requestTypeList, item.requestType)
          return item
        })
      })
    },
    request(val, label) {
      this.$modal({
        title: `${label}数据展示`,
        component: showJson,
        width: '500px',
        data: { jsonData: JSON.parse(val) },
        callback: (bool) => {}
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.row {
  align-items: stretch;
  &>.el-col .el-card{
    height: 100%;
  }
}

::v-deep .el-card__body {
  padding: 5px !important;
}
::v-deep .g-table.el-table.g-table-dense td .cell {
    line-height: 32px;
}
.heightControl{
  max-height:300px;
  height:auto;
  overflow:auto;
  border-bottom:1px solid #eee
}

</style>
