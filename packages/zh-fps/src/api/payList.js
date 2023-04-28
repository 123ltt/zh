import request from '@/router/axios'

// 表格数据
export const getList = (current, size, params) => {
  return request.$fps({
    url: '/payment/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

// 驳回
export const rejectPay = (data) => {
  return request.$fps({
    url: '/payment/reject-pay',
    method: 'post',
    data
  })
}

// 批量付款-批量会计审核-批量出纳审核
export const batchPay = (data) => {
  return request.$fps({
    url: '/payment/batch-pay',
    method: 'post',
    data
  })
}

// 详情
export const detailInfo = (id) => {
  return request.$fps({
    url: `/payment/detail/${id}`,
    method: 'get'
  })
}

// 跟新付款单状态-会计出纳审核
export const updatestatus = (data) => {
  return request.$fps({
    url: '/payment/update/status',
    method: 'post',
    data
  })
}

// 采购主体-新
export const purchaseDictionary = (params) => {
  return request.$fps({
    url: '/dict-biz/purchase/dictionary',
    method: 'get',
    params
  })
}
