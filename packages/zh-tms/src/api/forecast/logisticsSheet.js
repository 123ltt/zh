import request from '@/router/axios'
/**
 * 列表查询接口
 */
export const getList = (current, size, params) => request.$tms_forecast({
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
export const getGoodsDetail = (params) => request.$tms_forecast({
  url: '/forecast/order/goods/detail',
  method: 'get',
  params
})

/**
 * 收件人信息
 */
export const getReceiverDetail = (params) => request.$tms_forecast({
  url: '/forecast/receiver/detail',
  method: 'get',
  params
})

/**
 * 费用详情
 */
export const getCostDetail = (params) => request.$tms_forecast({
  url: '/forecast/order/cost/detail',
  method: 'get',
  params
})
