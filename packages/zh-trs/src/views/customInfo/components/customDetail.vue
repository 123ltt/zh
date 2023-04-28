<!-- 创建单个普通Listing -->
<template>
  <basic-container v-loading="productLoading <1">
    <div>
      <el-row :gutter="600">
        <el-col :span="2" style="padding-left:310px;">
          <el-button v-if="!['isView','modify','batchModify'].includes(type)" type="primary" size="small" @click="openPDF(type)">预览</el-button>
        </el-col>
        <el-col :span="15" style="padding-left:704px;">
          <el-button v-if="'isView'!==type" size="small" @click="$emit('close', false)">取消</el-button>
          <el-button v-if="['modify','batchModify'].includes(type)"
                     :loading="saveLoading"
                     type="primary"
                     size="small"
                     @click="save"
          >保存</el-button>
          <el-button v-if="['preReport','batchPreReport'].includes(type)" type="primary" size="small" @click="preReport">预报</el-button>
          <el-button v-if="'doubleCheck'===type" type="primary" size="small" @click="doubleCheck">复核</el-button>
          <el-button v-if="'report'===type" type="primary" size="small" @click="report">报关</el-button>
          <el-button v-if="'preRetax'===type" type="primary" size="small" @click="retax">预退税</el-button>
        </el-col>
      </el-row>
    </div>
    <el-collapse v-model="activeNames" class="add-linsting-box">
      <el-collapse-item name="baseInfo" :disabled="(type==='modify'&&status===0)||(type==='modify'&&status===1)||(type==='batchModify'&&status===0)||(type==='batchModify'&&status===1)||(status === 3 && type === 'report')||(status === 4 && type === 'preRetax')">
        <collapse-title slot="title" title="报关单信息" />
        <base-info v-if="baseProductInfo.declareCustomsBill"
                   ref="baseInfo"
                   v-loading="baseProductInfo.baseLoading<1"
                   v-bind="{ type,status,baseProductInfo }"
        />
      </el-collapse-item>
      <el-collapse-item name="contractInfo" :disabled="(type==='modify'&&status===0)||(type==='modify'&&status===1)||(type==='batchModify'&&status===0)||(type==='batchModify'&&status===1)||(status === 3 && type === 'report')||(status === 4 && type === 'preRetax')">
        <collapse-title slot="title" title="报关合同发票箱单信息" />
        <contract-info v-if="baseProductInfo.contractInvoiceBoxBill"
                       ref="contractInfo"
                       v-loading="baseProductInfo.contractLoading<1"
                       v-bind="{ type,status,baseProductInfo }"
        />
      </el-collapse-item>
      <el-collapse-item name="purchaseInfo" :disabled="(status === 3 && type === 'report')||(status === 4 && type === 'preRetax')||(status === 2 && type === 'doubleCheck')||(status === 1 && type === 'batchPreReport')">
        <collapse-title slot="title" title="采购及产品信息" />
        <purchase-info v-if="baseProductInfo.purchaseProduct"
                       ref="purchaseInfo"
                       v-loading="baseProductInfo.purchaseLoading<1"
                       v-bind="{ type,status,baseProductInfo }"
        />
      </el-collapse-item>
      <el-collapse-item name="outInfo" :disabled="(status === 3 && type === 'report')||(status === 4 && type === 'preRetax')">
        <collapse-title slot="title" title="出库信息" />
        <out-info v-if="baseProductInfo.outWarehouseInfo"
                  ref="outInfo"
                  v-loading="baseProductInfo.outLoading<1"
                  v-bind="{ type,status,baseProductInfo }"
        />
      </el-collapse-item>
      <el-collapse-item name="retaxInfo" :disabled="(type==='modify'&&status===0)||(type==='modify'&&status===1)||(type==='batchModify'&&status===0)||(type==='batchModify'&&status===1)|| (status === 2 && type === 'doubleCheck')||(status === 1 && type === 'preReport')||(status === 1 && type === 'batchPreReport')">
        <collapse-title slot="title" title="退税登记信息" />
        <retax-info v-if="baseProductInfo.taxRebateRegister"
                    ref="retaxInfo"
                    v-loading="baseProductInfo.retaxLoading<1"
                    v-bind="{ type,status,baseProductInfo }"
        />
      </el-collapse-item>
      <el-collapse-item name="operationLog" :disabled="(type==='modify'&&status===0)||(type==='modify'&&status===1)||(type==='batchModify'&&status===0)||(type==='batchModify'&&status===1)||(status === 3 && type === 'report')|| (status === 2 && type === 'doubleCheck')||(status === 4 && type === 'preRetax')||(status === 1 && type === 'preReport')||(status === 1 && type === 'batchPreReport')">
        <collapse-title slot="title" title="操作日志" />
        <operation-log v-if="baseProductInfo.declareCustomsHis"
                       ref="operationLog"
                       v-loading="baseProductInfo.logLoading<1"
                       v-bind="{type,status,baseProductInfo }"
        />
      </el-collapse-item>
    </el-collapse>
  </basic-container>
</template>

<script>
// import { deepClone } from '@/util/util'
import collapseTitle from './collapseTitle.vue'
import baseInfo from './baseInfo.vue'
import contractInfo from './contractInfo.vue'
import purchaseInfo from './purchaseInfo.vue'
import outInfo from './outInfo.vue'
import retaxInfo from './retaxInfo.vue'
import operationLog from '@/views/customInfo/components/operationLog'
import { preRetaxDetail, doubleCheckDetail, doubleCheck, reportDetail, report, retax } from '@/api/preReport'
import { modifyDetail, preReportDetail, preReport, requestDetail, saveData, batchPreReportDetail, saveBatchModifyData, batchPreReport } from '@/api/customDeclare'
export default {
  name: 'CustomDetail',
  components: {
    collapseTitle,
    baseInfo, // 报关单信息
    contractInfo, // 报关合同发票箱单信息
    purchaseInfo, // 采购及产品信息
    outInfo, // 出库信息
    retaxInfo, // 退税登记信息
    operationLog// 操作日志
  },
  props: {
    type: String, // 区分：批量修改、修改、详情、预报、批量预报
    id: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Array,
      default: ''
    }, // 勾选的id string 逗号分隔
    status: Number // 区分状态
  },
  data() {
    return {
      baseProductInfo: {
        declareCustomsBill: null, // 报关信息
        contractInvoiceBoxBill: null, // 合同箱单信息
        purchaseProduct: null, // 采购及产品信息
        outWarehouseInfo: null, // 出库信息,
        taxRebateRegister: null, // 退税登记信息
        declareCustomsHis: null // 日志信息
      },
      activeNames: ['baseInfo', 'contractInfo', 'purchaseInfo', 'outInfo', 'retaxInfo', 'operationLog'], // 折叠面板默认展开
      // 当前翻译语言
      countryCode: '',
      // languages: addListingHandle.languages,
      translate: { loading: false },
      // 产品通用编码
      standardProdcutIdTypeList: ['UPC', 'EAN'],
      // 产品基本信息
      // baseProductInfo: { platformCode: 'EB' },
      // Listing类型 Variation Normal Combo
      listingType: '',
      // 表单label统一宽度
      labelWidth: '150px',
      conditionList: {},
      // 是否有获取到sku信息
      hasSku: true,
      olineResData: null, // 记录在售详情，用于提交时对比
      productLoading: 0,
      saveLoading: false,
      declareCustomsBill: null, // 报关信息
      contractInvoiceBoxBill: null, // 合同箱单信息
      purchaseProduct: null, // 采购及产品信息
      outWarehouseInfo: null, // 出库信息,
      taxRebateRegister: null, // 退税登记信息
      declareCustomsHis: null, // 日志信息
      baseLoading: 0,
      contractLoading: 0,
      purchaseLoading: 0,
      outLoading: 0,
      retaxLoading: 0,
      logLoading: 0,
      verifyResFlag: true, // 表单校验结果
      params: null
    }
  },
  computed: {
  },
  created() {
    // 0,待审核 01,待预报 02,待复核; 3,待报关；4,待预退；5,提交退税
    // console.log('id', this.id)
    console.log('status', this.status)
    console.log('type', this.type)
    console.log('id=============', this.id)
    // this.activeNames = ['baseInfo', 'contractInfo', 'purchaseInfo', 'outInfo', 'retaxInfo', 'operationLog']
    if ((this.status === 0 && this.type === 'modify') ||
    (this.status === 0 && this.type === 'batchModify') ||
     (this.status === 1 && this.type === 'modify') ||
      (this.status === 1 && this.type === 'batchModify')
    ) {
      this.activeNames = ['purchaseInfo']
    }
    if ((this.status === 3 && this.type === 'report') ||
    (this.status === 4 && this.type === 'preRetax')
    ) {
      this.activeNames = ['retaxInfo']
    }
    if ((this.status === 1 && this.type === 'preReport')) {
      this.activeNames = ['baseInfo', 'contractInfo', 'purchaseInfo', 'outInfo']
    }
    if ((this.status === 1 && this.type === 'batchPreReport') || (this.status === 2 && this.type === 'doubleCheck')) {
      this.activeNames = ['baseInfo', 'contractInfo', 'outInfo']
    }
    this.type === 'preRetax' && this.getPreRetaxDetail(this.id) // 预退税
    this.type === 'doubleCheck' && this.getDoubleCheckDetail(this.id) // 复核
    this.type === 'report' && this.getReportDetail(this.id) // 报关
    this.type === 'modify' && this.getModifyDetail(this.id) // 修改
    this.type === 'preReport' && this.getPreReportDetail(this.id) // 预报关
    this.type === 'isView' && this.getDetail(this.id) // 详情
    this.type === 'batchPreReport' && this.getBatchPreReportDetail(this.id) // 批量预报
    this.type === 'batchModify' && this.getBatchModifyDetail(this.id) // 批量修改
  },
  methods: {
    // 预览
    openPDF(type) {
      this.$newPage({
        path: '/trs/preCustom/preview',
        data: {
          no: this.id,
          type: type
        }
      })
    },
    // 预退税-详情
    getPreRetaxDetail(id) {
      const contractAgreementNo = id
      preRetaxDetail({ contractAgreementNo }).then(res => {
        if (res.code === 200) {
          res = res.data
          this.baseProductInfo = {
            ...res,
            retaxLoading: 1,
            productLoading: 1
          }
          this.retaxLoading = 1
          this.productLoading = 1
        }
      })
    },
    // 复核-详情
    getDoubleCheckDetail(id) {
      const contractAgreementNo = id
      doubleCheckDetail({ contractAgreementNo }).then(res => {
        if (res.code === 200) {
          res = res.data
          this.baseProductInfo = {
            ...res,
            baseLoading: 1,
            contractLoading: 1,
            outLoading: 1,
            productLoading: 1
          }
          this.baseLoading = 1
          this.contractLoading = 1
          this.outLoading = 1
          this.productLoading = 1
        }
      })
    },
    // 报关-详情
    getReportDetail(id) {
      const contractAgreementNo = id
      reportDetail({ contractAgreementNo }).then(res => {
        if (res.code === 200) {
          res = res.data
          this.baseProductInfo = {
            taxRebateRegister: res.taxRebateRegister,
            retaxLoading: 1,
            productLoading: 1
          }
          this.retaxLoading = 1
          this.productLoading = 1
        }
      })
    },
    // 修改详情
    getModifyDetail(id) {
      modifyDetail({ id }).then(res => {
        if (res.code === 200) {
          res = res.data
          this.baseProductInfo = {
            ...res,
            retaxLoading: 1,
            productLoading: 1
          }
          this.retaxLoading = 1
          this.productLoading = 1
        }
      })
    },
    // 预报详情
    getPreReportDetail(id) {
      preReportDetail({ id }).then(res => {
        if (res.code === 200) {
          res = res.data
          this.baseProductInfo = {
            ...res,
            baseLoading: 1,
            contractLoading: 1,
            purchaseLoading: 1,
            outLoading: 1,
            productLoading: 1
          }
          this.baseLoading = 1
          this.contractLoading = 1
          this.purchaseLoading = 1
          this.outLoading = 1
          this.productLoading = 1
        }
      })
    },
    // 批量预报详情
    getBatchPreReportDetail(id) {
      batchPreReportDetail({ }).then(res => {
        if (res.code === 200) {
          res = res.data
          this.baseProductInfo = {
            ...res,
            baseLoading: 1,
            contractLoading: 1,
            outLoading: 1,
            productLoading: 1
          }
          this.baseLoading = 1
          this.contractLoading = 1
          this.outLoading = 1
          this.productLoading = 1
        }
      })
    },
    // 详情
    getDetail(id) {
      requestDetail({ id }).then(res => {
        if (res.code === 200) {
          res = res.data
          this.baseProductInfo = {
            ...res,
            baseLoading: 1,
            contractLoading: 1,
            purchaseLoading: 1,
            outLoading: 1,
            logLoading: 1,
            productLoading: 1
          }
          this.baseLoading = 1
          this.contractLoading = 1
          this.purchaseLoading = 1
          this.outLoading = 1
          this.logLoading = 1
          this.productLoading = 1
        }
      })
    },
    // 批量修改-详情
    getBatchModifyDetail() {
      this.baseProductInfo = {
        purchaseProduct: {},
        outWarehouseInfo: {},
        purchaseLoading: 1,
        outLoading: 1,
        productLoading: 1
      }
      this.purchaseLoading = 1
      this.outLoading = 1
      this.productLoading = 1
    },
    // 复核
    async doubleCheck() {
      await this.pubVerify(this.type)
      const params = {
        contractInvoiceBoxBill: this.baseProductInfo.contractInvoiceBoxBill,
        declareCustomsBill: this.baseProductInfo.declareCustomsBill,
        outWarehouseInfo: this.baseProductInfo.outWarehouseInfo
      }
      this.verifyResFlag === true && await doubleCheck(params).then(res => { // 表单校验通过才发请求
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.$emit('close', true)
        } else {
          this.$message.error(res.msg || '复核失败')
        }
      })
    },
    // 预报
    async preReport() {
      if (this.type === 'preReport') {
        await this.pubVerify(this.type)
        const params = {
          contractInvoiceBoxBill: this.baseProductInfo.contractInvoiceBoxBill,
          declareCustomsBill: this.baseProductInfo.declareCustomsBill,
          outWarehouseInfo: this.baseProductInfo.outWarehouseInfo,
          purchaseProduct: this.baseProductInfo.purchaseProduct
        }
        this.verifyResFlag === true && await preReport(params).then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.$emit('close', true)
          } else {
            this.$message.error(res.msg || '预报失败')
          }
        })
      } else {
        await this.pubVerify(this.type)
        const params = {
          contractInvoiceBoxBill: this.baseProductInfo.contractInvoiceBoxBill,
          declareCustomsBill: this.baseProductInfo.declareCustomsBill,
          outWarehouseInfo: this.baseProductInfo.outWarehouseInfo,
          ids: this.id
        }
        this.verifyResFlag === true && batchPreReport(params).then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.$emit('close', true)
          } else {
            this.$message.error(res.msg || '批量预报失败')
          }
        })
      }
    },
    // 报关
    async report() {
      await this.pubVerify(this.type)
      this.baseProductInfo.taxRebateRegister.contractAgreementNo = this.id
      const params = {
        taxRebateRegister: this.baseProductInfo.taxRebateRegister
      }
      this.verifyResFlag === true && await report(params).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.$emit('close', true)
        } else {
          this.$message.error(res.msg || '报关失败')
        }
      })
    },
    // 退税
    retax() {
      const params = {
        taxRebateRegister: this.baseProductInfo.taxRebateRegister
      }
      retax(params).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.$emit('close', true)
        } else {
          this.$message.error(res.msg || '退税失败')
        }
      })
    },
    // 保存
    save() {
      if (this.type === 'modify') { // 修改
        const params = {
          outWarehouseInfo: this.baseProductInfo.outWarehouseInfo,
          purchaseProduct: this.baseProductInfo.purchaseProduct
        }
        saveData(params).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功')
            this.$emit('close', true)
          } else {
            this.$message.error(res.msg || '保存失败')
          }
        })
      } else { // 批量修改
        const params = {
          ids: this.id,
          outWarehouseInfo: this.baseProductInfo.outWarehouseInfo,
          purchaseProduct: this.baseProductInfo.purchaseProduct
        }
        saveBatchModifyData(params).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功')
            this.$emit('close', true)
          } else {
            this.$message.error(res.msg || '保存失败')
          }
        })
      }
    },
    // 表单校验公共方法
    pubVerify(type) {
      const refs = this.$refs
      let validStatu = true
      let vaildes = []
      if (type === 'report') {
        vaildes = ['retaxInfo']
      }
      if (type === 'doubleCheck') {
        vaildes = ['outInfo']
      }
      if (type === 'preReport') {
        vaildes = ['baseInfo', 'contractInfo', 'purchaseInfo', 'outInfo']
      }
      if (type === 'batchPreReport') {
        vaildes = ['baseInfo', 'contractInfo', 'outInfo']
      }
      for (const item of vaildes) {
        refs[item].$refs.form.validate(valid => {
          if (!valid) {
            validStatu = false
          }
        })
      }
      console.log('validStatu', validStatu)
      if (!validStatu) {
        this.verifyResFlag = false
        this.$message.error('请根据提示完成表单')
        return false
      }
      this.verifyResFlag = true
    }
  }
}
</script>

<style lang="scss" scoped>
.add-linsting-box{
  padding: 10px 10px 45px 10px;
}
.el-collapse {
  border-top: 0;
  border-bottom: 0;
}
::v-deep .el-collapse-item__wrap, ::v-deep .el-collapse-item__header {
  border-bottom: 0;
}
::v-deep .el-collapse-item__content {
  padding-top: 10px;
  padding-bottom: 0;
}
.isFixed{
  position: fixed;
  bottom: 10px;
  z-index: 101;
  margin-left: 20%;
  .el-select{
    margin: 0 10px;
  }
}
</style>
