import request from '@/router/axios'

/**
 * @description: 刊登模板分页 文档地址： http://showdoc.zehui.local/web/?#/137?page_id=1166
 **/
export function getTemplateList(params) {
  return request.$lmsEbay({
    url: '/ebay/listing/templates/page',
    method: 'get',
    params
  })
}
/**
 * @description: 模板生成描述 文档地址： http://showdoc.zehui.local/web/?#/137?page_id=1167
 **/
export function getTemplateContent(data) {
  return request.$lmsEbay({
    url: '/ebay/listing/templates/generate/content',
    method: 'post',
    data
  })
}

/**
 * @description: 查看当前店铺授权的刊登模板 文档地址： http://showdoc.zehui.local/web/?#/137?page_id=1302
 **/
export function getTemplatePage(data) {
  return request.$lmsEbay({
    url: '/ebay/listing/templates/with-shop-page',
    method: 'get',
    params: data
  })
}
/**
 * @description: 获取政策模板分页详情  文档地址：http://showdoc.zehui.local/web/#/137?page_id=1403
**/
export function getPolicyPage(params) {
  return request.$lmsEbay({
    url: '/ebay/business/policy/page',
    method: 'get',
    params
  })
}
/**
 * @description: 修改指定id的政策模板状态  文档地址：http://showdoc.zehui.local/web/#/137?page_id=1404
**/
export function updatePolicyStatus(data) {
  return request.$lmsEbay({
    url: '/ebay/business/policy/status',
    method: 'post',
    params: { ...data }
  })
}
/**
 * @description: 新增政策模板内容  文档地址：http://showdoc.zehui.local/web/#/137?page_id=1338
**/
export function addPolicyTemplate(data) {
  return request.$lmsEbay({
    url: '/ebay/business/policy/save',
    method: 'post',
    data
  })
}
/**
 * @description: 更新政策模板内容  文档地址：http://showdoc.zehui.local/web/#/137?page_id=1339
**/
export function editPolicyTemplate(data) {
  return request.$lmsEbay({
    url: '/ebay/business/policy/update',
    method: 'post',
    data
  })
}
/**
 * @description: Paypal账号列表-分页多条件  文档地址：https://www.showdoc.com.cn/1079823493627381?page_id=6061670935832647
**/
export function getPaypalList(data) {
  return request.$sams({
    url: '/store/ebay-paypal/page',
    method: 'post',
    data
  })
}
/**
 * 获取 Listing 运输项列表
 * @param {string} siteCode 站点编号
 * @param {string} storeAccount 店铺编号
 * @param {string} itemType 运输项类型，
 */
export function getShoppingItems(data) {
  return request.$lmsEbay({
    url: '/ebay/common/shipping/items',
    method: 'get',
    params: data
  })
}
/**
 * @description: 获取指定站点和店铺的买家要求基础数据
**/
export function getBuyerItems(params) {
  return request.$lmsEbay({
    url: '/ebay/common/buyer/items',
    method: 'get',
    params
  })
}
/**
 * @description: 获取政策模板列表
**/
export function getPolicyList(params) {
  return request.$lmsEbay({
    url: '/ebay/business/policy/select',
    method: 'get',
    params
  })
}
/**
 * @description: 新增listing时获取政策模板内容详情,根据ID的不同，返回具体类型的信息
**/
export function getPolicyDetails(params) {
  return request.$lmsEbay({
    url: '/ebay/business/policy/detail-listing',
    method: 'get',
    params
  })
}
/**
 * @description: 获取默认的政策模板集合，根据政策类型区分
**/
export function getPolicyDefaults(params) {
  return request.$lmsEbay({
    url: '/ebay/business/policy/defaults',
    method: 'get',
    params
  })
}
/**
 * @description: 获取SKU车型库分页列表
**/
export function getSkuCarList(params) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/sku/page',
    method: 'get',
    params
  })
}
/**
 * @description: 绑定一个或多个产品SKU到模板和站点
**/
export function bindSku(data) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/sku/bind',
    method: 'post',
    data
  })
}
/**
 * @description: 删除一个或多个ID的SKU车型库
**/
export function deleteSkuCar(ids) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/sku/remove',
    method: 'post',
    params: ids
  })
}
/**
 * @description: 获取车型库模板列表
**/
export function getCarTempList(params) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/templates/page',
    method: 'get',
    params
  })
}
/**
 * @description: 获取车型库模板详情
**/
export function getCarTempDetail(params) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/templates/detail',
    method: 'get',
    params
  })
}
/**
 * @description: 新增车型库模板
**/
export function saveCarTemplate(data) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/templates/save',
    method: 'post',
    data
  })
}
/**
 * @description: 修改车型库模板
**/
export function updateCarTemplate(data) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/templates/update',
    method: 'post',
    data
  })
}
/**
 * @description: 删除车型库模板
**/
export function removeCarTemplate(ids) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/templates/remove',
    method: 'post',
    params: { ids }
  })
}
/**
 * @description: 导入车型库模板
**/
export function importCarTemplate(data) {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })
  return request.$lmsEbay({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/ebay/compatibility/templates/import',
    method: 'post',
    timeout: 120000,
    data: formData
  })
}
/**
 * @description: 导出车型库模板
**/
export function exportCarTemplate(params) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/templates/export',
    method: 'get',
    responseType: 'blob',
    params
  })
}
/**
 * @description: 下载导入车型库模板
**/
export function downloadCarTemplate(params) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/templates/download/template',
    method: 'get',
    responseType: 'blob',
    params
  })
}
/**
 * @description: 获取站点默认的车型库属性名称
**/
export function getSiteDefaultNames(params) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/names/site-default-compatibility-names',
    method: 'get',
    params
  })
}
/**
 * @description: 获取兼容属性可选值
**/
export function getValuesBulkOptions(data) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/values/bulk/options',
    method: 'post',
    data
  })
}
/**
 * @description: 生成车型库表格数据
**/
export function generateTableData(data) {
  return request.$lmsEbay({
    url: '/ebay/compatibility/values/generate',
    method: 'post',
    data
  })
}
