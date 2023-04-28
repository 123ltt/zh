import request from '@/router/axios'

/**
 * module: 模板列表
 * 文档地址： http://showdoc.zehui.local/web/#/14
 **/

// 模板列表分页查询
export function amazonTemplatePage({ name, templateStatus, current, size }) {
  return request.$lmsAmazon({
    url: '/amazon/template/page',
    method: 'get',
    params: { name, templateStatus, current, size }
  })
}
/**
 * 模板列表之状态下拉框
*/
export function amazonTemplateStatus() {
  return request.$lmsAmazon({
    url: '/amazon/template/list-status',
    method: 'get'
  })
}
/**
 * 根据类目关联模板名称接口
*/
export function templateName(data) {
  return request.$lmsAmazon({
    url: '/amazon/relation-category/get-template',
    method: 'post',
    params: data
  })
}
/**
 * 模板名称下拉框
*/
export function tempOption() {
  return request.$lmsAmazon({
    url: '/amazon/template/options',
    method: 'get'
  })
}
/**
 * 启用或者禁用模板
*/
export function templateUpdateStatus({ id, templateStatus }) {
  return request.$lmsAmazon({
    url: '/amazon/template/update-status',
    method: 'post',
    data: { id, templateStatus }
  })
}

/**
 * 获取模板下的属性接口
*/
export function getTemplateAttrList(data) {
  return request.$lmsAmazon({
    url: '/amazon/attr/list-by-template-name',
    method: 'get',
    params: { ...data }
  })
}
/**
 * 刊登页面获取属性接口
*/
export function getPublishAttr(data) {
  return request.$lmsAmazon({
    url: '/amazon/attr/get-publish-attr',
    method: 'get',
    params: { ...data }
  })
}
/**
 * 设置模板属性接口
 *
*/
/**
 *
 * @param {string} params.templateName
 * @param {object} [data]
 */
export function saveSetting(params, data) {
  return request.$lmsAmazon({
    url: '/amazon/attr/setting',
    method: 'post',
    params,
    data
  })
}
/**
 * 分配类目
*/
export function saveRelationCategory(data) {
  return request.$lmsAmazon({
    url: '/amazon/relation-category/alloc',
    method: 'post',
    data
  })
}

/**
 * 获取变体属性
*/
export function getVariationTheme(data) {
  return request.$lmsAmazon({
    url: '/amazon/attr/get-variation-theme',
    method: 'get',
    params: data
  })
}

/**
 * 获取变体属性
*/
export function getVariationAttr(data) {
  return request.$lmsAmazon({
    url: '/amazon/attr/get-variant-attr',
    method: 'get',
    params: data
  })
}
/**
 * 获取直接下级属性
*/
export function getChildren(data) {
  return request.$lmsAmazon({
    url: '/amazon/attr/get-children',
    method: 'post',
    data
  })
}
/**
 * 获取模板的第一级属性
*/
export function getOneLevel(data) {
  return request.$lmsAmazon({
    url: '/amazon/attr/get-one-level',
    method: 'post',
    data
  })
}
