import request from '@/router/axios'

/**
 * 日志列表
 * @param {string} params current size
 */
export function logList(params) {
  return request.$lmsAliExpress({
    url: '/listing/log/page',
    method: 'get',
    params
  })
}
/**
 * 类目日志
 * @param {object} data
 */
export function aliexpressopslogList(params) {
  return request.$lmsAliExpress({
    url: '/aliexpressopslog/list',
    method: 'get',
    params
  })
}
