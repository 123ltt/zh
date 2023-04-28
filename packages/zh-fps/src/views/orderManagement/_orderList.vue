<template>
  <basic-container v-loading="loading">
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
      <template slot="header">
        <el-form
          ref="form"
          :model="searchData"
          label-width="100px"
          size="mini"
          class="form-col no-message"
        >
          <el-row :gutter="10" class="row">
            <el-col :span="8">
              <el-form-item label="采购平台：" prop="purchasePlatformCode">
                <g-select
                  v-model="searchData.purchasePlatformCode"
                  :items="PlatformList"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictKey"
                  clearable
                  style="width: 100%"
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="第三方单号：" prop="orderCode">
                <el-input
                  v-model="searchData.orderCode"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="买家账号：" prop="buyerAccount">
                <g-select
                  v-model="searchData.buyerAccount"
                  :items="buyNumList"
                  key-field="buyerId"
                  label-field="buyerAccount"
                  value-field="buyerAccount"
                  clearable
                  style="width: 100%"
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交易状态：" prop="orderStatus">
                <g-select
                  v-model="searchData.orderStatus"
                  :items="statusList"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictKey"
                  clearable
                  style="width: 100%"
                  :item-title="true"
                />
              </el-form-item>

            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称：">
                <el-input v-model="searchData.supplierName" clearable />
              </el-form-item>

            </el-col>
            <el-col :span="8" style="padding-left:30px">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="initialization"
              >查询</el-button>
              <el-button
                class="ms-3"
                icon="el-icon-delete"
                size="mini"
                @click="reset"
              >重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </g-table>
  </basic-container>
</template>
<script>
import { getList, getPlatfor, getPlatformInfo, getBuyerInfo } from '@/api/orderListInfo' // 表格数据接口+字典数据（平台，状态，付款方式）+买家账号
export default {
  data() {
    return {
      loading: false,
      current: 1,
      orderId: '', // 第三方单号绑定的值
      // 绑定在表格标签上直接展示表头
      headers: [
        {
          label: '采购平台',
          prop: 'purchasePlatformName',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '第三方单号',
          prop: 'orderCode',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '买家账号',
          prop: 'buyerAccount',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '买家主账号id',
          prop: 'buyerAccountId',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '采购主体名称',
          prop: 'purchaseCompanyName',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '供应商名称',
          prop: 'supplierName',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '付款条件',
          prop: 'orderStatus',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '产品金额',
          prop: 'productAmount',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '物流运费',
          prop: 'shippingAmount',
          minWidth: '90px',
          align: 'center'
        },

        {
          label: '优惠金额',
          prop: 'discountInfo',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '订单金额',
          prop: 'orderAmount',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '已付金额',
          prop: 'paidAmount',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '应付总额',
          prop: 'paymentTotalAmount',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '交易状态',
          prop: 'orderStatusName',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '下单账号',
          prop: 'orderAccount',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '下单时间',
          prop: 'orderDate',
          minWidth: '100px',
          align: 'center'
        }
      ],
      // 搜索条件绑定的值
      searchData: {
        purchasePlatformCode: '', // 采购平台编码
        buyerAccount: '', // 买家账号
        orderCode: '', // 第三方单号
        orderStatus: '', // 订单状态
        transactionType: '', // 付款方式
        supplierName: ''// 供应商名称
      },
      PlatformList: [], // 平台列表数据
      buyNumList: [], // 买家账号列表
      statusList: [] // 状态列表
    }
  },
  // 页面一加载
  created() {
    this.getData()
  },
  mounted() {
    // 页面加载完成之后 调用搜索方法拿到表格数据
    this.initialization()
  },
  methods: {
    // 获取数据集合
    getData() {
      Promise.all([
        getPlatfor({ code: 'ips_pur_platform' }),
        getPlatformInfo({ code: 'alibaba_order_status' }),
        getBuyerInfo()
      ]).then((res) => {
        this.PlatformList = res[0].data
        this.statusList = res[1].data
        this.buyNumList = res[2].data
      })
    },

    // 自定义封装表格绑定的方法 ，只获取表格数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then((res) => {
        res.data.records.forEach((item) => {
          if (item.orderStatus === 'waitbuyerpay') {
            item.orderStatus = '待付款'
          } else {
            item.orderStatus = '已付款'
          }
        })
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
    // 重置
    reset() {
      for (const prop in this.searchData) {
        this.searchData[prop] = ''
      }
      // 让页面跳转到第一页
      this.current = 1
      this.initialization() // 获取表格数据
      this.searchData.auditStatus = '全部'
    }
  }
}
</script>
<style lang="scss" scoped>
.row {
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
