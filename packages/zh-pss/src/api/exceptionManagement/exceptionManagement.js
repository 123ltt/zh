import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplierAbnormal/list',
    method: 'get',
    params: {
      ...params,
      current,
      descs: 'id',
      size
    }
  })
}
// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/supplierAbnormal/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 处理
export const handle = (row) => {
  return request.$pss({
    url: '/supplierInspectVerify/handle',
    method: 'post',
    data: row
  })
}
