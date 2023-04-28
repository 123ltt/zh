import request from '@/router/axios'

// 表格数据
export const getList = (current, size, params) => {
  return request.$fps({
    url: '/purchase/refund/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

// 驳回
export const refundReject = (data) => {
  return request.$fps({
    url: '/purchase/refund/reject',
    method: 'post',
    data
  })
}

// 审核
export const approve = (data) => {
  return request.$fps({
    url: '/purchase/refund/approve',
    method: 'post',
    data
  })
}

// 详情
export const detail = (id) => {
  return request.$fps({
    url: '/purchase/refund/detail/{id}',
    method: 'get',
    id
  })
}
