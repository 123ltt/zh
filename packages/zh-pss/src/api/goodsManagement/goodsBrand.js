import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplierBrand/list',
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

// 新增保存
export const save = (row) => {
  return request.$pss({
    url: '/supplierBrand/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$pss({
    url: '/supplierBrand/update',
    method: 'post',
    data: row
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/supplierBrand/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/supplierBrand/detail',
    method: 'get',
    params: {
      id
    }
  })
}
