import request from '@/router/axios'
/**
 * 报关单列表
 */
export function declareList(params) {
  return request.$trs({
    url: '/declareCustomsInfo/list',
    method: 'get',
    params
  })
}

// 删除
export function rowDelete(ids) {
  return request.$trs({
    url: '/declareCustomsInfo/remove',
    method: 'post',
    params: { ids }
  })
}

// 保存拆分行
export function saveSplitRow(params) {
  return request.$trs({
    url: '/declareCustomsInfo/split',
    method: 'post',
    data: params
  })
}

// 修改-编辑页
export function modifyDetail(params) {
  return request.$trs({
    url: '/declareCustomsInfo/updateDetail',
    method: 'get',
    params: { ...params }
  })
}

// 预报-编辑页
export function preReportDetail(params) {
  return request.$trs({
    url: '/declareCustomsInfo/forecastDetail',
    method: 'get',
    params: { ...params }
  })
}

// 详情
export function requestDetail(params) {
  return request.$trs({
    url: '/declareCustomsInfo/detail',
    method: 'get',
    params: { ...params }
  })
}

// 批量预报-编辑页
export function batchPreReportDetail(params) {
  return request.$trs({
    url: '/declareCustomsInfo/batchForecastDetail',
    method: 'get',
    params: { ...params }
  })
}

// 预报-保存
export function preReport(params) {
  return request.$trs({
    url: '/declareCustomsInfo/forecast',
    method: 'post',
    data: params
  })
}

// 批量预报-保存
export function batchPreReport(params) {
  return request.$trs({
    url: '/declareCustomsInfo/batchForecast',
    method: 'post',
    data: params
  })
}

// 修改-保存
export function saveData(params) {
  return request.$trs({
    url: '/declareCustomsInfo/update',
    method: 'post',
    data: params
  })
}

// 下载pdf
export function downLoadPDF(params) {
  return request.$trs({
    url: '/preDeclareCustoms/downloadPdf',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

// 批量修改-保存
export function saveBatchModifyData(params) {
  return request.$trs({
    url: '/declareCustomsInfo/batchUpdate',
    method: 'post',
    data: params
  })
}

// 批量审核
export function requestBatchApproval(params) {
  return request.$trs({
    url: '/declareCustomsInfo/batchAudit',
    method: 'post',
    params: params
  })
}

// 获取状态列表
export function getStatus(params) {
  return request.$trs({
    url: '/dict-biz/dictionary?code=declare_customs_status',
    method: 'get',
    params
  })
}
