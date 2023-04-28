<template>
  <!-- 物流单管理列表页 -->
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form ref="form" :model="searchData" label-width="90px" size="mini" class="no-message form-col">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item prop="channelCode" label="渠道名称：">
                <g-select v-model.trim="searchData.channelCode"
                          :items="channelNameList"
                          key-field="channelCode"
                          :item-title="true"
                          :label-field="getLabel"
                          value-field="channelCode"
                          placeholder="请选择"
                          class="w-100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="2" class="mt-2">
              <el-dropdown class="d-flex justify-content-end align-items-center" @command="handleCommand">
                <span class="el-dropdown-link text-primary">
                  {{ value }}<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in searchContentList" :key="item.dictKey" :command="[item.dictKey,item.dictValue]">{{ item.dictValue }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="4">
              <el-input v-model.trim="searchData.searchValue" prop="searchValue" size="mini" clearable />
            </el-col>
            <el-col :span="6">
              <el-form-item label="租户：" prop="tenantId">
                <el-select v-model="searchData.tenantId" clearable placeholder="请选择" filterable class="w-85">
                  <el-option v-for="item in getTenantList" :key="item.tenantId" :label="`${item.tenantId}(${item.tenantName})`" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平台：" prop="platformCode">
                <g-select v-model="searchData.platformCode"
                          :items="platformList"
                          key-field="platformCode"
                          label-field="platformName"
                          value-field="platformCode"
                          placeholder="请选择"
                          :item-title="true"
                          style="width:100%"
                />
              </el-form-item>

            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="创建时间：" prop="createTime">
                <el-date-picker v-model="searchData.createTime"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                class="w-100"
                                :default-time="['00:00:00', '23:59:59']"
                                clearable
                                @change="timeChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="状态：" prop="type">
                <el-radio-group v-model="searchData.type" @change="changeFunc">
                  <el-radio-button v-for="item in statusList" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="d-flex justify-content-end align-items-end pb-2">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="initialization">搜索</el-button>
              <el-button class="ms-3" icon="el-icon-delete" size="mini" @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 详情 -->
      <el-table-column slot="code" label="物流单" align="center" min-width="100px">
        <template #default="{row}">
          <g-link color="primary" @click="detailBtn(row)">{{ row.code }}</g-link>
        </template>
      </el-table-column>

      <!-- 跟踪号 -->
      <el-table-column slot="trackingNumber" label="跟踪号" align="center" min-width="120px">
        <template v-slot="{row}">
          <g-list-group label-width="60px">
            <g-list-group-item label="跟踪号">
              <g-text-ellipsis>{{ row.trackingNumber }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="扩展跟踪号">
              <g-text-ellipsis>{{ row.trackingNumberEx }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 时间 -->
      <el-table-column slot="time" label="时间" align="center" min-width="120px">
        <template v-slot="{row}">
          <g-list-group label-width="60px">
            <g-list-group-item label="创建时间">
              <g-text-ellipsis>{{ row.createTime }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="完成时间">
              <g-text-ellipsis>{{ row.finishTime }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import { getList } from '@/api/forecast/logisticsSheet'
import { logisticsChannel, getLogisticsProvider, dictionary, getTenant } from '@/api/common'
import { dateFormat } from '@/util/date'
import logisticsListDetail from './lgListModal/detail.vue'
import { getplatformAllList } from '@/api/platformLimits'
export default {
  name: 'TmsForecastLgList',
  data() {
    return {
      current: 1,
      searchData: {
        createTime: [],
        searchValue: '',
        type: '',
        tenantId: '',
        platformCode: ''
      },
      value: '',
      platformList: [],
      echoStatusObj: {},
      searchContentList: [],
      statusList: [],
      channelNameList: [],
      logisticsProviderList: [],
      getTenantList: [],
      headers: [
        {
          slot: true,
          slotName: 'code'
        },
        {
          label: '平台单号',
          prop: 'platformNumber',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '包裹号',
          prop: 'referenceNumber',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '状态',
          prop: 'status',
          width: '90px',
          align: 'center'
        },
        {
          label: '物流商名称',
          prop: 'providerName',
          minWidth: '90px',
          align: 'center'
        },

        {
          label: '渠道名称',
          prop: 'channelName',
          minWidth: '90px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'trackingNumber'
        },
        {
          slot: true,
          slotName: 'time'
        }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  created() {
    const time = this.getTime()
    this.searchData.createTime.push(...time)
    this.timeChange(time)
  },
  methods: {
    getData() {
      Promise.all([
        dictionary('forecast_order_search'),
        dictionary('forecast_order_search_type'),
        logisticsChannel(),
        getLogisticsProvider(),
        getplatformAllList(),
        getTenant()
      ]).then(res => {
        this.statusList = res[0].data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
        this.searchContentList = res[1].data
        this.handleCommand([this.searchContentList[0].dictKey, this.searchContentList[0].dictValue])
        this.statusList.forEach(item => {
          this.echoStatusObj[item.dictKey] = item.dictValue
        })

        this.channelNameList = res[2].data
        this.logisticsProviderList = res[3].data
        this.platformList = res[4].data
        this.getTenantList = res[5].data
        this.initialization(true)
      })
    },
    handleCommand(val) {
      this.value = val[1]
      this.searchData.searchType = val[0]
    },
    getTime() {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },
    changeFunc() {
      this.initialization(true)
    },
    initialization(originalRefresh) {
      const searchData = { ...this.searchData }
      delete searchData.createTime
      const current = originalRefresh ? 1 : this.current
      this.$refs.table.load(current, searchData)
    },

    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        this.current = res.data.current
        const records = res.data.records
        records.forEach(item => {
          // 转换一下渠道代码
          this.channelNameList.forEach(e => {
            if (e.channelCode === item.channelCode) item.channelName = e.name
          })
          // 转换一下状态
          if (item.status === 30) {
            item.status = this.echoStatusObj[10]
          } else if (item.status === 40) {
            item.status = this.echoStatusObj[20]
          } else {
            item.status = this.echoStatusObj[item.status]
          }

          // 转换物流商名称
          this.logisticsProviderList.forEach(e => {
            if (e.supplierNumber === item.providerCode) item.providerName = e.lpAbbreviation// 后续检查
          })
        })
        return {
          records,
          total: res.data.total,
          size: res.data.pageSize
        }
      })
    },
    timeChange(val) {
      this.searchData.startDate = val ? dateFormat(new Date(val[0]), 'yyyy-MM-dd hh:mm:ss') : null
      this.searchData.endDate = val ? dateFormat(new Date(val[1]), 'yyyy-MM-dd hh:mm:ss') : null
    },
    reset() {
      this.searchData = {
        createTime: [],
        searchValue: '',
        type: '',
        tenantId: '',
        platformCode: ''
      }
      this.value = this.searchContentList[0].dictValue
      this.searchData.searchType = this.searchContentList[0].dictKey
      // Object.keys(this.searchData).forEach(key => {
      //   this.searchData[key] = ''
      // })
      const time = this.getTime()

      this.searchData.createTime.push(...time)
      this.timeChange(time)

      // 删除 code 默认值，假数据code不唯一
      this.searchData.channelCode = ' '
      delete this.searchData.channelCode

      this.initialization(true)
    },
    detailBtn(row) {
      this.$newTab({
        path: '/orderManagement/info/detail',
        title: '物流单详情',
        component: logisticsListDetail,
        clearCache: true,
        data: {
          detailInfo: row, // 行内信息
          channelTypeList: this.channelTypeList // 渠道类型
        },
        callback: (bool) => {
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
 .el-radio-group{
  width:100%;
  display:flex;
  .el-radio-button.el-radio-button--mini{
   flex:1;
    ::v-deep .el-radio-button__inner{
      padding:0!important;
      width:100%;
      height:28px;
      line-height:28px;
    }
  }
}
</style>
