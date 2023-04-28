import request from '@/router/axios'

/**
 * module: 类目管理
 * 文档地址： http://showdoc.zehui.local/web/#/14?page_id=1402
 **/

// 获取分级类目接口
export function getLevelCategory(params) {
  return request.$lmsAliExpress({
    url: '/category/level/category',
    method: 'get',
    params: {
      ...params
    }
  })
}

// 获取类目列表接口 模糊搜索
export function getCateogries(params) {
  return request.$lmsAliExpress({
    url: '/category/get/categories',
    method: 'get',
    params
  })
}

// 获取类目属性接口
export function getCateogAttr(params) {
  return request.$lmsAliExpress({
    url: '/category/get/category/attr',
    method: 'get',
    params
  })
}

// 更新类目属性
export function upateCateAttr(params) {
  return request.$lmsAliExpress({
    url: '/category/sync/category/attr',
    method: 'get',
    params
  })
}

// 类目对照
export function checkCategory(params) {
  return request.$lmsAliExpress({
    url: '/category/get/category',
    method: 'get',
    params: {
      ...params
    }
  })
}
/**
 * 类目列表
 * @param {string} categoryId 类目Id
 * @param {string} enName 类目名称
 * current size
 */
// 类目日志
export function categoryList(params) {
  return request.$lmsAliExpress({
    url: '/category/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
/**
 * 类目毛利编辑
 * @param {string} categoryId 平台类目ID
 * @param {string} grossProfit 平台类目ID
 */
export function updateGrossProfit(data) {
  return request.$lmsAliExpress({
    url: '/category/updateGrossProfit',
    method: 'post',
    data
  })
}
/**
 * 类目对照-保存
 * @param {string} categoryId 平台类目ID
 * @param {string} productCategoryId 产品类目ID
 */
export function saveCategoryContrast(data) {
  return request.$lmsAliExpress({
    url: '/category/updateProductCategory',
    method: 'post',
    data
  })
}
/**
 * 类目对照-根据产品类目获取平台类目
 * @param {string} productCategoryId 产品类目ID
 */
export function checkProductCategory(params) {
  return request.$lmsAliExpress({
    url: '/category/getByProductCategoryId',
    method: 'get',
    params: {
      ...params
    }
  })
}
