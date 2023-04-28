<template>
  <g-table ref="tableRef"
           stripe
           border
           :headers="headers"
           :fetch="fetch"
           :header-cell-style="{'text-align':'center'}"
           :cell-style="{'text-align':'center'}"
           @selection-change="handleSelectionChange"
  >
    <template #header>
      <el-form size="mini" :model="formInfo" label-width="150px" class="form-col no-message">
        <el-row type="flex">
          <el-col>
            <el-form-item label="主账户">
              <el-input v-model="formInfo.mainAccountNumber" clearable class="small" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="账户类型">
              <el-select v-model="formInfo.joomType" clearable placeholder="请选择">
                <el-option v-for="item in billOptions"
                           :key="item"
                           :label="item"
                           :value="item"
                />
              </el-select>

            </el-form-item>

          </el-col>

        </el-row>
        <el-row type="flex">
          <el-col>

            <el-form-item>
              <div slot="label">

                <el-select v-model="formInfo.dateType" placeholder="请选择" style="width:100px !important">
                  <el-option
                    v-for="item in dateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    clearable
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
              <el-button v-if="formInfo.joomType=='AD'||formInfo.joomType=='JLD'" size="mini" type="primary" @click="search">查询</el-button>
              <el-button v-if="formInfo.joomType=='AD'||formInfo.joomType=='JLD'" size="mini" type="primary" @click="reset">重置
              </el-button>

            </el-form-item>

          </el-col>
          <el-col>
            <el-form-item label="文件名称">
              <el-input v-model="formInfo.fileName" placeholder="多个用英文逗号隔开" class="small" />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row type="flex">
          <el-col>
            <el-form-item v-if="formInfo.joomType!=='AD'&&formInfo.joomType!=='JLD'" label="店铺编码">
              <el-select v-model="formInfo.storeName" clearable placeholder="请选择" filterable>
                <el-option
                  v-for="item in storeList"
                  :key="item"
                  :label="item"
                  :value="item"
                  clearable
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="formInfo.joomType!=='AD'&&formInfo.joomType!=='JLD'" label="平台订单号">
              <el-input v-model="formInfo.reference" placeholder="多个用英文逗号隔开" class="small" clearable />
              <el-button size="mini" type="primary" @click="search">查询</el-button>
              <el-button size="mini" type="primary" @click="reset">重置</el-button>
            </el-form-item>

          </el-col>

        </el-row>
      </el-form>
      <handel-download :all-data="allData" :part-data="exportData" :headers="headers" @getAllData="getAllData" />
    </template>
    <el-table-column slot="product" label="Product">
      <template v-slot="{row}">
        <g-link :href="row.product">product</g-link>
      </template>
    </el-table-column>
    <el-table-column slot="refundFraction" label="Refunded Fraction">
      <template v-slot="{row}">
        <span>{{ row.refundFraction*100+"%" }}</span>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { getJoomJld, getJoomStore, getJoomDetailR, getJoomDetailAd, getJoomDetailCm } from '@/api/joom/joom'
import handelDownload from '@/views/components/handelDownload'
import { filterData } from '../../../../utils/filterData'

export default {
  name: 'JoomDetail',
  components: { handelDownload },

  data() {
    return {
      allData: [],
      exportData: [], // 导出数据
      downloadLoading: '',
      formInfo: this.getFormInfo(),
      dateTime: [],
      fn: getJoomDetailR, // 接口名

      headers: [],
      storeList: [],
      billOptions: ['R', 'RCM', 'JLD', 'AD', 'RJL', 'RJLCM', 'JLO', 'JLOCM', 'JLNDI'],
      dateOptions: [{ label: '账单日期', value: 1 }, { label: '日期', value: 2 }],

      headersr: [
        { width: '55', type: 'selection' },
        { label: '主账户', prop: 'mainAccountNumber' },
        { label: '店铺编码', prop: 'storeName' },
        { label: '账单日期', prop: 'accountingPeriod' },
        { label: '币种', prop: 'currency' },
        { label: '账单类型', prop: 'joomType' },
        { label: '类型', prop: 'subType' },

        { label: 'Shipment Date, UTC', prop: 'operationDate', width: '100' },
        { label: 'Reference', prop: 'reference' },
        { label: 'Amount Due To Merchant, $', prop: 'dueToMerchant', width: '150' },

        { label: 'Order Amount, $', prop: 'orderAmount' },
        { label: 'Original Amount, $', prop: 'originalAmount' },
        {
          slot: true, slotName: 'product'
        },
        { label: 'Address', prop: 'address' },
        { label: '文件名称', prop: 'fileName' }
      ],
      headersrcm: [
        { width: '55', type: 'selection' },

        { label: '主账户', prop: 'mainAccountNumber' },
        { label: '店铺编码', prop: 'storeName' },
        { label: '账单日期', prop: 'accountingPeriod' },
        { label: '币种', prop: 'currency' },
        { label: '账单类型', prop: 'joomType' },
        { label: '类型', prop: 'subType' },
        { label: 'Shipment Date, UTC', prop: 'operationDate', width: '100' },
        { label: 'Refund Date, UTC', prop: 'refundDate' },
        { label: 'Reference', prop: 'reference' },
        { label: 'Amount Due To Merchant, $', prop: 'dueToMerchant', width: '150' },
        { label: 'Order Amount, $', prop: 'orderAmount' },
        { label: 'Original Amount, $', prop: 'originalAmount' },
        // { label: 'Refunded Fraction', prop: 'refundFraction' },
        {
          slot: true, slotName: 'refundFraction'
        },
        {
          slot: true, slotName: 'product'
        },
        { label: 'Address', prop: 'address' },
        { label: '文件名称', prop: 'fileName' }

      ],
      headersjlocm: [
        { width: '55', type: 'selection' },

        { label: '主账户', prop: 'mainAccountNumber' },
        { label: '店铺编码', prop: 'storeName' },
        { label: '账单日期', prop: 'accountingPeriod' },
        { label: '币种', prop: 'currency' },
        { label: '账单类型', prop: 'joomType' },
        { label: '类型', prop: 'subType' },
        { label: 'Shipment Date, UTC', prop: 'operationDate', width: '100' },
        { label: 'Refund Date, UTC', prop: 'refundDate' },
        { label: 'Reference', prop: 'reference' },
        { label: 'Amount Due From Merchant, $', prop: 'dueFromMerchant', width: '150' },
        { label: 'Order Amount, $', prop: 'orderAmount' },
        { label: 'Original Amount, $', prop: 'originalAmount' },

        {
          slot: true, slotName: 'refundFraction'
        },
        {
          slot: true, slotName: 'product'
        },
        { label: 'Address', prop: 'address' },
        { label: '文件名称', prop: 'fileName' }

      ],
      headersad: [
        { width: '55', type: 'selection' },

        { label: '主账户', prop: 'mainAccountNumber' },

        { label: '账单日期', prop: 'accountingPeriod' },
        { label: '币种', prop: 'currency' },
        { label: '账单类型', prop: 'joomType' },
        { label: '类型', prop: 'subType' },
        { label: 'Date', prop: 'advertDate' },
        { label: 'Campaign Name', prop: 'campaignName' },
        { label: 'IDCampaign ID', prop: 'campaignId' },
        { label: 'Operation Type', prop: 'operationType' },
        { label: 'Amount Due From Merchant, $', prop: 'dueFromMerchant', width: '150' },
        { label: '文件名称', prop: 'fileName' }

      ],
      headersjld: [
        { width: '55', type: 'selection' },

        { label: '主账户', prop: 'mainAccountNumber' },

        { label: '账单日期', prop: 'accountingPeriod' },
        { label: '币种', prop: 'currency' },
        { label: '账单类型', prop: 'joomType' },
        { label: '类型', prop: 'subType' },
        { label: 'Operation Date, UTC', prop: 'operationDate' },
        { label: 'Amount Due From Merchant, $', prop: 'dueFromMerchant', width: '150' },
        { label: 'Reference', prop: 'reference' },
        { label: 'Original Tracking Number', prop: 'originalTrackingNumber' },
        { label: 'Shipper Name', prop: 'shipperName', width: '100' },
        { label: 'Tracking Number', prop: 'trackingNumber' },
        { label: 'Weight, kg', prop: 'weight' },
        { label: '文件名称', prop: 'fileName' }

      ],
      headersjlndi: [
        { width: '55', type: 'selection' },

        { label: '主账户', prop: 'mainAccountNumber' },
        { label: '店铺编码', prop: 'storeName' },
        { label: '账单日期', prop: 'accountingPeriod' },
        { label: '币种', prop: 'currency' },
        { label: '账单类型', prop: 'joomType' },
        { label: 'Shipment Date, UTC', prop: 'operationDate', width: '150' },
        { label: 'Refund Date, UTC', prop: 'refundDate', width: '150' }, //
        { label: 'Reference', prop: 'reference', width: '150' },
        { label: 'Amount Due To Merchant,$', prop: 'dueToMerchant', width: '150' },
        {
          slot: true, slotName: 'product'
        },
        { label: 'Address', prop: 'address' },
        { label: '文件名称', prop: 'fileName' }

      ]

    }
  },
  watch: {
    'formInfo.joomType': function(val) {
      this.$refs.tableRef.tableList = []
      if (val === 'AD') {
        this.formInfo.storeName = ''
        this.formInfo.reference = ''
        this.headers = this.headersad
        this.fn = getJoomDetailAd
      } else if (val === 'JLD') {
        this.formInfo.storeName = ''
        this.formInfo.reference = ''
        this.headers = this.headersjld
        this.fn = getJoomJld
      } else if (val === 'RCM' || val === 'RJLCM') {
        this.headers = this.headersrcm
        this.fn = getJoomDetailCm
      } else if (val === 'JLOCM') {
        this.headers = this.headersjlocm
        this.fn = getJoomDetailCm
      } else if (val === 'JLNDI') {
        this.headers = this.headersjlndi
        this.fn = getJoomDetailCm
      } else {
        this.headers = this.headersr
        this.fn = getJoomDetailR
      }
      this.$nextTick(() => {
        this.$refs.tableRef.$refs.tableRef.doLayout()
      })
      this.$refs.tableRef.load(1, this.formInfo)
    }
  },
  created() {
    this.headers = this.headersr
  },

  mounted() {
    this.getData()
    this.init()
  },
  methods: {
    getAllData() {
      this.fn(1, 50000, this.formInfo).then(res => {
        // res.data.records.forEach(item => {
        // item.dueToMerchant = Number(item.dueToMerchant).toFixed(2)
        // item.orderAmount = Number(item.orderAmount).toFixed(2)
        // item.originalAmount = Number(item.originalAmount).toFixed(2)
        // })
        this.allData = res.data.records
      })
    },
    getFormInfo() {
      return {

        joomType: 'R',
        mainAccountNumber: '',
        reference: '',
        storeName: '',
        dateType: 1,
        fileName: ''

      }
    },
    // 选择获取数据
    handleSelectionChange(val) {
      this.exportData = val
    },
    // 重置
    reset() {
      this.dateTime = []
      this.formInfo = {
        reference: '',
        storeName: ''
      }
      this.$nextTick(() => {
        this.init()
      })
    },
    // 搜索
    search() {
      this.init()
    },
    fetch({ current, size }, params) {
      return this.fn(current, size, params).then(res => {
        // res.data.records.forEach(item => {
        //   item.dueToMerchant = Number(item.dueToMerchant).toFixed(2)
        //   item.orderAmount = Number(item.orderAmount).toFixed(2)
        //   item.originalAmount = Number(item.originalAmount).toFixed(2)
        // })
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    getData() {
      getJoomStore().then(res => {
        this.storeList = res.data
      })
    },
    init() {
      this.formInfo.startDate = this.dateTime?.[0]
      this.formInfo.endDate = this.dateTime?.[1]?.replace(/00:00:00/, '23:59:59')
      this.$refs.tableRef.load(1, this.formInfo)
    }

  }
}
</script>

<style scoped lang="scss">
.small{

  width:245px!important;
}
.g-select {
  width:50%;
}
.el-select{
  width:245px!important;
}
.el-date-editor--daterange.el-input__inner{
   width: 245px  !important;
 }

.clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
