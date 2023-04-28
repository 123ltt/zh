import request from '@/router/axios'

// 详情
export const detail = (id) => {
  return request.$purchase({
    url: '/purchase/order/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 订单处理
export const apiProcess = (id, params) => {
  return request.$pss({
    url: '/supplier/purchase/handle',
    method: 'post',
    data: {
      ...params,
      id
    }
  })
}
// 合同接口
export const contract = () => {
  return request.$pss({
    url: '/supplier/purchase/generatePurchaseContract',
    method: 'post'
  })
}

// 物流商接口
export const logisticsProvider = () => {
  return request.$purchase({
    url: '/tms/logistics/provider/listAll',
    method: 'get'
  })
}
