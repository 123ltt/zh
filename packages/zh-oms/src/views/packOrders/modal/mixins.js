import { getChannelAndPrice, save } from '@/api/packOrders'
import { getChannelListAll } from '@/api/common.js'
import wareCascader from '../../components/wareCascader'
import { getDicts } from '@/api/common/dict'
import { deepClone } from '@/util/util'
import { overSearZHMixin as isOverSeaZH } from '@/views/mixins/is-over-sea-zh.js'
import { getChannelPriceVO } from '../../../utils.js'
export const myMixin = {
  components: { wareCascader },
  mixinx: [isOverSeaZH],
  props: {
    editType: {
      type: String,
      default: 'add'// packSplit拆分
    },
    id: {
      type: String,
      default: ''
    },
    packageCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      packInfo: [
        { label: '包裹单号', prop: 'packageCode' },
        { label: '包裹SKU', prop: 'pmsSku', width: 120 },
        { label: 'SKU数量', prop: 'productQuantity', width: 70 },
        { slot: true, slotName: 'slotDelivery' },
        { slotName: 'slotChanel', slot: true },
        { slotName: 'slotStatus', slot: true },
        { label: '包裹利润', prop: 'trialProfit', width: 70 },
        { slot: true, slotName: 'slotStandbyWarehouse' },
        { slot: true, slotName: 'slotDeliveryCount' },
        { slot: true, slotName: 'slotIsVirtualWarehouse' },
        { slot: true, slotName: 'slotVirtualWarehouse' }
      ],
      addpackInfo: [
        { slot: true, slotName: 'slotName', width: 70 },
        { slot: true, slotName: 'slotSku' },
        { slot: true, slotName: 'slotWarehouse' },
        { slot: true, slotName: 'slotCount' },
        { slot: true, slotName: 'salePrice' },
        { slot: true, slotName: 'slotAutoChanel' },
        { slot: true, slotName: 'slotSelectChanel' },
        { slot: true, slotName: 'slotIschong' },
        { label: '试算运费价格', prop: 'trialFreightCost', width: 100 },
        { slot: true, slotName: 'slotItem' },
        { slot: true, slotName: 'handler' }
      ],
      splitpackInfo: [
        { slot: true, slotName: 'slotName', width: 70 },
        { slot: true, slotName: 'slotSku' },
        { slot: true, slotName: 'slotWarehouse' },
        { slot: true, slotName: 'slotCount' },
        { slot: true, slotName: 'slotAutoChanel' },
        { slot: true, slotName: 'slotSelectChanel' },
        { slot: true, slotName: 'slotIschong' },
        { label: '试算运费价格', prop: 'trialFreightCost', width: 100 },
        { slot: true, slotName: 'slotItem' },
        { slot: true, slotName: 'handler' }
      ],
      omOrderId: this.id || '',
      resultData: {},
      warehouseList: [],
      packNum: 1,
      skuList: [],
      addData: [],
      loading: false,
      packStatusList: [],
      channelList: [],
      channelMap: {},
      itemList: [],
      autoChanelList: [],
      form: {
        msgBrief: ''
      },
      submitLoading: false,
      orderType: '',
      channelFullName: '',
      ruleId: -1,
      reachLimitPack: []
    }
  },
  computed: {
    addPacklist() {
      return this.$refs.addpackTable.tableList
    },
    oldPackList() {
      return this.$refs.packTable.tableList
    },
    editTypeDisable() {
      return this.editType !== 'add'
    }
  },
  mounted() {
    getDicts(['package_status'], 'oms').then(res => {
      this.packStatusList = res.package_status
    })
    getChannelListAll().then(res => {
      this.channelList = res.data.map(item => {
        item.fullName = `${item.name}(${item.channelCode})`
        this.channelMap[item.channelCode] = item.fullName
        return item
      })
    })
  },
  methods: {
    getReachLimitPack() {
      this.$nextTick(() => {
        const list = this.$refs.addpackTable.tableList
        const arr = list.reduce((packs, cur) => {
          cur.upperLimit && packs.push(cur.packName.slice(2))
          return packs
        }, [])
        this.reachLimitPack = [...new Set(arr)]
      })
    },
    getChannelFullName(name, code) {
      const c = code ? `(${code})` : ''
      return (name || '') + c
    },
    channelTip(bool, list) {
      if (!bool || !list || !list.length) return true
      return false
    },
    chanelChange(index, manualOptimizationChannel, row) {
      const sIndex = row.autoChanelList.findIndex(item => {
        return item.channelCode === manualOptimizationChannel
      })
      const { cost, onlineChannel, externalChannelCode, fullName = '', upperLimit, ...otherChannelPrice } = row.autoChanelList[sIndex]
      this.channelFullName = fullName
      this.addPacklist[index].trialFreightCost = Number(cost).toFixed(2)
      this.addPacklist[index].onlineChannel = onlineChannel
      this.addPacklist[index].externalChannelCode = externalChannelCode
      this.addPacklist[index].otherChannelPrice = otherChannelPrice
      this.addPacklist[index].upperLimit = upperLimit
      this.getReachLimitPack()
    },
    formartSet(data, key) {
      const result = []
      const obj = {}
      for (let i = 0; i < data.length; i++) {
        if (!obj[data[i][key]]) {
          result.push(data[i])
          obj[data[i][key]] = true
        }
      }
      return result
    },
    dealSkuItemId(data, goodId = 'goodId') {
      const maxLen = data.length - 1
      let skuItemId = data[maxLen].pmsSku + '_' + data[maxLen].platformProductId + '_' + data[maxLen][goodId]
      let skuItemIdLen = 0
      let quantity = 0
      const obj = {}
      for (let i = maxLen; i >= 0; i--) {
        const { pmsSku, platformProductId, productQuantity, [goodId]: gid } = data[i]
        const item = `${pmsSku}_${platformProductId}_${gid}`
        if (item !== skuItemId) {
          obj[i + 1] = [skuItemIdLen, quantity]
          skuItemId = item
          skuItemIdLen = 1
          quantity = productQuantity
        } else {
          quantity = productQuantity
          skuItemIdLen++
        }
        if (i === 0) obj[0] = [skuItemIdLen, quantity]
      }
      Object.entries(obj).forEach(([key, value]) => {
        data[key].skuLen = value[0]
        data[key].productQuantity = value[1]
      })
    },
    // 订单当前包裹信息数据格式化
    packInfoFormatter(data) {
      const result = []
      Array.isArray(data) && data.forEach(item => {
        let tagSplit = item.skuInfos.length
        this.dealSkuItemId(item.skuInfos, 'omOrderGoodId')
        this.ruleId = item.ruleId
        item.skuInfos && item.skuInfos.forEach(res => {
          const row = Object.assign({ len: item.skuInfos.length, tagSplit, warehouseCode: item.warehouseCode }, item, res)
          delete row.skuInfos
          row.warehouseCode = row.warehouseCode.split(',')
          result.push(row)
          tagSplit--
        })
      })
      return result
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex !== 3 && columnIndex !== 4) {
        if (row.len > 0) {
          return [row.len, 1]
        } else {
          return [0, 0]
        }
      } else {
        if (row.skuLen > 0) {
          return [row.skuLen, 1]
        } else {
          return [0, 0]
        }
      }
    },
    packInfoSpanMethod({ row: { len, tagSplit, skuLen }, column, rowIndex, columnIndex }) {
      const rowNum = this.editType === 'add' ? [0, 5] : [0, 5, 8, 9] // 添加包裹/拆分包裹
      if (rowNum.includes(columnIndex)) {
        if (tagSplit / len === 1) {
          return [len, 1]
        } else {
          return [0, 0]
        }
      } else if ([1, 2, 3, 4].includes(columnIndex)) {
        if (skuLen > 0) {
          return [skuLen, 1]
        } else {
          return [0, 0]
        }
      }
    },
    addpackInfoSpanMethod({ row: { len, tagSplit }, column, rowIndex, columnIndex }) {
      if (columnIndex !== 1 && columnIndex !== 3 && columnIndex !== 4 && columnIndex !== 9 && columnIndex !== 10) {
        if (tagSplit / len === 1) {
          return [len, 1]
        } else {
          return [0, 0]
        }
      }
    },
    splitpackInfoSpanMethod({ row: { len, tagSplit }, column, rowIndex, columnIndex }) {
      if (columnIndex !== 1 && columnIndex !== 3 && columnIndex !== 8 && columnIndex !== 9) {
        if (tagSplit / len === 1) {
          return [len, 1]
        } else {
          return [0, 0]
        }
      }
    },
    deal(index, num) {
      let list = this.addPacklist
      const row = deepClone(list[index])
      row.productQuantity = ''
      row.platformProductId = ''
      row.pmsSku = ''
      const name = row.packName
      let tagSplit = row.len + num // 对应行中tagSplit
      const len = row.len + num// 对应行中len
      if (num === -1) { // 删除
        this.$delete(list, index)
        const i = this.addPacklist.findIndex(item => row.packName === item.packName)
        this.getAutoChanelList(row, i)
      } else { // 添加
        list.splice(index + 1, 0, row)
      }
      list = list.map(item => {
        if (item.packName === name) {
          item.tagSplit = tagSplit
          item.len = len
          tagSplit--
        }
        return item
      })
      this.$refs.addpackTable.tableList = list
      if (num === -1) {
        this.$nextTick(() => {
          this.$refs.addpackTable.tableList = this.sortName()
        })
      }
      this.getReachLimitPack()
    },
    delPack(name, index) {
      let lastIndex = 0
      const list = this.$refs.addpackTable.tableList
      list.forEach((item, i) => {
        if (item.packName === name) {
          lastIndex = item.len
        }
      })
      list.splice(index, lastIndex)
      this.$nextTick(() => {
        this.$refs.addpackTable.tableList = this.sortName()
      })
    },
    addPack() {
      this.addData = []
      const list = this.$refs.addpackTable.tableList
      const len = list[0].len
      this.packNum = this.packNum + 1
      for (let i = 0; i < len; i++) {
        const row = Object.assign({}, list[i])
        row.packName = '包裹' + this.packNum
        row.productQuantity = ''
        this.addData.push(row)
      }
      this.$refs.addpackTable.tableList = [...this.$refs.addpackTable.tableList, ...this.addData]
      this.$refs.addpackTable.tableList = this.sortName()
    },
    getAutoChanelList(row = this.addPacklist[0], index) {
      if (!row.warehouseCode.length) {
        return
      }
      const packageData = {
        warehouseCode: row.warehouseCode + '',
        autoOptimizationChannelFlag: row.autoOptimizationChannelFlag,
        manualOptimizationChannel: row.manualOptimizationChannel || '',
        skuWarehouseList: []
      }
      const packName = row.packName
      let check = false
      let virtualWarehouseCode
      let isFirst = false // 虚拟仓发货时，是否第一次调用运费试算接口
      this.$refs.addpackTable.tableList.forEach(item => {
        if (item.packName === packName) {
          if (!Number(item.productQuantity)) {
            check = true
          }
          const pmsSku = this.skuList.filter(sItem => item.pmsSku === sItem.value)
          if (pmsSku[0] && pmsSku[0].label) {
            packageData.skuWarehouseList.push({
              goodId: item.goodId,
              pmsSku: pmsSku[0].label,
              productQuantity: item.productQuantity,
              allowRushFlag: item.allowRushFlag !== 0,
              trialFreightCost: item.trialFreightCost,
              onlineChannel: item.onlineChannel,
              externalChannelCode: item.externalChannelCode,
              productSalePrice: item.productSalePrice
            })
            // 判断是否第一次调用运费试算接口
            if (!item.notFirst) {
              virtualWarehouseCode = item.virtualWarehouseCode
              isFirst = true
              item.notFirst = true
            } else item.virtualWarehouseCode = ''
          }
        }
      })
      if (check) {
        return false
      }
      if ((packageData.skuWarehouseList || []).length) {
        const params = {
          omOrderId: this.omOrderId,
          packageData
        }
        const initData = {
          autoChanelList: [],
          trialFreightCost: 0,
          manualOptimizationChannel: '',
          onlineChannel: 0,
          externalChannelCode: '',
          otherChannelPrice: {},
          upperLimit: false
        }
        if (this.isOverSeaZH(row.warehouseCode + '')) {
          this.setData(row, initData)
          return false
        }
        // 虚拟仓发货时第一次进来，运费试算接口的仓库用虚拟仓库编码
        if (isFirst && virtualWarehouseCode) params.packageData.warehouseCode = virtualWarehouseCode
        getChannelAndPrice(params).then((res) => {
          res.data = res.data.map(item => {
            item.channelPriceVO = getChannelPriceVO(item)
            delete item.details
            return ({ ...item, fullName: this.channelMap[item.channelCode] })
          })
          if (res.data && !res.data.length) {
            this.setData(row, initData)
            this.$message.error(res.msg)
            return false
          }
          this.autoChanelList = res.data
          this.addPacklist.forEach((item, i) => {
            if (index === undefined || index === i) {
              const { cost, channelCode, onlineChannel, fullName, externalChannelCode, upperLimit, ...otherChannelPrice } = res.data[0]
              this.channelFullName = fullName
              this.setData(item, {
                autoChanelList: res.data,
                trialFreightCost: Number(cost).toFixed(2),
                manualOptimizationChannel: channelCode,
                onlineChannel,
                externalChannelCode,
                otherChannelPrice,
                upperLimit
              }, false)
            }
          })
          this.getReachLimitPack()
        }).catch(() => {
          this.setData(row, initData)
          // this.$set(row, 'warehouseCode', '', 0)
        })
      }
    },
    setData(target, data, isExecuteCB = true) {
      for (const key in data) {
        this.$set(target, key, data[key])
      }
      isExecuteCB && this.getReachLimitPack()
    },
    autoChanel(row) {
      if (row.autoOptimizationChannelFlag) {
        const hasList = !!(row.autoChanelList && row.autoChanelList.length)
        this.$set(row, 'manualOptimizationChannel', hasList ? row.autoChanelList[0].channelCode : '')
        this.$set(row, 'trialFreightCost', hasList ? Number(row.autoChanelList[0].cost).toFixed(2) : 0)
        this.$set(row, 'allowRushFlag', false)
        this.$set(row, 'upperLimit', row.autoChanelList[0].upperLimit)
        this.getReachLimitPack()
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = this.validateData()
          if (data.msg) {
            this.$message.warning(data.msg)
            return false
          }
          this.formatterData()
        } else {
          return false
        }
      })
    },
    formatterData() {
      try {
        let productQuantitytotal = 0
        this.addPacklist.forEach(item => {
          productQuantitytotal += Number(item.productQuantity)
          if (!item.warehouseCode.length && item.len === 1) {
            throw new Error('warehouseCode')
          }
          if (!item.productQuantity) { // 包裹数量为空判断
            throw new Error('productQuantity')
          }
          if (!item.platformProductId) { // itemid为空判断
            throw new Error('platformProductId')
          }
          if (!item.productSalePrice.length) {
            throw new Error('productSalePrice')
          }
          // 非泽汇海外仓，且无优选渠道和试算价格
          const isNull = !this.isOverSeaZH(item.warehouseCode + '') && item.manualOptimizationChannel === '' && !item.trialFreightCost
          if (isNull) {
            throw new Error('channelCode')
          }
        })
        if (!productQuantitytotal) {
          throw new Error('productQuantitytotal')
        }
        if (this.editType !== 'add') {
          if (this.recursiveFn()) { // 拆分包裹sku数量与原包裹不匹配判断
            throw new Error('recursiveFn')
          }
        }
      } catch (e) {
        const msgObj = {
          productQuantity: '包裹发货数量不能为空',
          recursiveFn: '拆分包裹sku数量与原包裹不匹配，请重新分配',
          productQuantitytotal: '包裹发货总数量不能为0',
          platformProductId: '请关联对应的sku',
          productSalePrice: '销售单价不能为空',
          warehouseCode: '发货仓库不能为空',
          channelCode: '非泽汇海外仓优选渠道不能为空'
        }
        if (msgObj[e.message]) {
          this.$message.warning(msgObj[e.message])
          return false
        }
      }
      this.submitLoading = true
      const params = {
        omOrderId: this.omOrderId,
        manualSepList: [
        ],
        msgBrief: this.form.msgBrief
      }
      if (this.editType !== 'add') {
        delete params.omOrderId
        params.packageCode = this.packageCode
      }
      const len = this.$refs.addpackTable.tableList.length
      const list = deepClone(this.$refs.addpackTable.tableList)// 深递归避免影响页面数据
      const arr = []// 控制i的变化
      const manualSepList = []// params入参
      for (let i = 0; i < len;) {
        let inarr = []// 根据len分组
        inarr = list.splice(0, list && list[0].len)
        let returnData = { }// 返回值
        const skuWarehouseList = []// 入参
        inarr && inarr.forEach((item, index) => {
          arr.push(item)
          if (index === 0) {
            const hwFlag = this.isOverSeaZH(item.warehouseCode + '')
            let nwDwgId = item.otherChannelPrice && item.otherChannelPrice.dwgId
            if (isNaN(nwDwgId)) nwDwgId = -1
            returnData = {
              onlineChannel: item.onlineChannel,
              externalChannelCode: item.externalChannelCode,
              warehouseCode: item.virtualWarehouseCode || item.warehouseCode.join(',') || '',
              manualOptimizationChannel: item.manualOptimizationChannel || '',
              autoOptimizationChannelFlag: item.autoOptimizationChannelFlag ? 1 : 0,
              allowRushFlag: item.allowRushFlag ? 1 : 0,
              trialFreightCost: item.trialFreightCost || '0',
              channelPriceVO: item.otherChannelPrice && item.otherChannelPrice.channelPriceVO,
              nwDwgId,
              hwFlag
            }
          }
          if (Number(item.productQuantity) !== 0) {
            const pmsSku = this.skuList.filter(sItem => item.pmsSku === sItem.value)
            const p = this.itemList.find(p => {
              return p.platformProductId === item.platformProductId
            })
            skuWarehouseList.push({
              goodId: item.goodId,
              pmsSku: pmsSku[0].label,
              productQuantity: item.productQuantity,
              platformProductId: item.platformProductId,
              productSalePrice: item.productSalePrice,
              productsTransactionNum: p && p.productsTransactionNum,
              channelPriceVO: item.otherChannelPrice && item.otherChannelPrice.channelPriceVO
            })
          }
        })
        if ((skuWarehouseList || []).length) {
          returnData.skuWarehouseList = skuWarehouseList
          manualSepList.push(returnData)
        }
        i = arr.length// 控制i的变化
      }
      params.manualSepList = manualSepList
      const type = this.editType
      save(params, type).then(res => {
        this.submitLoading = false
        const msg = this.editType === 'add' ? '新增包裹成功' : '拆分包裹成功'
        this.$message.success(msg) && this.close(true)
      }).catch(() => {
        this.submitLoading = false
      })
    },
    close(type) {
      this.$parent.$emit('close', type)
    },
    validateData() {
      const msgInfo = {}
      let checkData = {}
      let list = deepClone(this.$refs.addpackTable.tableList)
      list = list.map(item => {
        const pmsSkuObj = this.skuList.filter(sItem => {
          return sItem.value === item.pmsSku
        })
        if (pmsSkuObj.length) {
          item.pmsSku = pmsSkuObj[0].label
        }
        return item
      })
      try {
        this.addPacklist.forEach((res, i) => {
          if (!res.pmsSku) {
            throw new Error('pmsku')
          }
          list.forEach((item) => {
            if (checkData[item.pmsSku] === item.platformProductId) {
              msgInfo.msg = `SKU ${item.pmsSku} 和SKU对应的Item ${item.platformProductId} 不能重复，系统检测到重复记录，请修改`
            } else {
              checkData[item.pmsSku] = item.platformProductId
            }
          })
          checkData = {}
        })
      } catch (e) {
        const msgObj = {
          pmsku: '系统检查有未填写的SKU'
        }
        msgInfo.msg = msgObj[e.message]
      }
      return msgInfo
    },
    quantityChange(row) {
      const index = this.skuList.findIndex(item => item.value === row.pmsSku)
      const i = this.addPacklist.findIndex(item => item.packName === row.packName)
      row.platformProductId = (this.skuList[index] && this.skuList[index].platformProductId) || ''
      if (this.editType === 'add') {
        const productQuantity = row.productQuantity
        const pmsSku = row.pmsSku
        const warehouseCode = row.warehouseCode
        this.resultData.goodInventoryList.forEach(item => {
          if (item.pmsSku === pmsSku) {
            item.inventoryList.forEach(wareItem => {
              if (wareItem.warehouseCode === warehouseCode) {
                if (productQuantity > wareItem.availableStock) {
                  this.$message.warning(`超出${wareItem.warehouseName}仓下的${pmsSku}的库存,请重新输入`)
                  row.productQuantity = ''
                  return false
                }
              }
            })
          }
        })
      }
      this.getAutoChanelList(row, i)
    },
    wareCodeChange(row, index) {
      this.getAutoChanelList(row, index)
    },
    sortName() {
      const sortList = []
      let tagNum = 1
      const deepList = deepClone(this.$refs.addpackTable.tableList)
      this.addPacklist.forEach(dItem => {
        const len = deepList.length && deepList[0].len
        const splitList = deepList.splice(0, len && len)
        splitList.forEach(item => {
          item.packName = '包裹' + tagNum
          sortList.push(item)
        })
        tagNum++
      })
      return sortList
    },
    uniqueFn(data) {
      const obj = {}
      let result = []
      data.forEach(item => {
        if (!obj[item.pmsSku]) {
          obj[item.pmsSku] = item
          result.push(item)
        }
      })
      const len = result.length
      let tagSplit = result.length
      result = result.map(res => {
        res.len = len
        res.tagSplit = tagSplit
        tagSplit--
        return res
      })
      return result
    },
    recursiveFn() {
      let type = false
      let list = deepClone(this.addPacklist)
      list = list.map(item => {
        item.pmsSku = this.skuList.filter(sItem => {
          return sItem.value === item.pmsSku
        })[0].label
        return item
      })
      const oldList = deepClone(this.oldPackList)
      const sp1 = this.spliceObj(list)
      const sp2 = this.spliceObj(oldList)
      Object.entries(sp2).forEach(([key, value]) => {
        if (((sp1 && sp1.key === 0) || sp1[key] !== sp2[key]) || !sp1[key]) {
          type = true
        }
      })
      return type
    },
    spliceObj(data) {
      const obj = {}
      data.forEach(item => {
        if (!obj[item.pmsSku]) {
          obj[item.pmsSku] = Number(item.productQuantity)
        }
      })
      return obj
    }

  }
}
