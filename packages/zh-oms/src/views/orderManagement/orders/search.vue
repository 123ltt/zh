<template>
  <!-- oms 订单管理 - 搜索条件头部 -->
  <el-form ref="formRef" :model="form" size="mini" label-width="82px" class="search-form form-col no-message" @submit.native.prevent="submitSearch">
    <el-row>
      <el-col :span="24">
        <el-form-item :label="isAll?'订单状态':'异常类型'"
                      prop="exceptionType"
                      label-width="70px"
        >
          <el-radio-group v-model="form.exceptionType" class="radio-btn">
            <el-radio-button key="all" label="">全部</el-radio-button>
            <el-radio-button v-for="item in orderStatusCountList" :key="item.typeCode" :label="+item.typeCode">{{ `${item.typeDescribe} (${item.typeCount})` }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6" class="d-flex align-items-center">
        <DropdownLabel v-model="form.timeType" width="66px" :list="timeTypeList" />
        <el-form-item label="" label-width="4px" prop="firstGrabTime">
          <el-date-picker
            v-model="form.firstGrabTime"
            style="width:100%;"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="销售平台" prop="platformCode">
          <el-select
            v-model="form.platformCode"
            clearable
            filterable
            placeholder="请选择销售平台"
            style="width:100%;"
          >
            <el-option
              v-for="item in platformList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="销售店铺" prop="storeName">
          <el-select
            v-if="accountType"
            v-model="form.storeName"
            :disabled="!form.platformCode"
            multiple
            collapse-tags
            clearable
            filterable
            style="width:100%;"
            :placeholder="form.platformCode?'请选择销售店铺':'请先选择销售平台'"
          >
            <el-option
              v-for="item in storeList"
              :key="item.value"
              :value="item.label"
              :label="item.label"
            />
          </el-select>
          <g-multiple-input
            v-else
            v-model="form.storeName"
            :reg-exp="/\n+/"
            placeholder="多个按回车键隔开"
          />
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="" label-width="4px">
          <el-button type="text" @click="changeAccountType">切换</el-button>
          <el-button type="text" @click="toggleAdvanced">
            {{ isAdvancedSearch?'取消高级':'高级' }}
            <i :class="isAdvancedSearch?'el-icon-arrow-up':'el-icon-arrow-down'" />
          </el-button>
          <template v-if="!isAdvancedSearch">
            <el-button type="primary" native-type="submit">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </template>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 高级搜索 -->
    <div v-show="isAdvancedSearch">
      <el-row>
        <el-col v-for="(item, i) in advancedRadios" :key="item.prop" :span="6">
          <el-form-item :label="item.label" :label-width="i===0?'70px':'82px'" :prop="item.prop">
            <el-select v-model="form[item.prop]"
                       :filterable="item.prop==='receiveCountryCode'"
                       :clearable="item.prop==='receiveCountryCode'"
                       class="w-100"
                       :placeholder="`请选择${item.label}`"
            >
              <el-option v-for="(list,index) in item.lists()"
                         :key="index"
                         :value="list.value"
                         :label="list.label"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <template v-if="!isAll">
          <el-col :span="6">
            <el-form-item label="" label-width="0px" prop="mainCustomerServiceId">
              <DropdownLabel v-model="roleType" label-class="pe-3 text-end" width="100px" :list="roleList">
                <v-organization ref="organizationRef" v-model="form.mainCustomerServiceId" style="width:100%;" input-placeholder="请选择客服" />
              </DropdownLabel>
            </el-form-item>
          </el-col>

          <el-col v-for="item in advancedSearch2" :key="item.prop" :span="6">
            <el-form-item :label="item.label" label-width="82px" :prop="item.prop">
              <el-input v-if="item.type==='text'" v-model="form[item.prop]" type="text" :placeholder="`请输入${item.label}`" />
              <el-input v-else-if="item.type==='textarea'" v-model="form[item.prop]" :autosize="{ minRows: 1, maxRows: 3}" type="textarea" :placeholder="`请输入${item.label}`" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="实收金额" prop="amount">
              <el-row type="flex" justify="space-between">
                <el-col :span="11"><el-input v-model="form.amount.min" v-input.positive type="text" class="w-100" @blur="amountHandler" /></el-col>
                <el-col :span="2" style="text-align:center;">-</el-col>
                <el-col :span="11"><el-input v-model="form.amount.max" v-input.positive type="text" class="w-100" @blur="amountHandler" /></el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-row v-if="isAll">
        <el-col :span="6">
          <el-form-item label="" label-width="0px" prop="mainCustomerServiceId">
            <DropdownLabel v-model="roleType" label-class="pe-3 text-end" width="76px" :list="roleList">
              <v-organization ref="organizationRef" v-model="form.mainCustomerServiceId" style="width:100%;" input-placeholder="请选择客服" />
            </DropdownLabel>
          </el-form-item>
        </el-col>

        <el-col v-for="item in advancedSearch2" :key="item.prop" :span="6">
          <el-form-item :label="item.label" label-width="82px" :prop="item.prop">
            <el-input v-if="item.type==='text'" v-model="form[item.prop]" type="text" :placeholder="`请输入${item.label}`" />
            <el-input v-else-if="item.type==='textarea'" v-model="form[item.prop]" :autosize="{ minRows: 1, maxRows: 3}" type="textarea" :placeholder="`请输入${item.label}`" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="实收金额" prop="amount">
            <el-row type="flex" justify="space-between">
              <el-col :span="11"><el-input v-model="form.amount.min" v-input.positive type="text" style="width:100%;" /></el-col>
              <el-col :span="2" style="text-align:center;">-</el-col>
              <el-col :span="11"><el-input v-model="form.amount.max" v-input.positive type="text" style="width:100%;" /></el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="d-flex">
        <el-form-item label="搜索类型" label-width="70px" prop="searchType">
          <el-radio-group v-model="form.searchType">
            <el-radio v-for="item in searchTypeList" :key="item.value" class="search-type mb-1" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" label-width="0" prop="searchContent">
          <g-multiple-input v-model="form.searchContent" style="width:206px;" :reg-exp="/\n+/" return-type="string" placeholder="多个按回车键隔开" />
        </el-form-item>
        <el-form-item label="" label-width="10px" class="text-end">
          <el-button type="primary" native-type="submit">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </div>
    <el-row>
      <el-col :span="12">
        <el-form-item label="排序方式" label-width="70px">
          <SortButtons ref="sortBtnRef" v-model="sorts" :sort-list="sortTypeList" active-color="red" />
        </el-form-item>
      </el-col>
      <el-col v-if="$auth('oms_order_customExp')" :span="12">
        <el-form-item label="" label-width="0" class="text-end">
          <el-button type="primary" @click="exportTemplate">自定义模板导出</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getCountryList, getOrderStatusCount } from '@/api/orderManagement'
import { getStoreByPlatform, getPlatformList } from '@/api/common.js'
import { getDicts } from '@/api/common/dict'
import { debounce, throttle } from '@/util/util'
import { dateFormat } from '@/util/date.js'

import VOrganization from '@/components/organization/index.vue'
import SortButtons from '../../components/sort-buttons/index.vue'
import DropdownLabel from '@/views/components/dropdown-label/index.vue'
import DefineTemplate from '@/views/components/define-template/index.vue'

export default {
  name: 'Search',
  components: { VOrganization, SortButtons, DropdownLabel },
  props: {
    search: Function,
    updateTableHeight: Function,
    isAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timeTypeList: [],
      roleList: [{ label: '客服', value: 'mainCustomerServiceId' }, { label: '销售', value: 'mainSellerId' }],
      orderStatusCountList: [],
      searchTypeList: [],
      sortTypeList: [],
      platformList: [],
      storeList: [],

      countryList: [],
      accountType: true,
      isAdvancedSearch: false,
      orderOriginList: [],
      ifCombinedOrderList: [
        { value: '', label: '全部' },
        { value: true, label: '是' },
        { value: false, label: '否' }
      ],
      advancedRadios: [
        { label: '订单来源', prop: 'orderType', isShow: true, lists: () => this.orderOriginList },
        { label: '收件国家', prop: 'receiveCountryCode', isShow: true, lists: () => this.countryList },
        { label: '是否合并单', prop: 'ifCombinedOrder', isShow: this.isAll, lists: () => this.ifCombinedOrderList }
        // { label: '确认撤单', prop: 'isUndoOrder', isShow: this.isAll, lists: () => this.ifCombinedOrderList }
      ],
      advancedSearch2: [
        // { label: '客服', prop: 'mainCustomerServiceId', type: 'select' },
        // { label: '卖家账号', prop: 'salerAccount', type: 'text' },
        // { label: '买家留言', prop: 'buyerLeavMsg', type: 'textarea' }
      ],
      sorts: {
        name: '',
        type: ''
      },
      roleType: 'mainCustomerServiceId',
      form: {
        sortAsc: '',
        timeType: '1',
        firstGrabTime: ['', ''],
        platformCode: '',
        storeName: [],
        searchType: this.$route.params.searchType || '1',
        searchContent: this.$route.params.searchContent || '',
        orderType: '',
        exceptionType: '',
        exceptionCreateTime: ['', ''],
        amount: { min: '', max: '' },
        receiveCountryCode: '',
        ifCombinedOrder: '',
        // isUndoOrder: '',
        mainCustomerServiceId: '',
        buyerLeavMsg: '',
        salerAccount: '',
        sortType: ''
      },
      dicts: ['order_type', 'order_sort_type', 'order_search_type', 'order_search_time_type'],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      resetting: false,
      paramsJson: ''
    }
  },
  watch: {
    sorts: {
      handler(obj) {
        this.form.sortAsc = obj.type
        this.form.sortType = obj.name
        if (!this.resetting) this.search()
      },
      deep: true
    },
    'form.exceptionType'() {
      if (!this.resetting) this.search()
    },
    'form.platformCode'(platformCode) {
      this.form.storeName = []
      if (platformCode === '') return
      getStoreByPlatform(platformCode).then(res => {
        this.storeList = res.data.map(item => {
          return {
            label: item.displayName,
            value: item.candidateDisplayName
          }
        })
      })
    }
  },
  created() {
    if (!this.$route.params.searchContent) this.setDefaultDate()
    this.getOrderStatusCount()
    const { advancedRadios } = this
    getDicts(this.dicts, 'oms')
      .then(res => {
        this.orderOriginList = [{ label: '全部', value: '' }, ...res.order_type]
        this.sortTypeList = res.order_sort_type.filter(item => {
          if (this.isAll) {
            return item.label !== '按异常停留'
          }
          return true
        })
        this.searchTypeList = res.order_search_type
        this.timeTypeList = res.order_search_time_type
      })
    getPlatformList().then(res => {
      this.platformList = res.data.map(item => {
        return {
          label: item.platformName,
          value: item.platformCode
        }
      })
    })

    this.advancedRadios = advancedRadios.filter(item => item.isShow)

    this.getCountryList()
  },
  methods: {
    setDefaultDate() {
      const curDate = new Date()
      const curDateEndStr = dateFormat(curDate).slice(0, 11) + '23:59:59'
      curDate.setMonth(curDate.getMonth() - 1)
      const lastMonthDateStartStr = dateFormat(curDate).slice(0, 11) + '00:00:00'
      this.form.firstGrabTime = [lastMonthDateStartStr, curDateEndStr]
    },
    exportTemplate() {
      this.$modal({
        title: '自定义导出模板选择：（每个用户最多配置5个自定义模板）',
        component: DefineTemplate,
        data: {
          params: this.paramsJson
        }
      })
    },
    amountHandler() {
      const { min, max } = this.form.amount
      if (max !== '' && +min > +max) {
        this.$message.error('起始金额范围有误')
      }
    },
    toggleAdvanced: throttle(function() {
      this.isAdvancedSearch = !this.isAdvancedSearch
      this.updateTableHeight()
    }, 500),
    getCountryList() {
      getCountryList('').then(res => {
        this.countryList = res.data.map(item => {
          return {
            label: item.countryCn,
            value: item.countryCode
          }
        })
      })
    },
    submitSearch: debounce(function() {
      this.getOrderStatusCount()
      this.search()
    }, 500, true),
    // 获取订单状态
    getOrderStatusCount() {
      const { form: { firstGrabTime, amount, mainCustomerServiceId }, isAll, roleType } = this
      const data = JSON.parse(JSON.stringify(this.form))
      delete data.exceptionType
      data.forExceptionOrders = !isAll
      // data.paymentAmount = [amount.min, amount.max]
      data.sellerIncomeAmount = [amount.min, amount.max]
      delete data.amount

      data.time = firstGrabTime
      delete data.firstGrabTime

      data[roleType] = mainCustomerServiceId ? mainCustomerServiceId.id : ''
      if (roleType === 'mainSellerId') delete data.mainCustomerServiceId
      if (isAll) delete data.exceptionCreateTime
      // else delete data.isUndoOrder
      data.ifCombinedOrder || delete data.ifCombinedOrder

      this.paramsJson = data
      getOrderStatusCount(data, isAll).then(res => {
        this.orderStatusCountList = res.data.filter(item => isAll || item.typeCount !== 0)
        this.updateTableHeight()
        this.resetting = false
      })
    },
    changeAccountType: throttle(function() {
      this.form.storeName = []
      this.accountType = !this.accountType
      this.updateTableHeight()
    }, 500),
    reset() {
      // 重置排序方式
      this.$refs.sortBtnRef.sorts.name = ''
      this.$refs.sortBtnRef.sorts.type = ''

      this.resetting = true
      this.form.amount.min = ''
      this.form.amount.max = ''
      this.$refs.formRef.resetFields()
      this.form.searchContent = ''
      this.form.searchType = '1'
      this.form.storeName = []
      this.$refs.organizationRef.inputText = ''
      if (this.form.exceptionType === '') { // 重置后
        this.$nextTick(() => {
          this.getOrderStatusCount()
          this.search()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form ::v-deep {
  .time-type{
    width: 96px;
    &>.el-input input{
      text-align:center;
    }
  }
  .el-col .el-form-item{
    // margin-bottom: 0;
    .el-form-item__label{
      font-size: 12px;
    }
  }
  .radio-btn label span{
    border-radius: 0;
    border: none;
  }
  .search-type{
    margin-right: 15px;
    .el-radio__label{
      padding-left: 5px;
    }
  }
}
</style>
