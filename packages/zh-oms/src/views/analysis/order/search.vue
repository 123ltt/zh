<template>
  <!-- oms 订单分析 - 搜索条件头部 -->
  <el-form ref="formRef" :model="form" size="mini" label-width="82px" class="search-form form-col no-message" @submit.native.prevent="submitSearch">
    <el-row>
      <el-col :span="6">
        <el-form-item label="平台" prop="platformCode">
          <el-select
            v-model="form.platformCode"
            clearable
            filterable
            placeholder="请选择平台"
            style="width:100%;"
            @clear="form.storeName = []"
            @change="form.storeName=[]"
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
        <el-form-item label="店铺" prop="storeName">
          <el-select
            v-model="form.storeName"
            :disabled="!form.platformCode"
            multiple
            collapse-tags
            clearable
            filterable
            style="width:100%;"
            :placeholder="form.platformCode?'请选择店铺':'请先选择销售平台'"
          >
            <el-option
              v-for="item in storeList"
              :key="item.value"
              :value="item.label"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="国家" prop="countryCode">
          <el-select
            v-model="form.countryCode"
            multiple
            collapse-tags
            clearable
            filterable
            style="width:100%;"
            :placeholder="'请选择国家'"
          >
            <el-option
              v-for="item in countryList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item :label="'付款时间：'"
                      prop="payDtType"
                      label-width="100px"
        >
          <el-radio-group v-model="form.payDtType" class="radio-btn" size="small">
            <el-radio-button v-for="item in payTimeList" :key="item.id" :label="+item.id">{{ item.payDtType }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7">
        <el-form-item :label="'订单类型：'"
                      prop="orderType"
                      label-width="100px"
        >
          <el-radio-group v-model="form.orderType" class="radio-btn" size="small">
            <el-radio-button key="all" label="">全部</el-radio-button>
            <el-radio-button v-for="item in orderTypeList" :key="item.id" :disabled="item.orderType==='平台发货'" :label="+item.id">{{ item.orderType }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item :label="'时区时间：'"
                      prop="timeZone"
                      label-width="100px"
        >
          <el-radio-group v-model="form.timeZone" class="radio-btn" size="small">
            <el-radio-button v-for="item in timeDifferenceList" :key="item.id" :disabled="item.timeZone==='原时区时间'" :label="+item.id">{{ item.timeZone }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="" label-width="4px">
          <template>
            <el-button type="primary" native-type="submit">搜索</el-button>
            <el-button plain @click="reset">重置</el-button>
            <el-button disabled plain @click="loadData">数据下载</el-button>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { debounce } from '@/util/util'
import { getCountryList } from '@/api/orderManagement'
import { getStoreByPlatform, getPlatformList } from '@/api/common.js'

export default {
  name: 'Search',
  components: {},
  props: {
    search: Function,
    updateTableHeight: Function
  },
  data() {
    return {
      // 付款时间
      payTimeList: [
        { id: '1', payDtType: '昨天' },
        { id: '2', payDtType: '7天' },
        { id: '3', payDtType: '30天' }
      ],
      // 订单类型
      orderTypeList: [
        { id: '1', orderType: '自发货' },
        { id: '2', orderType: '平台发货' }
      ],
      // 时区时间
      timeDifferenceList: [
        { id: '1', timeZone: '北京时间' },
        { id: '2', timeZone: '原时区时间' }
      ],
      platformList: [], // 平台
      storeList: [], // 店铺
      countryList: [], // 国家
      form: {
        platformCode: '',
        storeName: [],
        countryCode: [],
        payDtType: '',
        orderType: '',
        timeZone: ''
      },
      defaultStatus: 1
    }
  },
  watch: {
    'form.platformCode'(platformCode) {
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
    this.form.payDtType = this.defaultStatus // 默认高亮昨天
    this.form.timeZone = this.defaultStatus // 默认高亮北京时间
    getPlatformList().then(res => {
      this.platformList = res.data.map(item => {
        return {
          label: item.platformName,
          value: item.platformCode
        }
      })
    })
    this.getCountryList() // 获取国家下拉框
  },
  methods: {
    // TODO 数据下载 暂时不做
    loadData() { },
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
      this.search()
    }, 500, true),
    reset() {
      this.$refs.formRef.resetFields()
      this.form.storeName = []
      this.$nextTick(() => {
        this.search()
      })
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
