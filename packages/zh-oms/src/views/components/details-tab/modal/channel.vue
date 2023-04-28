<template>
  <!-- oms 详情 - 修改渠道 -->
  <div v-loading="loading" class="channel-wrap">
    <div style="height: 200px;">
      <g-table ref="firstTable"
               row-key="id"
               dense
               :headers="firstHeaders"
               :page-show="false"
               :fetch="firstFetch"
               :span-method="skuSpan"
               @rendered="skuRendered"
      >
        <el-form slot="header" ref="formRef" :model="form" size="mini" label-width="96px" class="form-col no-message">
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="包裹单号：" label-width="80px" prop="packageCode">
                <el-input v-model="form.packageCode" readonly type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物流属性：" prop="logisticsProperty">
                <g-text-ellipsis>{{ form.logisticsProperty }}</g-text-ellipsis>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="是否允许冲货：" prop="allowRushFlag">
                <el-switch v-model="form.allowRushFlag" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="试算重量：" label-width="80px" prop="trialWeight">
                <el-input v-model="form.trialWeight" readonly type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="虚仓发货：" prop="isVirtualWarehouse">
                <el-input v-model="form.isVirtualWarehouse" readonly type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="虚拟仓库：" prop="virtualWarehouse">
                <g-text-ellipsis>{{ form.virtualWarehouse }}</g-text-ellipsis>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table-column slot="warehouseCode" label="发货仓库">
          <template #default="{row}">
            <wareCascader ref="warehouseCodeRef" class="w-100" :show-all-levels="false" :virtual-rule-data="virtualRuleData" :value.sync="row.warehouseCode" @changeFn="firstSearch(row.warehouseCode, true)" @rendered="whcRendered" />
          </template>
        </el-table-column>
      </g-table>
    </div>
    <div class="text-end mb-2"><el-button type="primary" size="mini" @click="search(false)">查询渠道</el-button></div>

    <div style="height:200px;">
      <g-table ref="table"
               row-key="id"
               dense
               :headers="headers"
               :page-show="false"
               :fetch="fetch"
      >
        <el-table-column slot="selectionSlot" width="50px" align="center">
          <template #default="{row, $index}">
            <el-checkbox v-model="row.isChecked" :disabled="isChanged" @change="changeChecked($index)" />
          </template>
        </el-table-column>
      </g-table>
    </div>
    <div class="d-flex justify-content-between">
      <g-text-ellipsis class="text-danger">{{ (checkedData||{}).upperLimit? '所选渠道的国家已达到当日上限':'' }} </g-text-ellipsis>
      <div class="flex-shrink-0">
        <el-button size="mini" @click="close(false)">取消</el-button>
        <el-button :disabled="isChanged||checkedData===null" type="primary" size="mini" @click="submit">确认</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getChannelPriceVO } from '../../../../utils.js'
import { getChannelListAll } from '@/api/common.js'
import { overSearZHMixin as isOverSeaZH } from '@/views/mixins/is-over-sea-zh.js'
import { updateChannel, getSkuAndInventory, getSkuAndInventoryDetail, getChannelAndPriceByPkgCode, getChannelAndPriceByPkgDetail, packageSubmit } from '@/api/packageDetails'
import { exceptionAudit } from '@/api/orderManagement'
import wareCascader from '@/views/components/wareCascader/index.vue'

export default {
  name: 'Channel',
  components: { wareCascader },
  mixins: [isOverSeaZH],
  props: {
    omOrderId: String,
    /** @type {ZHKJ.VueProps<{trialWeight:string, logisticsProperty:string, packageCode:string},channelCode:string>} */
    channelForm: Object,
    exceptionType: Number,
    mData: {
      type: Object,
      default: () => ({})
    },
    detailsData: Object,
    packageStatus: Number,
    isRPDetails: Boolean,
    virtualRuleData: Object
  },
  data() {
    return {
      form: {
        packageCode: '',
        logisticsProperty: '',
        trialWeight: '',
        allowRushFlag: true,
        warehouseCode: [],
        isVirtualWarehouse: '',
        virtualWarehouse: ''
      },
      firstHeaders: [
        { slot: true, slotName: 'warehouseCode' },
        { label: 'SKU', prop: 'pmsSku', width: '130px' },
        { label: 'SKU对应的Item', prop: 'platformProductId', width: '130px' },
        { label: '包裹要求发货数量', prop: 'quantity', width: '120px' },
        { label: '备货仓库', prop: 'stockUpWarehouse', width: '160px' },
        { label: '可用库存', prop: 'inventory', width: '74px' }
      ],
      headers: [
        { slot: true, slotName: 'selectionSlot' },
        {
          label: '渠道名称',
          prop: 'channelCode',
          formatter(row) {
            return row.fullName
          }
        },
        { label: '价格（RMB）', prop: 'shortCost', width: 100 },
        { label: '时效（天）', prop: 'timeliness', width: 100 },
        { label: '是否冲货', prop: 'allowRushFlag', width: 100 }
      ],
      checkedData: null,
      loading: false,
      preWarehouse: this.channelForm.warehouseCode,
      initWhc: '',
      isChanged: false,
      isinitSku: true,
      warehouseList: [],
      channelMap: {}
    }
  },
  computed: {
    isChangedData({ mData, form: { warehouseCode: whc }, initWhc }) {
      const { packageAddressDTO, packageGoodList } = mData
      return packageAddressDTO === undefined && packageGoodList === undefined && whc.toString() === initWhc
    }
  },
  watch: {
    'form.warehouseCode'(val) {
      const isChanged = this.preWarehouse !== val.toString()
      isChanged && this.$message.warning('请重新查询渠道')
      this.isChanged = isChanged
    }
  },
  mounted() {
    this.goodInfoList = this.detailsData?.pages.reduce((pre, { pmsSku, platformProductId, productQuantity, omOrderGoodId }) => {
      pre.push({ pmsSku, platformProductId, productQuantity, goodId: omOrderGoodId })
      return pre
    }, [])

    getChannelListAll().then(res => {
      res.data.forEach(item => {
        const fullName = `${item.name}(${item.channelCode})`
        this.channelMap[item.channelCode] = fullName
      })
    })
    Object.assign(this.form, this.channelForm)
    this.form.trialWeight += 'g'
    this.firstSearch((this.channelForm.warehouseCode ?? '').split(','), false)
  },
  methods: {
    getWhcName(target, list = this.warehouseList) {
      const ids = [...target]
      const id = ids.shift()
      const res = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item.warehouseCode === id) {
          res.push(item.warehouseName)
          if (item.children !== null && item.children.length && target.length) {
            res.push(...this.getWhcName(ids, item.children))
            return res
          }
        }
      }
      return res
    },
    whcRendered(list) {
      this.warehouseList = list
      const { ruleId } = this.channelForm
      if (ruleId === -1) return
      this.form.virtualWarehouse = list.reduce((name, cur) => {
        if (cur.warehouseCode === 'VIRTUAL') {
          name = cur.warehouseName
          const { warehouseName = '' } = (cur.children || []).find(item => item.warehouseCode === ruleId) || {}
          name = warehouseName !== '' ? name + warehouseName : ''
        }
        return name
      }, '')
    },
    skuRendered() {
      if (!this.isinitSku) return
      this.search(this.isinitSku)
      this.isinitSku = false
    },
    skuSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.len > 0) {
          return [row.len, 1] // [row, column]
        } else {
          return [0, 0]
        }
      } else if ([1, 2, 3].includes(columnIndex)) {
        if (row.skuLen > 0) {
          return [row.skuLen, 1] // [row, column]
        } else {
          return [0, 0]
        }
      }
    },
    submit() {
      const {
        omOrderId,
        form: { packageCode, warehouseCode: whc },
        channelForm,
        exceptionType,
        checkedData: { cost: trialFreightCost, dwgId: nwDwgId, onlineChannel, externalChannelCode, channelPriceVO },
        mData: data,
        isChangedData
      } = this
      let channelCode = ''
      const hwFlag = this.isOverSeaZH(whc + '')
      if (!hwFlag) channelCode = this.checkedData.channelCode

      if (channelForm.channelCode === channelCode && isChangedData) {
        return this.$message.error('未进行任何更新操作，所选渠道与原渠道相同，无需修改')
      }
      if (this.loading) return
      this.loading = true

      // 详情页调用的修改渠道接口
      if (exceptionType !== undefined) {
        const returnPkgFlag = this.packageStatus === 10
        data.packageCode = packageCode
        data.channelUpdateDTO = {
          packageCode,
          warehouseCode: this.isinitSku ? channelForm.virtualWarehouseCode : whc.toString(),
          channelCode,
          onlineChannel,
          externalChannelCode,
          trialFreightCost,
          nwDwgId,
          channelPriceVO,
          returnPkgFlag,
          hwFlag
        }

        if (this.isRPDetails) return this.close(true, data) // 包裹详情的恢复包裹不直接调手工分仓接口

        packageSubmit(data).then(res => {
          this.close(true)
          const params = [{ ifPass: 1, omOrderId, packageCode, exceptionType, remarks: '' }]
          exceptionAudit('package', params).then(res => {
            this.$message.success(res.msg)
          })
        }).finally(() => { this.loading = false })
        return
      }
      // 列表页调用的修改渠道接口
      updateChannel({ packageCode, channelCode, onlineChannel, externalChannelCode, trialFreightCost, nwDwgId, channelPriceVO, warehouseCode: whc.toString(), hwFlag }).then(res => {
        this.close(true)
        this.$message.success(res.msg)
      }).finally(() => { this.loading = false })
    },
    changeChecked(index) {
      (this.$refs.table.tableList ?? []).map((row, i) => {
        if (index === i) {
          row.isChecked = true
          this.checkedData = row
        } else row.isChecked = false
        return row
      })
    },
    firstSearch(warehouseCode = [], notIsInit) {
      if (notIsInit) {
        if (warehouseCode.length) {
          const isVirtual = warehouseCode.includes('VIRTUAL')
          this.form.isVirtualWarehouse = isVirtual ? '是' : '否'
          this.form.virtualWarehouse = isVirtual ? this.getWhcName(warehouseCode).join('/') : ''
        } else {
          this.form.isVirtualWarehouse = ''
          this.form.virtualWarehouse = ''
        }
      }
      this.form.warehouseCode = warehouseCode
      const { packageCode } = this.channelForm
      const params = { packageCode, warehouseCode: warehouseCode.toString() }
      this.$refs.firstTable.load(1, params)
    },
    search(isinitSku) {
      const { channelForm: { packageCode, virtualWarehouseCode }, form: { allowRushFlag, warehouseCode: whc } } = this
      const params = { packageCode, allowRushFlag, warehouseCode: whc.toString() }
      // 是虚拟仓发货时，第一次的运费试算接口仓库用的是虚拟仓库编码，往后再修改仓库时就用修改的仓库
      if (virtualWarehouseCode && isinitSku) params.warehouseCode = virtualWarehouseCode

      if (this.detailsData) Object.assign(params, this.detailsData)
      this.checkedData = null
      this.$refs.table.tableList = []
      this.$refs.table.load(1, params)
      this.isChanged = false
      this.preWarehouse = whc.toString()
    },
    firstFetch(page, params) {
      const isInit = this.form.warehouseCode.length === 0
      let api = getSkuAndInventory
      if (this.goodInfoList) {
        api = getSkuAndInventoryDetail
        params.goodInfoList = this.goodInfoList
      }
      return api(params).then(({ data }) => {
        const whc = data[0].warehouseCode
        if (isInit) {
          this.preWarehouse = this.initWhc = whc
          this.form.warehouseCode = data[0].warehouseCode = whc.split(',')
        } else data[0].warehouseCode = this.form.warehouseCode
        data[0].len = data.length

        this.dealSkuItemId(data)
        return { records: data }
      })
    },
    dealSkuItemId(data) {
      const maxLen = data.length - 1
      let skuItemId = data[maxLen].pmsSku + '_' + data[maxLen].platformProductId
      let skuItemIdLen = 0
      const obj = {}
      for (let i = maxLen; i >= 0; i--) {
        const { pmsSku, platformProductId } = data[i]
        const item = `${pmsSku}_${platformProductId}`
        if (item !== skuItemId) {
          obj[i + 1] = skuItemIdLen
          skuItemId = item
          skuItemIdLen = 1
        } else skuItemIdLen++
        if (i === 0) obj[0] = skuItemIdLen
      }

      Object.entries(obj).forEach(([key, value]) => {
        data[key].skuLen = value
      })
    },
    fetch({ current, size }, params) {
      if (params.warehouseCode === '') return Promise.resolve().then(() => ({ records: [] }))
      else if (this.isOverSeaZH(params.warehouseCode)) {
        const ZH = { fullName: '泽汇海外仓无需优选渠道', cost: '0', shortCost: 0, timeliness: '0', isChecked: true, allowRushFlag: '否', dwgId: '' }
        this.checkedData = ZH
        return Promise.resolve().then(() => ({ records: [ZH] }))
      }
      return (this.detailsData ? getChannelAndPriceByPkgDetail : getChannelAndPriceByPkgCode)(params).then(res => {
        if (res.data?.length === 0) this.$message.error(res.msg)
        const records = (res.data ?? []).map(item => {
          const fullName = this.channelMap[item.channelCode]
          item.channelPriceVO = getChannelPriceVO(item)
          delete item.details
          return Object.assign(item, { shortCost: parseFloat(item.cost).toFixed(2), isChecked: false, allowRushFlag: '否', fullName })
        })
        return { records }
      })
    },
    close(bool, data) {
      this.$parent.$emit('close', bool, data)
    }
  }
}
</script>

<style scoped lang="scss">
.channel-wrap ::v-deep {
  .el-input--mini .el-input__inner{
    border:none;
    padding-left: 0;
  }
}
</style>
