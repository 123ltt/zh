import request from '@/router/axios'

/**
 * 站点列表
*/
export const pageList = (data) => {
  return request.$sams({
    url: '/store/site/page',
    method: 'POST',
    data
  })
}

// 站点下拉列表
export const siteOption = (data) => {
  return request.$sams({
    url: '/store/site/options',
    method: 'POST',
    data
  })
}

/**
 * 添加站点
*/
export const addSite = (data) => {
  return request.$sams({
    url: '/store/site/add',
    method: 'POST',
    data
  })
}

/**
 * 更新站点
*/
export const updateSite = (data) => {
  return request.$sams({
    url: '/store/site/update',
    method: 'POST',
    data
  })
}

/**
 * 查询所有的站点code
*/
export const listAllSite = () => {
  return request.$sams({
    url: '/store/site/listAllSite',
    method: 'POST'
  })
}
/**
 * 站点下拉项-平台简码
 * @param {string} platformCode 平台简码
 */
export const platformCode = (data) => {
  return request.$sams({
    url: '/store/site/optionsWithPlatformCode',
    method: 'POST',
    data
  })
}
/**
 * 店铺下拉项-平台简码
 * @param {string} platformCode 平台简码
 * @param {string} siteId 站点ID
 */
export const storePlatformCode = (data) => {
  return request.$sams({
    url: '/store/optionsWithPlatformCode',
    method: 'POST',
    data
  })
}
/**
 * 店铺下拉项-平台简码 无权限
 * @param {string} platformCode 平台简码
 * @param {string} siteId 站点ID
 */
export const storePlatformCodeByAdmin = (data) => {
  return request.$sams({
    url: '/store/optionsWithPlatformCodeByAdmin',
    method: 'POST',
    data
  })
}
