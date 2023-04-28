<template>
  <div>
    <div v-if="editType==='add'" class="om-box">
      <g-list-group>
        <g-list-group-item label="OMS订单号" label-width="65px" style="line-height:28px;">
          <div class="d-flex">
            <el-input v-model="omOrderId" size="mini" class="width-100" @keyup.enter.native="searchData" />
            <el-button type="primary" class="ms-2" size="mini" @click="searchData">搜索</el-button>
          </div>
        </g-list-group-item>
      </g-list-group>
    </div>
    <div v-if="show" v-loading="loading" class="addpack-box">
      <el-form class="no-message" :inline="true" label-width="90px">
        <el-form-item label="平台订单号：">{{ resultData.platOrderId }}</el-form-item>
        <el-form-item label="OMS订单号：">{{ resultData.omOrderId }}</el-form-item>
        <el-form-item label="收货国家：">{{ resultData.receivingCountry }}</el-form-item>
        <el-form-item v-if="editType==='packSplit'" label="待拆包裹单号：">{{ packageCode }}</el-form-item>
      </el-form>
      <el-divider content-position="left">订单SKU信息</el-divider>
      <g-table ref="skuInfoTable" :dense="true" class="form-col no-message" :headers="skuInfo" :page-show="false" :span-method="objectSpanMethod" :fixed-height="false">
        <el-table-column slot="skuNameSolt" label="sku名称">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">
              {{ scope.row.productsName }}
            </g-text-ellipsis>
          </template>
        </el-table-column>
      </g-table>
      <el-divider content-position="left">订单当前包裹信息</el-divider>
      <g-table ref="packTable" :dense="true" class="form-col no-message" :headers="packInfo" :page-show="false" :span-method="packInfoSpanMethod" :fixed-height="false">
        <el-table-column slot="slotChanel" label="渠道" width="250">
          <template slot-scope="scope">
            {{ getChannelFullName(scope.row.channelName,scope.row.channelCode) }}
          </template>
        </el-table-column>
        <el-table-column slot="slotStatus" label="包裹状态">
          <template slot-scope="scope">
            <el-select v-model="scope.row.packageStatus" :disabled="true" size="mini">
              <el-option v-for="(item,index) in packStatusList" :key="index" :label="item.label" :value="+item.value" />
            </el-select>
          </template>
        </el-table-column>
      </g-table>
      <el-divider content-position="left">新加包裹信息</el-divider>
      <g-table ref="addpackTable" class="form-col no-message" size="mini" :dense="true" :headers="addpackInfo" :page-show="false" :span-method="addpackInfoSpanMethod" :fixed-height="false">
        <el-table-column slot="slotName" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.packName }}</span><br>
            <el-button type="text" :disabled="addPacklist.length === addPacklist[0].len?true:false" @click="delPack(scope.row.packName,scope.$index)">删除包裹</el-button>
          </template>
        </el-table-column>
        <el-table-column slot="slotWarehouse" label="发货仓库" width="120">
          <template slot-scope="scope">
            <wareCascader v-if="virtualRuleData" :virtual-rule-data="virtualRuleData" :show-all-levels="false" :value.sync="scope.row.warehouseCode" @changeFn="wareCodeChange(scope.row, scope.$index)" />
          </template>
        </el-table-column>
        <el-table-column slot="slotSku">
          <template slot="header">
            <span>SKU
              <el-tooltip class="item" effect="dark" content="双击添加SKU" placement="top-start">
                <i class="el-icon-question" />
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <div @dblclick="addSku(scope)">
              <el-select v-model="scope.row.pmsSku" size="mini" @change="quantityChange(scope.row)">
                <el-option v-for="(item,i) in skuList" :key="i" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column slot="slotCount" label="数量" width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.productQuantity" v-input.numeric.!0 oninput="value=value.replace(/[^\d]/g,'')" size="mini" @change="quantityChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column slot="salePrice" label="销售单价" width="170px">
          <template slot-scope="scope">
            <div class="d-flex">
              <el-input v-model="scope.row.productSalePrice" v-input.positive size="mini" @change="priceChange(scope.row,scope.row.productSalePrice)" />
              <el-select v-model="scope.row.currencyCode" filterable size="mini" @change="currencyChange">
                <el-option v-for="(list,index) in currencyList" :key="index" :label="list.currency" :value="list.currency" />
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column slot="slotAutoChanel" label="自动优选渠道" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.autoOptimizationChannelFlag" size="mini" :disabled="isOverSeaZH(scope.row.warehouseCode+'')" @change="autoChanel(scope.row)" />
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
            <el-select v-model="scope.row.platformProductId" :disabled="editTypeDisable" size="mini" @change="itemChange(scope.row,scope.row.platformProductId)">
              <el-option v-for="(item,index) in itemList" :key="index" :label="item.platformProductId" :value="item.platformProductId" />
            </el-select>
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

      <el-form ref="form" class="mt-3" :model="form">
        <el-form-item :rules="[{ required: true, message: '请输入包裹原因'}]" :label="`${editType==='add'?'添加':'拆分'}包裹原因`" label-width="100px" prop="msgBrief">
          <el-input v-model="form.msgBrief" type="textarea" />
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="close(false)">取消</el-button>
        <el-button type="primary" size="mini" :loading="submitLoading" @click="submit">确定</el-button>
      </el-row>
    </div>
    <div v-if="!show" v-loading="loading" class="d-flex d-height justify-content-center align-items-center">
      <span v-if="editType==='add'">请点击上方搜索按钮查询数据</span>
    </div>
  </div>
</template>

<script>
import { orderGoodDetail, getCurrentPackageInfo, itemList } from '@/api/packOrders'
import { Currency } from '@/api/common'
import addSkuModal from './addskuModal.vue'
import { overSearZHMixin as isOverSeaZH } from '@/views/mixins/is-over-sea-zh.js'
import { myMixin } from './mixins.js'
export default {
  mixins: [myMixin, isOverSeaZH],
  data() {
    return {
      skuInfo: [
        { label: 'SKU编码', prop: 'pmsSku', width: 100 },
        { slot: true, slotName: 'skuNameSolt' },
        { label: '当前订单发货数量', prop: 'productQuantity', width: 120 },
        { label: '备货仓库', prop: 'warehouseName', width: 120 },
        { label: '可用库存', prop: 'availableStock', width: 120 }
      ],
      show: false,
      currencyList: [],
      orderAmount: '',
      virtualRuleData: {}
    }
  },
  mounted() {
    this.getCurrency()
  },
  methods: {
    getCurrency() {
      Currency().then(res => {
        this.currencyList = res.data
      })
    },
    searchData() {
      if (!this.omOrderId) {
        this.$message.warning('请输入OMS单号')
        return false
      }
      this.loading = true
      const params = [orderGoodDetail(this.omOrderId), itemList(this.omOrderId), getCurrentPackageInfo({ omOrderId: this.omOrderId, packageCode: this.packageCode })]
      Promise.all(params).then(res => {
        this.resultData = res[0].data
        this.orderType = res[0].data.orderType.orderType
        this.virtualRuleData = { country: res[0].data.receivingCountryCode, platCode: this.omOrderId.slice(0, 2) }
        this.orderAmount = res[0].data.orderAmount
        this.show = true
        this.$nextTick(() => {
          if (!res[2].data.length) {
            this.loading = false
            this.show = false
            this.$message.warning('该订单暂无包裹')
            return false
          }
          this.$refs.skuInfoTable && (this.$refs.skuInfoTable.tableList = this.skuInfoFormatter(this.resultData.goodInventoryList, 1))
          this.$refs.addpackTable && (this.$refs.addpackTable.tableList = this.uniqueFn(this.skuInfoFormatter(this.resultData.goodInventoryList)))
          this.$refs.packTable && (this.$refs.packTable.tableList = this.packInfoFormatter(res[2].data))
          this.itemList = res[1].data
          this.warehouseList = this.formartSet(this.warehouseList, 'warehouseCode')
          this.skuList = this.formartSet(this.skuList, 'value')
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
        this.show = false
      })
    },
    // sku信息和新增包裹格式化
    skuInfoFormatter(data, type = 0) {
      this.warehouseList = [] // 防止重复数据
      const result = []
      let tagSplit = data.length// 标记合并
      this.dealSkuItemId(data)
      Array.isArray(data) && data.forEach((item, i) => {
        if (this.editType === 'add') {
          this.skuList.push({ value: item.pmsSku + item.platformProductId, label: item.pmsSku, platformProductId: item.platformProductId })
        }
        // 新加包裹信息
        if (!type) {
          const len = data.length// 合并行数
          const packName = '包裹1'// 包裹名称
          const row = Object.assign({
            len,
            tagSplit,
            packName,
            autoOptimizationChannelFlag: true,
            isAlloweFlushGoods: '',
            freightTrialPrice: '0.00',
            warehouseCode: [],
            warehouseName: '',
            productSalePrice: item.productSalePrice || '',
            currencyCode: 'USD'
          }, item)
          row.productQuantity = 1
          row.pmsSku = item.pmsSku + item.platformProductId
          delete row.inventoryList // 删除冗余数据
          tagSplit--
          result.push(row)
        }
        item.inventoryList && item.inventoryList.forEach((res, index) => {
          this.warehouseList.push({ warehouseCode: res.warehouseCode, warehouseName: res.warehouseName })
          // 订单sku信息
          if (type) {
            const len = index === 0 ? item.inventoryList.length : 0
            const row = Object.assign({ len }, item, res)
            result.push(row)
          }
        })
      })
      return result
    },
    currencyChange(val) {
      this.addPacklist = this.addPacklist.map(item => {
        item.currencyCode = val
        return item
      })
    },
    priceChange(row, val) {
      if (!this.orderType) {
        const index = this.itemList.findIndex(item => {
          return row.platformProductId === item.platformProductId
        })
        const productSalePrice = this.itemList[index].productSalePrice
        if (productSalePrice < val) {
          this.$message.warning('销售单价不能超过对应的item的销售单价')
          row.productSalePrice = ''
        }
        // 线上订单
      } else {
        // 手工订单
        if (this.orderAmount < val) {
          this.$message.warning('手工订单销售单价不超过订单总金额')
          row.productSalePrice = ''
        }
      }
    },
    itemChange(row, val) {
      const index = this.itemList.findIndex(item => {
        return val === item.platformProductId
      })
      const productSalePrice = this.itemList[index].productSalePrice
      if (productSalePrice < row.productSalePrice) {
        this.$message.warning('销售单价不能超过对应的item的销售单价')
        row.productSalePrice = ''
      }
    },
    addSku(scope) {
      const { $index } = scope
      const { omOrderId, skuList } = this
      this.$modal(
        {
          title: '手工输入SKU产品',
          width: '30%',
          component: addSkuModal,
          data: { omOrderId, skuList, index: $index },
          callback: (data, index) => {
            if (data) {
              this.skuList.push(data)
              this.$nextTick(() => {
                scope.row.pmsSku = data.value
                this.getAutoChanelList(scope.row, $index)
              })
            }
          }
        }
      )
    }
  }
}
</script>

<style scoped lang="scss">
.addpack-box{
    height: 500px;
    overflow: hidden;
    overflow-y: auto;
}
// .addpack-box::-webkit-scrollbar { width: 0 !important }
.width-100{
  width: 200px;
}
.d-height{
  height: 300px;
}
</style>
