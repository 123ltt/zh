import request from '@/router/axios'

// 获取Listing列表
export function getLazadaListing(data) {
  return request.$lmsLazada({
    url: '/lazada/spus/list',
    method: 'post',
    data
  })
}
// 获取变体数据
export function listVariant(params) {
  return request.$lmsLazada({
    url: '/lazada/product/skus/variantList',
    method: 'get',
    params
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
 * @description 重新上架
 */
export function reShelve(params) {
  return request.$lmsLazada({
    url: '/lazada/spus/reShelve',
    method: 'get',
    params: {
      ...params,
      ids: params.ids.join(',')
    },
    reportError: false
  })
}
/**
 * @description 删除spu
 */
export function remove(params) {
  return request.$lmsLazada({
    url: '/lazada/spus/remove',
    method: 'get',
    params
  })
}

/**
 * @description 上传Listing
 */
export function upload(data) {
  return request.$lmsLazada({
    url: '/lazada/product/upload',
    method: 'post',
    data,
    reportError: false
  })
}
/**
 * @description 审核Listing
 */
export function audit(data) {
  return request.$lmsLazada({
    url: '/lazada/product/audit',
    method: 'post',
    data,
    reportError: false
  })
}

/**
 * @description 下架
 */
export function unShelve(params) {
  return request.$lmsLazada({
    url: '/lazada/spus/unShelve',
    method: 'get',
    params
  })
}

/**
 * @description 获取Listing 业务日志列表（分页）
 */
export function listingBusLog(params) {
  return request.$lmsLazada({
    url: '/log/listing_bus/page',
    method: 'get',
    params
  })
}
/**
 * @description 常量接口
 */
export function getConstants() {
  return request.$lmsLazada({
    url: '/constants',
    method: 'get'
  })
}
/**
 * @description 批量修改价格库存模板下载
 */
export function templateDownload(ids) {
  return request.$lmsLazada({
    url: '/lazada/spus/exportPriceStockTemplateDownload?ids=' + ids,
    method: 'get',
    responseType: 'blob'
  })
}
/**
 * @description 统计各状态数量
 */
export function statisticsStatus(data) {
  return request.$lmsLazada({
    url: '/lazada/spus/statisticsStatus',
    method: 'post',
    data
  })
}
/**
 * @description 子sku下架
 */
export function unShelveSku(params) {
  return request.$lmsLazada({
    url: '/lazada/spus/unShelveSku',
    method: 'get',
    params
  })
}
