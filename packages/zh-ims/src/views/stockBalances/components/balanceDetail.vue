<template>
  <!-- 库存结存详情 -->
  <basic-container ref="box">
    <el-card ref="infoBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="100px" size="mini" class="no-message" :model="detailData">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="产品编码">
              <el-input :value="detailData.productSku" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称">
              <el-input :value="detailData.skuInfo.productName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品类目">
              <el-input :value="detailData.skuInfo.categoryName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库类型">
              <el-input :value="detailData.warehouse.warehouseType.desc" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库归属">
              <el-input :value="warehouseBelongObj[detailData.warehouse.warehouseBelong] " disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库名称">
              <el-input :value="detailData.warehouse.warehouseName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货权">
              <el-input :value="detailData.productAuthName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货主">
              <el-input :value="detailData.productOwnerName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存期间">
              <el-input :value="detailData.stockPeriod" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="期初库存">
              <el-input :value="detailData.openingStockQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="新进库存">
              <el-input :value="detailData.ingoingStockQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库库存">
              <el-input :value="detailData.outStockQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售库存">
              <el-input :value="detailData.salesStockQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="期末库存">
              <el-input :value="detailData.endingStockQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="周转天数">
              <el-input :value="detailData.cycleDays" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">结存单据</span>
      </div>
      <div :style="{ height: maxHeight + 'px' }">
        <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
          <template slot="header">
            <el-form label-width="100px" size="mini" class="no-message" :model="submit">
              <el-row>
                <el-col :span="6">
                  <el-form-item prop="businessType" label="业务类型">
                    <el-select v-model="submit.businessType" clearable placeholder="请选择" filterable style="width:100%">
                      <el-option v-for="item in businessTypeList" :key="item.value" :label="item.desc" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="业务单号">
                    <el-input v-model.trim="submit.businessCode" clearable placeholder="请填写" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                    <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>

          <el-table-column slot="quantity" align="center" min-width="150">
            <template slot="header">
              <span>数量  </span><span style="color:blue">  合计：{{ detailData.totalStockQty }}</span>
            </template>
            <template v-slot="{row}">
              <span>{{ row.quantity }}</span>
            </template>
          </el-table-column>

        </g-table>
      </div>
    </el-card>
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/stockBalances/balance.js'
import { getType } from '@/api/public/public.js'

export default {
  name: 'BalanceDetail',
  props: {
    detailData: Object,
    warehouseBelongObj: Object
  },
  data() {
    return {
      submit: {
        businessType: '',
        businessCode: '',
        productAuthId: '',
        stockPeriod: '',
        productOwnerId: '',
        productSku: '',
        warehouseId: ''
      },
      businessTypeList: [],
      maxHeight: '',
      searchData: {},
      // 表格数据
      headers: [
        {
          label: '业务类型',
          prop: 'businessType.desc',
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '业务单号',
          prop: 'businessCode',
          minWidth: '250px',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          slot: true,
          slotName: 'quantity'
        },
        {
          label: '添加时间',
          prop: 'addTime',
          minWidth: '150px',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      const allHeight = this.$refs.box.$el.clientHeight
      const infoHeight = this.$refs.infoBox.$el.clientHeight || 0
      this.maxHeight = allHeight - infoHeight - 70
    })
    this.getData()
    this.giveData()
    this.initialization()
  },
  methods: {
    getData() {
      // 仓库类型
      getType('QUANTITY_BALANCE').then(res => {
        this.businessTypeList = res.data
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return getDetail(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.$refs.table.load(1, this.searchData)
    },
    search() {
      this.initialization()
    },
    giveData() {
      Object.keys(this.submit).forEach(item => {
        if (item !== 'businessType' && item !== 'businessCode') {
          this.submit[item] = this.detailData[item]
        }
      })
    },
    reset() {
      this.submit.businessType = ''
      this.submit.businessCode = ''
      this.initialization()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
