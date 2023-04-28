<template>
  <!-- 预付款核销 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="8">
              <el-form-item prop="shouldCode" label="应付编码">
                <el-input v-model.trim="formData.shouldCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="purCode" label="采购编码">
                <el-input v-model.trim="formData.c" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="supplierInfoId" label="供应商名称">
                <g-select v-model="formData.supplierInfoId" style="width:100%;" :items="warehouseList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="verifyCode" label="核销编码">
                <el-input v-model.trim="formData.verifyCode" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item class="btnBox">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button icon="el-icon-delete" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

    </g-table>

  </basic-container>
</template>
<script>
import { getList } from '@/api/advanceManagement/writeOff'
import { supplier } from '@/api/commonApi'
export default {
  name: 'PurchasePrePayManagementWriteOff',
  data() {
    return {
      formData: {
        shouldCode: '',
        purCode: '',
        supplierInfoId: '',
        verifyCode: ''
      },
      searchData: [],
      // 表格数据
      headers: [
        {
          label: '核销编码',
          prop: 'verifyCode',
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '预付编码',
          prop: 'prepayMoneyCode',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '应付编码',
          prop: 'shouldCode',
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '采购编码',
          prop: 'purCode',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '采购方名称',
          prop: 'purDemander.name',
          showOverflowTooltip: true,
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '供应商名称',
          prop: 'supplierInfo.supplierName',
          showOverflowTooltip: true,
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '预付金额',
          prop: 'prepayTotalMoney',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '核销金额',
          prop: 'currentVerifyTotalMoney',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '币种',
          prop: 'purAccountCurrency.value',
          minWidth: '60px',
          align: 'center'
        },
        {
          label: '核销时间',
          prop: 'verifyTime',
          minWidth: '130px',
          align: 'center'
        }
      ],
      warehouseList: []
    }
  },
  mounted() {
    this.initialization()
    this.getSearch()
  },
  methods: {
    getSearch() {
      supplier().then(res => {
        this.warehouseList = res.data
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        res.data.records.map(item => {
          for (const key in item) {
            if (item[key] === -1) item[key] = ''
          }
          return item
        })
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
