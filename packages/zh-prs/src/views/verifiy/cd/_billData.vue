<template>
  <basic-container>
    <g-table ref="tableRef"
             :headers="headers"
             :fetch="fetch"
             :header-cell-style="{'text-align':'center'}"
             :cell-style="{'text-align':'center'}"
             @selection-change="handleSelectionChange"
    >
      <template slot="header">
        <el-form size="mini" :model="formInfo" label-width="150px" class="form-col no-message">
          <el-row type="flex">
            <el-col>
              <el-form-item label="店铺编码">
                <el-select v-model="formInfo.stores" clearable>
                  <el-option v-for="item in storeCodeList" :key="item.value" :label="item.value" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item>
                <div slot="label">
                  <el-select v-model="formInfo.timeConditionType" style="width:100px !important">
                    <el-option v-for="item in dateOptions"
                               :key="item.label"
                               :label="item.label"
                               :value="item.value"
                    />
                  </el-select>
                </div>
                <el-date-picker v-model="dateTime"
                                type="daterange"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="订单服务号">
                <el-input v-model="formInfo.platformOrderNumbers" clearable placeholder="多个用英文逗号隔开" class="small" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件名">
                <el-input v-model="formInfo.fileNames" clearable placeholder="多个用英文逗号隔开" class="small" />
                <el-button size="mini" type="primary" @click="search">查询</el-button>
                <el-button size="mini" type="primary" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <handel-download :all-data="allData" :part-data="exportData" :headers="headers" @getAllData="getAllData" />
      </template>
    </g-table>
  </basic-container>
</template>
<script>
import { filterData } from '../../../utils/filterData'
import { getCdPage } from '@/api/cd/cd'
import { getStoreCodeList } from '@/api/common'
import handelDownload from '@/views/components/handelDownload'
export default {
  name: 'PrsVerifiyCdBillData',
  components: { handelDownload },
  data() {
    return {
      formInfo: {
        stores: '',
        platformOrderNumbers: '',
        fileNames: '',
        timeConditionType: 1
      },
      dateOptions: [
        { label: '账单日期', value: 1 },
        { label: '创建日期', value: 2 }
      ],
      storeCodeList: [],
      dateTime: [],
      allData: [],
      exportData: [],
      headers: [
        { width: 55, type: 'selection' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '币种', prop: 'currency' },
        { label: '账单日期', prop: 'fileUploadDate' },
        { label: '创建日期', prop: 'oderCreateDate' },
        { label: '订单服务号', width: 100, prop: 'platformOrderNumber' },
        { label: '订单状态', prop: 'orderStatus' },
        { label: '订单收入（含佣金）', width: 90, prop: 'platformOrderAmount' },
        { label: '平台费', prop: 'platformFee' },
        { label: '分期付款手续费', prop: 'installmentServiceChargeAmount' },
        { label: '分期付款管理费', prop: 'installmentManagementFee' },
        { label: '退款', prop: 'platformRefundAmount' },
        { label: '返还佣金', prop: 'commissionReturn' },
        { label: '放款金额', prop: 'loanTotalAmount' },
        { width: 150, label: '文件名', prop: 'fileName' }
      ]
    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.billBegin = val?.[0]
      this.formInfo.billEnd = val?.[1]?.replace(/00:00:00/, '23:59:59')
      this.init()
    }
  },
  mounted() {
    this.init()
    this.getStoreList()
  },
  methods: {
    // 表格数据初始化
    init() {
      this.formInfo.startDate = this.dateTime?.[0]
      this.formInfo.endDate = this.dateTime?.[1]?.replace(/00:00:00/, '23:59:59')
      this.$refs.tableRef.load(1, this.formInfo)
    },
    search() {
      this.init()
    },
    reset() {
      this.dateTime = []
      this.formInfo = {
        timeConditionType: 1
      }
      this.init()
    },
    // 获取选中数据
    handleSelectionChange(val) {
      this.exportData = val
    },
    fetch({ current, size }, params) {
      return getCdPage(current, size, params).then(res => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    // 导出所有数据
    getAllData() {
      getCdPage(1, 50000, this.formInfo).then(res => {
        // filterData(res.data.records)
        this.allData = res.data.records
      })
    },
    // 获取店铺列表
    getStoreList() {
      getStoreCodeList({ platformCode: 'CD' }).then(res => {
        this.storeCodeList = res.data
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .small{
    width: 245px!important;
  }
  .el-select{
    width:245px!important;
  }
  .el-range-editor--mini.el-input__inner{
    width: 245px !important;
  }
</style>
