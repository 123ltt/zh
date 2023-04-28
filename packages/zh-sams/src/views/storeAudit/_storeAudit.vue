<template>
  <basic-container>
    <!-- 店铺审核管理 -->
    <g-table ref="table" :headers="columns" row-key="id" :fetch="fetch" @selection-change="checkedHandler">
      <template slot="header">
        <el-form ref="formObjRef" class="no-message" :model="formObj" size="mini" label-width="70px" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="5">
              <el-form-item
                label="平台"
                prop="platformId"
              >
                <el-select
                  v-model="formObj.platformId"
                  clearable
                  filterable
                  size="mini"
                  class="w150"
                  placeholder="请选择"
                  @change="changePlatformId"
                >
                  <el-option
                    v-for="(item,index) in findForm.platformOption"
                    :key="index"
                    :label="item.displayName"
                    :value="item.hiddenValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="店铺"
                prop="siteId"
              >
                <el-row>
                  <el-col :span="12">
                    <!-- :disabled="showSiteId" -->
                    <el-select
                      v-model="formObj.siteId"
                      clearable
                      size="mini"
                      style="width:80px"
                      placeholder="站点"
                      @change="changeSiteId"
                    >
                      <el-option
                        v-for="(item,index) in findForm.siteOption"
                        :key="index"
                        :label="item.displayName"
                        :value="item.hiddenValue"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <div style="margin-left:10px">
                      <el-select
                        v-model="formObj.id"
                        clearable
                        filterable
                        size="mini"
                        style="width:80px"
                        placeholder="店铺"
                      >
                        <el-option
                          v-for="(item,index) in findForm.storeCodeOption"
                          :key="index"
                          :label="item.displayName"
                          :value="item.hiddenValue"
                        />
                      </el-select>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="申请人" prop="proposer">
                <el-input v-model="formObj.proposer" placeholder="请输入" size="mini" class="w150" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker v-model="formObj.createTime" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width:150px" />
              </el-form-item>
            </el-col>
            <el-button
              type="primary"
              size="mini"
              native-type="submit"
            >搜 索</el-button>
            <el-button
              size="mini"
              @click="handlerReact('formObjRef')"
            >清 空</el-button>
          </el-row>
        </el-form>
        <div class="d-flex head">
          <div>
            <el-tabs v-model="auditTabActiveName" @tab-click="handleTabClick">
              <el-tab-pane v-for="(item, index) in tabActiveList" :key="index" :label="`${item.label}(${item.count})`" :name="item.id" />
            </el-tabs>
          </div>
          <div class="d-flex-right">
            <g-auth code="store_examine_add">
              <el-button size="mini" type="primary" @click="handlerEdit">添加申请</el-button>
            </g-auth>
            <template v-if="auditTabActiveName === '1'">
              <g-auth code="store_examine_export">
                <el-button size="mini" type="primary" :disabled="!checkedIds.length" @click="handlerExport">导出</el-button>
              </g-auth>
              <g-auth code="store_examine_all_import">
                <el-button size="mini" type="primary" @click="handlerAllImport">批量导入</el-button>
              </g-auth>
              <g-auth code="store_examine_all_bring_trial">
                <el-button size="mini" type="primary" :disabled="!checkedIds.length" @click="handlerAllImproved">批量提审</el-button>
              </g-auth>
            </template>
            <template v-if="auditTabActiveName === '2'">
              <g-auth code="store_examine_all_first_trial">
                <el-button size="mini" type="primary" :disabled="!checkedIds.length" @click="handlerALLFirstTrial">批量初审</el-button>
              </g-auth>
              <g-auth code="store_examine_all_reject">
                <el-button size="mini" type="primary" :disabled="!checkedIds.length" @click="handlerALLReject(false)">批量驳回</el-button>
              </g-auth>
              <g-auth code="store_examine_all_import">
                <el-button size="mini" type="primary" @click="handlerAllImport">批量导入</el-button>
              </g-auth>
            </template>
            <template v-if="auditTabActiveName === '3'">
              <g-auth code="store_examine_finance_add">
                <el-button size="mini" type="primary" :disabled="!checkedIds.length" @click="handlerALLFinanceInfo">批量填写财务信息</el-button>
              </g-auth>
              <g-auth code="store_examine_all_review">
                <el-button size="mini" type="primary" :disabled="!checkedIds.length" @click="handlerALLReview(true)">批量复审</el-button>
              </g-auth>
              <g-auth code="store_examine_all_reject">
                <el-button size="mini" type="primary" :disabled="!checkedIds.length" @click="handlerALLReject(false)">批量驳回</el-button>
              </g-auth>
            </template>
            <template v-if="auditTabActiveName === '5'">
              <g-auth code="store_examine_export">
                <el-button size="mini" type="primary" :disabled="!checkedIds.length" @click="handlerExportUnimproved">导出</el-button>
              </g-auth>
              <g-auth code="store_examine_all_bring_trial">
                <el-button size="mini" type="primary" :disabled="!checkedIds.length" @click="handlerAllBringTrial(true)">批量提审</el-button>
              </g-auth>
            </template>
          </div>
        </div>
      </template>
      <el-table-column slot="handler" label="操作" :width="auditTabActiveName ==='1'|| auditTabActiveName==='4'?'150':'210'">
        <template v-slot="{row}">
          <template v-if="auditTabActiveName === '1'">
            <g-auth code="store_examine_edit">
              <el-button type="text" @click="handlerEdit(row, 1)">编辑</el-button>
            </g-auth>
            <g-auth code="store_examine_details">
              <el-button type="text" @click="handlerDetails(row, 1)">详情</el-button>
            </g-auth>
            <g-auth code="store_examine_bring_trial">
              <el-button type="text" @click="handlerUmipTrial(row, true)">提审</el-button>
            </g-auth>
          </template>
          <template v-if="auditTabActiveName === '2'">
            <g-auth code="store_examine_first_trial">
              <el-button type="text" @click="handlerTrial(row, true)">初审</el-button>
            </g-auth>
            <g-auth code="store_examine_edit">
              <el-button type="text" @click="handlerEdit(row, 1)">编辑</el-button>
            </g-auth>
            <g-auth code="store_examine_details">
              <el-button type="text" @click="handlerDetails(row, 1)">详情</el-button>
            </g-auth>
            <g-auth code="store_examine_reject">
              <el-button type="text" @click="handlerReject(row, false)">驳回</el-button>
            </g-auth>
          </template>
          <template v-if="auditTabActiveName === '3'">
            <g-auth code="store_examine_finance_edit">
              <el-button type="text" @click="handlerFinanceInfo(row)">财务信息</el-button>
            </g-auth>
            <g-auth code="store_examine_details">
              <el-button type="text" @click="handlerDetails(row, 1)">详情</el-button>
            </g-auth>
            <g-auth code="store_examine_reject">
              <el-button type="text" @click="handlerReject(row, false)">驳回</el-button>
            </g-auth>
            <g-auth code="store_examine_review">
              <el-button type="text" @click="handlerTrial(row, true)">复审</el-button>
            </g-auth>
          </template>
          <template v-if="auditTabActiveName === '4'">
            <g-auth code="store_examine_finance_details">
              <el-button type="text" @click="handlerFinanceInfoDetails(row)">财务信息</el-button>
            </g-auth>
            <g-auth code="store_examine_details">
              <el-button type="text" @click="handlerDetails(row, 1)">详情</el-button>
            </g-auth>
          </template>
          <template v-if="auditTabActiveName === '5'">
            <g-auth code="store_examine_edit">
              <el-button type="text" @click="handlerEdit(row,1)">编辑</el-button>
            </g-auth>
            <g-auth code="store_examine_details">
              <el-button type="text" @click="handlerDetails(row, 1)">详情</el-button>
            </g-auth>
            <g-auth code="store_examine_bring_trial">
              <el-button type="text" @click="getBringTrial(row, true)">提审</el-button>
            </g-auth>
          </template>
        </template>
      </el-table-column>
    </g-table>
    <!-- 批量导入 -->
  </basic-container>

</template>

<script>
import { platformCode, storePlatformCode } from '@/api/site'
import { platformOption } from '@/api/platform'
import { storeAPProvePage, nopassExport, rejectStatus, reviewStatus, arrroveBring, allBringBatch, allRecheckBatch, allFirstBatch, unimproved, statisticsStatus, exportUnimproved, allImprovedBatch } from '@/api/storeAudit'
import { dowloadExc } from '@/util/util'
import Apply from './components/apply.vue'
import ApplyDetails from './components/applyDetails.vue'
import FinanceInfo from './components/financeInfo.vue'
import FinanceInfoDetails from './components/financeInfoDetails.vue'
import RejectDialog from './components/rejectDialog'
import StoreImport from './components/storeImport.vue'
import ImproveBatch from './components/improveBatch.vue'
import { LIMIT } from '@/config/form'
import { mapGetters } from 'vuex'

export default {
  name: 'SamsStoreAuditStoreAudit',
  data() {
    return {
      LIMIT,
      rejectObj: {
        rejectReason: ''
      },
      acceptType: "['.xls', '.xlsx']",
      rejectId: '', // 店铺id
      isPassType: '', // 驳回状态
      isALLReject: false, // 是否批量驳回
      auditTabActiveName: '2',
      tabActiveList: [],
      auditTabActiveList: [
        { label: '资料待完善', id: '1' },
        { label: '待初审', id: '2' },
        { label: '待复审', id: '3' },
        { label: '审核通过', id: '4' },
        { label: '已驳回', id: '5' }
      ],
      importFormObj: {},
      formObj: {
        platformId: '',
        siteId: '',
        id: '',
        proposer: null,
        createTime: ''
      },
      dialogType: null, // 0添加 1编辑
      checkedIds: [],
      columns: [
        {
          type: 'selection'
        }, {
          label: '平台',
          prop: 'platformCode',
          'show-overflow-tooltip': true // 溢出点点
        }, {
          label: '站点',
          prop: 'siteCode',
          width: 100,
          'show-overflow-tooltip': true // 溢出点点
        }, {
          label: '店铺名',
          prop: 'name',
          'show-overflow-tooltip': true // 溢出点点
        }, {
          label: '销售',
          prop: 'mainSellerName',
          'show-overflow-tooltip': true // 溢出点点
        }, {
          label: '客服',
          prop: 'customerServiceName',
          'show-overflow-tooltip': true // 溢出点点
        }, {
          label: '申购/注册日期',
          prop: 'bidDate',
          width: 100
        }, {
          label: '申请人',
          prop: 'proposer',
          'show-overflow-tooltip': true // 溢出点点
        }, {
          label: '创建时间',
          prop: 'createTime',
          width: 130
        }, {
          slot: true,
          slotName: 'handler'
        }],
      // 平台下来列表
      findForm: {
        platformOption: [],
        siteOption: [],
        storeCodeOption: []
      },
      platformCode: '', // 平台code
      rules: {
        platformId: [{ required: true, message: '所属平台不能为空', trigger: 'change' }],
        code: [{ required: true, message: '站点不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '站点网址不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  mounted() {
    this.$refs.table.load(1, this.formObj)
    this.getPlatformOption()
  },
  methods: {
    fetch({ current, size }, params) {
      // status 1-资料待完善 2-待初审 3-待复审 4-审批通过 5-已驳回
      const auditTabActiveName = this.auditTabActiveName
      if (params.createTime) {
        params.createTime = `${params.createTime} 00:00:00`
      }
      this.statisticsStatus()
      return storeAPProvePage({ ...params, status: +auditTabActiveName, site: params.site, current, size }).then(res => {
        const data = res.data
        data.records.forEach(acc => {
          if (acc.bidDate && acc.bidDate.indexOf('00:00:00') > -1) {
            acc.bidDate = acc.bidDate.split('00:00:00')[0]
          }
        })
        return {
          records: data.records,
          total: data.total,
          size: data.size // 每页最大记录数
        }
      })
    },
    // 资料待完善-批量提审
    handlerAllImproved() {
      this.$confirm('确认提交？', '提交审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        allImprovedBatch({ ids: this.checkedIds, isPass: true }).then(res => {
          const reocrds = res.data.reocrds
          this.$modal({
            title: '批量提审结果',
            component: ImproveBatch,
            data: {
              reocrds: reocrds
            }
          })
          this.checkedIds = []
          this.search()
        })
      })
    },
    // 资料待完善 - 提审
    handlerUmipTrial(row, type) {
      this.$confirm('确认提交？', '提交审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        unimproved({ id: row.id, isPass: type }).then(res => {
          this.$message.success(res.msg)
          this.search()
        })
      })
    },
    // 店铺申请列表统计(状态)
    statisticsStatus() {
      statisticsStatus({ ...this.formObj }).then(res => {
        const data = res.data
        data.forEach(item => {
          this.auditTabActiveList.forEach(acc => {
            if (item.approveStatus === Number(acc.id)) {
              item.label = acc.label
              item.id = acc.id
            }
          })
        })
        this.tabActiveList = res.data
      })
    },

    // 批量初审
    handlerALLFirstTrial(type) {
      this.$confirm('确认提交审核？', '提交初审', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        allFirstBatch({ ids: this.checkedIds, isPass: true }).then(res => {
          this.$message.success(res.msg)
          this.checkedIds = []
          this.search()
        })
      })
    },
    // 批量驳回
    handlerALLReject(isPassType) {
      this.$modal({
        title: '批量驳回',
        component: RejectDialog,
        width: '500px',
        data: {
          checkedIds: this.checkedIds,
          isALLReject: true,
          auditTabActiveName: this.auditTabActiveName
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },

    // 批量添加财务信息
    handlerALLFinanceInfo() {
      this.$modal({
        title: '批量填写财务信息',
        component: FinanceInfo,
        width: '70%',
        data: {
          ids: this.checkedIds, // 批量
          isAllFinanceInfo: true // 是否批量添加财务信息
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },

    // 批量复审
    handlerALLReview(type) {
      this.$confirm('是否通过审核？', '批量复审', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        allRecheckBatch({ ids: this.checkedIds, isPass: type }).then(res => {
          this.$message.success(res.msg)
          this.checkedIds = []
          this.search()
        })
      })
    },
    // 批量提审
    handlerAllBringTrial(type) {
      this.$confirm('确认提交？', '提交审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        allBringBatch({ ids: this.checkedIds, isPass: type }).then(res => {
          this.$message.success(res.msg)
          this.checkedIds = []
          this.search()
        })
      })
    },
    // 提审
    getBringTrial(row, type) {
      this.$confirm('确认提交？', '提交审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        arrroveBring({ id: row.id, isPass: type }).then(res => {
          this.$message.success(res.msg)
          this.search()
        })
      })
    },
    search() {
      this.$refs.table.load(1, this.formObj)
    },
    // tab切换
    handleTabClick(item) {
      this.auditTabActiveName = item.name
      this.search()
    },
    // 初审
    handlerTrial(row, isPassType) {
      const msg = this.auditTabActiveName === '2' ? '确认提交审核？' : '是否通过审核？'
      const title = this.auditTabActiveName === '2' ? '提交初审' : '提交复审'
      this.$confirm(msg, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        if (this.auditTabActiveName === '2') {
          rejectStatus({ id: row.id, isPass: true }).then(res => {
            this.$message.success(res.msg)
            this.search()
          })
        } else if (this.auditTabActiveName === '3') {
          reviewStatus({ id: row.id, isPass: true }).then(res => {
            this.$message.success(res.msg)
            this.search()
          })
        }
      })
    },
    // 驳回
    handlerReject(row, isPassType) {
      this.$modal({
        title: '驳回',
        component: RejectDialog,
        width: '500px',
        data: {
          isALLReject: false,
          auditTabActiveName: this.auditTabActiveName,
          rejectId: row.id
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    // 店铺资料待完善列表-批量导出
    handlerExport() {
      const name = '资料待完善列表.xlsx'
      nopassExport({ ids: this.checkedIds }).then(res => {
        if (res.size) {
          dowloadExc(res, name)
          this.checkedIds = []
        }
      }).catch(() => {
        this.$message.error('请求异常，导出失败！')
      })
    },
    // 店铺驳回列表-批量导出
    handlerExportUnimproved() {
      const name = '已驳回列表.xlsx'
      exportUnimproved({ ids: this.checkedIds }).then(res => {
        if (res.size) {
          dowloadExc(res, name)
          this.checkedIds = []
        }
      }).catch(() => {
        this.$message.error('请求异常，导出失败！')
      })
    },
    // 批量导入
    handlerAllImport() {
      this.$modal({
        title: '批量导入',
        width: '560px',
        component: StoreImport,
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    // 表格多选
    checkedHandler(data) {
      this.checkedIds = data.map(item => item.id)
    },
    // 财务信息
    handlerFinanceInfo(row) {
      this.$newTab({
        path: '/storeAudit/financeInfo',
        title: '编辑财务信息',
        component: FinanceInfo,
        clearCache: true,
        data: {
          compId: row.id,
          menuId: this.$route.meta.id // 接入权限，新开页签，比加这个
        },
        callback: refresh => {
          refresh && this.search()
        }
      })
    },
    // 财务详情
    handlerFinanceInfoDetails(row) {
      this.$newTab({
        path: '/storeAudit/financeInfoDetails',
        title: '查看财务信息',
        component: FinanceInfoDetails,
        clearCache: true,
        data: {
          compId: row.id,
          menuId: this.$route.meta.id
        }
      })
    },
    // 添加申请
    addApply() {
      this.$newTab({
        path: '/storeAudit/apply',
        title: '添加申请',
        component: Apply,
        clearCache: true,
        menuId: this.$route.meta.id,
        callback: refresh => {
          refresh && this.search()
        }
      })
    },
    handlerDetails(row) {
      this.$newTab({
        path: '/storeAudit/applyDetails',
        title: '详情',
        component: ApplyDetails,
        clearCache: true,
        data: {
          compId: row.id,
          menuId: this.$route.meta.id
        }
      })
    },
    // 平台下拉列表
    getPlatformOption() {
      platformOption().then(res => {
        this.findForm.platformOption = res.data
      })
    },
    // 平台切换
    changePlatformId(id) {
      if (id) {
        this.platformCode = this.findForm.platformOption.find(item => item.hiddenValue === id).candidateDisplayName
        this.getStoreOption()
        this.getSiteOption()
      }
      this.formObj.siteId = ''
      this.formObj.id = ''
      this.findForm.siteOption = []
      this.findForm.storeCodeOption = []
    },
    // 站点下拉列表
    getSiteOption() {
      platformCode({ platformCode: this.platformCode }).then(res => {
        this.findForm.siteOption = res.data
      })
    },
    // 站点切换
    changeSiteId() {
      this.getStoreOption()
      this.formObj.id = ''
      this.findForm.storeCodeOption = []
    },
    // 店铺列表
    getStoreOption(id) {
      storePlatformCode({ platformCode: this.platformCode, siteId: this.formObj.siteId }).then(res => {
        this.findForm.storeCodeOption = res.data
      })
    },
    // 编辑
    handlerEdit(row, type) {
      row = row || ''
      type = type || ''
      this.$newTab({
        path: '/storeAudit/apply',
        title: row.id ? '编辑申请信息' : '添加申请',
        component: Apply,
        clearCache: true,
        data: {
          compId: row.id,
          menuId: this.$route.meta.id,
          auditTabActiveName: this.auditTabActiveName
        },
        callback: refresh => {
          refresh && this.search()
        }
      })
    },
    // 重置
    handlerReact(formName) {
      this.$refs[formName].resetFields()
      this.formObj.id = null
      this.findForm.siteOption = []
      this.findForm.storeCodeOption = []
      this.search()
    }
  }

}
</script>

<style scoped>

.w150 {
  width: 150px;
}
.head{
  height: 36px;
  margin-bottom: 20px;
}
.d-flex-right{
  flex: 1;
  text-align: right;
  border-bottom: 2px solid #E4E7ED;
}
</style>
