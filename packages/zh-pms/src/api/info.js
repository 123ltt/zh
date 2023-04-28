// 信息维护相关
import request from '@/router/axios'

function updateCommon(url, data) {
  return request.$pms({
    url,
    method: 'post',
    data
  })
}

/**
 * 添加或更新 基础信息
 * @param {object} data
 */
export function updateBaseInfo(data) {
  return updateCommon('/sku/submit', data)
}

/**
 * 更新销售信息
 * @param {{id:string;lowestSellingPrice:string}} data
 */
export function updateSalesInfo(data) {
  return updateCommon('/skuSale/update', data)
}

/**
 * 更新物流信息
 * @param {object} data
 */
export function updateLogisticsInfo(data) {
  return updateCommon('/skulogistics/update', data)
}

/**
 * 更新图片、视频、附件信息
 * @param {object} data
 * @param {string} data.productId sku/spu/组合skuID
 * @param {Object[]} data.img 图片
 * @param {string} data.img[].id
 * @param {string} data.img[].imageUrl 图片URL
 * @param {boolean} data.img[].isPrime 是否主图
 * @param {string[]} data.video 视频地址
 * @param {string[]} data.attachment 附件地址
 */
export function updateFilesInfo(data) {
  return updateCommon('/skuimage/submit', data)
}

/**
 * 更新供应商信息
 * @param {object} data
 */
export function updateSupplierInfo(data) {
  return updateCommon('/newProductApproval/updateNewProduct', data)
}

/**
 * 获取平台站点列表信息
 * @typedef {{siteCode:string;siteName:string}} lstSite
 * @returns {ZHKJ.Response<{platCode:string;platName:string;lstSite:lstSite[]}[]>}
 */
export function getPlatformTree() {
  return request.$pms({
    url: '/common/getPlatSiteTree',
    headers: {
      tenantId: '000000'
    }
  })
}

/**
 * 更新安全审核信息
 * @param {object} data
 */
export function updateSafetyAudioInfo(data) {
  return updateCommon('/sku/saveSafetyAuditInfo', data)
}

/**
 * 获取多语言列表
 */
export function getLangs() {
  return request.$pms({
    url: '/common/getMultiLangList'
  })
}

/**
 * 获取日志信息
 * @param {object} params
 */
export function getLogList(params) {
  return request.$pms({
    url: '/bizlog/getBizBlogPage',
    params
  })
}

/**
 * 保存 规格和类目属性信息
 * @param {object} data
 * @param {string} data.productId 产品id
 * @param {string[]} data.attrIdList 删除的属性id
 * @param {object[]} data.lstAttr 属性信息
 * @param {string} data.lstAttr[].attributeId 属性id
 * @param {string} data.lstAttr[].fieldId 字段id
 * @param {string} data.lstAttr[].fieldValue 保存字段值
 */
export function saveSpecificationAndCategory(data) {
  return request.$pms({
    url: '/attr/saveSpecAndCateAttr',
    method: 'post',
    data
  })
}

/**
 * 获取包材类型列表
 */
export function getPackingMaterialTypeList() {
  return request.$pms({
    url: '/sku/optionBaoCai'
  })
}

/**
 * 获取全部物流属性配置
 */
export function getLogisticsList() {
  return request.$pms({
    url: '/logisticsAttrConfig/getAll',
    useCache: true
  })
}

/**
 * 获取租户列表
 * 参数 tenantId,  tenantName
 */
export function getTenantList() {
  return request.$pms({
    url: '/tenant/getAllTenant'
  })
}

/**
 * 获取组织架构列表（获取所有部门列表）
 */
export function getDepartmentList(params) {
  return request.$ams({
    url: '/org/tree',
    params
  })
}
