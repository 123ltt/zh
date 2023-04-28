import request, { axios } from '@/router/axios'
// 站点下拉列表
export const siteOption = (data) => {
  return request.$oms({
    url: '/proxy/sams/store/site/optionsWithPlatformCode',
    method: 'POST',
    data
  })
}

// 平台订单列表
export const page = (data) => {
  return request.$oms({
    url: '/amplatorder/page',
    method: 'post',
    data
  })
}
// 平台订单列表状态
export const count = (data) => {
  return request.$oms({
    url: '/amplatorder/count',
    method: 'post',
    data
  })
}
// 平台订单详情
export const detail = (platOrderId) => {
  return request.$oms({
    url: '/amplatorder/detail?platOrderId=' + platOrderId,
    method: 'get'
  })
}
// 平台订单日志
export const pageTable = (data) => {
  return request.$oms({
    url: '/amplatorderhis/page',
    method: 'post',
    data
  })
}
// 下载模板
export const downloadModel = (id) => {
  let url = ''
  if (id === 'AMAZON_MODULAR') {
    // 下载亚马逊手工导单
    url = '/manual/downloadModel'
  } else {
    // 下载通用模板
    url = '/manual/downloadCommonModel'
  }
  return request.$oms({
    url,
    method: 'get',
    responseType: 'blob'
  })
}
// 下拉国家列表
export const baseCountry = () => {
  return request.$oms({
    url: '/baseCountry/list',
    method: 'get'
  })
}
// 创建手工单
export const saveManualOrder = (data) => {
  return request.$oms({
    url: '/original/save',
    method: 'post',
    data
  })
}
// 获取国家货币详情接口
export const Currency = () => {
  return request.$oms({
    url: '/downloadCenter/getCurrency',
    method: 'get'
  })
}
// 平台订单手工同步
export const amplatorderSyn = (id) => {
  return request.$oms({
    url: '/oms/amplatorder/syn?id=' + id,
    method: 'get'
  })
}
// 平台订单批量同步
export const synBatch = (data, type) => {
  const urlObj = {
    amazon: '/amplatorder/synBatch',
    smt: '/smplatOrdermain/sync',
    ebay: '/ebay/batchGrabAndSync'
  }
  return request.$oms({
    url: urlObj[type],
    method: 'post',
    data
  })
}
// 保存手工导单excel
export const uploadManualExcelFile = (data) => {
  return request.$oms({
    url: '/manual/uploadManualExcelFile',
    method: 'post',
    data
  })
}
// 从原订单丰富
export const getOriginalOrderDetail = (data) => {
  return request.$oms({
    url: '/original/getOriginalOrderDetail',
    method: 'get',
    params: { ...data }
  })
}
// 查询产品信息接口
export const getSkuDetailByCode = (data) => {
  return request.$oms({
    url: '/manual/getSkuDetailByCode',
    method: 'get',
    params: data
  })
}

// 上传文件返回文件地址
export const putFile = (data) => {
  const formData = new FormData()
  formData.append('file', data.file)
  return request.$oms({
    url: '/proxy/oss/put-file?code=minio',
    method: 'POST',
    data: formData
  })
}
// 速卖通列表页
export const smtPage = (data) => {
  return request.$oms({
    url: '/smplatOrdermain/page',
    method: 'POST',
    data
  })
}
// 速卖通平台状态列表
export const smtCount = (data) => {
  return request.$oms({
    url: '/smplatOrdermain/count',
    method: 'POST',
    data
  })
}
// 平台详情
export const platDetails = (config) => {
  return request.$oms(config)
}
// smt日志列表
export const smtPageLog = (params) => {
  return request.$oms({
    url: '/smplatOrderhis/page',
    method: 'GET',
    params
  })
}
// 平台订单批量手工同步
export const smtSync = (data) => {
  return request.$oms({
    url: '/smplatOrdermain/syn',
    method: 'POST',
    data
  })
}
// wish列表
export const whPage = (data) => {
  return request.$oms({
    url: '/whPlatOrderMain/page',
    method: 'POST',
    data
  })
}
// wish数量
export const countStatus = (data) => {
  return request.$oms({
    url: '/whPlatOrderMain/countStatus',
    method: 'POST',
    data
  })
}
// wish日志列表
export const whPlatOrderHis = (data) => {
  return request.$oms({
    url: '/whPlatOrderHis/page',
    method: 'POST',
    data
  })
}
// wish 手工同步
export const whSyn = (id) => {
  return request.$oms({
    url: '/whPlatOrderMain/syn?id=' + id,
    method: 'GET'
  })
}
// wish平台订单批量手工同步
export const whSynBatch = (data) => {
  return request.$oms({
    url: '/whPlatOrderMain/synBatch',
    method: 'POST',
    data
  })
}
// wish合并订单
export const manualPush = (data) => {
  return request.$oms({
    url: '/whPlatOrderMain/manualPush',
    method: 'POST',
    data
  })
}
// 批量标记保存
export const uploadMarkExcel = (data) => {
  return request.$oms({
    url: '/platOrderMark/uploadMarkExcel',
    method: 'post',
    data
  })
}
// 批量标记下载模板
export const getDemoUrl = () => {
  return request.$oms({
    url: '/platOrderMark/getDemoUrl',
    method: 'get'
    // responseType: 'blob'
  })
}
export const getXlsx = (url) => {
  return axios({
    url,
    method: 'get',
    responseType: 'blob'
  })
}
// 手工标记
export const handler = (data) => {
  return request.$oms({
    url: '/platOrderMark/handler',
    method: 'POST',
    data
  })
}
// 标记简称
export const getChannel = (params) => {
  return request.$oms({
    url: '/platOrderMark/getChannel',
    params
  })
}
