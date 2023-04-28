import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplierchargeoffperiod/list',
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
    url: '/supplierchargeoffperiod/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$pss({
    url: '/supplierchargeoffperiod/update',
    method: 'post',
    data: row
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/supplierchargeoffperiod/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 启用
export const start = (row) => {
  return request.$pss({
    url: '/supplierchargeoffperiod/start',
    method: 'post',
    data: row
  })
}

// 停用
export const stop = (row) => {
  return request.$pss({
    url: '/supplierchargeoffperiod/stop',
    method: 'post',
    data: row
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/supplierchargeoffperiod/detail',
    method: 'get',
    params: {
      id
    }
  })
}
