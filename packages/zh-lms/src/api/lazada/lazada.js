import request from '@/router/axios'

// listing新增
export function lazadaListingSave(params) {
  return request.$lmsLazada({
    url: '/lazada/product/save',
    method: 'post',
    data: params,
    reportError: false
  })
}
// listing修改
export function lazadaListingUpdate(params) {
  return request.$lmsLazada({
    url: '/lazada/product/update',
    method: 'post',
    data: params,
    reportError: false
  })
}
// 获取listing内容详情
export function getLazadaDetail(params) {
  return request.$lmsLazada({
    url: '/lazada/spus/detail',
    method: 'post',
    params
  })
}
// 计算sku售价
export function calculatePrice(params) {
  return request.$lmsLazada({
    url: '/common/calculatePrice',
    method: 'post',
    data: params,
    reportError: false
  })
}
// 计算sku利润率
export function calculateProfitRate(params) {
  return request.$lmsLazada({
    url: '/common/calculateProfitRate',
    method: 'post',
    data: params,
    reportError: false
  })
}
// sku重复性校验
export function checkSkuRepeat(params) {
  return request.$lmsLazada({
    url: '/lazada/product/checkSkuRepeat',
    method: 'post',
    data: params
  })
}
