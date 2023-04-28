import request from '@/router/axios'

/**
 * module: 亚马逊刊登
 * 文档地址： http://showdoc.zehui.local/web/#/14
 **/

// Listing新增
export function amazonlistingSave(data) {
  return request.$lmsAmazon({
    url: '/amazonlisting/save',
    method: 'post',
    data,
    reportError: false
  })
}

// Listing修改
export function amazonlistingUpdate(data) {
  return request.$lmsAmazon({
    url: '/amazonlisting/update',
    method: 'post',
    data
  })
}

// condition下拉框
export function getConditionList(data) {
  return request.$lmsAmazon({
    url: '/amazonconstant/condition',
    method: 'get',
    params: data
  })
}

// 获取sku产品详细信息
export function getSkuDetail(data) {
  return request.$lmsAmazon({
    url: '/amazonlisting/detail',
    method: 'get',
    params: data
  })
}

// 搜索可刊登的产品
export function getCanPublishSkuByProduct(current, size, params) {
  return request.$pms({
    url: '/lms/sku/getCanPublishSku',
    method: 'post',
    data: {
      query: { current, size },
      data: { ...params, siteCode: params.siteCode || 'US' }
    }
  })
}

// 刊登-获取SKU信息
export function getSkuDetailByProduct(data) {
  return request.$pms({
    url: '/lms/sku/getSkuDetail',
    method: 'post',
    data: { ...data, siteCode: data.siteCode || 'US' }
  })
}

// 刊登-获取SPU信息
export function getSpuDetailByProduct(data) {
  return request.$pms({
    url: '/lms/sku/getSpuDetail',
    method: 'post',
    data: { ...data, siteCode: data.siteCode || 'US' }
  })
}

// 类目对照接口
export function getPlatformCateId(data) {
  return request.$lmsAmazon({
    url: '/amazoncategory/check/bind/category',
    method: 'get',
    params: data
  })
}

// 物流渠道接口
export function getOptimize(data) {
  return request.$lmsAmazon({
    url: '/common/getOptimizeBySku',
    method: 'post',
    data
  })
}

// 获取Listing列表
export function amazonlisting(params, data) {
  return request.$lmsAmazon({
    url: '/amazonlisting/list',
    method: 'post',
    params: { ...params },
    data
  })
}
// Listing列表-变体(线上数据) online 之后
export function amazonlistingListVariant({ id, listingStatus }) {
  return request.$lmsAmazon({
    url: '/amazonlistingvariant/listVariant',
    method: 'post',
    params: { id, listingStatus }
  })
}
// Listing列表-变体(本地数据) online之前
export function getByAmazonListingId({ id }) {
  return request.$lmsAmazon({
    url: '/amazondraftsku/getByAmazonListingId',
    method: 'post',
    params: { id }
  })
}

/**
 * 店铺下拉项-平台简码
*/
export function optionsWithPlatformCode({ platformCode }) {
  return request.$sams({
    url: '/store/optionsWithPlatformCode',
    method: 'post',
    data: { platformCode }
  })
}
// Listing删除
export function amazonListDel({ listingStatus, variantIds, params }) {
  return request.$lmsAmazon({
    url: '/amazonlisting/remove',
    method: 'post',
    params: { listingStatus, variantIds },
    data: params
  })
}
/**
 * 站点下拉项-平台简码
*/
export function optionsSiteCode({ platformCode }) {
  return request.$sams({
    url: '/store/site/optionsWithPlatformCode',
    method: 'post',
    data: { platformCode }
  })
}

/**
 * 查询成本价
*/
export function getPrice(data) {
  return request.$lmsAmazon({
    url: '/common/getPrice',
    method: 'post',
    data
  })
}
/**
 * 提交审核
*/
export function amazonlistingAudit({ ids, isCheck, uploadTime }) {
  return request.$lmsAmazon({
    url: '/amazonlisting/audit',
    method: 'post',
    data: { ids, isCheck, timedUploadTime: uploadTime },
    reportError: false
  })
}

/**
 * Listing详情 草稿
*/
export function getAmazonListingDetail(data) {
  return request.$lmsAmazon({
    url: '/amazonlisting/detail',
    method: 'get',
    params: data
  })
}

/**
 * Listing修改 草稿
*/
export function amazonListingUpdateDraft(data) {
  return request.$lmsAmazon({
    url: '/amazonlisting/update',
    method: 'post',
    data,
    reportError: false
  })
}

/**
 * Listing详情-在售
*/
export function getAmazonListingOlineDetail(data) {
  return request.$lmsAmazon({
    url: '/amazonlistingvariant/detail',
    method: 'post',
    data
  })
}

/**
 * Listing编辑-在售
*/
export function amazonlistingvariantUpdate(data) {
  return request.$lmsAmazon({
    url: '/amazonlistingvariant/update',
    method: 'post',
    data,
    reportError: false
  })
}

/**
 * Listing校验
*/
export function amazonlistingCheck(data) {
  return request.$lmsAmazon({
    url: '/amazonlisting/check',
    method: 'post',
    data
  })
}

/**
 * 上传
*/
export function updateAmazonListing(data) {
  return request.$lmsAmazon({
    url: '/amazonlisting/uploading',
    method: 'post',
    data,
    reportError: false
  })
}

/**
 * 刊登-获取SKU产品属性
*/
export function getSkuAttr(data) {
  return request.$pms({
    url: '/lms/sku/getSkuAttr',
    method: 'post',
    data
  })
}

/**
 * 获取销售利润率接口
*/
export function getGrossprofit(data) {
  return request.$lmsAmazon({
    url: '/amazoncategory/get/gross-profit',
    method: 'get',
    params: data
  })
}

/**
 * 根据类目树名称获取类目
*/
export function getCateId(data) {
  return request.$lmsAmazon({
    url: '/amazoncategory/get/category',
    method: 'get',
    params: data
  })
}
/**
 * 获取类目列表(模糊搜索)
*/
export function getCateogries(data) {
  return request.$lmsAmazon({
    url: '/amazoncategory/get/categories',
    method: 'get',
    params: data
  })
}
/**
 * upc下载模板
*/
export function upcDownload() {
  return request.$lmsData({
    url: '/lms/data/upc/download',
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 根据图片url上传图片
*/
export function uploadUrlImg(data) {
  return request.$opsResource({
    url: '/oss/getImage',
    method: 'get',
    params: data,
    reportError: false
  })
}

/**
 * 获取图片尺寸，sku，url信息
*/
export function getImageDetailList(data) {
  return request.$pms({
    url: '/lms/sku/getImageDetailList',
    method: 'post',
    data
  })
}

/**
 * 批量上传UPC
 * @param {blob} file 文件流
 */
export function upcUpload({ file }) {
  const formData = new FormData()
  formData.append('file', file)
  return request.$lmsData({
    url: '/lms/data/upc/upload',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
    reportError: false
  })
}

// 角色接口
export const getUserList = (data) => {
  return request.$ams({
    url: '/user/conciseInfo/page?size=-1',
    method: 'get',
    params: data
  })
}
/**
 * 获取子sku数量
 * @param {array} ids 父sku ID
 * @param {string} listingStatus 状态
 */
export const getVariantNum = (data) => {
  return request.$lmsAmazon({
    url: '/amazonlisting/getVariantNum',
    method: 'post',
    data: data
  })
}
/**
 * Listing批量打开详情-草稿
 * @param {array {}[]} amazonListingIds listing主键ID
 */
export const getBatchDraftDetail = ({ amazonListingIds }) => {
  return request.$lmsAmazon({
    url: '/amazonlisting/getBatchDraftDetail',
    method: 'post',
    data: {
      amazonListingIds
    }
  })
}
/**
 * 批量打开详情页-线上
 * @param {array {}[]} amazonListingIds listing主键ID
 * @param {array {}[]} amazonVariantIds 变体主键ID
 */
export const getBatchOnlineDetail = ({ amazonListingIds, amazonVariantIds }) => {
  return request.$lmsAmazon({
    url: '/amazonlisting/getBatchOnlineDetail',
    method: 'post',
    data: { amazonListingIds, amazonVariantIds }
  })
}
/**
 * 批量更新价格
 * @param {Object} data
 */
export const batchPrice = (data) => {
  return request.$lmsAmazon({
    url: '/amazonlisting/batchPrice',
    method: 'post',
    data
  })
}
/**
 * 批量更新库存
 * @param {Object} data
 */
export const batchQuantity = (data) => {
  return request.$lmsAmazon({
    url: '/amazonlisting/batchQuantity',
    method: 'post',
    data
  })
}
/**
 * 批量修改价格库存-模板下载
 * @param {amazonListingIds} array listing主键ID
 * @param {amazonVariantIds} array 变体id
 */
export const quantityTemplateDownload = (data) => {
  return request.$lmsAmazon({
    url: '/amazonlisting/batchUpdatePriceAndQuantityTemplateDownload',
    method: 'post',
    responseType: 'blob',
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
// 自动刊登接口
export function autoBatchUpdateByFile(data) {
  return request.$lmsData({
    url: '/batchfeed/autoPublishSave',
    method: 'post',
    data
  })
}
