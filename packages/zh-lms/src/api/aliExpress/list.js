import request from '@/router/axios'

// 获取Listing列表
export function aliExpressListing(params, data) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/page',
    method: 'post',
    params: { ...params },
    data
  })
}

// 获取变体数据
export function listVariant(params) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/listVariant',
    method: 'post',
    params: params
  })
}
/**
 * 更改不可调价
 * @param {array} ids listingId集合
 * @param {number} noPriceChangeType 是否不可调价类型 1加入系统不可调价 2加入手动不可调价 3所有 NULL移除
 */
export function updateIsNoPriceChange(data) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/updateIsNoPriceChange',
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
 * @description 统计各状态数量
 */
export function statisticsStatus(data) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/statisticsStatus',
    method: 'post',
    data
  })
}

/**
 * @description 列表删除
 */
export function remove(params) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/remove',
    method: 'post',
    params
  })
}

/**
 * @description 审核Listing
 */
export function audit(data) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/audit',
    method: 'post',
    data,
    reportError: false
  })
}
/**
 * @description 上传Listing
 */
export function upload(data) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/upload',
    method: 'post',
    data,
    reportError: false
  })
}

/**
 * @description 下架
 */
export function unShelve(data) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/batchOnlineAndOffline',
    method: 'post',
    data
  })
}

/**
 * @description 重新上架
 */
export function reShelve(data) {
  return request.$lmsAliExpress({
    url: '/aliexpresslisting/batchOnlineAndOffline',
    method: 'post',
    data,
    reportError: false
  })
}

/**
 * 批量更新下载模板
*/
export function templateDownload(ids) {
  return request.$lmsAliExpress({
    url: `/aliexpresslisting/templateDownload?ids=${ids}`,
    method: 'get',
    responseType: 'blob'
  })
}
