import request from '@/router/axios'

/**
 * module: 类目管理
 * 文档地址： http://showdoc.zehui.local/web/#/14
 **/

// 分页获取类目列表
export function getCategoryList(params) {
  return request.$lmsAmazon({
    url: '/amazoncategory/list',
    method: 'get',
    params: {
      // browseNodeName, browseNodeId, current, size
      ...params
    }
  })
}
// 修改类目销售利润率
export function updateGrossProfit({ id, grossProfit }) {
  return request.$lmsAmazon({
    url: '/amazoncategory/update',
    method: 'post',
    data: { id, grossProfit }
  })
}
// 更新类目
export function updateCategory(params) {
  return request.$lmsAmazon({
    url: '/amazoncategory/update/category',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 类目对照->获取子类目
export function getLevelCategory(params) {
  return request.$lmsAmazon({
    url: '/amazoncategory/level/category',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 类目对照保存
export function saveCategoryContrast(params) {
  return request.$lmsAmazon({
    url: '/amazoncategory/bind/product/category',
    method: 'post',
    data: params
  })
}
// 类目对照
export function checkCategory(params) {
  return request.$lmsAmazon({
    url: '/amazoncategory/check/bind/category',
    method: 'get',
    params: {
      ...params
    }
  })
}

// 获取单个类目详情
export function getCateDetail(params) {
  return request.$lmsAmazon({
    url: '/amazoncategory/detail',
    method: 'get',
    params: {
      ...params
    }
  })
}
