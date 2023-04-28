import request from '@/router/axios'

/**
 * module: 类目管理
 * 文档地址： http://showdoc.zehui.local/web/#/137?page_id=1099
 **/

// 分页获取类目列表
export function getCategoryList(params) {
  return request.$lmsEbay({
    url: '/category/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 修改类目销售利润率
export function updateGrossProfit({ id, profitRate }) {
  return request.$lmsEbay({
    url: '/category/update/profit',
    method: 'post',
    data: { id, profitRate }
  })
}
// 更新类目
export function updateCategory(params) {
  return request.$lmsEbay({
    url: '/category/update',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 类目对照->获取子类目
export function getLevelCategory(params) {
  return request.$lmsEbay({
    url: '/category/level/category',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 类目对照保存
export function saveCategoryContrast(params) {
  return request.$lmsEbay({
    url: '/category/bind/product/category',
    method: 'post',
    data: params
  })
}
// 类目对照
export function checkCategory(params) {
  return request.$lmsEbay({
    url: '/category/check/bind/category',
    method: 'get',
    params: {
      ...params
    }
  })
}

// 获取单个类目详情
// export function getCateDetail(params) {
//   return request.$lmsEbay({
//     url: '/category/detail',
//     method: 'get',
//     params: {
//       ...params
//     }
//   })
// }

// 获取类目属性列表
export function getCateSpecificList(params) {
  return request.$lmsEbay({
    url: '/ebay/categorys/specific/list',
    method: 'get',
    params
  })
}
// 更新类目属性
export function upateCateAttr(params) {
  return request.$lmsEbay({
    url: '/ebay/categorys/specific/sync',
    method: 'get',
    params
  })
}

// 更新店铺类目接口
export function updateStoreCategory(params) {
  return request.$lmsEbay({
    url: '/store/category/update',
    method: 'post',
    params
  })
}

// 更新店铺类目接口
export function getStoreLevelCategory(params) {
  return request.$lmsEbay({
    url: '/store/category/level/category',
    method: 'get',
    params
  })
}

// 获取状态类型（conditionType）接口
export function getEbayConditionType(params) {
  return request.$lmsEbay({
    url: '/category/get/condition/type',
    method: 'get',
    params
  })
}

// 获取类目列表接口 模糊搜索
export function getCateogries(params) {
  return request.$lmsEbay({
    url: '/category/get/categories',
    method: 'get',
    params
  })
}

// 获取listing可选的模板选项
export function getCompatibilityTemplateList(data) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/templates/options',
    method: 'post',
    data
  })
}
