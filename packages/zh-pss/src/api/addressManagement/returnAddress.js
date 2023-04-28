import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplierReturnAddress/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 供应商接口
export const getListAll = () => {
  return request.$pss({
    url: '/supplierInfo/listImportedSupplierInfos',
    method: 'get'
  })
}

// 地址接口
export const getlistAddress = () => {
  return request.$pss({
    url: '/supplierDistrict/listAddress',
    method: 'get'
  })
}

// 新增保存
export const save = (row) => {
  return request.$pss({
    url: '/supplierReturnAddress/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$pss({
    url: '/supplierReturnAddress/update',
    method: 'post',
    data: row
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/supplierReturnAddress/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
