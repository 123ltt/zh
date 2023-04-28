import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplierInfo/list',
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
    url: '/supplierInfo/listAll',
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

// 主要类目接口
export const getCateGoryChild = () => {
  return request.$pss({
    url: '/category/getCateGoryChild',
    method: 'get'
  })
}

// 新增保存
export const save = (row) => {
  return request.$pss({
    url: '/supplierInfo/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$pss({
    url: '/supplierInfo/update',
    method: 'post',
    data: row
  })
}

// 提交
export const submit = (row) => {
  return request.$pss({
    url: '/supplierInfo/submit',
    method: 'post',
    data: row
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/supplierInfo/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/supplierInfo/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 审核
export const audit = (row) => {
  return request.$pss({
    url: '/supplierVerify/save',
    method: 'post',
    data: row
  })
}

// 审核后详情
export const getAuditDetail = (supplierId) => {
  return request.$pss({
    url: '/supplierVerify/detail',
    method: 'get',
    params: {
      supplierId
    }
  })
}

// 根据名称查询供应商公司信息
export const getSupplierDetailByName = (creditCode) => {
  return request.$pss({
    url: '/supplierInfo/searchByCreditCode',
    method: 'get',
    params: {
      creditCode
    }
  })
}
