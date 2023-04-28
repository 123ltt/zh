<template>
  <!-- 可用库存详情 -->
  <basic-container ref="box" v-loading="loading">
    <el-collapse v-model="activeName" @change="handleChange">
      <el-collapse-item ref="basis" title="基本信息" name="1">
        <el-form label-width="100px" size="mini" class="no-message" :model="detailData" disabled>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="产品编码">
                <el-input :value="detailData.productSku" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品名称">
                <el-input :value="detailData.skuInfo.productName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品类目">
                <el-input :value="detailData.skuInfo.categoryName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓库类型">
                <el-input :value="detailData.warehouse.warehouseType.desc" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓库归属">
                <el-input :value="warehouseBelongObj[detailData.warehouse.warehouseBelong]" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓库名称">
                <el-input :value="detailData.warehouse.warehouseName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货权">
                <el-input :value="detailData.productAuthName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货主">
                <el-input :value="detailData.productOwnerName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="库位号">
                <el-input :value="detailData.stockLocationOutsideCode" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="可用库存">
                <el-input :value="detailData.availableQty" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-tabs v-model="tableName" type="card" @tab-click="handleChange">
        <el-tab-pane label="库存明细" name="1">
          <div :style="{ height: maxHeight + 'px' }">
            <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
              <template slot="header">
                <el-form label-width="80px" size="mini" class="no-message">
                  <el-row>
                    <el-col :span="9">
                      <el-form-item prop="businessType" label="业务类型">
                        <el-select v-model="submit.businessType" clearable placeholder="请选择" filterable style="width:80%">
                          <el-option v-for="item in businessTypeList" :key="item.value" :label="item.desc" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item prop="businessCode" label="业务单号">
                        <el-input v-model.trim="submit.businessCode" clearable placeholder="请填写" style="width:80%" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item prop="operationCode" label="操作单号">
                        <el-input v-model.trim="submit.operationCode" clearable placeholder="请填写" style="width:80%" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item prop="operationType" label="操作逻辑">
                        <el-select v-model="submit.operationType" clearable placeholder="请选择" filterable style="width:80%">
                          <el-option v-for="item in operationTypeList" :key="item.value" :label="item.desc" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-button type="primary" size="mini" icon="el-icon-search" @click="initialization">查询</el-button>
                        <el-button icon="el-icon-delete" size="mini" @click="reset">重置</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>

              <!-- 操作数量 -->
              <el-table-column slot="operationQty" label="操作数量" width="100" align="center">
                <template v-slot="{row}">
                  <span v-if="row.operationType.desc == '上架'||row.operationType.desc == '解冻'" style="color:red;"> + {{ row.operationQty }}</span>
                  <span v-if="row.operationType.desc == '下架'||row.operationType.desc == '冻结'||row.operationType.desc == '占用'" style="color:green;"> - {{ row.operationQty }}</span>
                </template>
              </el-table-column>
            </g-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="校正明细分页" name="2">
          <div :style="{ height: maxHeight + 'px' }">
            <g-table ref="correctTable" :headers="correctheaders" :fetch="correctfetch" row-key="id">
              <template slot="header">
                <el-form label-width="100px" size="mini" class="no-message">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item prop="operationCode" label="操作单号">
                        <el-input v-model.trim="correctSubmit.checkCode" clearable placeholder="请填写" style="width:80%" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item prop="businessType" label="明细操作类型">
                        <el-select v-model="correctSubmit.detailOperationType" clearable placeholder="请选择" filterable style="width:80%">
                          <el-option v-for="item in operationTypeList" :key="item.value" :label="item.desc" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item prop="operationType" label="主表操作类型">
                        <el-select v-model="correctSubmit.mainOperationType" clearable placeholder="请选择" filterable style="width:80%">
                          <el-option v-for="item in operationTypeList" :key="item.value" :label="item.desc" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-button type="primary" size="mini" icon="el-icon-search" @click="correctTable">查询</el-button>
                        <el-button icon="el-icon-delete" size="mini" @click="correctReset">重置</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>

              <!-- 操作数量 -->
              <el-table-column slot="detailOperationQty" label="明细表操作数量" min-width="150" align="center">
                <template v-slot="{row}">
                  <span>{{ (+row.detailOperationQty)>0?row.detailOperationQty:'' }}</span>
                </template>
              </el-table-column>

            </g-table>
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-collapse>
  </basic-container>
</template>

<script>
import { getDetail, getListDetail, getDetailList, getType, getOperationType } from '@/api/stock/availableStock.js'
export default {
  name: 'AvailableStockDetails',
  props: {
    openData: Object,
    warehouseBelongObj: Object
  },
  data() {
    return {
      loading: true,
      recordData: [],
      activeName: ['1'],
      tableName: '1',
      submit: {
        stockLocationOutsideCode: this.openData.stockLocationOutsideCode,
        stockId: this.openData.stockId,
        businessType: '',
        businessCode: '',
        operationCode: '',
        operationType: ''
      },
      correctSubmit: {
        stockId: this.openData.stockId,
        checkCode: '',
        detailOperationType: '',
        mainOperationType: ''
      },
      searchData: {},
      maxHeight: '',
      businessTypeList: [],
      operationTypeList: [],
      detailData: {
        skuInfo: { categoryName: '', productName: '' },
        warehouse: {
          warehouseType: { desc: '' },
          warehouseBelong: '',
          warehouseName: ''
        }
      },
      // 表格数据
      headers: [
        {
          label: '业务类型',
          prop: 'businessType.desc',
          width: '100px',
          align: 'center'
        },
        {
          label: '业务单号',
          prop: 'businessCode',
          showOverflowTooltip: true,
          minWidth: '200px',
          align: 'center'
        },
        {
          label: '操作逻辑',
          prop: 'operationType.desc',
          width: '100px',
          align: 'center'
        },
        {
          label: '操作单号',
          prop: 'operationCode',
          showOverflowTooltip: true,
          minWidth: '200px',
          align: 'center'
        },
        {
          label: '操作日期',
          prop: 'operationDate',
          width: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'operationQty'
        },
        {
          label: '批次号',
          prop: 'batchCode',
          showOverflowTooltip: true,
          width: '150px',
          align: 'center'
        },
        {
          label: '可用库存',
          prop: 'availableBalanceQty',
          width: '80px',
          align: 'center'
        }
      ],
      correctheaders: [
        {
          label: '库存校正单号',
          prop: 'checkCode',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '主表操作类型',
          prop: 'mainOperationType.desc',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '主表操作数量',
          prop: 'mainOperationQty',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '明细表操作类型',
          prop: 'detailOperationType.desc',
          minWidth: '150px',
          align: 'center'
        },
        {
          slotName: 'detailOperationQty',
          slot: true
        },
        {
          label: '可用库存',
          prop: 'wmsAvailableStock',
          minWidth: '150px',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.basisHeight = this.$refs.basis.$el.clientHeight
      this.maxHeight = this.$refs.box.$el.clientHeight - this.basisHeight - 80
    })
    this.getDetail()
    this.initialization()
    this.correctTable()
  },
  methods: {
    getDetail() {
      this.loading = true
      getType('AVAILABLE').then(res => {
        this.businessTypeList = res.data
      })
      getOperationType().then(res => {
        this.operationTypeList = res.data
      })
      getDetail({ id: this.openData.stockId, stockLocationOutsideCode: this.openData.stockLocationOutsideCode }).then(res => {
        this.detailData = res.data
        this.loading = false
      })
    },
    fetch({ current, size }, params) {
      return getListDetail(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    correctfetch({ current, size }, params) {
      return getDetailList(current, size, params).then(res => {
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
    correctTable() {
      this.correctSearch = JSON.parse(JSON.stringify(this.correctSubmit))
      this.$refs.correctTable.load(1, this.correctSearch)
    },
    //   重置
    correctReset() {
      Object.keys(this.correctSubmit).forEach(item => {
        if (item !== 'stockId') {
          this.correctSubmit[item] = ''
        }
      })
      this.correctTable()
    },
    //   重置
    reset() {
      Object.keys(this.submit).forEach(item => {
        if (item !== 'stockLocationOutsideCode' && item !== 'stockId') {
          this.submit[item] = ''
        }
      })
      this.initialization()
    },
    handleChange(val) {
      if (this.activeName.indexOf('1') === -1) {
        this.maxHeight = this.$refs.box.$el.clientHeight - 160
      } else {
        this.maxHeight = this.$refs.box.$el.clientHeight - this.basisHeight - 80
      }

      this.$nextTick(() => {
        this.$refs.table.updateTableHeight()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-collapse-item__header{
  padding: 0 30px;
  font-weight: 600;
  ::v-deep .el-collapse-item__arrow{
    margin: 0 auto 0 20px;
    font-weight: 600;
  }
}
</style>
