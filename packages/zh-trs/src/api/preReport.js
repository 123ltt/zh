import request from '@/router/axios'
/**
 * 预报关单列表
 */
export function preReportList(params) {
  return request.$trs({
    url: '/preDeclareCustoms/list',
    method: 'get',
    params
  })
}

// 删除
export function rowDelete(ids) {
  return request.$trs({
    url: '/preDeclareCustoms/remove',
    method: 'post',
    params: { ids }
  })
}

// 预退税-编辑页
export function preRetaxDetail(params) {
  return request.$trs({
    url: '/preDeclareCustoms/preTaxRebateDetail',
    method: 'get',
    params: { ...params }
  })
}

// 复核-编辑页
export function doubleCheckDetail(params) {
  return request.$trs({
    url: '/preDeclareCustoms/reviewDetail',
    method: 'get',
    params: { ...params }
  })
}

// 报关-编辑页
export function reportDetail(params) {
  return request.$trs({
    url: '/preDeclareCustoms/declareCustomsDetail',
    method: 'get',
    params: { ...params }
  })
}

// 复核保存
export function doubleCheck(params) {
  return request.$trs({
    url: '/preDeclareCustoms/review',
    method: 'post',
    data: params
  })
}

// 报关保存
export function report(params) {
  return request.$trs({
    url: '/preDeclareCustoms/declareCustoms',
    method: 'post',
    data: params
  })
}

// 退税保存
export function retax(params) {
  return request.$trs({
    url: '/preDeclareCustoms/preTaxRebate',
    method: 'post',
    data: params
  })
}

// 上传单个pdf
export function uploadPdf({ file }) {
  const formData = new FormData()
  formData.append('file', file)
  return request.$trs({
    url: '/preDeclareCustoms/uploadPdf',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
    responseType: 'blob',
    reportError: false
  })
}

// 上传多个pdf
export function batchUploadPdf(data) {
  return request.$trs({
    url: '/preDeclareCustoms/batchUploadPdf',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data,
    responseType: 'blob',
    reportError: false
  })
}

// 预览
export function openPDF(id) {
  return request.$trs({
    url: '/preDeclareCustoms/preview',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: id,
    responseType: 'blob',
    reportError: false
  })
}

// 预报-预览
export function openPreReportPDF(id) {
  return request.$trs({
    url: '/declareCustomsInfo/previewForecast',
    method: 'post',
    timeout: 120000,
    data: id,
    responseType: 'blob',
    reportError: false
  })
}

// 批量预报-预览
export function openBatchPreReportPDF(id) {
  return request.$trs({
    url: '/declareCustomsInfo/previewBatchForecast',
    method: 'post',
    timeout: 120000,
    data: id,
    responseType: 'blob',
    reportError: false
  })
}

// 复核-预览
export function openDoubleCheckPDF(id) {
  return request.$trs({
    url: '/preDeclareCustoms/previewReview',
    method: 'post',
    timeout: 120000,
    data: id,
    responseType: 'blob',
    reportError: false
  })
}

// 报关-预览
export function openReportPDF(id) {
  return request.$trs({
    url: '/preDeclareCustoms/previewDeclareCustoms',
    method: 'post',
    timeout: 120000,
    data: id,
    responseType: 'blob',
    reportError: false
  })
}

// 预退税-预览
export function openPreRetaxtPDF(id) {
  return request.$trs({
    url: '/preDeclareCustoms/previewPreTaxRebate',
    method: 'post',
    timeout: 120000,
    data: id,
    responseType: 'blob',
    reportError: false
  })
}

// 获取状态列表
export function getStatus(params) {
  return request.$trs({
    url: '/dict-biz/dictionary?code=pre_declare_customs_status',
    method: 'get',
    params
  })
}
