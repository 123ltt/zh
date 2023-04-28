<template>
  <!-- 订单优选列表页 -->
  <basic-container>
    <g-table
      ref="table"
      row-key="id"
      :headers="headers"
      :fetch="fetch"
      @selection-change="handleSelectionChange"
    >
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form
          ref="form"
          :model="searchData"
          label-width="100px"
          size="mini"
          class="no-message form-col"
        >
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="租户ID" prop="tenantId">
                <el-select
                  v-model="searchData.tenantId"
                  clearable
                  placeholder="请选择"
                  filterable
                  class="w-100"
                >
                  <el-option
                    v-for="item in getTenantList"
                    :key="item.tenantId"
                    :label="`${item.tenantId}(${item.tenantName})`"
                    :value="item.tenantId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="平台" prop="platformCode">
                <g-select
                  v-model="searchData.platformCode"
                  :items="platformList"
                  key-field="platformCode"
                  label-field="platformName"
                  value-field="platformCode"
                  placeholder="请选择"
                  :item-title="true"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="调用方" prop="requestType">
                <el-select
                  v-model="searchData.requestType"
                  clearable
                  placeholder="请选择"
                  filterable
                  class="w-100"
                >
                  <el-option
                    v-for="item in requestTypeList"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="2" class="mt-2">
              <el-dropdown
                class="
                                    d-flex
                                    justify-content-end
                                    align-items-center
                                "
                @command="handleCommand"
              >
                <span class="el-dropdown-link text-primary">
                  {{ value
                  }}<i
                    class="
                                            el-icon-arrow-down
                                            el-icon--right
                                        "
                  />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in searchKeyList"
                    :key="item.dictKey"
                    :command="[
                      item.dictKey,
                      item.dictValue,
                    ]"
                  >{{ item.dictValue }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="5">
              <el-input
                v-model.trim="searchData.ruleValue"
                prop="searchValue"
                size="mini"
                clearable
              />
            </el-col>
            <el-col :span="7">
              <el-form-item label="接收时间" prop="createTime">
                <el-date-picker
                  v-model="searchData.createTime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="w-100"
                  :default-time="['00:00:00', '23:59:59']"
                  clearable
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="状态" prop="channelState">
                <el-radio-group
                  v-model="searchData.channelState"
                  @change="changeFunc"
                >
                  <el-radio-button
                    v-for="item in statusList"
                    :key="item.dictKey"
                    :label="item.dictKey"
                  >{{ item.dictValue }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col
              :span="3"
              class="
                                d-flex
                                justify-content-end
                                align-items-end
                                pb-2
                            "
            >
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="init"
              >搜索</el-button>
              <el-button
                class="ms-3"
                icon="el-icon-delete"
                size="mini"
                @click="reset"
              >重置</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-button type="primary"
                       size="mini"
                       @click="askAll"
            >优选通知
            </el-button>
          </el-row>
        </el-form>
      </template>

      <!-- 请求 -->
      <el-table-column
        slot="request"
        label="请求"
        align="center"
        width="100px"
      >
        <template #default="{ row }">
          <g-link
            color="primary"
            @click="request(row.request, '请求')"
          >查看请求</g-link>
        </template>
      </el-table-column>
      <!-- 响应 -->
      <el-table-column
        slot="response"
        label="响应"
        align="center"
        width="100px"
      >
        <template #default="{ row }">
          <g-link
            color="primary"
            @click="request(row.response, '响应')"
          >查看响应</g-link>
        </template>
      </el-table-column>

      <!-- 单号 -->
      <el-table-column
        slot="order"
        label="单号"
        align="center"
        min-width="120px"
      >
        <template v-slot="{ row }">
          <g-list-group label-width="63px">
            <g-list-group-item label="OMS订单号">
              <g-link color="primary" @click="detailBtn(row)">
                <g-text-ellipsis>{{
                  row.referenceNumber
                }}</g-text-ellipsis>
              </g-link>
            </g-list-group-item>
            <g-list-group-item label="包裹单号">
              <g-text-ellipsis>{{
                row.parcelNumber
              }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <!-- 时间 -->
      <el-table-column
        slot="time"
        label="时间"
        align="center"
        width="200px"
      >
        <template v-slot="{ row }">
          <g-list-group label-width="50px">
            <g-list-group-item label="创建时间">
              <g-text-ellipsis>{{
                row.createTime
              }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="完成时间">
              <g-text-ellipsis>{{
                row.finishTime
              }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>

      <el-table-column
        slot="operate"
        label="操作"
        align="center"
        width="100px"
      >
        <template v-slot="scope">
          <el-row>
            <el-button type="text"
                       @click="ask(scope.row)"
            >优选通知</el-button>
          </el-row>
          <el-row>
            <el-button type="text"
                       @click="retry(scope.row)"
            >重新优选</el-button>
          </el-row>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import { getList, channelOptimize, noticeOptimize } from '@/api/orderOpt'
import { dictionary, getTenant, getplatformAllList } from '@/api/common'
import orderOptDetail from './orderOptModal/detail'
import showJson from './orderOptModal/showJson'
import { getDictVal } from '../until'

export default {
  name: 'TmsOptimizeOrderOpt',
  data() {
    return {
      searchKeyList: [], // 搜索字段
      requestTypeList: [],
      platformList: [],
      statusList: [],
      current: 1,
      searchData: {
        createTime: [],
        channelState: ''
      },
      value: '',
      selectRow: [],
      getTenantList: [],
      headers: [
        { type: 'selection', width: 55, align: 'center' },
        {
          label: '租户ID',
          prop: 'tenantId',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '调用方',
          prop: 'requestType',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '平台',
          prop: 'platformName',
          width: '90px',
          align: 'center'
        },
        { slot: true, slotName: 'order' },
        { slot: true, slotName: 'request' },
        { slot: true, slotName: 'response' },
        {
          label: '状态',
          prop: 'channelState',
          width: '90px',
          align: 'center'
        },
        { slot: true, slotName: 'time' },
        { slot: true, slotName: 'operate' }
      ]
    }
  },
  created() {
    this.getTime()
  },
  mounted() {
    this.getData()
  },

  methods: {
    askAll() {
      if (!this.selectRow.length) return this.$message.error('请选择要批量优选通知的数据!')
      this.ask()
    },
    getData() {
      Promise.all([
        dictionary('referenceNumber'),
        dictionary('RequestType'),
        dictionary('channelState'),
        getplatformAllList(),
        getTenant()
      ]).then((res) => {
        this.searchKeyList = res[0].data
        this.handleCommand([
          this.searchKeyList[0].dictKey,
          this.searchKeyList[0].dictValue
        ])

        this.requestTypeList = res[1].data

        this.statusList = res[2].data
        res[2].data.unshift({ dictKey: '', dictValue: '全部' })

        this.platformList = res[3].data

        this.getTenantList = res[4].data

        this.init()
      })
    },

    handleCommand(val) {
      this.value = val[1]
      this.searchData.ruleKey = val[0]
    },

    getTime() {
      const date = new Date()
      const y = date.getFullYear()
      const m =
                (date.getMonth() + 1).length > 1
                  ? date.getMonth() + 1
                  : '0' + (date.getMonth() + 1)
      const lM =
                date.getMonth().length > 1
                  ? date.getMonth()
                  : '0' + date.getMonth()
      const d = date.getDate()
      this.searchData.createTime[0] =
                y + '-' + lM + '-' + d + ' 00:00:00'
      this.searchData.createTime[1] = y + '-' + m + '-' + d + ' 23:59:59'
    },

    changeFunc() {
      this.current = 1
      this.init()
    },

    init() {
      const params = JSON.parse(
        JSON.stringify(this.searchData, [
          'tenantId',
          'platformCode',
          'channelState',
          'requestType',
          'ruleKey',
          'ruleValue'
        ])
      )

      const operateTime = this.searchData.createTime
      if (operateTime) {
        params.startDate = operateTime[0]
        params.endDate = operateTime[1]
      } else {
        params.startDate = params.endDate = ''
      }

      this.$refs.table.load(this.current, params)
    },

    fetch({ current, size }, params) {
      return getList({ current, size, ...params }).then((res) => {
        this.current = res.data.current

        res.data.list.map((e) => {
          // 初始化调用方
          e.requestType = getDictVal(
            this.requestTypeList,
            e.requestType
          )
          // 初始化状态
          e.channelState = getDictVal(
            this.statusList,
            e.channelState
          )
          // 初始化平台
          e.platformName = this.platformList.find(
            (item) => item.platformCode === e.platformCode
          )?.platformName
          return e
        })

        return {
          records: res.data.list,
          total: res.data.pagesVO.totalPages,
          size: res.data.pagesVO.pageSize
        }
      })
    },

    reset() {
      this.searchData = {
        createTime: [],
        channelState: ''
      }
      this.value = this.searchKeyList[0].dictValue
      this.searchData.ruleKey = this.searchKeyList[0].dictKey
      this.getTime()

      this.current = 1
      this.init()
    },

    handleSelectionChange(val) {
      this.selectRow = val
    },

    detailBtn(row) {
      this.$newTab({
        path: '',
        title: '订单优选详情',
        component: orderOptDetail,
        clearCache: true,
        data: {
          detailInfo: row,
          requestTypeList: this.requestTypeList
        },
        callback: (bool) => {}
      })
    },
    ask(row) {
      const params = row
        ? [
          {
            packageCode: row.parcelNumber,
            omOrderId: row.referenceNumber
          }
        ]
        : this.selectRow.map(item => ({
          packageCode: item.parcelNumber,
          omOrderId: item.referenceNumber
        }))

      noticeOptimize(
        params
      ).then(res => {
        this.$message.success(res.msg)
      })
    },
    retry(row) {
      channelOptimize(JSON.parse(row.request))
        .then((res) => {
          this.$message.success(res.msg)
        })
        .catch((res) => {})
    },
    request(val, label) {
      this.$modal({
        title: `${label}数据展示`,
        component: showJson,
        width: '500px',
        data: { jsonData: JSON.parse(val) },
        callback: (bool) => {}
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-radio-group {
    width: 100%;
    display: flex;
    .el-radio-button.el-radio-button--mini {
        flex: 1;
        ::v-deep .el-radio-button__inner {
            padding: 0 !important;
            width: 100%;
            height: 28px;
            line-height: 28px;
        }
    }
}
</style>
