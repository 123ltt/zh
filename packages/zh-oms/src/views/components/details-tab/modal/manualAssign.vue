<template>
  <!-- oms 订单管理 - 全部订单  手工分仓 -->
  <div v-loading="loading" class="manual-assign">

    <div class="main">
      <el-form ref="formRef" :model="form" size="mini" label-width="90px" class="search-form form-readonly" disabled>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="平台订单号" prop="platOrderId">
              <el-input v-model="form.platOrderId" type="text" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="OMS订单号" prop="omOrderCode">
              <el-input v-model="form.omOrderCode" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货国家" prop="receiveCountry">
              <el-input v-model="form.receiveCountry" type="text" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider content-position="left">订单SKU信息</el-divider>
      <template>
        <g-table ref="skuTable"
                 row-key="id"
                 dense
                 :headers="skuHeaders"
                 :fixed-height="false"
                 :page-show="false"
                 :fetch="fetchSku"
                 :span-method="skuSpan"
                 @rendered="getSkuTableData"
        >
          <el-table-column slot="originalSkuNameSlot" label="SKU对应的Item">
            <template slot-scope="{row}">
              <g-text-ellipsis>{{ row.platformProductId }}</g-text-ellipsis>
            </template>
          </el-table-column>
          <el-table-column slot="productsNameSlot" label="SKU名称">
            <template slot-scope="{row}">
              <TextEllipsisTip :line="2" :content="row.productsName" />
            </template>
          </el-table-column>
        </g-table>
      </template>
      <el-divider content-position="left">手工分仓信息</el-divider>
      <template>
        <g-table ref="assignTable"
                 row-key="id"
                 dense
                 :headers="assignHeaders"
                 :fixed-height="false"
                 :page-show="false"
                 :fetch="fetchAssign"
                 :span-method="assignSpan"
        >
          <el-table-column slot="indexSlot" label="包裹" width="50px">
            <template slot-scope="{row, $index}">
              <div>{{ (row.index = ($index/row.len)+1, row.index) }}</div>
            </template>
          </el-table-column>

          <el-table-column slot="originalSkuNameSlot" label="SKU对应的Item" width="120px">
            <template slot-scope="{row}">
              <g-text-ellipsis>{{ row.platformProductId }}</g-text-ellipsis>
            </template>
          </el-table-column>

          <el-table-column slot="warehouseCodeSlot" label="发货仓库">
            <template slot-scope="{row, $index}">
              <wareCascader :show-all-levels="false" :virtual-rule-data="virtualRuleData" :value.sync="row.warehouseCode" @changeFn="quantityOrWarehouseChange($index, row)" />
            </template>
          </el-table-column>
          <el-table-column slot="productQuantitySlot" label="数量">
            <template slot-scope="{row, $index}">
              <el-input v-model="row.productQuantity" v-input.positive.numeric type="text" size="mini" @blur="productQuantityBlur(row)" @change="quantityOrWarehouseChange($index)" />
            </template>
          </el-table-column>
          <el-table-column slot="autoOptimizationChannelFlagSlot" label="自动优选渠道">
            <template slot-scope="{row, $index}">
              <SwitchInnerText :key="$index" v-model="row.autoOptimizationChannelFlag" :active-value="true" :inactive-value="false" :disabled="isOverSeaZH(row.warehouseCode+'')" />
            </template>
          </el-table-column>
          <el-table-column slot="manualOptimizationChannelSlot" label="手工优选渠道">
            <template slot-scope="{row}">
              <g-text-ellipsis v-if="isOverSeaZH(row.warehouseCode+'')">泽汇海外仓无需优选渠道</g-text-ellipsis>

              <el-tooltip v-else :disabled="!row.autoOptimizationChannelFlag||!row.fullName" :content="row.fullName">
                <el-select v-model="row.manualOptimizationChannel" :disabled="row.autoOptimizationChannelFlag" size="mini" style="width:100%;" @change="(val)=>setOnlineChannel(val,row)">
                  <el-option
                    v-for="item in row.manualOptimizationChannelList"
                    :key="item.channelCode"
                    :value="item.channelCode"
                    :label="item.fullName"
                  />
                </el-select>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column slot="allowRushFlagSlot" label="是否允许冲货">
            <template slot-scope="{row, $index}">
              <SwitchInnerText :key="$index" v-model="row.allowRushFlag" :active-value="true" :inactive-value="false" :disabled="row.autoOptimizationChannelFlag" />
            </template>
          </el-table-column>
          <el-table-column slot="handler" label="操作" width="60px">
            <template slot-scope="{row, $index}">
              <el-button type="text" :disabled="canDelete" @click="deleteAssign(row, $index)">删除</el-button>
            </template>
          </el-table-column>
        </g-table>
      </template>
      <div class="d-flex justify-content-between">
        <g-text-ellipsis class="text-danger" style="line-height: 34px;">{{ reachLimitPack.length? `包裹 ${reachLimitPack} 所选渠道的国家已达到当日上限`:'' }} </g-text-ellipsis>
        <div class="mt-2 ms-1 flex-shrink-0">
          <el-button size="mini" @click="close(false)">取消</el-button>
          <el-button type="primary" size="mini" @click="addPackage">添加包裹+</el-button>
          <el-button type="primary" size="mini" @click="submit">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChannelPriceVO } from '../../../../utils.js'
import { debounce, deepClone } from '@/util/util'
import { overSearZHMixin as isOverSeaZH } from '@/views/mixins/is-over-sea-zh.js'
import { getManualAssignList, saveManualSep, getSkuWareHouse } from '@/api/orderManagement'
import { getChannelAndPrice } from '@/api/packOrders'
import { getChannelListAll } from '@/api/common.js'

import SwitchInnerText from '../../switch-innerText.vue'
import TextEllipsisTip from '../../text-ellipsis-tip/index.vue'
import wareCascader from '@/views/components/wareCascader/index.vue'

export default {
  name: 'ManualAssign',
  components: { SwitchInnerText, TextEllipsisTip, wareCascader },
  mixins: [isOverSeaZH],
  props: {
    id: String,
    omOrderId: String,
    virtualRuleData: Object
  },
  data() {
    return {
      form: {
        platOrderId: '',
        omOrderCode: '',
        receiveCountry: ''
      },
      goodId: '',
      skuCode: '',
      skuHeaders: [
        { label: 'SKU编码', prop: 'pmsSku' },
        { slot: true, slotName: 'originalSkuNameSlot' },
        { slot: true, slotName: 'productsNameSlot' },
        { label: '当前订单发货数量', prop: 'productQuantity', width: '120px' },
        { label: '备货仓库', prop: 'warehouseName', width: '100px' },
        { label: '可用库存', prop: 'availableStock', width: '100px' },
        { label: '当前储位', prop: 'warehouseCode', width: '100px' }
      ],
      assignHeaders: [
        { slot: true, slotName: 'indexSlot' },
        { label: 'SKU', prop: 'pmsSku' },
        { slot: true, slotName: 'originalSkuNameSlot' },
        { slot: true, slotName: 'warehouseCodeSlot' },
        { slot: true, slotName: 'productQuantitySlot' },
        { slot: true, slotName: 'autoOptimizationChannelFlagSlot' },
        { slot: true, slotName: 'manualOptimizationChannelSlot' },
        { slot: true, slotName: 'allowRushFlagSlot' },
        {
          label: '试算运费价格',
          prop: 'trialFreightCost',
          formatter: (row) => {
            const { manualOptimizationChannel: manualVal, autoOptimizationChannelFlag: autoVal, manualOptimizationChannelList: list = [] } = row
            if (autoVal) {
              const { channelCode = '', cost, fullName, upperLimit } = list[0] ?? {}
              row.manualOptimizationChannel = channelCode
              row.upperLimit = upperLimit
              row.allowRushFlag = false
              row.trialFreightCost = cost
              row.fullName = fullName
              this.getReachLimitPack()
              return parseFloat(cost || 0).toFixed(2)
            }
            for (let i = 0; i < list.length; i++) {
              const { channelCode = '', cost } = list[i] ?? {}
              if (channelCode === manualVal) {
                row.trialFreightCost = cost
                return parseFloat(cost || 0).toFixed(2)
              }
            }
            return '0'
          }
        },
        { slot: true, slotName: 'handler' }
      ],
      defaultAssign: [],
      loading: false,
      skuMaxNumObj: {},
      isChannelAndPrice: false, // 是否正在请求渠道和运费
      isSubmit: false, // 是否点了提交
      skuWH: {
        isSame: true,
        code: [],
        msg: ''
      },
      channelMap: {},
      reachLimitPack: []
    }
  },
  computed: {
    canDelete() {
      return this.defaultAssign.length === this.$refs.assignTable.tableList.length
    }
  },
  created() {
    getChannelListAll().then(res => {
      res.data.forEach(item => {
        const fullName = `${item.name}(${item.channelCode})`
        this.channelMap[item.channelCode] = fullName
      })
    })
    getSkuWareHouse(this.omOrderId).then(res => {
      const whs = Object.entries(res.data)
      const msg = '<div>存在多个SKU仓库不一致或为空，请调整产品发货仓库。</div>'
      let isSameWH = true
      whs.forEach(([k, v]) => {
        // msg += `<div>${k}:${v}</div>`
        if (v !== whs[0][1] || v === '') isSameWH = false
      })
      if (isSameWH || whs.length === 1) this.skuWH.code = whs[0][1].split(',')
      else {
        this.skuWH.isSame = false
        this.skuWH.msg = msg
        this.showDiffMsg()
      }
    })
  },
  mounted() {
    this.$refs.skuTable.load(1, this.omOrderId)
  },
  methods: {
    getReachLimitPack(list = this.$refs.assignTable.tableList) {
      this.reachLimitPack = list.reduce((packs, cur) => {
        cur.upperLimit && packs.push(cur.index)
        return packs
      }, [])
    },
    showDiffMsg() {
      this.skuWH.isSame || this.$message.warning({
        dangerouslyUseHTMLString: true,
        message: this.skuWH.msg
      })
    },
    // 手工优选渠道 change 事件
    setOnlineChannel(val, row) {
      const list = row.manualOptimizationChannelList
      const target = list.find(item => item.channelCode === val) || {}
      row.onlineChannel = target.onlineChannel
      row.channelPriceVO = target.channelPriceVO
      row.externalChannelCode = target.externalChannelCode
      row.fullName = target.fullName
      row.nwDwgId = target.dwgId
      row.upperLimit = target.upperLimit
      this.getReachLimitPack()
    },
    async getChannelAndPrice($index, list = this.$refs.assignTable.tableList) {
      const { data, index } = this.dealPackageData($index, list)
      const isAllNumZero = data.packageData.skuWarehouseList.every(item => item.productQuantity === 0)
      const whcStr = data.packageData.warehouseCode
      this.$set(list[index], 'hwFlag', this.isOverSeaZH(whcStr))
      if (!whcStr || isAllNumZero) {
        return
      } else if (this.isOverSeaZH(whcStr)) {
        this.$set(list[index], 'manualOptimizationChannelList', [])
        Object.assign(list[index], { manualOptimizationChannel: '', channelCode: '', onlineChannel: 0, externalChannelCode: '', trialFreightCost: '0', channelPriceVO: null, cost: '0', autoOptimizationChannelFlag: true, upperLimit: false })
        this.getReachLimitPack(list)
        return
      }
      this.isChannelAndPrice = true
      let res = {}
      try {
        res = await getChannelAndPrice(data)
      } catch (error) {

      } finally {
        this.isChannelAndPrice = false
      }
      const resArray = (res.data || []).map(item => {
        item.fullName = this.channelMap[item.channelCode]
        item.channelPriceVO = getChannelPriceVO(item)
        delete item.details
        return item
      })
      resArray.length || this.$message.error(res.msg)
      this.$set(list[index], 'manualOptimizationChannelList', resArray)
      Object.assign(list[index], { fullName: '' }, resArray[0])

      list[index].manualOptimizationChannel = resArray[0]?.channelCode
      list[index].trialFreightCost = resArray[0]?.cost
      list[index].nwDwgId = resArray[0]?.dwgId
      // channelPriceVO、onlineChannel、externalChannelCode
      this.getReachLimitPack(list)
      if (this.isSubmit) {
        this.submit()
      }
      return resArray
    },
    productQuantityBlur(row) {
      if (row.productQuantity === '') {
        row.productQuantity = 0
      }
    },
    async quantityOrWarehouseChange($index, row) {
      try {
        await this.getChannelAndPrice($index)
      } catch (error) {}
    },
    // 判断是否空包裹
    hasNullPackage() {
      const list = this.$refs.assignTable.tableList
      const len = list[0].len
      let index = 0
      let nullNum = 0

      for (let i = 0; i < list.length; i++) {
        if (i >= index && i < index + len) {
          if (list[i].productQuantity > 0) {
            i = index + len - 1
            index = i + 1
            nullNum = 0
          } else ++nullNum
          if (nullNum === len) {
            return true
          }
        }
      }
      return false
    },
    // 判断发货仓库是否为空  或者  无渠道
    hasNull(isWarehouse = false) {
      const list = this.$refs.assignTable.tableList
      const len = list[0].len
      for (let i = 0; i < list.length; i += len) {
        const { warehouseCode, manualOptimizationChannel } = list[i]
        if (isWarehouse) {
          if (warehouseCode.length === 0) {
            return true
          }
        } else {
          const whcStr = warehouseCode + ''
          if (manualOptimizationChannel === '' && !this.isOverSeaZH(whcStr)) {
            return true
          }
        }
      }
      return false
    },
    dealPackageData($index, list) {
      const firstRowLen = list[0].len
      const index = $index - ($index % firstRowLen)
      const { autoOptimizationChannelFlag, allowRushFlag } = list[index]
      const maxLen = firstRowLen + index
      const skuWarehouseList = []

      for (let i = index; i < maxLen; i++) {
        const { goodId, pmsSku, productSalePrice, productQuantity, onlineChannel, externalChannelCode } = list[i]
        skuWarehouseList.push({ goodId, pmsSku, productSalePrice, productQuantity: +productQuantity, allowRushFlag, onlineChannel, externalChannelCode })
      }

      const wc = list[index].warehouseCode
      const packageData = { warehouseCode: wc.toString(), skuWarehouseList, autoOptimizationChannelFlag }
      return {
        data: { omOrderId: this.omOrderId, packageData },
        index
      }
    },
    isShowError() {
      let msg = ''
      if (this.hasNull(true)) {
        msg = '发货仓库为空不能为空'
      } else if (this.hasNull()) {
        msg = '无可用渠道'
      } else if (this.hasNullPackage()) {
        msg = '请先为空包裹分配数量或者删除'
      }
      msg && this.$message.error(msg)
      return msg !== ''
    },
    submit: debounce(function() {
      this.isSubmit = true
      if (this.isShowError()) {
        this.isSubmit = false
        return
      }

      const list = this.$refs.assignTable.tableList
      const len = list[0].len
      let hasLenIndex = 0
      const manualSepList = []
      let manualSepListItem = {}
      let skuWarehouseList = []
      const skuNumObj = {}

      list.forEach((item, i) => {
        item.trialFreightCost = +(item.trialFreightCost || 0)
        item.productQuantity = +item.productQuantity
        const {
          warehouseCode = [],
          nwDwgId = '',
          onlineChannel,
          externalChannelCode,
          autoOptimizationChannelFlag,
          allowRushFlag,
          trialFreightCost,
          hwFlag,
          channelPriceVO,
          manualOptimizationChannel,

          ...other
        } = item

        const key = `${other.pmsSku}${other.platformProductId === '' ? '' : '-' + other.platformProductId}`
        skuNumObj[key] = skuNumObj[key] === undefined
          ? +item.productQuantity
          : (skuNumObj[key] + +item.productQuantity)

        delete other.len

        if (i % len === 0) {
          hasLenIndex = i
          if (item.productQuantity !== 0) {
            skuWarehouseList.push(other)
          }
          Object.assign(manualSepListItem, {
            warehouseCode: warehouseCode.toString(),
            nwDwgId,
            onlineChannel,
            externalChannelCode,
            autoOptimizationChannelFlag,
            allowRushFlag,
            trialFreightCost,
            hwFlag,
            channelPriceVO,
            manualOptimizationChannel,
            skuWarehouseList
          })
        } else if (i > hasLenIndex && i < hasLenIndex + len && item.productQuantity !== 0) {
          skuWarehouseList.push(other)
        }
        if (i === hasLenIndex + len - 1) {
          manualSepListItem.skuWarehouseList = skuWarehouseList
          manualSepList.push(manualSepListItem)
          skuWarehouseList = []
          manualSepListItem = {}
        }
      })

      const skus = overflowSku(skuNumObj, this.skuMaxNumObj)
      if (skus) {
        this.isSubmit = false
        return this.$message.error(`订单的SKU-Item数量与包裹的总数量不相等：${skus}`)
      }
      if (this.loading || this.isChannelAndPrice) return
      this.loading = true

      saveManualSep(this.omOrderId, manualSepList).then(res => {
        this.close(true)
        this.$message.success(res.msg)
      }).finally(() => {
        this.isSubmit = false
        this.loading = false
      })

      function overflowSku(origin, max) {
        const sku = []
        Object.keys(origin).forEach(item => {
          if (origin[item] !== max[item]) {
            sku.push(item)
          }
        })
        return sku.length > 0 ? sku.join('、') : false
      }
    }, 500, true),
    deleteAssign(row, index) {
      const list = this.$refs.assignTable.tableList
      const len = this.defaultAssign.length
      const data = list.filter((item, i) => {
        if (i >= index && i < index + len) return false
        return true
      })
      this.$refs.assignTable.tableList = data
      this.getReachLimitPack(data)
    },
    addPackage: debounce(function() {
      // if (this.isShowError()) return 添加包裹限制条件
      const data = this.defaultAssign.map(item => {
        return Object.assign({}, item, { productQuantity: 0, autoOptimizationChannelFlag: true, allowRushFlag: false })
      })
      this.$refs.assignTable.tableList.push(...data)
      this.showDiffMsg()
    }, 500, true),
    getSkuTableData() {
      this.$nextTick(this.$refs.assignTable.load)
    },
    async fetchAssign() {
      const skuTableData = this.$refs.skuTable.tableList
      const data = []
      let len = 0
      skuTableData.forEach((item, index) => {
        if (item.len > 0) {
          const {
            pmsSku, platformProductId, productSalePrice, productQuantity, goodId,
            manualOptimizationChannel
          } = item
          len++
          data.push({
            len: 0,
            pmsSku,
            platformProductId,
            productSalePrice,
            goodId,
            warehouseCode: this.skuWH.isSame ? this.skuWH.code : [],
            productQuantity,
            autoOptimizationChannelFlag: true,
            manualOptimizationChannel,
            manualOptimizationChannelList: [],
            allowRushFlag: false,
            trialFreightCost: ''
          })
        }
      })

      if (data.length > 0) {
        data[0].len = len
      }
      this.defaultAssign.push(...deepClone(data))
      // 获取优选渠道和试算运费列表
      try {
        await this.getChannelAndPrice(0, data)
      } catch (error) {}
      return Promise.resolve({
        records: data
      })
    },
    fetchSku({ current, size }, omOrderId) {
      return getManualAssignList(omOrderId).then(res => {
        const { platOrderId, omOrderId, receivingCountry, goodInventoryList } = res.data
        this.form.platOrderId = platOrderId
        this.form.omOrderCode = omOrderId
        this.form.receiveCountry = receivingCountry
        const data = []

        goodInventoryList.forEach(({ inventoryList, ...other }) => {
          // 各个sku允许的最大数量
          const maxKey = `${other.pmsSku}${other.platformProductId === '' ? '' : '-' + other.platformProductId}`
          const maxNum = this.skuMaxNumObj[maxKey]
          this.skuMaxNumObj[maxKey] = maxNum === undefined
            ? +other.productQuantity
            : (maxNum + +other.productQuantity)

          inventoryList.forEach((item, index) => {
            data.push({ ...other, ...item, len: index === 0 ? inventoryList.length : 0 })
          })
        })
        return {
          records: data
        }
      })
    },
    assignSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex !== 1 && columnIndex !== 2 && columnIndex !== 4) {
        if (row.len > 0) {
          return [row.len, 1] // [row, column]
        } else {
          return [0, 0]
        }
      }
    },
    skuSpan({ row, column, rowIndex, columnIndex }) {
      if ([0, 1, 2, 3].includes(columnIndex)) {
        if (row.len > 0) {
          return [row.len, 1] // [row, column]
        } else {
          return [0, 0]
        }
      }
    },

    reShow(data = {}) {
      Object.keys(this.form).forEach(key => {
        if (key === 'reasonType') {
          this.form[key] = data.reasonTypeEnum.code
        } else this.form[key] = data[key]
      })
    },
    close(bool) {
      this.$parent.$emit('close', bool)
    }
  }
}
</script>
<style lang="scss" scoped>
.manual-assign .main{
  max-height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
  .search-form .el-col{
    height: 28px;
 }
}
</style>
