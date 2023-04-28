<template>
  <div class="basic-container-box">
    <el-tabs v-model="activeName" type="border-card" @tab-click="openTag">
      <el-tab-pane v-for="(item,index) in arrTabList" :key="index" :label="item.label " :name="item.value" />
      <component :is="componentName" :comp-id="compId" :type="type" :platform-code="platformCode" @close="close" />
    </el-tabs>

  </div>
</template>

<script>
import BasicInfo from './basicInfo'
import OperateEdit from './operateEdit'
import FinanceInfo from './finance/financeInfo'
import RegisterInfo from './registerInfo'
import BaseicInfoDetails from './baseicInfoDetails'
import OperateDetails from './operateDetails'
import FinanceInfoDetails from './finance/financeInfoDetails'
import RegisterInfoDetails from './registerInfoDetails'
import NetworkCost from './networkCost'
import RecordInfo from './recordInfo'
import { mapGetters } from 'vuex'

export default {
  name: 'StoreListEdit',
  components: {
    BasicInfo,
    OperateEdit,
    BaseicInfoDetails,
    RegisterInfo,
    OperateDetails,
    FinanceInfo,
    FinanceInfoDetails,
    RegisterInfoDetails,
    RecordInfo,
    NetworkCost
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    },
    // eslint-disable-next-line vue/require-default-prop
    type: { /// 1编辑 0 查看
      type: Number
    },
    platformCode: {
      type: String
    }
  },
  data() {
    return {
      activeName: '0',
      tabList: [
        { label: '基础信息', keyName: 'store_base', temp: this.type ? 'BasicInfo' : 'BaseicInfoDetails' },
        { label: '运营信息', keyName: 'store_operate', temp: this.type ? 'OperateEdit' : 'OperateDetails' },
        { label: '财务信息', keyName: 'store_finance', temp: this.type ? 'FinanceInfo' : 'FinanceInfoDetails' },
        { label: '注册信息', keyName: 'store_register', temp: this.type ? 'RegisterInfo' : 'RegisterInfoDetails' },
        { label: '网络费用项', keyName: 'store_network', temp: 'NetworkCost' }

      ]
    }
  },
  computed: {
    ...mapGetters(['permission']),
    arrTabList() {
      const vat = this.permission
      const arr = [vat.store_base, vat.store_operate, vat.store_finance, vat.store_register, vat.store_network, vat.store_record]
      return this.tabList.filter((item, index) => arr[index]).map((item, index) => {
        item.value = String(index)
        return item
      })
    },
    componentName() {
      return this.arrTabList.find(item => item.value === this.activeName).temp
    }
  },
  created() {
    if (this.type === 0) {
      this.tabList.push({ label: '日志', keyName: 'store_record', temp: 'RecordInfo' })
    }
  },
  methods: {
    close() {
      this.$emit('close', true)
    },
    openTag(item) {
    }
  }

}
</script>

<style>

</style>
