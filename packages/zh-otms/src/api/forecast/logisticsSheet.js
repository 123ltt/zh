import request from '@/router/axios'
/**
 * 列表查询接口
 */
export const getList = (current, size, params) =>
  request.$otms_forecast({
    url: '/forecast/order/detail',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })

/**
 * 查询产品详情 数据
 */
export const getGoodsDetail = (params) =>
  request.$otms_forecast({
    url: '/forecast/order/goods/detail',
    method: 'get',
    params
  })

/**
 * 收件人信息
 */
export const getReceiverDetail = (params) =>
  request.$otms_forecast({
    url: '/forecast/receiver/detail',
    method: 'get',
    params
  })

/**
 * 费用详情
 */
export const getCostDetail = (params) =>
  request.$otms_forecast({
    url: '/forecast/order/cost/detail',
    method: 'get',
    params
  })
// 导出订单数据
export const exportLgList = (params) => {
  return request.$ltms_forecast({
    url: '/forecast/order/export/detail',
    method: 'get',
    responseType: 'blob',
    timeout: 60000,
    params
  })
}
