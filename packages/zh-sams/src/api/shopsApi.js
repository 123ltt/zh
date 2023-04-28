import request from '@/router/axios'

/**
 * 店铺API授权分页列表
 */
export const pageAuths = (data) => {
  return request.$sams({
    url: '/store/auth/pageAuths',
    method: 'POST',
    data
  })
}

/**
 * 普通授权接口 添加授权
 */
export const createAuthorize = (data) => {
  return request.$sams({
    url: '/store/auth/authorize',
    method: 'POST',
    data
  })
}

/**
 * 日志分页列表接口
 */
export const recordList = (id) => {
  return request.$sams({
    url: '/store/auth-his/page',
    method: 'POST',
    data: id
  })
}

/**
 * 获取指定站点配置参数列表接口
 */
export const paramsList = (data) => {
  return request.$sams({
    url: '/store/auth/params',
    method: 'POST',
    data
  })
}

/**
 * 店铺API授权删除接口
 */
export const delRecord = (id) => {
  return request.$sams({
    url: '/store/auth/delAuth',
    method: 'POST',
    data: id
  })
}

/**
 * 获取站点下的店铺列表
 * platformId 平台id
 * siteId 站点id
*/
export const getStoreBySiteId = (data) => {
  return request.$sams({
    url: '/store/getStoreBySiteId',
    method: 'POST',
    data
  })
}

/**
 * 店铺编号下拉列表
 * platformId 平台id
 * siteId 站点id
*/
export const storCodeOption = (data) => {
  return request.$sams({
    url: '/store/options',
    method: 'POST',
    data
  })
}
/**
 * 更新店铺授权
*/
export const updateParamValue = (data) => {
  return request.$sams({
    url: '/store/auth/updateParamValue',
    method: 'POST',
    data
  })
}
/**
 * 更新店铺参数-数据回显
*/
export const storeDetail = (data) => {
  return request.$sams({
    url: '/store/auth/detail',
    method: 'POST',
    data
  })
}
/**
 * 根据关键词获取平台下的店铺列表
 * @param {String} platformCode
 * @param {String} keywords
 */
export const storesByPlatformAndKeyword = ({ platformCode, keywords = '' }) => {
  return request.$sams({
    url: '/store/optionsWithKeywords',
    method: 'post',
    data: { platformCode, keywords }
  })
}
/**
 * 刷新授权
 * @param {String} platformCode 平台简码
 * @param {String} name 店铺名称
 * @returns
 */
export const refreshAuthorization = ({ platformCode, name }, prefix) => {
  return request.$sams({
    url: `/store/seller-auth/${prefix}refreshAuthorization`,
    method: 'get',
    params: { platformCode, name }
  })
}
/**
 * Lazada ebay授权URL
 * @param {String} storeCode 店铺编号
 * @returns string
 */
export const authorizationUrl = ({ storeCode }, prefix) => {
  return request.$sams({
    url: `/store/seller-auth/${prefix}/authorizationUrl`,
    method: 'get',
    params: { storeCode }
  })
}
