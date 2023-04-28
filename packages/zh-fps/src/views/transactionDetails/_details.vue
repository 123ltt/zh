<template>
  <basic-container>
    <g-table
      ref="table"
      :headers="headers"
      :fetch="fetch"
      row-key="id"
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
              <el-form-item label="第三方单号：">
                <el-input v-model="searchData.orderCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="财务类型：">
                <g-select
                  v-model="searchData.financeType"
                  :items="financeTypeList"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictValue"
                  clearable
                  style="width: 100%"
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态：">
                <g-select
                  v-model="searchData.transactionStatus"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictKey"
                  clearable
                  :items="statusList"
                  style="width: 100%"
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="交易账号：" prop="transactionAccount">
                <g-select
                  v-model="searchData.transactionAccount"
                  :items="accountListInfo"
                  key-field="id"
                  label-field="transactionAccount"
                  value-field=""
                  clearable
                  style="width: 100%"
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" style="margin-left: 20px">
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
          <el-row :gutter="10" class="row">
            <el-col>
              <el-button
                type="primary"
                icon="el-icon-upload2"
                size="mini"
                class="me-1"
                @click="upBtn()"
              >导入</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </g-table>
  </basic-container>
</template>
<script>
import { getList, accountList } from '@/api/transactionDetails' // 表格列表+交易账号查询
import { getPlatformInfo } from '@/api/orderListInfo' // 字典数据（平台，状态，付款方式）
import upload from '../transactionDetails/uploadModal/upload.vue'

export default {
  data() {
    return {
      headers: [
        {
          label: '交易账号',
          prop: 'transactionAccount',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '第三方单号',
          prop: 'orderCode',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '对方账号',
          prop: 'oppositeAccount',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '交易类型',
          prop: 'transactionType',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '收入（+元）',
          prop: 'incomeAmount',
          minWidth: '135px',
          align: 'center'
        },
        {
          label: '支出（-元）',
          prop: 'expendAmount',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '交易流水号',
          prop: 'transactionId',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '流水号总额',
          prop: 'transactionTotalAmount',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '流水号余额',
          prop: 'transactionRemainderAmount',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '交易备注',
          prop: 'remark',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '交易时间',
          prop: 'transactionDate',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '状态',
          prop: 'transactionStatusName',
          minWidth: '70px',
          align: 'center'
        }

      ],
      searchData: {
        transactionStatus: '', // 状态
        transactionAccount: '', // 交易账号
        orderCode: '', // 第三方单号
        financeType: '' // 财务类型
      },
      accountListInfo: [], // 交易账号查询列表
      financeTypeList: [], // 财务类型列表
      statusList: []// 状态列表
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initialization()
  },
  methods: {
    // 重置
    reset() {
      for (const prop in this.searchData) {
        this.searchData[prop] = ''
      }
    },
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
    // 搜索
    initialization(originalRefresh = true) {
      const current = originalRefresh ? 1 : this.current
      this.$refs.table.load(current, this.searchData)
    },
    getData() {
      Promise.all([
        accountList(), // 交易账号查询
        getPlatformInfo({ code: 'transaction_finance_type' }),
        getPlatformInfo({ code: 'transaction_record_status' })
      ]).then(res => {
        this.accountListInfo = res[0].data
        this.financeTypeList = res[1].data
        this.statusList = res[2].data
      })
    },
    upBtn() {
      this.$modal({
        title: '导入账单',
        component: upload,
        width: '500px',
        data: {
        },
        callback: (bool) => {
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.row {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
