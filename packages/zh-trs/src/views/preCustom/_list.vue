<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" @select="select" @select-all="select">
      <template slot="header">
        <el-form ref="form" :inline="true" :model="form" size="mini">
          <el-row>
            <el-col :span="7">
              <el-form-item label="合同协议号" prop="contractAgreementNo" class="ms-4">
                <el-input v-model="form.contractAgreementNo" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="报关号" prop="declareCustomsNo" class="ps-3">
                <el-input v-model="form.declareCustomsNo" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="采购编码" prop="purchaseCode">
                <el-input v-model="form.purchaseCode" type="text" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="SKU编码" prop="productSku" class="ms-3 ps-4">
                <el-input v-model="form.productSku" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="需求单号" prop="demandOrder">
                <el-input v-model="form.demandOrder" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="出库单号" prop="outputWarehouseOrder">
                <el-input v-model="form.outputWarehouseOrder" type="text" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="状态" prop="status" class="ms-4 ps-5">
                <el-select v-model="form.status" collapse-tags filterable style="width:177px;">
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="出口日期" prop="exportDate">
                <el-date-picker
                  v-model="form.exportDate"
                  style="width:177px;"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="7" class="ms-4 mb-2">
              <el-button type="primary" size="mini" @click="exportExcel">批量下载报关单</el-button>
            </el-col>
          </el-row> -->
        </el-form>
      </template>
      <el-table-column slot="declareCustomsNoSlot" width="110px">
        <g-table-column-header slot="header" label="报关号" prop="declareCustomsNo" />
        <template v-slot="{row}">
          <g-text-ellipsis> {{ row.declareCustomsNo }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="contractIdSlot" label="合同协议号" width="123px">
        <template v-slot="{row}">
          <el-button type="text" @click="openPDF(row.id)">{{ row.contractAgreementNo }}</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="purchaseIdSlot" label="采购编码" width="110px;">
        <template v-slot="{row}">
          <el-row v-for="(item,index) in row.purchaseProductVOList" :key="index">
            <!-- <g-link class="text-primary" @click="openPurchaseDetail('1397839693031989250', row.name)">CG2105270001</g-link> -->
            <g-link class="text-primary" @click="openPurchaseDetail(item.id, row.name)">{{ item.purchaseCode }}</g-link>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column slot="skuSlot" label="SKU编码" width="110px;">
        <template v-slot="{row}">
          <el-row v-for="(item,index) in row.purchaseProductVOList" :key="index">
            <!-- <g-link class="text-primary" @click="openSpuSkuDetail('RB5BT481GS7', item.name)">RB5BT481GS7</g-link> -->
            <g-link class="text-primary" @click="openSpuSkuDetail(item.productSku, item.name)">{{ item.productSku }}</g-link>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column slot="updateTimeSlot" label="修改时间" prop="updateTime" width="100px">
        <template v-slot="{row}">
          <g-text-ellipsis> {{ row.updateTime }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="demandOrderSlot" label="需求单号" width="110px;">
        <template v-slot="{row}">
          <el-row v-for="(item,index) in row.purchaseProductVOList" :key="index">
            {{ item.demandOrder }}
          </el-row>
        </template>
      </el-table-column>
      <el-table-column slot="outputSlot" label="出库单号" width="110px;">
        <template v-slot="{row}">
          <el-row v-for="(item,index) in row.purchaseProductVOList" :key="index">
            {{ item.outputWarehouseOrder }}
          </el-row>
        </template>
      </el-table-column>
      <el-table-column slot="handSlot" label="操作" width="120px">
        <template v-slot="{row}">
          <div>
            <el-button type="text" class="pd-r0" @click="openPDF(row.id)">预览</el-button>
            <el-button v-if="row.status===2" type="text" class="pd-r0 " @click="openCustomDetail('doubleCheck',row.contractAgreementNo,row.status)">复核</el-button>
            <el-button v-if="row.status===2" type="text" class="pd-r0" @click="del(row.id)">删除</el-button>
            <el-button v-if="row.status===3" type="text" class="pd-r0" @click="openCustomDetail('report',row.contractAgreementNo,row.status)">报关</el-button>
            <el-button v-if="row.status===4" type="text" class="pd-r0" @click="openCustomDetail('preRetax',row.contractAgreementNo,row.status)">预退税</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column slot="customDeclareSlot" label="报关单">
        <template v-slot="{row}">
          <div>
            <el-button v-if="![2,3].includes(row.status)" type="text" class="pd-r0" style="padding-right:-4px;" @click="downLoad(row)">下载</el-button>
          </div>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { dowloadExc } from '@/util/util'
import { openSpuSkuDetail, openPurchaseDetail } from '@/views/components/utils.js'
import { preReportList, rowDelete, getStatus } from '@/api/preReport'
import { downLoadPDF } from '@/api/customDeclare'
import CustomDetail from '@/views/customInfo/components/customDetail.vue'
export default {
  name: 'TrsPreCustomList',
  data() {
    return {
      openSpuSkuDetail,
      openPurchaseDetail,
      form: {
        contractAgreementNo: null,
        declareCustomsNo: null,
        purchaseCode: null,
        productSku: null,
        demandOrder: null,
        outputWarehouseOrder: null,
        status: null,
        exportDate: null
      },
      headers: [
        { type: 'selection' },
        { slot: true, slotName: 'contractIdSlot' },
        { slot: true, slotName: 'declareCustomsNoSlot' },
        { slot: true, slotName: 'purchaseIdSlot' },
        { slot: true, slotName: 'skuSlot' },
        // { slot: true, slotName: 'demandIdSlot' },
        // { slot: true, slotName: 'deliverOrderSlot' },
        { slot: true, slotName: 'demandOrderSlot' },
        { slot: true, slotName: 'outputSlot' },
        { prop: 'exportDate', label: '出口日期' },
        { prop: 'statusName', label: '状态' },
        { slot: true, slotName: 'handSlot' },
        { slot: true, slotName: 'customDeclareSlot' },
        { prop: 'createUser', label: '创建人' },
        { slot: true, slotName: 'updateTimeSlot' }
      ],
      statusList: [],
      requestFlag: false,
      checkedId: []// 选中的id
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
    getStatusList() {
      getStatus({ }).then(res => {
        const { code, data } = res
        if (code === 200) {
          this.statusList = data
        }
      })
    },
    // 预览
    openPDF(id) {
      this.$newPage({
        path: '/trs/preCustom/preview',
        data: {
          id
        }
      })
    },
    // table 复选框
    select(checkedList = []) {
      this.checkedId = checkedList.map(item => item.id)// 当前选中项
    },
    getDetailPath(type) {
      const path = {
        doubleCheck: '/trs/customInfo/doubleCheck',
        report: '/trs/customInfo/report',
        preRetax: '/trs/customInfo/preRetax'
      }
      return path[type]
    },
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
    getDetailTitle(type) {
      const path = {
        doubleCheck: '报关信息复核',
        report: '报关信息报关',
        preRetax: '报关信息预退税'
      }
      return path[type]
    },
    // 批量修改/修改/预览
    openCustomDetail(type, id, status) {
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
          refresh && this.getData()
        }
      })
    },
    exportExcel() {},
    reset() {
      this.$refs.form.resetFields()
      this.search()
    },
    search() {
      this.getData()
    },
    getData() {
      let params = {}
      params = Object.assign({}, this.form)
      this.$refs.table.load(1, params)
    },
    fetch({ current, size }, params) {
      return preReportList({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    downLoad(row) { // 下载
      const pdf = row.declareCustomsPdf
      downLoadPDF(pdf).then(res => {
        const name = pdf.name
        dowloadExc(res, name)
        this.$emit('close', true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-col{
  margin-bottom:-3px;
}
::v-deep .pd-r0.el-button{
  padding-right:0;
  padding-left:0;
}
</style>
