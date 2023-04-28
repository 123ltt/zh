import request from '@/router/axios'

/**
 * @description: listing新增 文档地址： http://showdoc.zehui.local/web/?#/137?page_id=1143
 **/
export function ebayListingSave(data) {
  return request.$lmsEbay({
    url: '/ebay/listing/save',
    method: 'post',
    data,
    reportError: false
  })
}
/**
 * @description: listing修改 文档地址： http://showdoc.zehui.local/web/?#/137?page_id=1144
 **/
export function ebayListingUpdate(data) {
  return request.$lmsEbay({
    url: '/ebay/listing/update',
    method: 'post',
    data,
    reportError: false
  })
}
/**
 * @description: listing详情 文档地址： http://showdoc.zehui.local/web/?#/137?page_id=1152
 **/
export function getEbayListingDetail(data) {
  return request.$lmsEbay({
    url: '/ebay/listing/detail',
    method: 'get',
    params: data
  })
}

/**
 * @description 计算sku利润率
 */
export function getCalculateProfitRate(data) {
  return request.$lmsEbay({
    url: '/common/calculateProfitRate',
    method: 'post',
    data,
    reportError: false
  })
}

/**
 * @description 计算sku售价
 */
export function getCalculatePrice(data) {
  return request.$lmsEbay({
    url: '/common/calculatePrice',
    method: 'post',
    data,
    reportError: false
  })
}
/**
 * 查询成本价
*/
export function getPrice(data) {
  return request.$lmsEbay({
    url: '/common/getPrice',
    method: 'post',
    data
  })
}
// 物流渠道接口
export function getOptimize(data) {
  return request.$lmsEbay({
    url: '/common/getOptimizeBySku',
    method: 'post',
    data
  })
}
/**
 * @description 获取店铺是否支持paypal
 */
export function checkPaypal(data) {
  return request.$lmsEbay({
    url: '/ebay/listing/checkPaypal',
    method: 'get',
    params: data
  })
}
