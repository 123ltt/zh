import request from '@/router/axios'
/**
 * 获取Listing 列表（分页）
 * @param {string} keyType  关键词类型
 * @param {string} keywords  关键词
 * @param {array} storeCodes  店铺编号
 * @param {string} listingType  listing类型
 * @param {string} saleType  销售类型
 * @param {string} listingStatus  Listing状态
 * @param {boolean} isBackPublish  是否后台刊登
 * @param {string} createUser  创建人
 * @param {date} createStartTime  创建开始时间
 * @param {date} createEndTime  创建结束时间
 * @param {date} putawayStartTime  上架开始时间
 * @param {date} putawayEndTime  上架结束时间
 */
export function ebayList(data) {
  return request.$lmsEbay({
    url: '/ebay/listing/page',
    method: 'post',
    // params: { current, size },
    data
  })
}
/**
 * 获取Listing 变体列表
 * @param {listingId} 父sku id
 */
export function ebayVariantList(data) {
  return request.$lmsEbay({
    url: '/ebay/listing/variant_list',
    method: 'get',
    params: data
  })
}
/**
 * 常量
 * @param {} listingId
 */
export function ebayconstants() {
  return request.$lmsEbay({
    url: '/constants',
    method: 'get'
  })
}

/**
 * listing详情
 * @param {string} id  父id
 */
export function ebayDetails(id) {
  return request.$lmsEbay({
    url: '/ebay/listing/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * 上传 Listing
 * @param {array} listingIds  父id []
 */
export function ebayUpload(listingIds) {
  return request.$lmsEbay({
    url: '/ebay/listing/upload',
    method: 'post',
    data: listingIds,
    reportError: false
  })
}
/**
 * 审核 Listing
 * @param {array} listingIds  父id[]
 * @param {data}} uploadTime  刊登时间
 */
export function audit(data) {
  return request.$lmsEbay({
    url: '/ebay/listing/audit',
    method: 'post',
    data,
    reportError: false
  })
}
/**
 * 删除 Listing
 * @param {array} listingID  父id
 * @param {array}} variations  Listing变体ID列表
 */
export function remove(data) {
  return request.$lmsEbay({
    url: '/ebay/listing/remove',
    method: 'post',
    data
  })
}

/**
 * @description 批量更新价格库存（按条件）
 */
export function batchUpdatePriceStock(data) {
  return request.$lmsEbay({
    url: '/ebay/listing/batchUpdatePriceStock',
    method: 'post',
    data
  })
}

/**
 * @description 批量更新价格库存（按文件上传）
 */
export function batchUpdateByFile(data) {
  return request.$lmsData({
    url: '/batchfeed/save',
    method: 'post',
    data
  })
}
/**
 * 批量更新价格库存下载模板
*/
export function exportPriceStockTemplate(params) {
  return request.$lmsEbay({
    url: '/ebay/listing/exportPriceStockTemplate',
    method: 'get',
    responseType: 'blob',
    params
  })
}
/**
 * @description 统计各状态数量
 */
export function statisticsStatus(data) {
  return request.$lmsEbay({
    url: '/ebay/listing/statisticsStatus',
    method: 'post',
    data
  })
}
