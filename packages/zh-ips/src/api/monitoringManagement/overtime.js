import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$purchase({
    url: '/monitor/overtime/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 采购方名称查询
export const getPurSquareName = () => {
  return request.$purchase({
    url: '/demander/list/purSquareInfo',
    method: 'get'
  })
}

// 供应商名称查询
export const getSupplierName = () => {
  return request.$pss({
    url: '/supplierInfo/listImportedSupplierInfos',
    method: 'get'
  })
}
