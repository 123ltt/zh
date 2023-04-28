import request from '@/router/axios'
/** Lazada平台-类目管理 */

/**
 * 分页获取类目列表
 * @param {*} params
 * @returns
 */
export const getCategoryList = (params) => request.$lmsLazada({
  url: '/lazada/category/page',
  method: 'get',
  params: {
    ...params
  }
})
/**
 * 设置销售利润率
 * @param {*} id
 * @param {*} profitRate
 * @returns
 */
export const updateGrossProfit = ({ id, profitRate }) => request.$lmsLazada({
  url: '/lazada/category/assign-profit-rate',
  method: 'post',
  data: {
    id,
    profitRate
  }
})
/**
 * 更新站点类目--${}拼接方式
 * @param {*} siteCode
 * @returns
 */
export const updateCategory = (siteCode) => request.$lmsLazada({
  url: `/lazada/category/update?siteCode=${siteCode}`,
  method: 'post'
})
/**
 * 类目列表接口
 * @param {*} current
 * @param {*} size
 * @param {*} params
 * @returns
 */
export const getCategoryLog = (params) => request.$lmsLazada({
  url: '/log/listing_cate/page',
  method: 'get',
  params: {
    ...params
  }
})

// 类目对照->获取子类目
export function getLevelCategory(params) {
  return request.$lmsLazada({
    url: '/lazada/category/levelCategory',
    method: 'post',
    data: params
  })
}
// 模糊查询类目接口
export function getCateogries(params) {
  return request.$lmsLazada({
    url: '/lazada/category/getCateByName',
    method: 'post',
    data: params
  })
}
// 类目对照-根据产品类目获取平台类目
export function checkCategory(params) {
  return request.$lmsLazada({
    url: '/lazada/category/getByProductCateId',
    method: 'post',
    data: params
  })
}
// 创建listing-根据店铺获取限制一级类目
export function getCateByStoreName(params) {
  return request.$lmsLazada({
    url: '/lazada/category/getCateByStoreName',
    method: 'post',
    data: params
  })
}
// 获取类目属性
export function getCategoryAttribute(params) {
  return request.$lmsLazada({
    url: '/lazada/category/getCategoryAttribute',
    method: 'post',
    data: params
  })
}
// 创建listing-校验类目
export function checkCateById(params) {
  return request.$lmsLazada({
    url: '/lazada/category/checkCategory',
    method: 'post',
    data: params
  })
}

// 实时同步类目属性-邢振
export function syncCategoryAttribute(params) {
  return request.$lmsLazada({
    url: '/lazada/category/syncCategoryAttribute',
    method: 'post',
    data: params
  })
}
