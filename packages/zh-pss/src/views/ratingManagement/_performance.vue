<template>
  <!-- 供应商评级管理/供应商绩效-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="8">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="submit.supplierId" style="width:80%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="btnBox">
                <el-button
                  class="btn"
                  type="primary"
                  icon="el-icon-search"
                  @click="search()"
                >查询</el-button>
                <el-button
                  class="btn"
                  icon="el-icon-delete"
                  @click="reset()"
                >重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="130">
        <template slot-scope="scope">
          <el-button type="text" @click="detailBtn(scope.row)">历史绩效</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>

import { getList } from '@/api/ratingManagement/performance.js'
import { supplier } from '@/api/commonApi/common.js'
import performanceDetails from './components/performanceDetails'

export default {
  name: 'SupplierRatingManagementAchievement',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        supplierId: ''
      },
      supplierList: [],
      searchData: {},
      tableData: [],
      // 表格数据
      headers: [
        {
          label: '供应商名称',
          prop: 'supplierName',
          minWidth: '130px',
          align: 'center',
          showOverflowTooltip: true
        },
        {
          label: '考核期间',
          prop: 'checkDate',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '综合绩效',
          prop: 'totalPerformance',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '准时交付20分',
          prop: 'onTimeDelivery',
          width: '71px',
          align: 'center'
        },
        {
          label: '账期10分',
          prop: 'paymentDay',
          width: '71px',
          align: 'center'
        },
        {
          label: '滞销处理10分',
          prop: 'unsalableProcessing',
          width: '71px',
          align: 'center'
        },
        {
          label: '成本优化10分',
          prop: 'costOptimization',
          width: '71px',
          align: 'center'
        },
        {
          label: '来料合格率20分',
          prop: 'incomingQualifiedRate',
          width: '71px',
          align: 'center'
        },
        {
          label: '不良率10分',
          prop: 'defectiveRate',
          width: '60px',
          align: 'center'
        },
        {
          label: '售后退货率10分',
          prop: 'afterSaleReturnRate',
          width: '71px',
          align: 'center'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          minWidth: '150px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      //   详情
      detailData: '',
      isDetail: false
    }
  },
  mounted() {
    this.initialization()
  },
  methods: {
    //   获取数据
    getData() {
      supplier().then(res => {
        this.supplierList = res.data
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
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      this.submit.supplierId = ''
      this.searchData = {}
      this.initialization()
    },
    detailBtn(val) {
      this.$modal({
        title: '供应商历史绩效',
        component: performanceDetails,
        width: '70%',
        data: {
          supplier: val
        },
        callback: () => {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
.btnBox{
    ::v-deep .el-form-item__content{
        margin-left: 20px!important;
    }
    .btn{
        width: 30%;
    }
}
.searchBox{
    ::v-deep .el-form-item{
        margin-bottom: 0;
    }
}
.block {
  text-align: right;
  margin: 10px 10px 0 0;
}
.tableData {
  padding: 0 10px;
  margin-top: 15px;
  .addBox {
    width: 100%;
    height: 30px;
    margin-bottom: 10px;
  }
}
</style>
