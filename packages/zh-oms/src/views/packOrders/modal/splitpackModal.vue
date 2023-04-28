<template>
  <div v-loading="loading" class="addpack-box">
    <el-form class="form-col no-message" :inline="true" label-width="100px">
      <el-form-item label="平台订单号：">{{ resultData.platOrderId }}</el-form-item>
      <el-form-item label="OMS订单号：">{{ resultData.omOrderId }}</el-form-item>
      <el-form-item label="收货国家：">{{ resultData.receivingCountry }}</el-form-item>
      <el-form-item label="待拆包裹单号：">{{ packageCode }}</el-form-item>
    </el-form>
    <el-divider content-position="left">订单当前包裹信息</el-divider>
    <g-table ref="packTable" :dense="true" class="form-col no-message" :headers="packInfo" :page-show="false" :span-method="packInfoSpanMethod" :fixed-height="false">
      <el-table-column slot="slotChanel" label="渠道">
        <template slot-scope="scope">
          {{ getChannelFullName(scope.row.channelName,scope.row.channelCode) }}
        </template>
      </el-table-column>
      <el-table-column slot="slotDelivery" label="发货仓库">
        <template slot-scope="scope">
          {{ scope.row.warehouseName }}
        </template>
      </el-table-column>
      <el-table-column slot="slotStandbyWarehouse" label="备货仓库">
        <template slot-scope="scope">
          {{ scope.row.stockUpWarehouse }}
        </template>
      </el-table-column>
      <el-table-column slot="slotDeliveryCount" label="可用库存" width="70px">
        <template slot-scope="scope">
          {{ scope.row.stockQuantity }}
        </template>
      </el-table-column>
      <el-table-column slot="slotIsVirtualWarehouse" label="虚仓发货" width="70px">
        <template slot-scope="{row:{ruleId}}">
          {{ ruleId && ruleId !== -1? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column slot="slotVirtualWarehouse" label="虚拟仓库">
        <template slot-scope="{row:{virtualWarehouseName}}">
          {{ virtualWarehouseName }}
        </template>
      </el-table-column>
    </g-table>
    <el-divider content-position="left">拆分包裹信息</el-divider>
    <g-table ref="addpackTable" class="form-col no-message" size="mini" :dense="true" :headers="splitpackInfo" :page-show="false" :span-method="splitpackInfoSpanMethod" :fixed-height="false">
      <el-table-column slot="slotName" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.packName }}</span><br>
          <el-button type="text" :disabled="addPacklist.length === addPacklist[0].len?true:false" @click="delPack(scope.row.packName,scope.$index)">删除包裹</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="slotWarehouse" label="发货仓库" width="120">
        <template slot-scope="scope">
          <wareCascader :virtual-rule-data="virtualRuleData" :show-all-levels="false" :value.sync="scope.row.warehouseCode" @changeFn="wareCodeChange(scope.row,scope.$index)" @rendered="virtualWHRendered" />
        </template>
      </el-table-column>
      <el-table-column slot="slotSku" label="SKU">
        <template slot-scope="scope">
          <el-select v-model="scope.row.pmsSku" size="mini" @change="quantityChange(scope.row)">
            <el-option v-for="(item,i) in skuList" :key="i" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column slot="slotCount" label="数量" width="100px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.productQuantity" v-input.numeric.!0 oninput="value=value.replace(/[^\d]/g,'')" size="mini" @change="quantityChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column slot="slotAutoChanel" label="自动优选渠道" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.autoOptimizationChannelFlag" :disabled="isOverSeaZH(scope.row.warehouseCode+'')" size="mini" @change="autoChanel(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column slot="slotSelectChanel" label="手工优选渠道">
        <template slot-scope="{row,row:{warehouseCode,manualOptimizationChannel,autoChanelList,autoOptimizationChannelFlag},$index}">
          <g-text-ellipsis v-if="isOverSeaZH(warehouseCode+'')" :lines="2">泽汇海外仓无需优选渠道</g-text-ellipsis>
          <el-tooltip v-else :disabled="channelTip(autoOptimizationChannelFlag,autoChanelList)" :content="channelFullName">
            <el-select v-model="row.manualOptimizationChannel" :disabled="autoOptimizationChannelFlag" size="mini" @change="(val)=>chanelChange($index,val,row)">
              <el-option v-for="(item,index) in autoChanelList" :key="index" :label="item.fullName" :value="item.channelCode" />
            </el-select>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column slot="slotIschong" label="是否允许冲货" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.allowRushFlag" :disabled="scope.row.autoOptimizationChannelFlag" size="mini" />
        </template>
      </el-table-column>
      <el-table-column slot="slotItem" label="SKU对应的Item">
        <template slot-scope="scope">
          <g-text-ellipsis>
            {{ getTitle(scope.row.platformProductId) }}
          </g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="60">
        <template slot-scope="scope">
          <el-button v-if="scope.row.tagSplit===1" type="text" @click="deal(scope.$index,+1)">添加</el-button><br>
          <el-button type="text" :disabled="(scope.row.len===1&&addPacklist.length===1)?true:false" @click="deal(scope.$index,-1)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
    <div class="d-flex justify-content-between my-2">
      <g-text-ellipsis class="text-danger">{{ reachLimitPack.length? `包裹 ${reachLimitPack} 所选渠道的国家已达到当日上限`:'' }}</g-text-ellipsis>
      <div class="flex-shrink-0">
        <el-button type="primary" size="mini" @click="addPack">添加包裹</el-button>
      </div>
    </div>
    <el-form ref="form" class="orm-col no-message" :model="form">
      <el-form-item :rules="[{ required: true, message: '请输入包裹原因'}]" :label="`${editType==='add'?'添加':'拆分'}包裹原因`" label-width="100px" prop="msgBrief">
        <el-input v-model="form.msgBrief" type="textarea" />
      </el-form-item>
    </el-form>
    <el-row class="footer-btns" type="flex" justify="end">
      <el-button size="mini" @click="close(false)">取消</el-button>
      <el-button type="primary" size="mini" :loading="submitLoading" @click="submit">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import { orderGoodDetail, orderGoodDetailByDetailPage, getCurrentPackageInfo, itemList } from '@/api/packOrders'
import { overSearZHMixin as isOverSeaZH } from '@/views/mixins/is-over-sea-zh.js'
import { myMixin } from './mixins.js'
export default {
  mixins: [myMixin, isOverSeaZH],
  props: {
    goodInfoList: Array,
    virtualRuleData: Object,
    channelForm: Object
  },
  data() {
    return {
    }
  },
  mounted() {
    if (this.omOrderId) {
      this.searchData()
    }
  },
  methods: {
    getTitle(val) {
      return (this.itemList.find(item => item.platformProductId === val) || {}).platformProductId
    },
    searchData() {
      this.loading = true
      const { omOrderId, packageCode, goodInfoList } = this
      let api = orderGoodDetail
      let apiParams = omOrderId
      if (goodInfoList) {
        const { ruleId, warehouseCode } = this.channelForm
        api = orderGoodDetailByDetailPage
        apiParams = { omOrderId, packageCode, goodInfoList }

        apiParams.warehouseCode = ruleId !== -1 ? 'VIRTUAL,' + ruleId : warehouseCode
      }

      const params = [api(apiParams), itemList(omOrderId), getCurrentPackageInfo({ omOrderId, packageCode })]
      Promise.all(params).then(res => {
        this.resultData = res[0].data
        this.orderType = res[0].data.orderType.orderType
        this.$nextTick(() => {
          this.$refs.addpackTable.tableList = this.splitpackInfoFormatter(res[2].data)
          this.itemList = res[1].data
          this.$refs.packTable.tableList = this.packInfoFormatter(res[2].data)
          this.warehouseList = this.formartSet(this.warehouseList, 'warehouseCode')
          this.skuList = this.formartSet(this.skuList, 'value')
          this.getAutoChanelList()
          this.loading = false
        })
      })
    },
    virtualWHRendered(list) {
      if (this.ruleId === -1) return
      this.$refs.packTable.tableList[0].virtualWarehouseName = list.reduce((name, cur) => {
        if (cur.warehouseCode === 'VIRTUAL') {
          name = cur.warehouseName
          const { warehouseName = '' } = (cur.children || []).find(item => item.warehouseCode === this.ruleId) || {}
          name = warehouseName !== '' ? name + '/' + warehouseName : ''
        }
        return name
      }, '')
    },
    // 拆分包裹格式化
    splitpackInfoFormatter(data) {
      let result = []
      Array.isArray(data) && data.forEach((item, i) => {
        this.warehouseList.push({ warehouseCode: item.warehouseCode, warehouseName: item.warehouseName })
        if (item.packageCode === this.packageCode) {
          item.skuInfos && item.skuInfos.forEach((res, index) => {
            this.skuList.push({ value: res.pmsSku + res.platformProductId, label: res.pmsSku, platformProductId: res.platformProductId })
            const packName = '包裹1'// 包裹名称
            const row = Object.assign({
              len: 0,
              packName,
              tagSplit: 0,
              autoOptimizationChannelFlag: true,
              manualOptimizationChannel: item.channelCode,
              isAlloweFlushGoods: '',
              productSalePrice: item.productSalePrice || '',
              trialFreightCost: ''
            }, item, res)
            row.warehouseCode = row.ruleId !== -1 ? ['VIRTUAL', row.ruleId] : row.warehouseCode.split(',')
            row.pmsSku = res.pmsSku + res.platformProductId
            delete row.skuInfos
            result.push(row)
          })
        }
      })
      result = this.uniqueFn(result)
      const len = result.length
      let tagSplit = result.length
      result.forEach(res => {
        res.len = len
        res.tagSplit = tagSplit
        tagSplit--
      })
      return result
    }
  }
}
</script>

<style scoped lang="scss">
.addpack-box{
  min-height: 300px;
  max-height: 500px;
  overflow: hidden;
  overflow-y: auto;
  .footer-btns{
    background-color: #fff;
    position: sticky;
    bottom: 0;
    padding-top: 10px;
  }
}
// .addpack-box::-webkit-scrollbar { width: 0 !important }
.width-100{
  width: 200px;
}
.d-height{
  height: 300px;
}
</style>
