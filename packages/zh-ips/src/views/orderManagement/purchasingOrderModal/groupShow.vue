<template>
  <basic-container v-loading="loading">
    <div slot="header">
      <span>基本信息</span>
    </div>
    <div class="d-flex flex-wrap border">
      <el-card style="width:49%;border-right: 1px solid #ccc!important;border-bottom: 1px solid #ccc!important;">
        <div slot="header">
          <span>采购信息</span>
        </div>
        <g-list-group :cols="3" label-width="70px" label-align="center">
          <g-list-group-item label="采购编码">{{ incomingData.purCode }}</g-list-group-item>
          <g-list-group-item label="采购方名称">
            <g-text-ellipsis>{{ incomingData.purSquareName }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="本地采购">{{ incomingData.localPurchaserName }}</g-list-group-item>
          <g-list-group-item label="计划编码">{{ incomingData.planCode }}</g-list-group-item>
          <g-list-group-item label="供应商名称">
            <g-text-ellipsis>{{ incomingData.supplierName }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="海外采购">{{ incomingData.overseaPurchaserName }}</g-list-group-item>
          <g-list-group-item label="平台单号">{{ incomingData.platformCode }}</g-list-group-item>
          <g-list-group-item label="供应商等级">{{ incomingData.supplierLevel }}</g-list-group-item>
          <g-list-group-item label="开发员">{{ incomingData.developerName }}</g-list-group-item>
          <g-list-group-item label="采购平台">{{ incomingData.purPlatform }}</g-list-group-item>
          <g-list-group-item label="计划备注">
            <g-text-ellipsis>{{ incomingData.remarks }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </el-card>
      <el-card style="width:49%;border-bottom: 1px solid #ccc!important;">
        <div slot="header">
          <span>收货信息</span>
        </div>
        <g-list-group :cols="2" label-width="60px" label-align="center">
          <g-list-group-item label="直发仓库">{{ isYes(incomingData.isStraight) }}</g-list-group-item>
          <g-list-group-item label="收件人">{{ incomingData.receiptPeople }}</g-list-group-item>
          <g-list-group-item label="中转仓库">{{ incomingData.transitWarehouseName }}</g-list-group-item>
          <g-list-group-item label="移动电话">{{ incomingData.mobile }}</g-list-group-item>
          <g-list-group-item label="目的仓库">{{ incomingData.destWarehouseName }}</g-list-group-item>
          <g-list-group-item label="收货地址">
            <g-text-ellipsis>{{ incomingData.shippingAddress }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </el-card>
      <el-card style="width:49%;">
        <div slot="header">
          <span>财务信息</span>
        </div>
        <g-list-group :cols="3" label-width="60px" label-align="center">
          <g-list-group-item label="采购类型">{{ purTypeObj[incomingData.purType] }}</g-list-group-item>
          <g-list-group-item label="付款方式">{{ paymentMethodObj[incomingData.paymentMethod] }}</g-list-group-item>
          <g-list-group-item label="付款条件">{{ paymentConditionObj[incomingData.paymentCondition] }}</g-list-group-item>
          <g-list-group-item label="公司主体">
            <g-text-ellipsis>{{ mainBobyObj[incomingData.mainBody] }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="是否包邮">{{ isYes(incomingData.isFreeShipping) }}</g-list-group-item>
          <g-list-group-item label="是否含税">{{ isYes(incomingData.isTax) }}</g-list-group-item>
          <g-list-group-item label="采购数量">{{ incomingData.purQty }}</g-list-group-item>
          <g-list-group-item label="产品金额">{{ isShow(incomingData.goodsAmount) }}</g-list-group-item>
          <g-list-group-item label="物流运费">{{ isShow(incomingData.logisticsFreight) }}</g-list-group-item>
          <g-list-group-item label="优惠金额">{{ isShow(incomingData.discountAmount) }}</g-list-group-item>
          <g-list-group-item label="应付金额">{{ isShow(incomingData.payableAmount) }}</g-list-group-item>
          <g-list-group-item label="预付金额">{{ isShow(incomingData.prePayAmount) }}</g-list-group-item>
        </g-list-group>
      </el-card>
      <el-card style="width:49%;border-left: 1px solid #ccc!important;">
        <div slot="header">
          <span>订单时间</span>
        </div>
        <g-list-group :cols="2" label-width="80px" label-align="center">
          <g-list-group-item label="期望到货时间">{{ incomingData.expectArrivalTime }}</g-list-group-item>
          <g-list-group-item label="预计发货时间">{{ incomingData.estimatedDeliveryTime }}</g-list-group-item>
          <g-list-group-item label="预计到货时间">{{ incomingData.estimatedArrivalTime }}</g-list-group-item>
          <g-list-group-item label="实际到货时间">{{ incomingData.receivingGoodsTime }}</g-list-group-item>
          <g-list-group-item label="创建人">{{ incomingData.createUserName }}</g-list-group-item>
          <g-list-group-item label="创建时间">{{ incomingData.createTime }}</g-list-group-item>
          <g-list-group-item label="最后修改人">{{ incomingData.updateUserName }}</g-list-group-item>
          <g-list-group-item label="最后修改时间">{{ incomingData.updateTime }}</g-list-group-item>
        </g-list-group>
      </el-card>
    </div>

  </basic-container>
</template>

<script>
import { dictionary } from '@/api/commonApi'

export default {
  name: 'GroupShow',
  props: {
    incomingData: Object
  },
  data() {
    return {
      currencyList: {},
      purTypeObj: {},
      paymentMethodObj: {},
      paymentConditionObj: {},
      mainBobyObj: {},
      loading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      dictionary('ips_account_currency').then(res => {
        res.data.forEach(item => {
          this.currencyList[item.dictKey] = item.dictValue
        })
      })
      dictionary('ips_pur_type').then(res => {
        res.data.forEach(item => {
          this.purTypeObj[item.dictKey] = item.dictValue
        })
      })
      dictionary('ips_payment_method').then(res => {
        res.data.forEach(item => {
          this.paymentMethodObj[item.dictKey] = item.dictValue
        })
      })
      dictionary('ips_payment_condition').then(res => {
        res.data.forEach(item => {
          this.paymentConditionObj[item.dictKey] = item.dictValue
        })
      })
      dictionary('ips_procuring_entity').then(res => {
        res.data.forEach(item => {
          this.mainBobyObj[item.dictKey] = item.dictValue
        })
      })
    },
    isYes(val) {
      if (val === 1) {
        return '是'
      } else if (val === 2) {
        return '否'
      }
    },
    isShow(val) {
      if (val && val !== -1) {
        return `${val}  ${this.currencyList[this.incomingData.purAccountCurrency]}`
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
