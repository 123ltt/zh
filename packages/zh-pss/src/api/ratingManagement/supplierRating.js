import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplierGrade/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 详情
export const getDetail = (current, size, params) => {
  return request.$pss({
    url: '/supplierGradehi/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 供应商等级接口
export const getGrade = () => {
  return request.$pss({
    url: '/supplierGrade/getAllLevel',
    method: 'get'
  })
}

// 供应商接口
export const getListAll = () => {
  return request.$pss({
    url: '/supplierInfo/listImportedSupplierInfos',
    method: 'get'
  })
}
