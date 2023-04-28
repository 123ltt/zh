import request from '@/router/axios'

/**
 * module: 类目管理
 * 文档地址： http://showdoc.zehui.local/web/#/14?page_id=1878
 **/

// 分页获取类目列表
export function getCategoryList(params) {
  return request.$lmsShopee({
    url: '/shopeecategory/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 修改类目销售利润率
export function updateGrossProfit({ id, grossProfit }) {
  return request.$lmsShopee({
    url: '/shopeecategory/updateGrossProfit',
    method: 'post',
    data: { id, grossProfit }
  })
}
// 更新类目
export function updateCategory(data) {
  return request.$lmsShopee({
    url: '/shopeecategory/categoryUpdate',
    method: 'post',
    data
  })
}
// 类目对照->获取子类目
export function getLevelCategory(params) {
  return request.$lmsShopee({
    url: '/shopeecategory/level/category',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 类目对照保存
export function saveCategoryContrast(params) {
  return request.$lmsShopee({
    url: '/shopeecategory/updateProductCategory',
    method: 'post',
    data: params
  })
}
// 类目对照-根据产品类目获取平台类目
export function checkCategory(params) {
  return request.$lmsShopee({
    url: '/shopeecategory/getByProductCategoryId',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 模糊查询类目接口 - 待联调
export function getCateogries(params) {
  return request.$lmsShopee({
    url: '/shopeecategory/get/categories',
    method: 'get',
    params
  })
}
// 获取类目属性接口 - 待联调
export function getCateogAttr(params) {
  return request.$lmsShopee({
    url: '/shopeecategoryattribute/list',
    method: 'post',
    data: params
  })
}
