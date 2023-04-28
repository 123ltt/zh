import request from '@/router/axios'
/**
 * 列表查询接口
 */
export const getList = (current, size, params) => request.$tms_forecast({
  url: '/forecast/senderConfig/list',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})
/**
 *新增配置接口
 */
export const addConfiguration = (data) => request.$tms_forecast({
  url: '/forecast/senderConfig/add',
  method: 'post',
  data
})
/**
 * 更新配置接口
 * @param {*} data
 */
export const updateConfiguration = (data) => request.$tms_forecast({
  url: '/forecast/senderConfig/update',
  method: 'post',
  data
})
/**
 * 删除配置接口
 * @param {*} id
 */
export const deleConfiguration = (id) => request.$tms_forecast({
  url: `/forecast/senderConfig/deleted?id=${id}`,
  method: 'get',
  params: {
  }
})
