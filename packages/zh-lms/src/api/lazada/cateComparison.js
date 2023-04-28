import request from '@/router/axios'
/**
 * 类目对照表
 */

/**
 * 根据站点分级获取店铺类目列表（不传id默认返回一级）
 * @param {*} siteCode
 * @param {*} id
 * @returns
 */
export const getLevelCategory = (siteCode, categoryId = '') => request.$lmsLazada({
  url: '/lazada/category/levelCategory',
  method: 'post',
  data: {
    siteCode,
    categoryId
  }
})
/**
 * 类目对照-绑定类目关系
 * @param {*} id
 * @param {*} productCateId
 * @returns
 */
export const saveCategoryContrast = ({ id, productCateId }) => request.$lmsLazada({
  url: '/lazada/category/updateProductCategory',
  method: 'post',
  data: {
    id,
    productCateId
  }
})
/**
 * 类目对照-根据产品类目获取平台类目
 * @param {*} productCateId
 * @returns
 */
export const checkCategory = ({ site, productCateId }) => request.$lmsLazada({
  url: '/lazada/category/getByProductCateId',
  method: 'post',
  data: {
    productCateId,
    siteCode: site
  }
})
/**
 * 类目限制-类目限制列表
 * @param {*} current
 * @param {*} size
 * @param {*} params
 * @returns
 */
export const lazadaCategoryLimit = (params, data) => request.$lmsLazada({
  url: '/lazadaCategoryLimit/page',
  method: 'post',
  data: {
    ...data
  },
  params
})
/**
 * 类目限制-保存类目限制
 * @param {*} storeName
 * @param {*} limitCategory
 * @returns
 */
export const limitSave = (params) => request.$lmsLazada({
  url: '/lazadaCategoryLimit/save',
  method: 'post',
  data: {
    ...params
  }
})
/**
 * 类目限制-更新类目限制
 * @param {*} storeName
 * @param {*} limitCategory
 * @returns
 */
export const limitUpdate = (params) => request.$lmsLazada({
  url: '/lazadaCategoryLimit/update',
  method: 'post',
  data: {
    ...params
  }
})
/**
 * 类目限制-类目限制日志
 * @param {*} size
 * @param {*} current
 * @param {*} id
 * @returns
 */
export const getCategortLimitLog = (current, size, id) => request.$lmsLazada({
  url: '/log/getCategortLimitLog/page',
  method: 'get',
  params: {
    size,
    current,
    id
  }
})
