import request from '@/router/axios'

// listing新增
export function walmartListingSave(params) {
  return request.$lmsWalmart({
    url: '/walmartlisting/save',
    method: 'post',
    data: params,
    reportError: false
  })
}
// listing修改
export function walmartListingUpdate(params) {
  return request.$lmsWalmart({
    url: '/walmartlisting/update',
    method: 'post',
    data: params,
    reportError: false
  })
}
// 获取listing内容详情 - 草稿
export function getWalmartDetail(params) {
  return request.$lmsWalmart({
    url: '/walmartlisting/detail',
    method: 'get',
    params
  })
}
// 新增、编辑listing 根据类型获取属性信息
export function getCategoryAttribute(params) {
  return request.$lmsWalmart({
    url: '/walmartAttribute/getAttributeByCategory',
    method: 'post',
    data: params
  })
}
// 获取类目列表
export function getCateogries(params) {
  return request.$lmsWalmart({
    url: '/walmartCategory/list',
    method: 'post',
    data: params
  })
}
// 类目对照
export function checkCategory(params) {
  return request.$lmsWalmart({
    url: '/walmartCategory/getByProductCategoryId',
    method: 'get',
    params
  })
}
// 计算sku售价
export function calculatePrice(params) {
  return request.$lmsWalmart({
    url: '/common/calculatePrice',
    method: 'post',
    data: params,
    reportError: false
  })
}
// 计算sku利润率
export function calculateProfitRate(params) {
  return request.$lmsWalmart({
    url: '/common/calculateProfitRate',
    method: 'post',
    data: params,
    reportError: false
  })
}
// listing列表
export function walmartlisting({ current, size }, data) {
  return request.$lmsWalmart({
    url: '/walmartlisting/list',
    method: 'post',
    params: { current, size },
    data
  })
}
// 物流渠道接口
export function getOptimize(data) {
  return request.$lmsWalmart({
    url: '/common/getOptimizeBySku',
    method: 'post',
    data
  })
}
// listing列表-变体查询
export function getListVariant(id) {
  return request.$lmsWalmart({
    url: '/walmartlistingvariant/listVariant',
    method: 'get',
    params: { id }
  })
}
// 获取Variant详情-在线
export function walmartlistingvariant(id) {
  return request.$lmsWalmart({
    url: '/walmartlistingvariant/detail',
    method: 'post',
    data: { id }
  })
}
export function walmartlistingDel(data) {
  return request.$lmsWalmart({
    url: '/walmartlisting/remove',
    method: 'post',
    data // { listingStatus, listingId, variantId }
  })
}
/**
 * Listing-批量打开详情页
 * @param {array} walmartListingIds listing主键ID
 * @param {array} walmartVariantIds 变体主键ID
 * @returns
 */
export function getBatchDetail(data) {
  return request.$lmsWalmart({
    url: '/walmartlisting/getBatchDetail',
    method: 'post',
    data
  })
}
// 上传
export function walmartUpload(data) {
  return request.$lmsWalmart({
    url: '/walmartlisting/uploading',
    method: 'post',
    data,
    reportError: false
  })
}
// 提交审核
export function walmartAudit(data) {
  return request.$lmsWalmart({
    url: '/walmartlisting/audit',
    method: 'post',
    data,
    reportError: false
  })
}
