<template>
  <basic-container style="overflow-y: hidden;">
    <div class="findtrace-container">
      <div ref="search-fold" :class="{fold: isFold}" class="search-fold">
        <div ref="searchSelect" class="search-select">
          <el-form :model="submit" size="mini" label-width="80px">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="平台" prop="platformId">
                  <el-select v-model="submit.platformId" filterable clearable placeholder="请选择" size="mini" style="width:100%;" @change="selectBool(submit.platformId, 'account')" @clear="markClear('platformId')">
                    <el-option v-for="item in findForm.platformName" :key="item.platformNameCn" :label="item.platformNameCn" :value="item.platformId" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="账号" prop="account">
                  <el-select id="account" v-model="submit.account" :disabled="form.accountBool" placeholder="请选择" clearable filterable size="mini" style="width:100%;">
                    <el-option v-for="item in findForm.account" :key="item.storeName" :label="item.storeName" :value="item.storeName" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="物流商" prop="diId">
                  <el-select v-model="submit.diId" clearable placeholder="请选择" filterable size="mini" style="width:100%;" @change="selectBool(submit.diId, 'delivery')" @clear="markClear('delivery')">
                    <el-option v-for="item in logisticsList" :key="item.id" :label="item.lpAbbreviation" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发货方式" prop="dgId">
                  <el-select v-model="submit.dgId" :disabled="form.deliveryBool" placeholder="请选择" clearable filterable size="mini" style="width:100%;">
                    <el-option v-for="item in findForm.delivery" :key="item.id" :label="item.deliveryGroupName" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="国家" prop="countryName">
                  <el-select v-model="submit.countryName" :filter-method="filterCountry" placeholder="请选择" filterable size="mini" style="width:100%;" clearable @clear="clearCountry">
                    <!-- @change="selectBool(submit.diId, 'delivery')" -->
                    <el-option v-for="item in (findForm.country||country)" :key="item.countryId" :label="item.countryName" :value="item.countryName">
                      <span style="float: left">{{ item.countryNameCn }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.countryName }}({{ item.countryNameShort }})
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="渠道类型" prop="channelType">
                  <el-select v-model="submit.channelType" clearable placeholder="请选择" size="mini" style="width:100%;">
                    <el-option
                      v-for="item in channelTypeList"
                      :key="item.dictKey"
                      :value="+item.dictKey"
                      :label="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="时间类型" prop="timeState">
                  <el-select v-model="submit.timeState" clearable placeholder="请选择" size="mini" style="width:100%;" @change="selectBool(form.platformName, 'time')" @clear="markClear('time')">
                    <el-option v-for="item in findForm.timeType" :key="item.key" :label="item.value" :value="item.key" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="时间" prop="timeBool">
                  <el-date-picker v-model="submit.dateTimeList"
                                  :disabled="form.timeBool"
                                  :picker-options="pickerOptions"
                                  :default-time="['00:00:00', '23:59:59']"
                                  type="datetimerange"
                                  range-separator=" 至 "
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  size="mini"
                                  style="width:100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="搜索内容" prop="radio">
                  <div style="display:flex;justify-content:flex-start;align-items:center;">
                    <el-radio v-model="findForm.radio" label="0" size="mini">订单号</el-radio>
                    <el-radio v-model="findForm.radio" label="1" size="mini">追踪码</el-radio>
                    <el-radio v-model="findForm.radio" label="2" size="mini">扩展追踪码</el-radio>
                    <el-input v-model.trim="submit.input" :inline="true" placeholder="双击可输入多条" size="small" style="width:100%;" @dblclick.native="exchangeInput" />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width="0">
                  <el-button type="primary" size="mini" @click="search()">搜 索</el-button>
                  <el-button type="primary" size="mini" @click="reset()">重 置</el-button>
                  <el-button type="primary" size="mini" @click="grab()">手动拉取</el-button>
                  <el-button v-if="permission.find_trajectory_export" type="primary" size="mini" @click="exportExc()">导 出</el-button>
                  <el-button type="primary" size="mini" @click="fnShowMore">
                    更多菜单 <i class="el-icon-d-caret" />
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div ref="searchType" :class="{'search-type': isFoldMenu}" style="transition: height .5s;">
          <div class="tag-group">
            <span class="tag-group__title">轨迹状态：</span>
            <span class="tag-row">
              <el-tag v-for="(item, index) in findForm.trajectoryState"
                      :key="item.name"
                      :class="{
                        mouseoutTag: !item.colorbool,
                        mouseoverTag: item.colorbool,
                        clickBackgroundTag: item.cleakbool,
                        mouseoutTags: item.cleakbool
                      }"
                      :type="item.name"
                      effect="plain"
                      @mouseover.native="mouseoverTagState(index)"
                      @mouseout.native="mouseoutTagState(index)"
                      @click="mouseoverTagStateClick(index)"
              >
                {{ item.name }}
              </el-tag>
            </span>
          </div>
          <div class="tag-group">
            <span class="tag-group__title">延迟类型：</span>
            <span class="tag-row">
              <!-- :type="item" -->
              <el-tag v-for="(item, index) in findForm.trajectoryType"
                      :key="index"
                      :class="{
                        mouseoutTag: !item.colorbool,
                        mouseoverTag: item.colorbool,
                        clickBackgroundTag: item.cleakbool,
                        mouseoutTags: item.cleakbool
                      }"
                      effect="plain"
                      @mouseover.native="mouseoverTagType(index)"
                      @mouseout.native="mouseoutTagType(index)"
                      @click="mouseoverTagTypeClick(index)"
              >
                <span class="tag-btn">{{ item.name }}</span>
              </el-tag>
            </span>
          </div>
        </div>
      </div>
      <div style="height: 20px; background-color: #FAFAFA;text-align: center;cursor: pointer;" @click="fnFold">
        <i :class="isFold?'el-icon-caret-bottom':'el-icon-caret-top'" style="font-size: 20px;line-height: 20px;" />
      </div>
      <div class="tableData">
        <el-table ref="tableRef"
                  v-loading="loading"
                  :data="tableData"
                  :max-height="tableMaxHeight"
                  :row-class-name="tableRowClassName"
                  border
                  style="width: 100%"
                  @cell-click="cellClick"
                  @select="selectRow"
                  @select-all="selectAll"
        >
          <!-- @selection-change="handleSelectionChange" -->
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column prop="diShortname" label="物流商" align="center" width="150" />
          <el-table-column prop="dgName" label="发货方式" align="center" width="150" />
          <el-table-column prop="trackNumber" label="追踪码" align="center" min-width="190">
            <template slot-scope="scope">
              <p style="color:#1A6BE6;cursor: pointer;">
                {{ scope.row.tracknumber }}<br>{{ scope.row.tracknumberEx }}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="trajectoryType" label="轨迹状态" align="center" width="80">
            <template slot-scope="scope">
              <div>
                <p style="color:#44BB5C">{{ scope.row.trajectoryType }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="轨迹状态时间" align="center" width="220">
            <template slot-scope="scope">
              <div style="padding-top: 4px;padding-bottom: 4px;">
                <el-tooltip v-if="scope.row.orderTraceList.length" placement="top">
                  <div slot="content" style="font-size:14px;line-height:16px;">
                    <span v-if="scope.row.outstockTime">
                      出库时间：{{ scope.row.outstockTime }}
                    </span><br>
                    <span v-for="item in scope.row.orderTraceList" :key="item.traceCode" class="traceTime">
                      {{ item.traceDesc }}时间：{{ item.traceTime }}<br>
                    </span>
                  </div>
                  <span>
                    {{ scope.row.orderTraceList[scope.row.orderTraceList.length-1].traceDesc }}时间：{{ scope.row.orderTraceList[scope.row.orderTraceList.length-1].traceTime }}
                  </span>
                </el-tooltip>
                <span v-else-if="scope.row.outstockTime">
                  出库时间：{{ scope.row.outstockTime }}
                </span>
                <span v-else>暂无轨迹状态</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="延迟类型" align="center" width="80">
            <template slot-scope="scope">
              <div style="padding-top: 4px;padding-bottom: 4px;color:red">
                <el-tooltip v-if="scope.row.orderTraceYCList.length>1" placement="top">
                  <div slot="content" style="font-size:14px;line-height:16px;">
                    <p v-for="item in scope.row.orderTraceYCList" :key="item.id" class="traceTime">
                      {{ item }}
                    </p>
                  </div>
                  <p>
                    {{ scope.row.orderTraceYCList[scope.row.orderTraceYCList.length-1] }}
                  </p>
                </el-tooltip>
                <p v-else class="traceTime">
                  {{ scope.row.orderTraceYCList[0] }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="签收时效" align="center" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.signDay>0">{{ scope.row.signDay }}(天)<span /></span></template>
          </el-table-column>
          <el-table-column prop="country" label="国家" align="center" width="150" />
          <el-table-column prop="oId" label="订单号" align="center" width="100" />
          <el-table-column prop="pbdTime" label="包裹扫描时间" align="center" width="160" />
          <el-table-column prop="outstockTime" label="出库时间" align="center" width="160" />
          <el-table-column prop="paidTime" label="付款时间" align="center" width="160" />
          <el-table-column prop="platformNameShort" label="平台" align="center" width="150" />
          <el-table-column prop="account" label="账号" align="center" width="150" />
          <el-table-column :formatter="channelTypeFormatter" prop="channelType" label="渠道类型" align="center" width="150" />
        </el-table>
      </div>
      <div class="block">
        <el-pagination ref="pageRef" :current-page="Page.current" :page-sizes="[10, 40, 50, 80, 500]" :page-size="Page.size" :total="Page.total" layout="slot,sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          <span style="fontWeight:normal;">共 {{ Page.realPageCount }} 条</span>
        </el-pagination>
      </div>
      <!-- 输入多条追踪码搜索框 -->
      <el-dialog :visible.sync="form.bool" :append-to-body="true" title="请输入追踪码(最多输入5000条)" width="40%" top="40px">
        <el-divider />
        <div class="scrollDiv">
          <el-input v-model="submit.input" :autosize="{ minRows: 2, maxRows: 20}" :autofocus="true" type="textarea" resize="none" placeholder="按下回车键输入多条" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="submit.input=''">清 空</el-button>
          <el-button type="primary" size="mini" @click="fnTrackNum">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 追踪码详情的弹窗 -->
      <el-dialog :title="`详情 - ${tranceDetail.type==='trackingNumber'?'追踪码':'扩展跟踪码'} : ${tranceDetail[tranceDetail.type]}`" :visible.sync="dialogVisible" :append-to-body="true" :before-close="handleClose" width="60%" top="40px">
        <el-divider />
        <div class="scrollDiv">
          <!-- :reverse="reverse" -->
          <el-timeline>
            <el-timeline-item v-for="(item, index) in tranceDetail.content" :key="index" :timestamp="item.text" color="#123">
              {{ item.time }}
            </el-timeline-item>
          </el-timeline>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="dialogVisible = false">返 回</el-button>
          <!-- <el-button type="primary" size="mini" @click="dialogVisible = false">确 定</el-button> -->
        </span>
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import {
  getList,
  // getLogisticsBasicList,
  getTraceTracePlatformList,
  getTraceStoreformList,
  // getTraceCodeList,
  getTrackingNumberList,
  getObtainTraceList,
  getfindListId,
  getTraceDetail,
  getExportExc,
  getTraceCodeList
} from '@/api/trace/findTrajectory'
import { mapState, mapGetters } from 'vuex'
import { getMaxTableHei, dowloadExc, debounce } from '@/util/util'
import { getDictionary } from '@/api/system/dictbiz'
import { dateFormat } from '@/util/date'
export default {
  name: 'TraceFindTrajectory',
  data() {
    return {
      // 勾选的所有数据
      checkData: [],
      // 是否显示更多菜单
      isFoldMenu: true,
      // 是否折叠
      isFold: false,
      timePDBool: true,
      // 表格max-height
      tableMaxHeight: 'auto',
      fixMaxHei: {
        max: 'auto',
        min: 'auto',
        fold: 'auto',
        isRepair: false
      },
      // 追踪码对话框
      dialogVisible: false,
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
      tranceDetail: [],
      channelTypeList: [],
      submit: {
        channelType: '', // 渠道类型
        platformId: null, // 平台id
        account: null, // 账号
        diId: null, // 物流商id
        dgId: null, // 发货方式id
        countryName: null, // 国家
        timeState: 'outstockTime', // 时间选择
        dateTimeList: [dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() - 60 * 60 * 1000 * 24 * 30), 'yyyy-MM-dd hh:mm:ss'), dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1), 'yyyy-MM-dd hh:mm:ss')], // 时间范围集合, // 时间范围集合
        startDate: dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() - 60 * 60 * 1000 * 24 * 30), 'yyyy-MM-dd hh:mm:ss'), // 开始时间
        endDate: dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1), 'yyyy-MM-dd hh:mm:ss'), // 结束时间
        input: '', // 搜索值
        trajectoryType: null, // 延迟状态
        traceStatus: 0 // 延迟状态
      },
      type: 0,
      loading: true,
      Page: {
        current: 1,
        total: 1,
        size: 10,
        realPageCount: 0
      }, // 分页时间
      // 提交事件渲染
      form: {
        accountBool: true,
        deliveryBool: true,
        timeBool: false,
        bool: false
      },
      findForm: {
        platformName: [], // 平台名称
        account: ['awe123', 'qwe123', 'wwe123'], // 账户
        logisticsList: [], // 物流商下拉
        delivery: ['手动', '自动'], // 发货方式
        timeType: [
          { key: 'outstockTime', value: '出库时间' },
          { key: 'paidTime', value: '付款时间' }
        ],
        radio: '0',
        trajectoryState: [
          { id: '0', name: '全部', delayCode: 0, colorbool: false, cleakbool: false }
        ], // 轨迹状态
        trajectoryType: [
          { id: '0', name: '全部', delayCode: 0, colorbool: false, cleakbool: false }
        ], // 轨迹类型
        country: ''
      },
      tableData: [],
      searchListInput: [],
      dataJson: {},
      //   存放submit初始值
      oldsubmit: {},
      //   存放form初始值
      oldform: {},
      traceCodeList: []
      // grabList: []
    }
  },
  watch: {
    tableData(newVal, oldVal) {
      if (newVal !== oldVal) {
        newVal.forEach((row, index) => {
          // 切换表格页码时回显勾选状态
          if (this.findCheckDataIndex(row.id) !== -1) {
            this.$nextTick(() => {
              this.$refs.tableRef.toggleRowSelection(row, true)
            })
          }
        })
      }
    },
    isCollapse(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isFoldMenu || (this.fixMaxHei.isRepair = true)
        this.isFold = false
        setTimeout(this.initHeight, 500)
      }
    }
  },
  computed: {
    ...mapState({
      country: state => state.trace.country,
      logisticsList: state => state.trace.logisticsList
      // traceCodeList: state => state.trace.traceCodeList
    }),
    ...mapGetters(['isCollapse', 'permission'])
  },
  created() {
    // 字典- 渠道类型
    getDictionary({ code: 'channel_type' }).then(res => {
      const { code, data } = res
      code === 200 && (this.channelTypeList = data)
    })
    getTraceCodeList().then(res => {
      const { code, data } = res
      if (code === 200) {
        this.traceCodeList = data
        data.forEach((item, index) => {
          this.findForm.trajectoryState.push({
            id: index,
            code: item.traceCode,
            name: item.traceDesc,
            colorbool: false,
            cleakbool: false
          })
          if (item.traceCode !== 106 && item.delayDesc !== '') {
            this.findForm.trajectoryType.push({
              id: index,
              name: item.delayDesc,
              delayCode: item.delayCode,
              colorbool: false,
              cleakbool: false
            })
          }
        })
        this.initialization()
      }
    }).catch(err => {
      this.initialization()
      console.log(err)
    })
  },
  mounted() {
    this.initHeight()
    this.oldsubmit = JSON.parse(JSON.stringify(this.submit))
    this.oldform = JSON.parse(JSON.stringify(this.form))
  },
  methods: {
    channelTypeFormatter(row, column, cellValue) {
      const list = this.channelTypeList
      for (let i = 0; i < list.length; i++) {
        if (list[i].dictKey === cellValue) return list[i].dictValue
      }
      return cellValue
    },
    // 确定多条跟踪码
    fnTrackNum() {
      const arr = this.submit.input.split(/\r|\n|\r\n/)
      const row = arr.length
      if (row > 5000) {
        this.$notify({
          title: '提示：',
          type: 'warning',
          dangerouslyUseHTMLString: true,
          message: '<span style="color: red;">限制5000条数据，超过将会被截取掉</span>'
        })
        arr.length = 5000
        this.submit.input = arr.join('\n')
        return
      }
      this.form.bool = false
    },
    // 初始化表格和搜索项高度
    initHeight() {
      // 114  42 34 20
      this.$nextTick(() => {
        this.fixMaxHei.max = getMaxTableHei(this, [], 220)
        this.fixMaxHei.fold = this.$refs.searchSelect.clientHeight + this.$refs.searchType.clientHeight
        this.$refs['search-fold'].style.height = this.fixMaxHei.fold + 'px'
        const tableMaxHeight = getMaxTableHei(this, [], this.fixMaxHei.fold + 220)
        this.fixMaxHei.min = tableMaxHeight
        this.tableMaxHeight = tableMaxHeight
      })
    },
    fnShowMore() {
      // 轨迹状态和延迟类型的高为76
      // isFoldMenu --true: 收
      this.isFoldMenu = !this.isFoldMenu
      // 更多菜单  收
      if (this.isFoldMenu) {
        this.$refs.searchType.style.height = '0'
        if (this.fixMaxHei.isRepair) {
          this.fixMaxHei.fold -= 76
          this.fixMaxHei.min += 76
          this.fixMaxHei.isRepair = false
        }
        this.tableMaxHeight = this.fixMaxHei.min
        this.$refs['search-fold'].style.height = this.fixMaxHei.fold + 'px'
      } else {
        this.$refs.searchType.style.height = '76px'
        this.$refs['search-fold'].style.height = this.fixMaxHei.fold + 76 + 'px'
        this.tableMaxHeight = this.fixMaxHei.min - 76
      }
    },
    fnFold() {
      // isFold --true: 收
      this.isFold = !this.isFold
      this.$nextTick(() => {
        // 全收
        if (this.isFold) {
          this.$refs['search-fold'].style.height = 0
          this.tableMaxHeight = this.fixMaxHei.max
        } else {
          if (this.fixMaxHei.isRepair) {
            this.fixMaxHei.fold -= 76
            this.fixMaxHei.min += 76
            this.fixMaxHei.isRepair = false
          }
          // isFoldMenu --true: 收
          this.$refs['search-fold'].style.height = this.isFoldMenu ? this.fixMaxHei.fold + 'px' : this.fixMaxHei.fold + 76 + 'px'
          this.tableMaxHeight = this.isFoldMenu ? this.fixMaxHei.min : this.fixMaxHei.min - 76
        }
      })
    },
    // ...mapActions(['getCountry', 'getLogisticsList']),
    // 表格单元格点击函数
    cellClick(row, column, cell, event) {
      if (column.property === 'trackNumber') {
        const number = row.tracknumber
        getTraceDetail(number).then(res => {
          const { code, msg, data } = res
          if (code === 200 && msg !== '暂无承载数据') {
            this.dialogVisible = true
            const contentArr = []
            data.content.replace(/[\r\n]/g, '').split('^^').forEach(item => {
              var tmp = item.split('&&')
              contentArr.push({
                time: tmp[0],
                text: tmp[1]
              })
            })
            data.type = data.type === 1 ? 'trackingNumber' : 'trackingNumberEx'
            data.content = contentArr

            this.tranceDetail = data
          } else {
            const h = this.$createElement
            this.$message({
              message: h('p', null, [h('span', null, '您所查询的无数据，追踪号：'),
                h('i', { style: 'color: teal' }, row.tracknumber)])
            })
          }
        })
      }
    },
    // 弹窗关闭钱调用
    handleClose(done) {
      this.tranceDetail = []
      done()
    },
    clearCountry() {
      this.findForm.country = this.country
    },
    // 国家搜素
    filterCountry(val) {
      this.submit.countryName = val
      const reg = /[a-z]/g
      const newVal = val.replace(reg, (m) => m.toUpperCase())
      // console.log('%cfilter: ', 'color:blue;font-size:16px;', this.submit.countryName, val, newVal)
      this.findForm.country = this.country.filter(item => {
        const countryName = item.countryName.replace(reg, (m) => m.toUpperCase())
        const countryNameShort = item.countryNameShort.replace(reg, (m) => m.toUpperCase())
        const bool = item.countryNameCn.indexOf(val) !== -1 || countryName.indexOf(newVal) !== -1 || countryNameShort.indexOf(newVal) !== -1
        return bool
      })
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    markClear(val) {
      if (val === 'platformId') {
        this.form.accountBool = true
        this.submit.account = ''
      } else if (val === 'delivery') {
        this.form.deliveryBool = true
        this.submit.dgId = ''
      } else {
        this.form.timeBool = true
        this.submit.dateTimeList = ''
      }
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    selectRow(selection, row) {
      // 勾选则去掉，没有则勾选上
      const index = this.findCheckDataIndex(row.id)
      if (index === -1) {
        this.checkData.push({
          id: row.id,
          tracknumber: row.tracknumber,
          outstockTime: row.outstockTime
        })
      } else {
        this.checkData.splice(index, 1)
      }
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    selectAll(selection) {
      if (!selection.length) {
        this.tableData.forEach((item) => {
          // 去掉已有的勾选
          const index = this.findCheckDataIndex(item.id)
          index !== -1 && this.checkData.splice(index, 1)
        })
        return
      }
      selection.forEach((item, index) => {
        // 勾选数据的id、追踪码、出库时间
        if (this.findCheckDataIndex(item.id) === -1) {
          this.checkData.push({
            id: item.id,
            tracknumber: item.tracknumber,
            outstockTime: item.outstockTime
          })
        }
      })
    },
    // 查找勾选数据中是否有某个id，返回index
    findCheckDataIndex(id) {
      const { checkData } = this
      for (let i = 0; i < checkData.length; i++) {
        if (checkData[i].id === id) return i
      }
      return -1
    },
    // 手动抓取 当前页的勾选
    // handleSelectionChange(selection) {
    //   this.grabList = selection
    // },
    // 手动抓取 tracknumber
    grab() {
      const { checkData } = this
      // const { grabList } = this
      if (!checkData.length) {
        this.$message.error('您未选择订单')
        return
      } else if (checkData.length > 1000) {
        this.$message.error(`订单数不能超过1000条，当前拉取订单数（${checkData.length}）`)
        return
      }
      // if (!grabList.length) {
      //   this.$message.error('您未选择订单')
      //   return
      // }
      const ids = []

      let min = checkData[0].outstockTime
      // let min = grabList[0].outstockTime
      let max = min
      checkData.forEach((item, i) => {
      // grabList.forEach(item => {
        if (i < 1000) {
          ids.push(item.id)
          if (min > item.outstockTime) min = item.outstockTime
          if (max < item.outstockTime) max = item.outstockTime
        }
      })
      const datas = min + ',' + max
      getObtainTraceList(ids.toString(), datas).then(res => {
        if (res.code === 200) {
          this.$message({ message: '订单拉取中', type: 'success' })
        } else {
          this.$message.error('拉取订单信息失败!')
        }
      })
    },
    // 分页
    handleSizeChange(val) {
      this.Page.size = val
      this.getSearchList(val)
    },
    handleCurrentChange(val) {
      this.Page.current = val
      this.getSearchList(val)
    },
    // 轨迹状态的动态效果属性
    // 悬浮效果
    mouseoverTagType(index) {
      this.findForm.trajectoryType.forEach(item => {
        item.colorbool = false
      })
      if (!this.findForm.trajectoryType[index].cleakbool) {
        this.findForm.trajectoryType[index].colorbool = true
      }
    },
    mouseoutTagType(index) {
      this.findForm.trajectoryType[index].colorbool = false
    },
    mouseoverTagState(index) {
      this.findForm.trajectoryState.forEach(item => {
        item.colorbool = false
      })
      if (!this.findForm.trajectoryState[index].cleakbool) {
        this.findForm.trajectoryState[index].colorbool = true
      }
    },
    mouseoutTagState(index) {
      this.findForm.trajectoryState[index].colorbool = false
    },
    // 点击事件
    mouseoverTagStateClick(indexs) {
      this.findForm.trajectoryState.forEach((item, index) => {
        this.findForm.trajectoryState[index].cleakbool = false
      })
      if (indexs > 0) {
        this.submit.trajectoryType = this.findForm.trajectoryState[indexs].code
      } else if (indexs <= 0) {
        this.submit.trajectoryType = null
      }
      this.findForm.trajectoryState[indexs].cleakbool = true
      this.Page.current = 1
      this.getSearchList()
    },
    mouseoverTagTypeClick(indexs) {
      // 清空勾选表格的数据
      this.checkData = []
      this.findForm.trajectoryType.forEach((item, index) => {
        this.findForm.trajectoryType[index].cleakbool = false
      })
      if (indexs > 0) {
        this.submit.traceStatus = this.findForm.trajectoryType[indexs].delayCode
      } else if (indexs <= 0) {
        this.submit.traceStatus = 0
      }
      this.findForm.trajectoryType[indexs].cleakbool = true
      this.Page.current = 1
      this.getSearchList()
    },
    // 简化代码
    simplifyReset(arr) {
      arr.forEach(item => {
        item.cleakbool = false
      })
      arr[0].cleakbool = true
    },
    // 重置form数据
    reset: debounce(function() {
      // 清空勾选表格的数据
      this.checkData = []
      this.submit = JSON.parse(JSON.stringify(this.oldsubmit))
      this.form = JSON.parse(JSON.stringify(this.oldform))
      this.Page.current = 1
      this.findForm.radio = '0'
      // eslint-disable-next-line no-sequences
      this.searchListInput = []
      this.dataJson = this.odd()
      this.simplifyReset(this.findForm.trajectoryState)
      this.simplifyReset(this.findForm.trajectoryType)
      this.loading = true
      this.dogetList(this.dataJson, 1)
    }, 1000, true),
    // 导出到exc
    exportExc: debounce(function() {
      if (!this.tableData.length) {
        this.$message.warning('数据为空，无法导出！')
        return
      }
      const searchList = []
      this.checkData.forEach(item => {
        searchList.push(item.tracknumber)
      })
      const dataJson = {
        ...this.submit,
        country: this.submit.countryName,
        searchState: this.findForm.radio,
        searchList
      }
      if (searchList.length) {
        dataJson.searchState = '1'
      } else {
        dataJson.searchList = this.submit.input ? this.submit.input.split(/\n/) : searchList
      }
      delete dataJson.countryName
      // this.$message.success('正在导出，请稍等片刻...')
      const loading = this.$loading({
        lock: true,
        text: '正在拼了老命的请求中。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      getExportExc(dataJson).then(res => {
        if (res.size) {
          dowloadExc(res, '轨迹查询结果.xls')
        } else this.$message.warning('数据为空，无法导出')
      }).catch(() => {
        this.$message.error('请求异常，导出失败！')
      }).finally(() => { loading.close() })
    }, 1000, true),
    // 选择事件
    selectBool(key, val) {
      if (val === 'account') {
        this.form.accountBool = false
        this.submit.account = ''
        getTraceStoreformList(key).then(res => {
          if (res.code === 200) {
            this.findForm.account = res.data
          } else {
            this.$message.error('物流商加载失败!')
          }
        })
      } else if (val === 'delivery') {
        this.form.deliveryBool = false
        this.submit.dgId = ''
        this.logisticsList.forEach(item => {
          if (item.id === key) {
            this.findForm.delivery = item.groups
          }
        })
      } else {
        this.form.timeBool = false
        // this.submit.dateTimeList = ''
      }
    },
    // 搜索
    search: debounce(function() {
      if (this.submit.timeState.length === 0 && this.timePDBool) {
        this.$confirm('您未选择时间数据查询时间会较长，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.timePDBool = false
          this.Page.current = 1
          this.getSearchList()
        })
      } else {
        if (this.form.timeBool === false &&
          (this.submit.dateTimeList == null || this.submit.dateTimeList === '')) {
          if (this.submit.timeState === 'outstockTime') {
            this.$alert('请选择出库时间！', '提示', {
              confirmButtonText: '确定'
            })
            return
          } else {
            this.$alert('请选择付款时间！', '提示', {
              confirmButtonText: '确定'
            })
            return
          }
        } else if (this.form.timeBool === false && (this.submit.dateTimeList != null || this.submit.dateTimeList !== '')) {
          this.submit.startDate = this.submit.dateTimeList[0]
          this.submit.endDate = this.submit.dateTimeList[1]
          this.Page.current = 1
          this.getSearchList()
        } else {
          this.Page.current = 1
          this.getSearchList()
        }
      }
      // 清空勾选表格的数据
      this.checkData = []
    }, 1000, true),
    bool(val) {
      if (val == null || val === '') {
        return true
      }
      return false
    },
    // 封装数据源请求
    dogetList(data, type) {
      getList(data, type).then(res => {
        if (res.code === 200) {
          res.data.list.forEach(item => {
            if (item.tracknumber === item.tracknumberEx) {
              item.tracknumberEx = ''
            }
            this.findForm.trajectoryState.forEach(items => {
              if (items.code === item.trajectoryType) {
                item.trajectoryType = items.name
              }
            })
            this.findForm.platformName.forEach(items => {
              if (item.platformId === items.platformId) {
                item.platformNameShort = items.platformNameCn
              }
            })
            item.orderTraceList = []
            item.orderTraceYCList = []
            this.findForm.trajectoryType.forEach((items) => {
              if (items.delayCode > 0 && ((item.delayType & items.delayCode) === items.delayCode)) {
                item.orderTraceYCList.push(items.name)
              }
            })
          })
          const totalPage = res.data.pageVO.totalPages
          const pageSize = res.data.pageVO.pageSize
          const MAX_COUNT = 10000
          this.Page.current = res.data.pageVO.current
          this.Page.total = totalPage > MAX_COUNT ? MAX_COUNT : totalPage
          this.Page.size = pageSize
          this.Page.realPageCount = totalPage
          this.tableData = res.data.list
          this.TrackingNumber()
        } else {
          this.$message.error('订单详情加载失败!')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 搜索数据
    odd() {
      // eslint-disable-next-line no-unused-vars
      const { countryName, dateTimeList, input, ...other } = this.submit
      return {
        query: {
          current: this.Page.current,
          size: this.Page.size,
          ascs: null,
          descs: ''
        },
        findOrderVO: {
          country: this.submit.countryName,
          searchState: this.findForm.radio,
          searchList: this.searchListInput,
          ...other
        }
      }
    },
    // 搜索接口
    getSearchList(val) {
      this.searchListInput = []
      let type = 1
      let isYes = true
      if (
        !this.form.bool &&
        this.submit.input !== '' &&
        this.submit.input != null
      ) {
        this.searchListInput = this.submit.input.split('\n')
      } else if (this.submit.input != null && this.submit.input !== '') {
        this.searchListInput.push(this.submit.input)
      }
      // eslint-disable-next-line no-unused-vars
      const { traceStatus, startDate, endDate, dateTimeList, input, ...other } = this.submit
      Object.keys(other).forEach(item => {
        if (!this.bool(other[item])) {
          isYes = false
        }
      })
      if (
        isYes &&
        this.searchListInput.length === 0 &&
        (this.submit.traceStatus === 0)
      ) {
        type = 0
      }
      if (val === undefined) {
        //   点击搜索事件
        this.dataJson = this.odd()
        this.loading = true
        this.dogetList(this.dataJson, type)
      } else {
        // 点击分页
        this.dataJson.query.size = this.Page.size
        this.dataJson.query.current = this.Page.current
        this.loading = true
        this.dogetList(this.dataJson, type)
      }
    },
    TrackingNumber() {
      var list = []
      var date = []
      this.tableData.forEach(item => {
        if (item.tracknumber != null && item.tracknumber !== '') {
          list.push(item.tracknumber)
          date.push(item.outstockTime)
        }
      })
      getTrackingNumberList(list, 1, date.toString()).then(res => {
        const { code, msg, data } = res
        if (code === 200 && msg !== '"暂无承载数据') {
          data.forEach(items => {
            this.tableData.forEach((item, index) => {
              if (item.tracknumber === items.trackingNumber) {
                this.findForm.trajectoryState.forEach((iten) => {
                  if (items.traceCode === iten.code) {
                    items.traceDesc = iten.name
                  }
                })
                this.tableData[index].orderTraceList.push(items)
              }
            })
          })
        } else {
          this.$message.error('轨迹信息加载失败!')
        }
      })
      const ids = []
      let a = ''
      this.tableData.forEach(item => {
        if (item.logisticsGroupId !== a || ids.length === 0) {
          ids.push(item.logisticsGroupId)
          a = item.logisticsGroupId
        }
      })
      getfindListId(ids.toString()).then(res => {
        if (res.code === 200) {
          res.data.forEach(item => {
            this.tableData.forEach(items => {
              if (item.id === items.logisticsGroupId) {
                items.dgName = item.deliveryGroupName
                items.channelType = item.channelType
              }
            })
          })
        } else {
          this.$message.error('订单详情发货方式加载失败!')
        }
      })
    },
    formatDate(value) {
      const date = new Date(value)
      const y = date.getFullYear()
      const MM = date.getMonth() + 1
      const d = date.getDate()
      const h = date.getHours()
      const m = date.getMinutes()
      const s = date.getSeconds()
      return y + '年' + MM + '月' + d + '日 ' + h + ':' + m + ':' + s
    },
    // 初始化
    initialization() {
      // 初始化显示全部
      this.findForm.trajectoryState[0].cleakbool = true
      this.findForm.trajectoryType[0].cleakbool = true
      // getLogisticsBasicList().then(res => {
      //   if (res.code === 200) {
      //     this.findForm.logisticsList = res.data
      //   } else {
      //     this.$message.error('物流商加载失败!')
      //   }
      // })
      this.getSearchList()
      getTraceTracePlatformList().then(res => {
        if (res.code === 200) {
          this.findForm.platformName = res.data
          // this.getSearchList()
        } else {
          this.$message.error('平台加载失败!')
        }
      })
      // getTraceCodeList().then(res => {
      //   if (res.code === 200) {
      //     res.data.forEach((item, index) => {
      //       this.findForm.trajectoryState.push({
      //         id: index,
      //         code: item.traceCode,
      //         name: item.traceDesc,
      //         colorbool: false,
      //         cleakbool: false
      //       })
      //     })
      //     res.data.forEach((item, index) => {
      //       if (item.traceCode != 106) {
      //         this.findForm.trajectoryType.push({
      //           id: index,
      //           name: item.delayDesc,
      //           delayCode: item.delayCode,
      //           colorbool: false,
      //           cleakbool: false
      //         })
      //       }
      //     })
      //   } else {
      //     this.$message.error('轨迹状态加载失败!')
      //   }
      // })
    },
    // 双击事件
    exchangeInput() {
      this.form.bool = true
    }
  }
}
</script>
<style lang="scss" scoped>
.findtrace-container {
  overflow: hidden;
  font-size: 14px;
  .search-fold {
    overflow: hidden;
    // height: 230px;
    transition: height 0.5s;
    -webkit-transition: height 0.5s;
    .search-type {
      height: 0;
      overflow: hidden;
    }
    .search-select ::v-deep .el-row .el-col {
      // margin-bottom: 6px;
      height: 28px;
      .el-form-item__label {
        text-align-last: justify;
        padding-right: 8px;
      }
    }
    &.fold {
      height: 0;
    }
  }
}
::v-deep .el-radio .el-radio__label {
  padding-left: 4px;
}
::v-deep .el-radio:not(:last-child) {
  margin-right: 8px;
}
// 跟踪码详情样式
::v-deep .el-dialog__body {
  padding: 0;
  li {
    padding-bottom: 10px;
    .el-timeline-item__timestamp.is-bottom {
      margin-top: 4px;
    }
  }
  .title {
    font-size: 16px;
    margin-left: 20px;
  }
  .scrollDiv {
    max-height: 70vh;
    overflow: auto;
    .el-textarea__inner {
      border: none;
    }
  }
}
#search {
  margin: 2px 0 2px 0;
}
// #search h{ margin: 0 0 0 5px;}
#search span {
  margin: 20px 0 0 0;
}
.tag-group {
  width: 1131px;
  height: 38px;
}
.tag-group .tag-group__title {
  margin: 0 5px 10px 0;
}
.tag-group .el-tag {
  width: 68px;
  height: 31px;
  padding: 0;
  margin: 0px 4px 0px 4px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
}
.mouseoverTag {
  color: #409eff;
}
.mouseoutTags {
  color: #fff;
}
.mouseoutTag {
  color: #000000;
}
.rowButton .el-button {
  margin: 2px 0px 5px 0px;
}
.block {
  text-align: right;
  margin: 10px 10px 0 0;
}
.clickBackgroundTag {
  background: #409eff;
  color: #fff;
}
.tableData ::v-deep .el-table__header-wrapper .has-gutter tr th {
  /* background: #F2F6FC; */
  background: #fafafa;
  font-size: 14px;
  // color: #000000ba;
}
.tableData ::v-deep .el-table .success-row {
  /* background: #EBEEF5; */
  background: #fafafa;
}
.tableData ::v-deep .el-table {
  th .el-checkbox:last-of-type {
    margin-right: 0;
  }
  .el-table__row {
    td {
      padding: 0;
      cursor: default;
      .el-checkbox:last-of-type {
        margin-right: 0;
      }
    }
    td:first-child .cell,
    th:first-child .cell {
      padding-left: 14px;
    }
  }
}
.traceTime {
  margin: 0;
}
// 滚动条的宽度
//   ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
//   width: 15px; // 横向滚动条
//   height: 15px; // 纵向滚动条 必写
//   }
// 滚动条的滑块
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}
</style>
