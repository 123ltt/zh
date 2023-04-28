import request from '@/router/axios'

/**
 * module: wish刊登
 * 文档地址： http://showdoc.zehui.local/web/#/14
 **/
/**
 * SKU映射模板下载
*/
export function skuUploadDownload(params) {
  return request.$lmsWish({
    url: '/aliexpresslisting/skuUploadDownload',
    method: 'get',
    responseType: 'blob',
    params
  })
}
/**
 * SKU映射模板导入
 * @param {blob} file 文件流
 */
export function skuUpload({ file }) {
  const formData = new FormData()
  formData.append('file', file)
  return request.$lmsWish({
    url: '/wishlisting/skuUpload',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
    reportError: false
  })
}
// 同步listing
export function syncFromPlatform(params) {
  return request.$lmsWish({
    url: '/wishlisting/syncFromPlatform',
    method: 'post',
    params,
    reportError: false
  })
}
// 获取Listing列表
export function wishListing(data, params) {
  return request.$lmsWish({
    url: '/wishlisting/page',
    method: 'post',
    data,
    params
  })
}

// 获取变体数据
export function listVariant(params) {
  return request.$lmsWish({
    url: '/wishlisting/listVariant',
    method: 'post',
    params: params
  })
}
// 国家运费
export function shippableCountriesList() {
  return request.$lmsWish({
    url: '/ShippableCountries/list',
    method: 'get'
  })
}
// 汇率转换接口
export function exchangeByRate(data) {
  return request.$lmsData({
    url: '/rate/exchangeByRate',
    method: 'post',
    data
  })
}
// 计算售价
export function calculatePrice({
  storeCode,
  warehouseId,
  priceDTOList,
  platformCode,
  saleProfitRate,
  productSku
}) {
  return request.$lmsWish({
    url: '/common/calculatePrice',
    method: 'post',
    data: {
      storeCode, // string 店铺编码
      warehouseId, // string 仓库编码
      priceDTOList, // array sku 数组
      saleProfitRate, // double 销售利润率
      platformCode, // 平台编码
      productSku // sku
    }
  })
}
// 计算利润率
export function calculateProfitRate({
  storeCode,
  warehouseId,
  priceRateDTOList,
  platformCode
}) {
  return request.$lmsWish({
    url: '/common/calculateProfitRate',
    method: 'post',
    data: {
      storeCode, // string 店铺编码
      warehouseId, // string 仓库编码
      priceRateDTOList, // array sku 数组
      platformCode // 平台编码
    }
  })
}
// 新增草稿
export function addDraft(data) {
  return request.$lmsWish({
    url: '/wishlisting/addDraft',
    method: 'post',
    data,
    reportError: false
  })
}
// 更新listing
export function updateListing(data) {
  return request.$lmsWish({
    url: '/wishlisting/updateListing',
    method: 'post',
    data,
    reportError: false
  })
}
/**
 * listing详情 草稿
 * @param {*} id
 * @returns
 */

export const wishDetail = (id) => request.$lmsWish({
  url: `/wishlisting/getById?id=${id}`,
  method: 'post'
})
/**
 * 在售listing详情
 * @param {*} id
 * @returns
 */
export const onlineDetail = (id) => request.$lmsWish({
  url: `/wishlisting/detail?id=${id}`,
  method: 'post'
})
/**
 * 查看国家费用
 * @param {*} id
 * @returns
 */
export const countryFreight = (id) => request.$lmsWish({
  url: `/shipping/detail?id=${id}`,
  method: 'post'
})
// 批量库存/价格调整 新增
export const batchSave = (data) => request.$lmsData({
  url: '/batchfeed/save',
  method: 'post',
  data
})
// 批量更新下载模板
export const templateDownload = (ids) => request.$lmsWish({
  url: '/wishlisting/templateDownload?ids=' + ids,
  responseType: 'blob'
})

// 上传
export function wishUpload(data) {
  return request.$lmsWish({
    url: '/wishlisting/upload',
    method: 'post',
    data,
    reportError: false
  })
}
// 提交审核
export function wishAudit({ uploadTime, isCheck, ids }) {
  return request.$lmsWish({
    url: '/wishlisting/audit',
    method: 'post',
    data: {
      ids,
      isCheck,
      timedUploadTime: uploadTime
    },
    reportError: false
  })
}
// 上架listing
export function enableProducts({ ids = [], isCheck }) {
  return request.$lmsWish({
    url: '/wishlisting/enableProducts',
    method: 'post',
    params: { ids: ids.join(), isCheck },
    reportError: false
  })
}
// 下架listing
export function disableProducts(ids) {
  return request.$lmsWish({
    url: '/wishlisting/disableProducts',
    method: 'post',
    params: { ids }
  })
}
// 下架sku
export function disableSku(variantId) {
  return request.$lmsWish({
    url: '/wishlisting/disableSku',
    method: 'post',
    params: { variantId }
  })
}
// 上架sku
export function enableSku(variantId) {
  return request.$lmsWish({
    url: '/wishlisting/enableSku',
    method: 'post',
    params: { variantId }
  })
}
// 删除
export function wishlistingDel(ids) {
  return request.$lmsWish({
    url: '/wishlisting/remove',
    method: 'post',
    params: { ids }
  })
}
// 草稿编辑
export function draftUpdate(data) {
  return request.$lmsWish({
    url: '/wishlisting/update',
    method: 'post',
    data,
    reportError: false
  })
}
// 自动刊登模板下载
export const autoTemplate = () => request.$lmsWish({
  url: '/wishlisting/publishTemplateDownload',
  method: 'get',
  responseType: 'blob'
})
// 自动刊登模板上传
export const autoBatchUpdateByFile = (data) => request.$lmsWish({
  url: '/wishlisting/uploadPublishTemplate',
  method: 'post',
  data
})
