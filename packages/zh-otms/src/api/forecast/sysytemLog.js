import request from '@/router/axios'
/**
 * 分页接口
 * @param {*} current
 * @param {*} size
 * @param {*} params
 */
export const getList = (current, size, params) =>
  request.$otms_forecast({
    url: '/forecast/log/blogs',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
/**
   * 消息重试接口
   */
export const logRetry = (params) =>
  request.$otms_forecast({
    url: '/forecast/log/retry',
    method: 'post',
    data: params
  })
