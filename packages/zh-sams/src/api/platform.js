import request from '@/router/axios'

/**
 * 平台下拉列表
 */
export const platformOption = () => {
  return request.$sams({
    url: '/store/platform/options',
    method: 'POST'
  })
}

/**
 * 获取平台列表
 * @param {platform 平台id } param0
 */
export const platformList = (data) => {
  return request.$sams({
    url: '/store/platform/page',
    method: 'POST',
    data
  })
}

/**
 * 添加平台
 * platformCode 平台编码
 * url 平台url
*/
export const addPlatform = (data) => {
  return request.$sams({
    url: '/store/platform/add',
    method: 'POST',
    data
  })
}

/**
 * 更新平台
*/
export const updatePlatform = (data) => {
  return request.$sams({
    url: '/store/platform/update',
    method: 'POST',
    data
  })
}

/**
 * 查看配置站点接口
 * id 平台id
*/
export const showConfiguredSites = (data) => {
  return request.$sams({
    url: '/store/platform/showConfiguredSites',
    method: 'POST',
    data
  })
}
