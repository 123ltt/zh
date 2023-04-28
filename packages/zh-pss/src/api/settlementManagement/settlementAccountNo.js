import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplierAccount/list',
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

// 开户银行接口
export const getBank = () => {
  return request.$ams({
    url: '/dict-biz/dictionary?code=account_bank',
    method: 'get'
  })
}

// 币种接口
export const getCurrency = () => {
  return request.$pss({
    url: '/dict-biz/dictionary?code=pss_account_currency',
    method: 'get'
  })
}

// 新增保存
export const save = (row) => {
  return request.$pss({
    url: '/supplierAccount/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$pss({
    url: '/supplierAccount/update',
    method: 'post',
    data: row
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/supplierAccount/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/supplierAccount/detail',
    method: 'get',
    params: {
      id
    }
  })
}
