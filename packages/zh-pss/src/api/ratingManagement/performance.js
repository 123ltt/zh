import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplierPerformance/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 详情
export const detail = (supplierId) => {
  return request.$pss({
    url: '/supplierPerformance/listHis',
    method: 'get',
    params: {
      supplierId
    }
  })
}
