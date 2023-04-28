import request from '@/router/axios'
/**
 *  区域定价模板
 * @param {string} account 店铺名称
 * @param {string} name 模板名称
 */
export function adjustPage(params) {
  return request.$lmsAliExpress({
    url: '/price/adjust/page',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * 新增接口区域定价模板
 * @param {*} data
 */
export function adjustAdd(data) {
  return request.$lmsAliExpress({
    url: '/price/adjust/add',
    method: 'post',
    data
  })
}
/**
 * 更新接口区域定价模板
 * @param {*} data
 */
export function adjustUpdate(data) {
  return request.$lmsAliExpress({
    url: '/price/adjust/update',
    method: 'post',
    data
  })
}

/**
 * 删除区域定价模板
 * @param {string} id 定价模板id
 */
export function adjustDel(id) {
  return request.$lmsAliExpress({
    url: '/price/adjust/remove',
    method: 'post',
    params: { id }
  })
}
/**
 * 区域定价模板详情
 * @param {string} id 定价模板id
 */
export function adjustDetail(id) {
  return request.$lmsAliExpress({
    url: '/price/adjust/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取产品信息模板列表
 */
export function productTempList({ current, size }, params) {
  return request.$lmsAliExpress({
    url: '/productDetailTemplate/list',
    method: 'post',
    params: { current, size },
    data: {
      ...params
    }
  })
}
/**
 * 新增、编辑-产品信息模板初始化
 */
export function getProductTempList(params) {
  return request.$lmsAliExpress({
    url: '/productDetailTemplate/queryList',
    method: 'post',
    params
  })
}
/**
 * 产品信息模板 详情
 */
export function productTempDetail(id) {
  return request.$lmsAliExpress({
    url: '/productDetailTemplate/detail',
    method: 'get',
    params: id
  })
}
/**
 * 获取自定义模板 详情信息
 */
export function productDetailCustomTemplate(data) {
  return request.$lmsAliExpress({
    url: '/productDetailCustomTemplate/getDetails',
    method: 'post',
    data
  })
}
/**
 * 获取产品信息自定义模板列表
 * @param {string} account 店铺名
 * @param {string} templateName 模板名称
 * @param {number} createUser 用户id
 */
export function productCustomTempPage(data) {
  return request.$lmsAliExpress({
    url: '/productDetailCustomTemplate/list',
    method: 'post',
    data
  })
}
/**
 * 删除自定义信息模板
 * @param {json} ids 模板id
 */
export function productCustomTempDel(ids) {
  return request.$lmsAliExpress({
    url: '/productDetailCustomTemplate/remove',
    method: 'post',
    params: ids
  })
}
/**
 * 产品信息编辑-初始化
 * @param {string} id 模板id
 */
export function productCustomTempDetail(id) {
  return request.$lmsAliExpress({
    url: '/productDetailCustomTemplate/detail',
    method: 'get',
    params: id
  })
}
/**
 * 编辑产品信息自定义模板
 * @param {object} data 保存参数
 */
export function productCustomTempUpdate(data) {
  return request.$lmsAliExpress({
    url: '/productDetailCustomTemplate/update',
    method: 'post',
    data
  })
}
/**
 * 新增产品信息自定义模板
 * @param {object} data 保存参数
 */
export function productCustomTempSave(data) {
  return request.$lmsAliExpress({
    url: '/productDetailCustomTemplate/save',
    method: 'post',
    data
  })
}
/**
 * 获取主图
 * @param {object} data 参数
 */
export function getImageUrl(data) {
  return request.$lmsAliExpress({
    url: '/productDetailCustomTemplate/getImageUrl',
    method: 'post',
    data
  })
}

/**
 * 获取所有的调价模板
 * @param {object} data 参数
 */
export function getAllPriceAdjustTemplate(params) {
  return request.$lmsAliExpress({
    url: '/price/adjust/getPriceAdjustTemplateByAccount',
    method: 'get',
    params
  })
}

/**
 * 获取车型库模板列表
 * @param {object} data 参数
 */
export function getCarAttrTemplateList(params) {
  return request.$lmsAliExpress({
    url: '/carAttr/template/get/list',
    method: 'get',
    params
  })
}
/**
 * 分页获取车型库模板列表
 * @param {object} data 参数
 */
export function carAttrTempList(params) {
  return request.$lmsAliExpress({
    url: '/carAttr/template/list',
    method: 'get',
    params
  })
}
/**
 * 分级获取车型库接口
 * @param {number} attributeId 属性ID
 * @param {number} attributeValId attributeValId
 */
export function carAttrChild(params) {
  return request.$lmsAliExpress({
    url: '/car/attribute/get/child',
    method: 'get',
    params
  })
}
/**
 * 分页获取sku绑定车型库模板列表接口
 */
export function carAttrSkuPage(params) {
  return request.$lmsAliExpress({
    url: '/carAttr/sku/list',
    method: 'get',
    params
  })
}
/**
 * 获取运费模板
 */
export function getFreightTemp(params) {
  return request.$lmsAliExpress({
    url: '/aliexpressFreightTemplate/list',
    method: 'get',
    params
  })
}
/**
 * 更新运费模板
 */
export function updateFreightTemp(params) {
  return request.$lmsAliExpress({
    url: '/aliexpressFreightTemplate/sync',
    method: 'get',
    params
  })
}
/**
 * 批量/单个删除接口
 */
export function carAttrSkuDel(id) {
  return request.$lmsAliExpress({
    url: '/carAttr/template/remove',
    method: 'post',
    params: { id }
  })
}
/**
 * sku车型库 批量/单个删除接口
 * @param {string} id id
 * @returns
 */
export function skuDel(ids) {
  return request.$lmsAliExpress({
    url: '/carAttr/sku/remove',
    method: 'post',
    params: { ids }
  })
}

/**
 * 查看详情接口
 */
export function carAttrSkuDetail(params) {
  return request.$lmsAliExpress({
    url: '/carAttr/sku/detail',
    method: 'get',
    params
  })
}
/*
 * 绑定SKU车型库接口
 */
export function carAttrSkuSave(data) {
  return request.$lmsAliExpress({
    url: '/carAttr/sku/save',
    method: 'post',
    data
  })
}

/**
 * 导出车型库模板
 */
export function carAttrTmpeExport(ids) {
  return request.$lmsAliExpress({
    url: '/carAttr/template/export',
    method: 'get',
    responseType: 'blob',
    params: ids
  })
}
/**
 * 导入车型库模板
 */
export function carAttrTmpeImport({ file, templateName }) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('templateName', templateName)
  return request.$lmsAliExpress({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/carAttr/template/import',
    method: 'post',
    timeout: 120000,
    data: formData
  })
}
/*
 * 获取单个车型库模板
 */
export function carAttrTempDetail(id) {
  return request.$lmsAliExpress({
    url: '/carAttr/template/detail',
    method: 'get',
    params: id
  })
}
/**
 * 下载模板
 */
export function downloadTemp() {
  return request.$lmsAliExpress({
    url: '/carAttr/template/download/excel/model',
    method: 'GET',
    responseType: 'blob'
  })
}
/**
 * 车型库模板单个删除接口
 */
export function carAttrTempDel(id) {
  return request.$lmsAliExpress({
    url: '/carAttr/template/remove',
    method: 'post',
    params: id
  })
}
/**
 * 车型库模板批量删除接口
 */
export function carAttrTempBatchDel(ids) {
  return request.$lmsAliExpress({
    url: '/carAttr/template/batch/remove',
    method: 'post',
    params: { ids }
  })
}
/**
 * @description 新建车型库模板
 * @param {*} data {}
 * @returns object
 */
export function carAttrTempSave(data, id) {
  return request.$lmsAliExpress({
    url: id ? '/carAttr/template/update' : '/carAttr/template/save',
    method: 'post',
    data
  })
}
