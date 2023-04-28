<template>
  <basic-container>
    <g-table
      ref="table"
      :headers="headers"
      row-key="id"
      :fetch="fetch"
    >
      <template slot="header">
        <el-form
          ref="form"
          label-width="100px"
          size="mini"
          class="form-col no-message"
        >
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="退款编码:">
                <el-input clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="采购编码:">
                <el-input clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="退款账号:">
                <el-input clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商名称:">
                <el-input clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="交易流水号:">
                <el-input clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态:">
                <g-select
                  style="width: 100%"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictValue"
                  clearable
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请人:">
                <el-input clearable />
              </el-form-item>
            </el-col>

            <el-col :span="6" style="padding-left: 40px">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                class="me-1"
                @click="initialization"
              >查询</el-button>
              <el-button
                icon="el-icon-delete"
                size="mini"
                class="me-1"
                @click="reset"
              >重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column
        slot="handler"
        label="操作"
        fiexd="right"
        min-width="140px"
        align="center"
      >
        <template v-slot="scope">
          <el-button v-if="scope.row.refundStatusName=='待审核'" type="text" @click="audit">审核</el-button>
          <el-button v-if="scope.row.refundStatusName=='核对异常'" type="text" @click="reject(scope.row)">驳回</el-button>
          <el-button type="text" @click="details(scope.row)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column
        slot="certificate"
        label="凭证"
        fiexd="right"
        min-width="140px"
        align="center"
      >
        <template v-slot="scope">
          <img :src="scope.row.refundProof" alt="" min-width="70" height="70">
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import { getList } from '@/api/purchasingRefund'
import details from './detailsModal/datails.vue'
import reject from './detailsModal/reject.vue' // 驳回弹框组件
export default {
  data() {
    return {
      headers: [
        { label: '退款编码', prop: 'refundCode', minWidth: '80px', align: 'center' },
        { label: '采购编码', prop: 'purchaseCode', minWidth: '80px', align: 'center' },
        { label: '采购平台', prop: 'purchasePlatformName', minWidth: '80px', align: 'center' },
        { label: '第三方单号', prop: 'orderCode', minWidth: '90px', align: 'center' },
        {
          label: '采购主体名称',
          prop: 'purchaseCompanyName',
          minWidth: '100px',
          align: 'center'
        },
        { label: '供应商名称', prop: 'supplierName', minWidth: '90px', align: 'center' },
        { label: '采购类型', prop: 'purchaseTypeName', minWidth: '80px', align: 'center' },
        { label: '付款金额', prop: 'paidAmount', minWidth: '70px', align: 'center' },
        { label: '退款方式', prop: 'refundTypeName', minWidth: '80px', align: 'center' },
        { label: '退款账号', prop: 'refundAccount', minWidth: '80px', align: 'center' },
        { label: '退款金额', prop: 'refundAmount', minWidth: '80px', align: 'center' },
        { label: '退款备注', prop: 'refundRemark', minWidth: '80px', align: 'center' },
        { label: '退款时间', prop: 'refundDate', minWidth: '125px', align: 'center' },
        { label: '交易流水号', prop: 'transactionId', minWidth: '90px', align: 'center' },
        { slot: true, slotName: 'certificate' },
        { label: '申请人', prop: 'applyUser', minWidth: '80px', align: 'center' },
        { label: '申请时间', prop: 'applyDate', minWidth: '125px', align: 'center' },
        { label: '状态', prop: 'refundStatusName', minWidth: '80px', align: 'center' },
        { slot: true, slotName: 'handler' }
      ]
    }
  },
  created() {},
  mounted() {
    this.initialization()
  },
  methods: {
    // 自定义封装表格绑定的方法 ，只获取表格数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then((res) => {
        this.current = res.data.current
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },

    // 重置
    reset() {
      for (const prop in this.searchData) {
        this.searchData[prop] = ''
      }
    },
    // 搜索
    initialization(originalRefresh = true) {
      const current = originalRefresh ? 1 : this.current
      this.$refs.table.load(current, this.searchData)
    },
    // 详情
    details(row) {
      this.$newTab({
        path: '/purchasingRefund/detail',
        title: '预付款单付款详情',
        component: details,
        clearCache: true,
        data: {
          row
        },
        callback: (bool) => {}
      })
    },
    // 审核
    audit(row) {
      this.$modal({
        title: '采购退款驳审核',
        component: reject,
        width: '600px',
        data: {
          row
        },
        callback: (bool) => {}
      })
    },
    // 驳回
    reject(row) {
      this.$modal({
        title: '采购退款驳回',
        component: reject,
        width: '600px',
        data: {
          row
        },
        callback: (bool) => {}
      })
    }

  }
}
</script>

<style></style>
