<template>
  <basic-container v-loading="loading" class="platform_detail">
    <el-row ref="formRef" class="row">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>

        <g-list-group :cols="2"
                      label-width="100px"
        >
          <template v-for="(item,index) in groupList">
            <g-list-group-item v-if="item.prop==='stores'&&bindingInfoDetail.onlineChannelServiceBindStoreDTOList" :key="index" :label="getStoreType(bindingInfoDetail.storeType)">
              <arrowShowDetail
                v-if="bindingInfoDetail.storeType!==1"
                :selected-list="bindingInfoDetail.onlineChannelServiceBindStoreDTOList"
                :render-type="item.prop"
                :length="60"
              />
              <span v-else>全部店铺</span>
            </g-list-group-item>
            <g-list-group-item
              v-else
              :key="item.prop"
              :label="item.label"
            >
              <g-text-ellipsis>{{ bindingInfoDetail[item.prop] }}</g-text-ellipsis>
            </g-list-group-item>

          </template>
        </g-list-group>

      </el-card>
    </el-row>
    <detailTab :id="id" type="online_channel_service_bind" />
  </basic-container>
</template>
<script>
import { dictionary } from '@/api/common'

import { onlineServiceBindDetail } from '@/api/serviceBinding'
import arrowShowDetail from '../../components/arrowShowDetail'
import detailTab from '../../components/detailTab'
export default {
  name: 'ServiceBindingDetail',
  components: { arrowShowDetail, detailTab },
  props: {
    id: String,
    serviceList: Array
  },
  data() {
    return {
      loading: false,
      bindingInfoDetail: [],
      storeTypeList: [],
      stroe: {},
      activeName: 'handleRecords',
      groupList: [
        { label: '线上服务名', prop: 'onlineServiceName' },
        { label: '平台', prop: 'platform' },
        { label: '店铺名', prop: 'stores' },
        { label: '渠道名称', prop: 'channelName' },
        { label: '总金额', prop: 'totalPrice' },
        { label: '单件金额', prop: 'price' },
        { label: '运费', prop: 'freight' }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      Promise.all([
        onlineServiceBindDetail({ id: this.id }),
        dictionary('common_store_type')
      ]).then(res => {
        this.bindingInfoDetail = res[0].data
        this.storeTypeList = res[1].data

        this.init()
      })
    },
    getStoreType(val) {
      return this.storeTypeList && this.storeTypeList.find(item => item.dictKey === val + '')?.dictValue
    },
    init() {
      const data = this.bindingInfoDetail
      const { onlineChannelServiceVO } = data
      // 处理线上服务名
      this.bindingInfoDetail.onlineServiceName = `${onlineChannelServiceVO.onlineServiceNameEn}(${onlineChannelServiceVO.onlineServiceNameCn})`
      this.bindingInfoDetail.platform = onlineChannelServiceVO.platformName
      const dealWithDecimal = ['totalPrice', 'price', 'freight']
      dealWithDecimal.forEach(item => {
        const low = data[`${item}Low`] == null ? '' : Number(data[`${item}Low`]) + '~'
        const high = data[`${item}High`] == null ? '' : Number(data[`${item}High`]) + '（ 单位：美元 ）'
        this.bindingInfoDetail[item] = low + high
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .py-2 {
  margin-top: -0.275rem!important;
}
::v-deep .el-card__body {
  padding: 10px !important;
}
</style>
