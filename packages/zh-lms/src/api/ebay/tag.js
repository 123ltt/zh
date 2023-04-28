import request from '@/router/axios'

/**
 * module: 标签
 * 文档地址： http://showdoc.zehui.local/web/#/137?page_id=1115
 **/

// 分页获取标签类型列表
export function getTagTypeList(params) {
  return request.$lmsEbay({
    url: '/ebay/tag-type/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 获取标签类型列表
export function getTagType(params) {
  return request.$lmsEbay({
    url: '/ebay/tag-type/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增标签类型
export function saveTagType(params) {
  return request.$lmsEbay({
    url: '/ebay/tag-type/save',
    method: 'post',
    data: params
  })
}
// 编辑标签类型
export function updateTagType(params) {
  return request.$lmsEbay({
    url: '/ebay/tag-type/update',
    method: 'post',
    data: params
  })
}
// 删除标签类型
export function removeTagType(ids) {
  return request.$lmsEbay({
    url: '/ebay/tag-type/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
// 修改标签类型状态
export function editTagTypeStatus(params) {
  return request.$lmsEbay({
    url: '/ebay/tag-type/status',
    method: 'post',
    params: {
      ...params
    }
  })
}
/*
 * 标签内容
 */
// 分页获取标签内容列表
export function getTagContentList(params) {
  return request.$lmsEbay({
    url: '/ebay/tag-content/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增标签内容
export function saveTagContent(params) {
  return request.$lmsEbay({
    url: '/ebay/tag-content/save',
    method: 'post',
    data: params
  })
}
// 修改标签内容
export function updateTagContent(params) {
  return request.$lmsEbay({
    url: '/ebay/tag-content/update',
    method: 'post',
    data: params
  })
}
// 删除标签内容
export function removeTagContent(ids) {
  return request.$lmsEbay({
    url: '/ebay/tag-content/remove',
    method: 'post',
    params: { ids }
  })
}
// 修改标签内容状态
export function editTagContentStatus(params) {
  return request.$lmsEbay({
    url: '/ebay/tag-content/status',
    method: 'post',
    params: { ...params }
  })
}

/**
 * module: 模板
 * 文档地址： http://showdoc.zehui.local/web/#/137?page_id=1166
 **/
// 模板分页列表
export function getTemplateList(params) {
  return request.$lmsEbay({
    url: '/ebay/listing/templates/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增模板
export function addTemplate(params) {
  return request.$lmsEbay({
    url: '/ebay/listing/templates/save',
    method: 'post',
    data: params
  })
}
// 修改模板
export function updateTemplate(params) {
  return request.$lmsEbay({
    url: '/ebay/listing/templates/update',
    method: 'post',
    data: params
  })
}
// 删除模板
export function removeTemplate(ids) {
  return request.$lmsEbay({
    url: '/ebay/listing/templates/remove',
    method: 'post',
    params: { ids }
  })
}
// 停用模板
export function disableTemplate(ids) {
  return request.$lmsEbay({
    url: '/ebay/listing/templates/disable',
    method: 'get',
    params: {
      ids
    }
  })
}
// 启用模板
export function enableTemplate(ids) {
  return request.$lmsEbay({
    url: '/ebay/listing/templates/enable',
    method: 'get',
    params: {
      ids
    }
  })
}
// 模板详情
export function templateDetail(params) {
  return request.$lmsEbay({
    url: '/ebay/listing/templates/detail',
    method: 'get',
    params: {
      ...params
    }
  })
}
/*
  模板分配列表
*/
// 模板分配列表
export function templateShopsList(params) {
  return request.$lmsEbay({
    url: '/ebay/listing-template-shops/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增模板分配列表
export function addTemplateShops(params) {
  return request.$lmsEbay({
    url: '/ebay/listing-template-shops/save',
    method: 'post',
    data: params
  })
}
// 编辑模板分配列表
export function updateTemplateShops(params) {
  return request.$lmsEbay({
    url: '/ebay/listing-template-shops/update',
    method: 'post',
    data: params
  })
}
// 删除模板分配列表
export function deleteTemplateShops(ids) {
  return request.$lmsEbay({
    url: '/ebay/listing-template-shops/remove',
    method: 'post',
    params: { ids }
  })
}
