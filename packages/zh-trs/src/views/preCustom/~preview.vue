<template>
  <PdfViewer :blob="blob" />
</template>

<script>
import { openPDF, openPreReportPDF, openBatchPreReportPDF, openDoubleCheckPDF, openReportPDF, openPreRetaxtPDF, doubleCheckDetail, preRetaxDetail, reportDetail } from '@/api/preReport'
import { preReportDetail, batchPreReportDetail } from '@/api/customDeclare'
import PdfViewer from '@/components/pdf-viewer/index.vue'

export default {
  components: { PdfViewer },
  props: {
    id: String,
    no: String,
    type: String
  },
  data() {
    return {
      blob: null,
      pdfParams: null
    }
  },
  created() {
    !this.type && openPDF({ id: this.id }).then(res => { // 预报关列表-预览
      this.blob = res
    })
    this.type === 'preReport' && preReportDetail({ id: this.no }).then(res => {
      if (res.code === 200) {
        res = res.data
        this.pdfParams = {
          contractInvoiceBoxBill: res.contractInvoiceBoxBill,
          declareCustomsBill: res.declareCustomsBill,
          outWarehouseInfo: res.outWarehouseInfo,
          purchaseProduct: res.purchaseProduct
        }
        openPreReportPDF(this.pdfParams).then(res => { // 预报-预览
          this.blob = res
        })
      }
    })
    this.type === 'batchPreReport' && batchPreReportDetail({ }).then(res => {
      if (res.code === 200) {
        res = res.data
        this.pdfParams = {
          contractInvoiceBoxBill: res.contractInvoiceBoxBill,
          declareCustomsBill: res.declareCustomsBill,
          outWarehouseInfo: res.outWarehouseInfo,
          ids: this.no.split(',')
        }
        this.pdfParams = Object.assign(this.pdfParams, {
          purchaseProduct: {},
          taxRebateRegister: {}
        })
        openBatchPreReportPDF(this.pdfParams).then(res => { // 批量预报-预览
          this.blob = res
        })
      }
    })
    this.type === 'doubleCheck' && doubleCheckDetail({ contractAgreementNo: this.no }).then(res => {
      if (res.code === 200) {
        res = res.data
        this.pdfParams = {
          contractInvoiceBoxBill: res.contractInvoiceBoxBill,
          declareCustomsBill: res.declareCustomsBill,
          outWarehouseInfo: res.outWarehouseInfo
        }
        openDoubleCheckPDF(this.pdfParams).then(res => { // 复核-预览
          this.blob = res
        })
      }
    })
    this.type === 'report' && reportDetail({ contractAgreementNo: this.no }).then(res => {
      if (res.code === 200) {
        res = res.data
        this.pdfParams = {
          taxRebateRegister: res.taxRebateRegister
        }
        openReportPDF(this.pdfParams).then(res => { // 报关-预览
          this.blob = res
        })
      }
    })
    this.type === 'preRetax' && preRetaxDetail({ contractAgreementNo: this.no }).then(res => {
      if (res.code === 200) {
        res = res.data
        this.pdfParams = {
          taxRebateRegister: res.taxRebateRegister
        }
        openPreRetaxtPDF(this.pdfParams).then(res => { // 预退税-预览
          this.blob = res
        })
      }
    })
  },
  methods: {
  }
}
</script>
