import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplierAssign/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 供应商名称接口
export const getListAll = () => {
  return request.$pss({
    url: '/supplierInfo/listImportedSupplierInfos',
    method: 'get'
  })
}

// 角色接口
export const getUserlist = () => {
  return request.$ams({
    url: '/user/conciseInfo/page?current=1&size=-1',
    method: 'get'
  })
}

// 新增保存
export const save = (row) => {
  return request.$pss({
    url: '/supplierAssign/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$pss({
    url: '/supplierAssign/update',
    method: 'post',
    data: row
  })
}

// 修改
export const getDetail = (id) => {
  return request.$pss({
    url: '/supplierAssign/detail',
    method: 'get',
    params: {
      id
    }
  })
}
