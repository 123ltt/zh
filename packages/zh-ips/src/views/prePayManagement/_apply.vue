<template>
  <!-- 预付款申请 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="9">
              <el-form-item prop="purCode" label="采购编码">
                <el-input v-model.trim="formData.purCode" clearable style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="applyCode" label="申请编码">
                <el-input v-model.trim="formData.applyCode" clearable style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="applyUserId" label="申请人">
                <el-input v-model.trim="formData.applyUserId" clearable style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="prepayStatus" label="状态">
                <el-select v-model="formData.prepayStatus" clearable style="width:100%">
                  <el-option v-for="item in statusList" :key="item.dictKey" :value="item.dictKey" :label="item.dictValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button icon="el-icon-delete" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="applyCode" label="申请编码" min-width="110" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="propsData(row.id)">{{ row.applyCode }}</g-link>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="prepayStatus" label="状态" nim-width="60" align="center">
        <template slot-scope="scope">
          <span>{{ statusObj[scope.row.prepayStatus] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="160">
        <template slot-scope="slot">
          <el-button type="text" @click="addFpsData(slot.row)">请款</el-button>
          <el-button type="text" @click="propsData(slot.row.id)">详情</el-button>
          <el-button v-if="slot.row.prepayStatus === 'WaitAudit'?true:false" type="text" @click="Moni(slot.row)">模拟审核</el-button>
          <el-button v-if="slot.row.prepayStatus === 'WaitPay'?true:false" type="text" @click="MoniPay(slot.row)">模拟支付</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>
<script>
import applyeDetail from './applyModal/applyDetail'
import { getList, MoniCheck, MoniPay, addFps } from '@/api/advanceManagement/apply'
import { dictionary } from '@/api/commonApi'
export default {
  name: 'PurchasePrePayManagementApply',
  data() {
    return {
      loading: false,
      visible: false,
      formData: {
        status: '',
        applyUserId: '',
        applyCode: '',
        purCode: ''
      },
      searchData: [],
      statusList: [],
      statusObj: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'applyCode'
        },
        {
          label: '采购编码',
          prop: 'purCode',
          width: '110px',
          align: 'center'
        },
        {
          label: '采购方名称',
          prop: 'purDemander.orgName',
          showOverflowTooltip: true,
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '供应商名称',
          prop: 'supplierInfo.supplierName',
          showOverflowTooltip: true,
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '采购金额',
          prop: 'purTotalMoney',
          minWidth: '75px',
          align: 'center'
        },
        {
          label: '预付类型',
          prop: 'prepayType',
          minWidth: '105px',
          align: 'center'
        },
        {
          label: '预付金额',
          prop: 'prepayTotalMoney',
          minWidth: '75px',
          align: 'center'
        },
        {
          label: '申请人',
          prop: 'applyUser.name',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '申请时间',
          prop: 'applyTime',
          minWidth: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'prepayStatus'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ]
    }
  },
  mounted() {
    this.initialization()
    this.getSearch()
  },
  methods: {
    Moni(row) {
      this.$set(row, 'prepayStatus', 'WaitPay')
      MoniCheck(row).then(res => {
        this.$message.success('审核通过')
      })
    },
    MoniPay(row) {
      this.$set(row, 'prepayStatus', 'Delivered')
      this.$set(row, 'operateUser', '小明')
      MoniPay(row).then(res => {
        this.$message.success('完成支付')
      })
    },
    addFpsData(val) {
      const obj = {
        id: val.id,
        version: val.version,
        remark: val.remark,
        purAccountCurrency: val.purAccountCurrency,
        prepayTotalMoney: val.prepayTotalMoney,
        operateUser: val.updateUser
      }
      addFps(obj).then(res => {
        this.$message.success('请款成功！')
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    getSearch() {
      dictionary('ips_prepay_status').then(res => {
        this.statusList = res.data
        res.data.forEach(item => {
          this.statusObj[item.dictKey] = item.dictValue
        })
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
    },
    getTable() {
      this.$refs.controlDetail.getData()
    },
    propsData(id) {
      this.$modal({
        title: '预付申请详情',
        component: applyeDetail,
        data: {
          id
        },
        callback: () => {}
      })
    },
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.formData))
      this.initialization()
    },
    reset() {
      Object.keys(this.formData).forEach(item => {
        this.formData[item] = ''
      })
      this.searchData = []
      this.initialization()
    }
  }
}
</script>
<style lang="scss" scoped>
.searchBox{
    ::v-deep .el-form-item{
      margin-bottom: 0;
    }
  }
.block{
    text-align:right;
    margin: 10px 10px 0 0;
}
</style>
