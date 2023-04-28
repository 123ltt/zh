import request from '@/router/axios'

export function getPageList(params, data) {
  return request.$oms({
    url: '/oms/performanceReport/orderAnalysis',
    method: 'post',
    data: data,
    params: params
  })
}

// 订单分析页面 echart图数据
export function getChart(params, data) {
  return request.$oms({
    url: '/oms/performanceReport/orderAnalysisForGraph',
    method: 'post',
    data: data,
    params: params
  })
}
