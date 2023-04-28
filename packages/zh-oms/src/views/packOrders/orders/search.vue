<template>
  <el-form ref="form" class="search-form form-col no-message" :model="form" size="mini" :label-width="labelWidth">
    <el-row v-if="orderType==='all'" :gutter="10">
      <el-col :span="24">
        <el-form-item label="包裹状态" prop="packageStatus">
          <BtnsGroup :type-list="generalList" :value.sync="form.packageStatus" @change="radioChange" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="orderType==='audit'" :gutter="10">
      <el-col :span="24">
        <el-form-item label="待审类型" prop="exceptionType">
          <BtnsGroup :order-type="orderType" :type-list="generalList.filter(item=>item.typeCount > 0 )" :value.sync="form.exceptionType" @change="radioChange" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="orderType==='abnormal'" :gutter="10">
      <el-col :span="24">
        <el-form-item label="异常类型" prop="channelExceptionType">
          <BtnsGroup :type-list="generalList" :value.sync="form.channelExceptionType" @change="radioChange" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="获取状态" prop="channelGetStatus">
          <BtnsGroup :type-list="getStatusCountList" :value.sync="form.channelGetStatus" @change="radioChange" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6" class="d-flex align-items-center">
        <DropdownLabel v-model="activeDropdown" width="66px" :list="timeTypeList" />
        <el-form-item label="" label-width="6px" prop="time" class="w-100">
          <el-date-picker
            v-model="time"
            class="w-100"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="销售平台" prop="platformCode">
          <el-select v-model="form.platformCode" class="w-100" filterable clearable @change="getStoreName">
            <el-option v-for="(list,index) in platList" :key="index" :label="list.label" :value="list.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="销售店铺" prop="storeName">
          <el-select v-if="!textChange" v-model="form.storeName" class="w-100" collapse-tags multiple :disabled="!form.platformCode.length" filterable clearable>
            <el-option v-for="(list,index) in storeList" :key="index" :label="list.label" :value="list.value" />
          </el-select>
          <g-multiple-input v-else v-model="form.storeName" :reg-exp="/\n+/" return-type="string" placeholder="多个以回车隔开" />
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item label-width="0">
          <el-button type="text" @click="()=>{textChange=!textChange;updateTableHeight()}">切换</el-button>
          <el-button type="text" @click="ishigh=!ishigh">
            {{ ishigh?'高级':'取消高级' }}<i :class="ishigh?'el-icon-arrow-down':'el-icon-arrow-up'" />
          </el-button>
          <el-button v-if="ishigh" type="primary" @click="submitSearch(1)">搜索</el-button>
          <el-button v-if="ishigh" @click="reset('form')">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <template v-if="!ishigh">
      <el-row :gutter="10">
        <el-col v-if="['all', 'audit', 'delivery'].includes(orderType)" class="d-flex align-items-center" :span="6">
          <DropdownLabel v-model="rangeType" width="66px" :list="rangeTypeList" />
          <el-form-item label="" label-width="6px" class="w-100">
            <el-row type="flex">
              <el-col :span="11">
                <el-input v-model="actualFreightCostArray1" v-input.number class="width-100" @change="changeFreight" />
              </el-col>
              <el-col :span="2" style="text-align:center;">-</el-col>
              <el-col :span="11">
                <el-input v-model="actualFreightCostArray2" v-input.number class="width-100" @change="changeFreight" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收件国家" prop="receiveCountryCode">
            <el-select v-model="form.receiveCountryCode" filterable clearable class="w-100">
              <el-option v-for="(item,index) in countryList" :key="index" :label="item.countryCn" :value="item.countryCode" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物流渠道" prop="channelCode">
            <g-select v-model="form.channelCode" :items="deliveryChannelList" key-field="id" label-field="fullName" value-field="channelCode" dropdown-width="24em" class="w-100" />
          </el-form-item>
        </el-col>
        <el-col v-if="orderType==='delivery'" :span="6">
          <el-form-item label="拦截原因" prop="exceptionMsg">
            <el-select v-model="form.exceptionMsg" clearable class="w-100">
              <el-option v-for="(item,index) in exceptionList" :key="index" :value="item" :label="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <div v-if="orderType!=='returnGoods'&&orderType!=='delivery'">
          <el-col v-if="orderType==='all'" :span="6">
            <el-form-item label="轨迹状态" prop="exceptionType">
              <el-select v-model="form.ifSupplementPackage" :disabled="true" class="w-100">
                <el-option value="" label="全部" />
                <el-option v-for="item in locusStatusList" :key="item.typeCode" :label="item.typeDescribe" :value="item.typeCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单来源" prop="orderType">
              <el-select v-model="form.orderType" filterable clearable class="w-100">
                <el-option value="" label="全部" />
                <el-option v-for="item in orderSourceList" :key="item.typeCode" :label="item.typeDescribe" :value="+item.typeCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="orderType!=='audit'" :span="6">
            <el-form-item label="是否负利润" prop="ifProfit">
              <el-select v-model="form.ifProfit" clearable class="w-100">
                <el-option value="" label="全部" />
                <el-option v-for="item in istrueList" :key="item.typeCode" :label="item.typeDescribe" :value="item.typeCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发货仓库" prop="warehouseCode">
              <el-cascader
                ref="tree"
                v-model="form.warehouseCode"
                :show-all-levels="false"
                class="w-100"
                clearable
                collapse-tags
                :options="wareCodeList"
                :props="{label: 'warehouseName', value: 'warehouseCode',multiple:true}"
                @change="getCheckedNodes"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="orderType==='all'" :span="6">
            <el-form-item label="发货状态" prop="wmsStatus">
              <g-select v-model="form.wmsStatus" :disabled="form.warehouseCode.length===0" multiple :items="getWmsStatus" key-field="label" label-field="label" value-field="state" class="w-100 px-0" @change="updateTableHeight()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否偏远" prop="ifSupplementPackage">
              <el-select v-model="form.ifSupplementPackage" clearable :disabled="true" class="w-100">
                <el-option value="" label="全部" />
                <el-option v-for="item in istrueList" :key="item.typeCode" :label="item.typeDescribe" :value="item.typeCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否补包裹" prop="ifSupplementPackage">
              <el-select v-model="form.ifSupplementPackage" clearable class="w-100">
                <el-option value="" label="全部" />
                <el-option v-for="item in istrueList" :key="item.typeCode" :label="item.typeDescribe" :value="item.typeCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="自动撤单" prop="sysCancelRslt">
              <el-select v-model="form.sysCancelRslt" clearable class="w-100">
                <el-option value="" label="全部" />
                <el-option v-for="item in istrueList" :key="item.typeCode" :label="item.typeDescribe" :value="item.typeCode" />
              </el-select>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
      <div class="d-flex">
        <el-form-item label="搜索类型" prop="searchType">
          <BtnsGroup :type-list="searchTypeList" :is-radio="true" :value.sync="form.searchType" />
        </el-form-item>
        <el-form-item label-width="10px" prop="searchContent">
          <g-multiple-input v-model="form.searchContent" style="width: 206px;" :reg-exp="/\n+/" return-type="string" placeholder="多个以回车隔开" />
        </el-form-item>
        <el-form-item v-if="!ishigh" label-width="10px">
          <el-button type="primary" @click="submitSearch(1)">搜索</el-button>
          <el-button @click="reset('form')">重置</el-button>
        </el-form-item>
      </div>
    </template>
    <el-row type="flex" class="row-bg" :justify="orderType==='abnormal'?'end':'space-between'" :gutter="10">
      <el-col :span="14">
        <el-form-item label="排序方式">
          <SortButtons ref="allSort" v-model="sorts" :sort-list="sortTypeList" active-color="red" />
        </el-form-item>
      </el-col>
      <el-col :span="10" class="d-flex justify-content-end align-items-center">
        <el-button v-if="$auth('oms_pack_all_reissue')&&['all', 'audit'].includes(orderType)" type="primary" size="mini" @click="addPack">添加包裹</el-button>
        <el-button v-if="$auth('oms_pack_customExp')" type="primary" class="mx-2" size="mini" @click="tmpExport">自定义模板导出</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getDicts } from '@/api/common/dict'
import { baseCountry, getCount, wareCodeList, getWmsStatus } from '@/api/packOrders'
import { getChannelListAll, getStoreByPlatform, getPlatformList } from '@/api/common.js'
import { dateFormat } from '@/util/date.js'

import defineTemplate from '../../components/define-template/index.vue'
import SortButtons from '../../components/sort-buttons/index.vue'
import addpackModal from '../modal/addpackModal.vue'
import BtnsGroup from '../../components/btns-group/index.vue'
import DropdownLabel from '@/views/components/dropdown-label/index.vue'

export default {
  components: {
    SortButtons, BtnsGroup, DropdownLabel
  },
  props: {
    search: Function,
    orderType: String,
    updateTableHeight: Function
  },
  data() {
    return {
      params: {},
      deliveryChannelList: [],
      form: {
        packageStatus: '',
        platformCode: '',
        storeName: '',
        exceptionType: '',
        channelExceptionType: '',
        channelGetStatus: '',
        searchType: this.$route.params.searchType || '1',
        warehouseCode: [],
        wmsStatus: [],
        sysCancelRslt: '',
        channelCode: '',
        ifSupplementPackage: '',
        confirmCancel: '',
        ifOnlineChannel: '',
        searchContent: this.$route.params.searchContent || '',
        sortType: '',
        orderType: '',
        ifProfit: '',
        receiveCountryCode: '',
        sortAsc: ''
      },
      actualFreightCostArray1: '',
      actualFreightCostArray2: '',
      timeType: '',
      labelWidth: 72 + 'px',
      ishigh: true,
      generalList: [], // 通用列表
      getStatusCountList: [], // 获取状态
      searchTypeList: [], // 搜索类型
      searchTypeCountList: [{ typeCode: 0, typeDescribe: '平台单号' }],
      wareCodeList: [], // 发货仓库下拉列表
      orderSourceList: [
        { typeCode: 0, typeDescribe: '线上订单' },
        { typeCode: 1, typeDescribe: '手工订单' },
        { typeCode: 2, typeDescribe: '批发订单' }
      ], // 订单来源
      istrueList: [
        { typeCode: 1, typeDescribe: '是' },
        { typeCode: 0, typeDescribe: '否' }
      ], // 是否
      locusStatusList: [
        { typeCode: 0, typeDescribe: '暂无轨迹', typeCount: '0' },
        { typeCode: 1, typeDescribe: '上网', typeCount: '0' },
        { typeCode: 2, typeDescribe: '封发', typeCount: '0' },
        { typeCode: 3, typeDescribe: '交轨', typeCount: '0' },
        { typeCode: 4, typeDescribe: '落地', typeCount: '0' },
        { typeCode: 5, typeDescribe: '妥投', typeCount: '0' }
      ],
      textChange: false,
      timeTypeList: [{ value: 0, label: '付款时间' }, { value: 2, label: '抓单时间' }],
      rangeTypeList: [{ value: 'actualFreightCostArray', label: '实际运费' }],
      sortTypeList: [
        { value: 1, label: '按付款时间', type: true },
        { value: 2, label: '按异常停留时间', type: this.orderType === 'audit' || this.orderType === 'abnormal' || this.orderType === 'returnGoods' || this.orderType === 'delivery' },
        { value: 3, label: '按试算包裹利润', type: this.orderType === 'audit' || this.orderType === 'all' || this.orderType === 'returnGoods' || this.orderType === 'delivery' },
        { value: 2, label: '按缺货时间', type: this.orderType === 'scarceGoods' }, // 异常和缺货是同一个字段所以对应的值都是2
        { value: 4, label: '按发货优先级', type: this.orderType === 'scarceGoods' }
      ],
      iscancelList: [
        { typeCode: 1, typeDescribe: '已撤单' },
        { typeCode: 0, typeDescribe: '未撤单' }
      ],
      platList: [], // 平台列表
      storeList: [], // 店铺列表
      activeDropdown: 0,
      rangeType: 'trialProfit',
      countryList: [], // 国家列表
      getWmsStatus: [], // 发货状态
      dicts: ['pack_searchtype'],
      warehouseCode: [],
      sorts: {
        name: '',
        type: ''
      },
      time: '',
      exceptionList: [
        '出库计算负利润被拦截',
        '手工触发出库拦截',
        '出库拦截审核不通过',
        '出库拦截审核通过'
      ]
    }
  },
  watch: {
    sorts: {
      handler(newVal, oldVal) {
        this.submitSearch()
      },
      deep: true
    },
    ishigh: {
      handler(newVal, oldVal) {
        this.updateTableHeight()
      }
    },
    orderType: {
      handler(newVal) {
        this.sortTypeList = this.sortTypeList.filter(item => item.type)
      },
      immediate: true
    }
  },
  created() {
    if (['all', 'audit', 'delivery'].includes(this.orderType)) {
      if (this.orderType === 'delivery') {
        this.rangeType = 'actualProfit'
        this.rangeTypeList.push({ value: 'actualProfit', label: '出库利润' })
      } else this.rangeTypeList.push({ value: 'trialProfit', label: '试算利润' })
    }
    this.setDefaultDate()
    const orderTypeList = {
      all: '',
      audit: '1',
      scarceGoods: '5',
      abnormal: '3',
      delivery: '13',
      returnGoods: '10'
    }
    this.form.packageStatus = orderTypeList[this.orderType]
    getDicts(this.dicts, 'oms').then(res => {
      this.searchTypeList = res.pack_searchtype
    })
    this.getPlatLIst()
    this.getBaseCountry()
    this.getwareCodeList()
    getChannelListAll().then(res => {
      this.deliveryChannelList = res.data.filter(item => {
        item.fullName = `${item.name}(${item.channelCode})`
        return item.channelCode !== ''
      })
    })
  },
  mounted() {
    this.submitSearch(1)
  },
  methods: {
    setDefaultDate() {
      const curDate = new Date()
      const curDateEndStr = dateFormat(curDate).slice(0, 11) + '23:59:59'
      curDate.setMonth(curDate.getMonth() - 1)
      const lastMonthDateStartStr = dateFormat(curDate).slice(0, 11) + '00:00:00'
      this.time = [lastMonthDateStartStr, curDateEndStr]
    },
    tmpExport() {
      const { params } = this
      this.$modal({
        title: '自定义导出模板选择：（每个用户最多配置5个自定义模板）',
        component: defineTemplate,
        data: { params, type: 1 }
      })
    },
    // 添加包裹
    addPack() {
      this.$modal({
        title: '添加包裹',
        width: '85%',
        component: addpackModal,
        data: {},
        callback: (type) => {
          type && this.submitSearch(1, -1)
        }
      })
    },
    // 实际运费验证
    changeFreight() {
      if (this.actualFreightCostArray1 && this.actualFreightCostArray2 && (+this.actualFreightCostArray1 > +this.actualFreightCostArray2)) {
        return this.$message.warning('请输入正确的实际运费')
      }
    },
    // 获取状态及数量
    async getCount() {
      const countTypeList = {
        all: 1, // 包裹状态
        audit: 2,
        scarceGoods: 3,
        abnormal: 4
      }
      let loopIndex = 1
      const params = Object.assign({ countType: countTypeList[this.orderType] }, this.form)
      params[this.rangeType] = [this.actualFreightCostArray1 || '', this.actualFreightCostArray2 || '']
      params.storeName = Array.isArray(params.storeName) ? params.storeName.join(',') : params.storeName
      params.warehouseCode = this.warehouseCode.map(res => {
        return res.join()
      })
      if (this.activeDropdown) {
        params.firstGrabTimeArray = (this.time && this.time) || ['', '']
        params.payTimeArray = ['', '']
      } else {
        params.firstGrabTimeArray = ['', '']
        params.payTimeArray = (this.time && this.time) || ['', '']
      }
      if (this.orderType === 'abnormal') {
        loopIndex = 2
      }
      for (let i = 0; i < loopIndex; i++) {
        if (i === 1) {
          params.countType = 5
        }
        try {
          await getCount(params).then(res => {
            if (i === 1) {
              this.getStatusCountList = res.data
            } else {
              if (this.orderType === 'audit') {
                this.generalList = res.data.filter(item => item.typeCode !== 0)
              } else {
                this.generalList = res.data
              }
            }
            this.updateTableHeight()
          })
        } catch (error) {}
      }
    },
    // 获取平台列表
    getPlatLIst() {
      getPlatformList().then(res => {
        this.platList = res.data.map(item => {
          return {
            label: item.platformName,
            value: item.platformCode
          }
        })
      })
    },
    radioChange() {
      this.submitSearch()
    },
    // 获取发货仓库列表
    getwareCodeList() {
      wareCodeList({ searchWord: '' }).then(res => {
        this.wareCodeList = this.recursiveTree(res.data).filter(item => item.warehouseCode !== 'VIRTUAL')
      })
    },
    getCheckedNodes(val, index) {
      if (!val.length) {
        this.form.wmsStatus = []
        this.warehouseCode = []
        return
      }
      const paramsList = []
      let item = ''
      const ids = []
      val.forEach((res) => {
        ids.push(res[2])
        if (!item || item !== res[1]) {
          item = res[1]
          paramsList.push(res.join())
        }
      })
      if (this.orderType === 'all') {
        getWmsStatus(paramsList).then(res => {
          this.getWmsStatus = res.data.map(item => {
            item.label = `${item.warehouseName}(${item.stateDesc})`
            return item
          })
          this.updateTableHeight()
        })
      }
      this.warehouseCode = this.getParams(ids)
    },
    getParams(ids) {
      const result = []
      const arr = this.wareCodeList
      function recursionFn(arr, parentNode = '', ids) {
        arr.forEach((aitem) => {
          // 每个节点添加全路径
          if (parentNode) {
            aitem.fullPath = [...parentNode.fullPath, aitem.warehouseCode]
          } else {
            aitem.fullPath = [aitem.warehouseCode]
          }
          if (ids.includes(aitem.warehouseCode)) {
            result.push(aitem.fullPath)
          }
          aitem.parentNode = parentNode
          if (aitem.children) {
            recursionFn(aitem.children, aitem, ids)
          }
        })
      }
      recursionFn(arr, '', ids)
      return result
    },
    recursiveTree(tree) {
      tree.forEach(item => {
        if (item.children?.length === 0) {
          item.children = null
        } else if (item.children?.length > 0) {
          this.recursiveTree(item.children)
        }
      })
      return tree
    },
    // 获取店铺列表
    getStoreName() {
      this.form.storeName = ''
      if (!this.form.platformCode.length) {
        return false
      }
      getStoreByPlatform(this.form.platformCode).then(res => {
        this.storeList = res.data.map(item => {
          return {
            label: item.displayName,
            value: item.displayName
          }
        })
      })
    },
    submitSearch(type, page = 1) {
      this.form.sortType = this.sorts.name
      this.form.sortAsc = this.sorts.type
      const params = Object.assign({}, this.form)
      params.warehouseCode = this.warehouseCode.map(res => {
        return res.join()
      })
      if (this.activeDropdown) {
        params.firstGrabTimeArray = (this.time && this.time) || ['', '']
        params.payTimeArray = ['', '']
      } else {
        params.firstGrabTimeArray = ['', '']
        params.payTimeArray = (this.time && this.time) || ['', '']
      }
      params[this.rangeType] = [this.actualFreightCostArray1 || '', this.actualFreightCostArray2 || '']
      if (type && (this.orderType !== 'returnGoods' && this.orderType !== 'delivery')) {
        this.getCount()
      }
      params.storeName = Array.isArray(params.storeName) ? params.storeName.join(',') : params.storeName
      this.params = params
      this.search(page, params)
    },
    handleCommand(val) {
      this.activeDropdown = val
    },
    getBaseCountry() {
      baseCountry().then(res => {
        this.countryList = res.data
      })
    },
    reset(form) {
      this.$refs[form].resetFields()
      this.warehouseCode = []
      this.time = ''
      this.actualFreightCostArray1 = ''
      this.actualFreightCostArray2 = ''
      this.$refs.allSort.sorts = { name: '', type: '' }
      this.submitSearch(1)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio{
  margin-right: 5px !important;
}
</style>
