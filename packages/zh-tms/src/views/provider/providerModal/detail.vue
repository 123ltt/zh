<template>
  <basic-container class="platform_detail">
    <el-row ref="formRef" class="row">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <g-list-group v-for="(items,i) in detailRow1" :key="i" :cols="items.length" label-width="110px" label-align="center">
          <g-list-group-item v-for="(item,j) in items" :key="j" :label="item.label" :class="item.class?item.class:''">
            <g-text-ellipsis>{{ logisticDetail[item.prop] }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
        <g-list-group v-if="logisticDetail.auditStatus===1" label-width="110px" label-align="center" :cols="1">
          <g-list-group-item label="通过理由">
            <g-text-ellipsis>{{ logisticDetail.approvalOpinion }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </el-card>
    </el-row>
    <detailTab :id="detailInfo.id+''" type="logistics_provider" />
  </basic-container>
</template>
<script>
import { dictionary } from '@/api/common'
import detailTab from '../../components/detailTab'
export default {
  name: 'LogisticDetail',
  components: {
    detailTab
  },
  props: {
    detailInfo: Object
  },
  data() {
    return {
      logisticDetail: [],
      activeName: 'handleRecords',
      detailRow1: Object.freeze(
        [
          [
            { label: '物流商简称', prop: 'lpAbbreviation' },
            { label: '物流商全称', prop: 'lpFullname' },
            { label: '营业执照编号', prop: 'businessLicenseNo' }
          ],
          [
            { label: '付款类型', prop: 'paymentType' },
            { label: '结算周期', prop: 'settlementPeriod' },
            { label: '默认收银银行类型', prop: 'bankType' }
          ],
          [
            { label: '收款单位(对公账号)', prop: 'payeeCommon' },
            { label: '收款账号(对公账号)', prop: 'accountNumberCommon' },
            { label: '开户行(对公账号)', prop: 'bankNameCommon' }
          ],
          [
            { label: '收款单位(对私账号)', prop: 'payeePrivate' },
            { label: '收款账号(对私账号)', prop: 'accountNumberPrivate' },
            { label: '开户行(对私账号)', prop: 'bankNamePrivate' }
          ],
          [
            { label: '收款单位(外币账号)', prop: 'payeeCurrency' },
            { label: '收款账号(外币账号)', prop: 'accountNumberCurrency' },
            { label: '开户行(外币账号)', prop: 'bankNameCurrency' }
          ],
          [
            { label: '联系人', prop: 'contactPerson', class: 'w-33' },
            { label: '联系方式', prop: 'contactPhone' }
          ],
          [
            { label: '备注', prop: 'remarks' }
          ]
        ])

    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.logisticDetail = JSON.parse(JSON.stringify(this.detailInfo))
      const { paymentType, settlementPeriod, bankType } = this.logisticDetail
      // 结算周期字典
      dictionary('common_settlement_period').then(res => {
        res.data.forEach(item => {
          if (item.dictKey === settlementPeriod + '') this.logisticDetail.settlementPeriod = item.dictValue
        })
      })
      // 默认收银银行类型字典
      dictionary('common_bank_type').then(res => {
        res.data.forEach(item => {
          if (item.dictKey === bankType + '') this.logisticDetail.bankType = item.dictValue
        })
      })
      // // 付款类型字典
      dictionary('common_payment_type').then(res => {
        res.data.forEach(item => {
          if (item.dictKey === paymentType + '') this.logisticDetail.paymentType = item.dictValue
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.w-33{
width:33.33%!important
}
::v-deep .py-2 {
  margin-top: -0.275rem!important;
}
::v-deep .el-card__body {
  padding: 10px !important;
}
</style>
