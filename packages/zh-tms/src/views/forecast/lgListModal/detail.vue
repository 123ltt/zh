<template>
  <basic-container>
    <el-row type="flex" :gutter="8" class="row">
      <el-col v-for="(items, index) in detailRow1" :key="index" :span="12">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <template v-if="index === 0">
              <span>基本信息</span>
              <a
                :href="logisticsListInfo.labelUrl"
                class="float-end px-1 py-0"
                :class="[!logisticsListInfo.labelUrl?'text-info':'text-primary']"
                target="_blank"
              >
                物流面单
              </a>

            </template>
            <span v-else>发货明细</span>
          </div>
          <template v-if="index===0">
            <g-list-group v-for="(item,i) in items" :key="i" :cols="3" label-width="60px">
              <g-list-group-item v-for="(e,j) in item" :key="j" :label="e.label">
                <g-text-ellipsis>{{ logisticsListInfo[e.prop] }}</g-text-ellipsis>
              </g-list-group-item>
            </g-list-group>
          </template>
          <template v-else>
            <el-table
              :data="deliveryDetailList"
              style="width: 100%"
              border
              stripe
              class="g-table g-table-dense"
            >
              <el-table-column v-loading.fullscreen.lock="loading" type="expand">
                <el-table
                  :data="goodsDetailList"
                  style="width: 100%"
                  border
                  stripe
                  class="g-table g-table-dense"
                >
                  <el-table-column
                    v-for="(item,i) in items[1]"
                    :key="i"
                    :label="item.label"
                    :prop="item.prop"
                  />
                </el-table>
              </el-table-column>
              <el-table-column
                v-for="(item,i) in items[0]"
                :key="i"
                :label="item.label"
                :prop="item.prop"
              />
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
          <g-list-group v-for="(item,i) in items" :key="i" :cols="3" :label-width="index===0?'60px':'80px'">
            <g-list-group-item v-for="(e,j) in item" :key="j" :label="e.label">
              <g-text-ellipsis>{{ index===0?receiverDetailList[e.prop]:costDetail[e.prop] }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </el-card>
      </el-col>
    </el-row>

    <!-- 状态选项卡 -->
    <el-tabs v-model="active" lazy>
      <el-tab-pane label="状态" name="showStatus">
        <el-steps :active="statusActive" finish-status="finish" align-center process-status="process" class="mt-4">
          <el-step v-if="progressResults===1 || logisticsListInfo.trackNoTime" title="申请跟踪号" :description="logisticsListInfo.trackNoTime" />
          <el-step v-if="progressResults===1 || logisticsListInfo.labelTime" title="申请面单" :description="logisticsListInfo.labelTime" />
          <el-step v-if="progressResults===1" title="订单完成" :description="logisticsListInfo.finishTime" />
          <el-step v-if="progressResults===2" title="订单取消" status="error" :description="logisticsListInfo.finishTime" />
          <el-step v-if="progressResults===3" title="预报异常" status="error" :description="logisticsListInfo.finishTime" />
        </el-steps>
      </el-tab-pane>

    </el-tabs>

  </basic-container>
</template>
<script>
import { getGoodsDetail, getReceiverDetail, getCostDetail } from '@/api/forecast/logisticsSheet'
export default {
  name: 'LogisticsListDetail',
  props: {
    detailInfo: Object
  },
  data() {
    return {
      loading: false,
      statusActive: 0,
      active: 'showStatus',
      progressResults: 1,
      logisticsListInfo: {},
      goodsDetailList: [],
      receiverDetailList: [],
      deliveryDetailList: [],
      costDetail: [],
      detailRow1: Object.freeze([
        [
          [
            { label: '物流单', prop: 'code' },
            { label: '平台单号', prop: 'platformNumber' },
            { label: '包裹号', prop: 'referenceNumber' }
          ],
          [
            { label: '状态', prop: 'status' },
            { label: '物流商名称', prop: 'providerName' },
            { label: '渠道名称', prop: 'channelName' }
          ],
          [
            { label: '跟踪号', prop: 'trackingNumber' },
            { label: '扩展跟踪号', prop: 'trackingNumberEx' },
            { label: '创建时间', prop: 'createTime' }
          ],
          [
            { label: '完成时间', prop: 'finishTime' }
          ]
        ],
        [
          [
            { label: '包裹号', prop: 'referenceNumber' },
            { label: '包裹计费重', prop: 'chargeWeight' },
            { label: '包裹实重', prop: 'totalWeight' },
            { label: '包裹体积重', prop: 'volumeWeight' },
            { label: '包裹申报价值', prop: 'joinTotalCost' }
          ],
          [
            { label: '产品编码', prop: 'sku' },
            { label: '申报中文名', prop: 'nameCn' },
            { label: '申报英文名', prop: 'nameEn' },
            { label: '产品数量', prop: 'number' },
            { label: '产品总重量', prop: 'weight' },
            { label: '产品总申报价值', prop: 'totalDeclaredValue' }
          ]
        ]
      ]),
      detailRow2: Object.freeze([
        [
          [
            { label: '收件人', prop: 'name' },
            { label: '国家简称', prop: 'countryCode' },
            { label: '省/州', prop: 'province' }
          ],
          [
            { label: '城市', prop: 'city' },
            { label: '邮编', prop: 'postCode' },
            { label: '买家ID', prop: 'buyerCode' }
          ],
          [
            { label: '固定电话', prop: 'tel' },
            { label: '移动电话', prop: 'phone' },
            { label: '地址一', prop: 'address' }
          ],
          [
            { label: '地址二', prop: 'address1' }
          ]
        ],
        [
          [
            { label: '包裹总运费', prop: 'totalFreight' },
            { label: '基础运费(全程)', prop: 'fullCost' },
            { label: '头程费', prop: 'firstCost' }
          ],
          [
            { label: '尾程费', prop: 'tailCost' },
            { label: '附加费', prop: 'additionCost' },
            { label: '关税', prop: 'tax' }
          ]

        ]

      ])
    }
  },
  created() {
    this.logisticsListInfo = JSON.parse(JSON.stringify(this.detailInfo))
    this.getData()
  },

  methods: {
    getData() {
      const oId = this.logisticsListInfo.id
      Promise.all([
        getGoodsDetail({ oId }),
        getReceiverDetail({ oId }),
        getCostDetail({ oId })
      ]).then(res => {
        this.goodsDetailList = res[0].data
        this.receiverDetailList = res[1].data
        this.costDetail = res[2].data
        this.init()
      })
    },
    init() {
      // 处理发货明细 内容
      ['chargeWeight', 'totalWeight', 'volumeWeight'].forEach(item => {
        this.logisticsListInfo[item] = this.logisticsListInfo[item] && this.dealDecimal(this.logisticsListInfo[item]) + 'kg'
      })
      this.deliveryDetailList.push(this.logisticsListInfo)
      this.logisticsListInfo.joinTotalCost = this.logisticsListInfo.codCurrency + ' ' + this.dealDecimal(this.logisticsListInfo.totalCost)
      // 处理产品详情 数据
      this.goodsDetailList[0].weight = this.goodsDetailList[0].weight && this.dealDecimal(this.goodsDetailList[0].weight) + 'kg'
      this.goodsDetailList[0].totalDeclaredValue = this.goodsDetailList[0].currency + ' ' + this.dealDecimal(this.goodsDetailList[0].cost)
      // 收件信息 数据
      this.receiverDetailList.buyerCode = this.logisticsListInfo.buyerCode
      // 费用明细
      if (this.costDetail) {
        for (const prop in this.costDetail) {
          this.costDetail[prop] = this.costDetail[prop] ? 'RMB ' + this.dealDecimal(this.costDetail[prop]) : ''
        }
      } else {
        this.costDetail = {}
      }
      // 处理步骤条
      switch (this.logisticsListInfo.statusKey) {
        case 10:
          this.statusActive = 0
          break
        case 20:
          this.statusActive = 1
          break
        case 30:
          this.statusActive = 0
          break
        case 40: // 回传面单
          this.statusActive = 1
          break
        case 50: // 订单完成
          this.statusActive = 3
          this.progressResults = 1
          break
        case 70: // 取消中
          this.statusActive = 3
          this.progressResults = 2
          break
        case 80: // 已取消
          this.statusActive = 3
          this.progressResults = 1
          break
        case 90: // 预报异常
          this.statusActive = 3
          this.progressResults = 3
          break
      }
    },
    dealDecimal(val) {
      return Number(Number(val).toFixed(3))
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
.el-tabs.el-tabs--top{
  margin-top:20px;
}
::v-deep .el-card__body {
  padding: 10px !important;
}
</style>
