<template>
  <basic-container>
    <g-table ref="table"
             draggable
             immediate
             show-summary
             :headers.sync="headers"
             max-height="550"
             :fetch="fetch"
             row-key="id"
             :fixed-height="false"
             :summary-method="getSummaries"
             :custom-column="{cols:5,itemWidth:'120px'}"
             @select="select"
             @select-all="select"
    >
      <el-table-column slot="indexSlot">
        <g-table-column-header slot="header" label="序号" prop="seqNo" />
        <template v-slot="{row}">
          <g-link class="text-primary" @click="openCustomDetail('isView', row.id)">
            <g-text-ellipsis>{{ row.seqNo }}</g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <el-table-column slot="updateTimeSlot" width="100px">
        <g-table-column-header slot="header" label="修改时间" prop="updateTime" />
        <template v-slot="{row}">
          <g-text-ellipsis> {{ row.updateTime }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="exportDateSlot" width="100px">
        <g-table-column-header slot="header" label="出口日期" prop="exportDate" />
        <template v-slot="{row}">
          <g-text-ellipsis> {{ row.exportDate }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="declareCustomsNoSlot" width="110px">
        <g-table-column-header slot="header" label="报关号" prop="declareCustomsNo" />
        <template v-slot="{row}">
          <g-text-ellipsis> {{ row.declareCustomsNo }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="contractIdSlot" width="110px">
        <g-table-column-header slot="header" label="合同协议号" prop="contractAgreementNo" />
        <template v-slot="{row}">
          <!-- <el-button type="text" @click="del(row.id)">{{ row.contractAgreementNo }}</el-button> -->
          <g-text-ellipsis> {{ row.contractAgreementNo }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="purchaseIdSlot">
        <g-table-column-header slot="header" label="采购编码" prop="purchaseCode" />
        <template v-slot="{row}">
          <!-- <g-link class="text-primary" @click="openPurchaseDetail('1397839693031989250', row.name)"><g-text-ellipsis>CG2105270001</g-text-ellipsis></g-link> -->
          <g-link class="text-primary" @click="openPurchaseDetail(row.id, row.name)"><g-text-ellipsis>{{ row.purchaseCode }}</g-text-ellipsis></g-link>
        </template>
      </el-table-column>
      <el-table-column slot="skuSlot">
        <g-table-column-header slot="header" label="SKU编码" prop="productSku" />
        <template v-slot="{row}">
          <!-- <g-link class="text-primary" @click="openSpuSkuDetail('RB5BT481GS7', row.name)"><g-text-ellipsis>RB5BT481GS7</g-text-ellipsis></g-link> -->
          <g-link class="text-primary" @click="openSpuSkuDetail(row.productSku, row.name)"><g-text-ellipsis>{{ row.productSku }}</g-text-ellipsis></g-link>
        </template>
      </el-table-column>
      <el-table-column slot="demandOrderSlot" width="110px">
        <g-table-column-header slot="header" label="需求单号" prop="demandOrder" />
        <template v-slot="{row}">
          <g-text-ellipsis> {{ row.demandOrder }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <!-- <el-table-column slot="demandIdSlot" label="需求单号">
        <template v-slot="{row}">
          <el-button type="text" @click="del(row.id)">{{ row.count }}</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="deliverOrderSlot" label="出库单号">
        <template v-slot="{row}">
          <el-button type="text" @click="del(row.id)">{{ row.count }}</el-button>
        </template>
      </el-table-column> -->
      <template slot="header">
        <el-form ref="form" :inline="true" :model="form" size="mini">
          <el-row>
            <el-col :span="6">
              <el-form-item label="采购编码" prop="purchaseCode" class="ms-4">
                <el-input v-model="form.purchaseCode" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="SKU编码" prop="productSku" class="ps-3">
                <el-input v-model="form.productSku" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同协议号" prop="contractAgreementNo">
                <el-input v-model="form.contractAgreementNo" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="需求单号" prop="demandOrder" class="ms-3 ps-4">
                <el-input v-model="form.demandOrder" type="text" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="6">
              <el-form-item label="出库单号" prop="outputWarehouseOrder" class="ps-4">
                <el-input v-model="form.outputWarehouseOrder" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报关号" prop="declareCustomsNo" class="ps-4">
                <el-input v-model="form.declareCustomsNo" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" prop="status" class="ps-1 ms-3" style="padding-left: 23px !important">
                <el-select v-model="form.status" collapse-tags filterable style="width:177px;">
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出口日期" prop="exportDate" class="ps-4" style="padding-left: 30px !important">
                <el-date-picker
                  v-model="form.exportDate"
                  style="width:177px;"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item class="ps-4">
                <el-button size="mini" @click="openCustomDetail('batchModify',checkedId,sameStatus)">批量修改</el-button>
                <el-button size="mini" @click="splitRow">拆分行</el-button>
                <el-button size="mini" @click="batchApproval">批量审核</el-button>
                <el-button size="mini" @click="openCustomDetail('batchPreReport',checkedId,sameStatus)">批量预报</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item class="ps-4" style="padding-left:21px !important;">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
            <!-- <el-button size="mini" @click="hanlerCustomExport">自定义导出</el-button>
              <el-button size="mini" @click="search">导入修改</el-button> -->
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="handSlot" label="操作" width="120px">
        <template v-slot="{row}">
          <div>
            <el-button v-if="row.status===1" type="text" class="pd-r0" @click="openCustomDetail('preReport',row.id,row.status)">预报</el-button>
            <el-button v-if="[0,1].includes(row.status)" type="text" class="pd-r0 " @click="openCustomDetail('modify',row.id,row.status)">修改</el-button>
            <el-button v-if="[2,3,4,5].includes(row.status)" type="text" class="pd-r0" @click="openCustomDetail('isView',row.id,row.status)">详情</el-button>
            <el-button v-if="row.status===0" type="text" class="pd-r0" @click="del(row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column slot="customDeclareSlot" label="报关单">
        <template v-slot="{row}">
          <div>
            <el-button type="text" class="pd-r0" style="padding-right:-4px;" @click="del(row.id)">下载</el-button>
          </div>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { declareList, rowDelete, requestBatchApproval, getStatus } from '@/api/customDeclare.js'
import { openSpuSkuDetail, openPurchaseDetail } from '@/views/components/utils.js'
import CustomDetail from '@/views/customInfo/components/customDetail.vue'
import DefineTemplate from '@/views/components/define-template/index.vue'
import SplitRow from './components/splitRow.vue'
import { headers } from '@/views/components/customInfoListHeader.js'
// import { deepClone } from '@/util/util'
export default {
  name: 'TrsCustomInfoList',
  data() {
    return {
      openSpuSkuDetail,
      openPurchaseDetail,
      form: {
        purchaseCode: null,
        declareCustomsNo: null,
        contractAgreementNo: null,
        demandOrder: null,
        exportDate: null,
        outputWarehouseOrder: null,
        productSku: null,
        status: null
      },
      headers: headers,
      paramsJson: '',
      checkedId: [], // 选中的id
      checkedCount: null, // 选中的数量
      checkedStatus: [], // 选中的状态
      currentCount: null,
      checkedList: [],
      checkedFreight: [], // 选中的货代公司
      checkedTransport: [], // 选中的运输方式
      checkedPurposeCountry: [], // 选中的目的国
      sameStatus: '', // 选中的相同的状态名
      statusList: [],
      isStatusEqual: false, // 状态是否相同
      requestFlag: false
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getStatusList()
    })
  },
  mounted() {
    this.getData()
  },
  methods: {
    getStatusList() { // 获取状态下拉框数据
      getStatus({ }).then(res => {
        const { code, data } = res
        if (code === 200) {
          this.statusList = data
        }
      })
    },
    splitRow() { // 拆分行
      if (this.checkedId.length !== 1) {
        this.$message.error('只能选择一条数据，请重新选择！')
      } else if (![0, 1].includes(this.sameStatus)) {
        this.$message.error('“待预报”或“待审核”的数据才能进行拆分，请重新选择！')
      } else {
        this.$modal({
          title: '自定义拆分行',
          width: '500px',
          data: {
            currentCount: this.currentCount,
            checkedList: this.checkedList ? this.checkedList[0] : {}
          },
          component: SplitRow,
          callback: refresh => {
            refresh && this.getData()
          }
        })
      }
    },
    // 删除
    del(id) {
      this.$confirm('请确认是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = id
        rowDelete(ids).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功') && this.getData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    hanlerCustomExport() { // 自定义导出
      this.$modal({
        title: '自定义导出模板选择：（每个用户最多配置5个自定义模板）',
        component: DefineTemplate,
        data: {
          params: this.paramsJson
        }
      })
    },
    // 隐藏列
    updateTemp(id) {
      const data = id ? { id } : undefined
      this.$newPage({
        path: 'trs/components/define-template/updateTemp',
        data,
        callback: bool => bool && this.getData()
      })
    },
    getDetailPath(type) {
      const path = {
        batchModify: '/trs/customInfo/batchModify',
        modify: '/trs/customInfo/modify',
        isView: '/trs/customInfo/viewDetails',
        preReport: '/trs/customInfo/preReport',
        batchPreReport: '/trs/customInfo/batchPreReport'
      }
      return path[type]
    },
    getDetailTitle(type) {
      const path = {
        batchModify: '报关信息批量修改',
        modify: '报关信息修改',
        isView: '报关信息详情',
        preReport: '报关信息预报',
        batchPreReport: '报关信息批量预报'
      }
      return path[type]
    },
    // 打开详情页
    openCustomDetail(type, id, status) {
      console.log('this.isAllEqual(this.checkedFreight): ', this.isAllEqual(this.checkedFreight))
      console.log('this.isAllEqual(this.checkedTransport): ', this.isAllEqual(this.checkedTransport))
      console.log('this.isAllEqual(this.checkedPurposeCountry): ', this.isAllEqual(this.checkedPurposeCountry))
      if (type === 'batchModify' && (!this.isStatusEqual || ![0, 1].includes(this.sameStatus))) { // 批量修改
        this.$message.error('请重新选择状态一致且状态为“待审核”或“待预报”的数据！')
      } else if (type === 'batchPreReport' && (!this.isStatusEqual || this.sameStatus !== 1)) { // 批量预报
        this.$message.error('请重新选择状态一致且状态为“待预报”的数据！')
      } else {
        this.$newTab({
          path: this.getDetailPath(type),
          title: this.getDetailTitle(type),
          component: CustomDetail,
          clearCache: true,
          data: {
            type: type, // 区分操作类型：批量修改、修改、详情、预报、批量预报
            id: id,
            status: status // 区分状态
          },
          callback: refresh => {
            console.log('refresh: ', refresh)
            refresh && this.getData()
          }
        })
      }
    },
    // 判断数组内的元素是否都相同
    isAllEqual(array) {
      if (array.length > 0) {
        return !array.some(function(value, index) {
          return value !== array[0]
        })
      } else {
        return true
      }
    },
    // table 复选框
    select(checkedList = [], row) {
      this.checkedList = checkedList
      this.checkedId = checkedList.map(item => item.id)// 当前选中项
      this.checkedStatus = checkedList.map(item => item.status)// 当前选中的状态
      this.checkedFreight = checkedList.map(item => item.freightForwardCompany)// 当前选中的货代公司
      this.checkedTransport = checkedList.map(item => item.transport)// 当前选中的运输方式
      this.checkedPurposeCountry = checkedList.map(item => item.purposeCountry)// 当前选中的目的国
      this.currentCount = checkedList.map(item => item.quantity)// 当前选中的数量
      if (this.currentCount.length === 1) {
        this.currentCount = this.currentCount[0]
      }
      this.isStatusEqual = this.checkedStatus && this.isAllEqual(this.checkedStatus)
      if (this.checkedStatus.length > 0 && this.isStatusEqual) { this.sameStatus = this.checkedStatus[0] }// 如果有勾选且状态相同，就取勾选数组中第一个元素的状态传参给编辑页
      if (this.checkedStatus.length === 0) { this.isStatusEqual = false }// 取消勾选的时候重置批量按钮为disabled
      if (row) { // 单选时合计计算逻辑
        if (checkedList.includes(row)) {
          this.checkedCount += row.quantity
        } else {
          this.checkedCount -= row.quantity
        }
      } else { // 全选时合计计算逻辑
        const tempCheckedCount = []
        const tempCheckedPrice = []
        if (checkedList.length > 0) {
          tempCheckedCount.push(...checkedList.map(item => item.quantity))
          tempCheckedPrice.push(...checkedList.map(item => Number(item.unitPriceUsd)))
        }
        this.checkedCount = tempCheckedCount.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
      }
    },
    reset() {
      this.$refs.form.resetFields()
      this.search()
    },
    search() {
      this.getData()
    },
    batchApproval() { // 批量审核
      if (!this.isStatusEqual || this.sameStatus !== 0) {
        this.$message.error('请重新选择状态一致且状态为“待审核”的数据！')
      } else {
        this.checkedId = this.checkedId.length > 0 ? this.checkedId.join() : this.checkedId
        this.requestBatchApproval(this.checkedId)
      }
    },
    requestBatchApproval(ids) {
      requestBatchApproval({ ids: ids }).then(res => {
        if (res.code === 200) {
          this.$message.success('批量审核成功')
          this.getData()
        } else {
          this.$message.error(res.msg || '批量审核失败')
        }
      })
    },
    getData() {
      let params = {}
      params = Object.assign({}, this.form)
      console.log(' this.$refs.table: ', this.$refs.table)
      this.$refs.table.load(1, params)
    },
    fetch({ current, size }, params) {
      return declareList({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    openModal(type, row) {
      // this.requestFlag = true // 用户点击了按钮，按钮置为disabled防止重复点击
      // this.$modal({
      //   title: '下载模板/导入',
      //   component: tempImport,
      //   data: {
      //     siteOption: this.siteOption
      //   },
      //   callback: (refresh) => {
      //     this.requestFlag = false // 请求回来且方法执行完，按钮恢复可点击状态
      //     refresh && this.search()
      //   }
      // })
    },
    // 自定义合计规则
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          if (column.label === '数量') {
            sums[index] = this.checkedCount || ''
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    handleExport() {
      // this.requestFlag = true // 用户点击了按钮，按钮置为disabled防止重复点击
      // this.$modal({
      //   title: '下载模板/导入',
      //   component: tempImport,
      //   data: {
      //     siteOption: this.siteOption
      //   },
      //   callback: (refresh) => {
      //     this.requestFlag = false // 请求回来且方法执行完，按钮恢复可点击状态
      //     refresh && this.search()
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-col{
  margin-bottom:-10px;
}
::v-deep .pd-r0.el-button{
  padding-right:0;
  padding-left:0;
}
::v-deep .el-table--scrollable-y .el-table__body-wrapper{
  max-height: 444px !important;
}
// 调整漏斗位置 暂时保留
// ::v-deep .g-table-wrap .filter-btn{
//   padding:0;
//   left:57px;
// }
</style>
