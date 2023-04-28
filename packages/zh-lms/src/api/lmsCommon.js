import request from '@/router/axios'
const platformUrl = {
  wish: {
    prefix: '$lmsWish',
    skuUploadDownload: '/wishlisting/skuUploadDownload',
    skuUpload: '/wishlisting/skuUpload',
    filePath: 'file',
    syncItem: '/wishlisting/syncFromPlatform'
  },
  lazada: {
    prefix: '$lmsLazada',
    skuUploadDownload: '/lazada/product/skuTemplateDownload',
    skuUpload: '/lazada/product/importSkuRelation',
    filePath: 'filePath',
    syncItem: '/lazada/spus/sync/listing',
    syncMethod: 'get'
  },
  shopee: {
    prefix: '$lmsShopee',
    skuUploadDownload: '/shopeelisting/skuUploadDownload',
    skuUpload: '/shopeelisting/skuUpload',
    filePath: 'file',
    syncItem: '/shopeelisting/syncItem',
    syncMethod: 'get'
  },
  ebay: {
    prefix: '$lmsEbay',
    skuUploadDownload: '/ebay/listing/skuUploadDownload',
    skuUpload: '/ebay/listing/skuUpload',
    filePath: 'filePath',
    syncItem: '/ebay/listing/sync'
  },
  amazon: {
    prefix: '$lmsAmazon',
    skuUploadDownload: '/amazonlisting/skuUploadDownload',
    skuUpload: '/amazonlisting/skuUpload',
    syncItem: ''
  },
  aliExpress: {
    prefix: '$lmsAliExpress',
    skuUploadDownload: '/aliexpresslisting/skuUploadDownload',
    skuUpload: '/aliexpresslisting/skuUpload',
    filePath: 'file',
    syncItem: '/aliexpresslisting/sync/listing',
    syncMethod: 'get'
  }
}

/**
 * SKU映射模板下载
*/
export function skuUploadDownload(source, params) {
  return request[platformUrl[source].prefix]({
    url: platformUrl[source].skuUploadDownload,
    method: 'get',
    responseType: 'blob',
    params
  })
}
/**
 * SKU映射模板导入
 * @param {blob} file 文件流
 */
export function skuUpload(source, filePath) {
  const p = platformUrl[source]
  const formData = new FormData()
  formData.append(p.filePath, filePath)
  return request[p.prefix]({
    url: p.skuUpload,
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
    reportError: false
  })
}

/**
 * 同步listing
 */
export function syncFromPlatform(source, params, cancelPrice, formData) {
  const p = platformUrl[source]
  const method = p.syncMethod || 'post'
  const data = {}
  data[method === 'get' || source === 'wish' ? 'params' : 'data'] = params
  formData && (data.headers = { 'Content-Type': 'multipart/form-data' })
  return request[(p.prefix)]({
    url: cancelPrice ? '/shopeelisting/cancelDiscount' : p.syncItem,
    method,
    ...data,
    reportError: false
  })
}

/**
 * 一键翻译
*/
export function getTranslate(data, prefix) {
  const prefixs = prefix.substring(0, 1).toUpperCase() + prefix.substring(1) // 首字母大写
  return request[`$lms${prefixs}`]({
    url: '/common/getTranslate',
    method: 'post',
    data
  })
}
// 统计状态数量 prefix前缀名
export function statisticsStatus(data, prefix) {
  const prefixs = prefix.substring(0, 1).toUpperCase() + prefix.substring(1) // 首字母大写
  return request[`$lms${prefixs}`]({
    url: `/${prefix}listing/statisticsStatus`,
    method: 'post',
    data
  })
}
// Listing日志下拉框
// http://showdoc.zehui.local/web/#/14?page_id=1140
export function getMapLog({ key }, prefix) {
  const prefixs = prefix.substring(0, 1).toUpperCase() + prefix.substring(1) // 首字母大写
  return request[`$lms${prefixs}`]({
    url: '/constant/getMap',
    method: 'get',
    params: { key }
  })
}
/**
 * @description 查询SKU前后缀对应的仓库和国家
 */
export function getSkuAffix(data) {
  return request.$oms({
    url: '/skuResolvingRule/resolveSkuAffix',
    method: 'post',
    data
  })
}
