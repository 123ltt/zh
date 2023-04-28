<template>
  <basic-container class="platform_detail">
    <el-row ref="formRef" class="row">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>

        <g-list-group :cols="3" label-width="100px">
          <template v-for="(item) in groupList3">
            <g-list-group-item :key="item.prop" :label="item.label">
              <g-text-ellipsis>
                <span v-if="item.prop === 'weight'">
                  {{ platformLimitInfo.weightLow }}~{{ platformLimitInfo.weightHigh }}(单位：kg)
                </span>
                <span v-else-if="item.prop === 'distribution'">
                  <span v-if="platformLimitInfo.distributionNum">{{ platformLimitInfo.distributionNum }}
                    (<span class="text-danger fw-bold">剩余数： {{ platformLimitInfo.surplusDistributionNum }}</span>)
                  </span>
                </span>
                <span v-else>{{ platformLimitInfo[item.prop] }}</span>
              </g-text-ellipsis>
            </g-list-group-item>
          </template>
        </g-list-group>

        <g-list-group :cols="1" label-width="100px">
          <template v-for="(item,index) in groupList1">

            <!-- 国家 -->
            <g-list-group-item
              v-if="item.prop==='country' && platformLimitInfo.channelSaleLimitCountryVos"
              :key="index"
              :label="item.label"
            >
              <arrowShowDetail
                :selected-list="platformLimitInfo.channelSaleLimitCountryVos"
                :render-type="item.prop"
                :length="80"
              />
            </g-list-group-item>

            <!-- 店铺 -->
            <g-list-group-item
              v-else-if="item.prop==='stores' && platformLimitInfo.channelSaleLimitStoreVos"
              :key="index"
              :label="getStoreType(platformLimitInfo.storeType)"
            >
              <arrowShowDetail
                :selected-list="storeVos"
                :render-type="item.prop"
                :length="100"
                :has-platform="true"
              />
            </g-list-group-item>

            <!-- 备注 -->
            <g-list-group-item v-else :key="index" :label="item.label">
              <g-text-ellipsis>{{ platformLimitInfo[item.prop] }}</g-text-ellipsis>
            </g-list-group-item>
          </template>
        </g-list-group>
      </el-card>
    </el-row>
    <detailTab :id="detailInfo.id+''" type="channel_platform_limit" />
  </basic-container>
</template>
<script>
import arrowShowDetail from '../../components/arrowShowDetail'
import detailTab from '../../components/detailTab'
import { platformDetail } from '@/api/platformLimits'
import { dictionary } from '@/api/common'

export default {
  name: 'ChannelDetail',
  components: { arrowShowDetail, detailTab },
  props: {
    detailInfo: Object
  },
  data() {
    return {
      loading: false,
      activeName: 'handleRecords',
      storeTypeList: [],
      platformLimitInfo: {},
      storeVos: [],
      groupList3: Object.freeze(
        [
          { label: '渠道名称', prop: 'channelName' },
          { label: '限制名称', prop: 'name' },
          { label: '线上渠道', prop: 'onlineChannel' },
          { label: '重量', prop: 'weight' },
          { label: '日分配数', prop: 'distribution' },
          { label: '优先级', prop: 'priority' },
          { label: '总金额', prop: 'totalPrice' },
          { label: '单件金额', prop: 'price' },
          { label: '订单运费', prop: 'orderFreight' }
        ]
      ),
      groupList1: Object.freeze([
        { label: '目的国', prop: 'country' },
        { label: '店铺', prop: 'stores' },
        { label: '备注', prop: 'remark' }
      ])

    }
  },
  created() {
    this.getData()
  },

  methods: {
    getData() {
      const params = {
        id: this.detailInfo.id
      }
      this.loading = true
      platformDetail(params).then(res => {
        const data = res.data
        const dealWithDecimal = ['totalPrice', 'price', 'orderFreight']
        dealWithDecimal.forEach(item => {
          const low = data[`${item}Low`] == null ? '' : Number(data[`${item}Low`]) + '~'
          const high = data[`${item}High`] == null ? '' : Number(data[`${item}High`]) + ' ( 单位：美元) '
          data[item] = low + high
        })
        this.platformLimitInfo = data
        const obj = {}
        this.platformLimitInfo.channelSaleLimitStoreVos.forEach(item => {
          obj[item.platformName] ? obj[item.platformName].push(item) : obj[item.platformName] = [item]
        })
        for (const prop in obj) {
          this.storeVos.push({
            platformName: prop,
            channelSaleLimitStores: obj[prop],
            storeAll: this.platformLimitInfo.storeType === 1
          })
        }
        this.init()
        this.loading = false
      })
    },

    getStoreType(val) {
      return this.storeTypeList && this.storeTypeList.find(item => item.dictKey === val + '')?.dictValue
    },
    init() {
      // 线上渠道转换
      Promise.all([
        dictionary('online_channel'),
        dictionary('common_store_type')

      ]).then(res => {
        res[0].data.forEach(item => {
          if (item.dictKey === this.platformLimitInfo.onlineChannel + '') {
            this.platformLimitInfo.onlineChannel = item.dictValue
          }
        })

        this.storeTypeList = res[1].data
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.row ::v-deep {
  align-items: stretch;
  &>.el-col .el-card{
    height: 100%;
    .el-card__body{
      padding: 4px;
      display: flex;
      flex-wrap: wrap;
      &>div{
        width: 100%;
      }
    }
  }
}
::v-deep .py-2 {
  margin-top: -0.275rem!important;
}
::v-deep .el-card__body {
  padding: 10px !important;
}

</style>
