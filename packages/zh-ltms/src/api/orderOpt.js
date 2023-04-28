// 导入axios
import request from '@/router/axios'

// 订单优选管理查询
export const getList = (params) => {
  return request.$ltms_optimize({
    url: '/channelESLog/page',
    method: 'post',
    params
  })
}
// 订单优选详情展示
export const getDetail = (params) =>
  request.$ltms_optimize({
    url: '/channelESLog/detail',
    method: 'post',
    params
  })

// 订单重新优选
export const channelOptimize = (params) =>
  request.$ltms_optimize({
    url: '/channelESLog/channelOptimize',
    method: 'post',
    data: params
  })

// 订单通知
export const noticeOptimize = (params) =>
  request.$ltms_optimize({
    url: '/channelESLog/noticeOptimize',
    method: 'post',
    data: params
  })
