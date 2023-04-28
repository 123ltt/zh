import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplierGoodsPrice/list',
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

// 币种接口
export const getCurrency = () => {
  return request.$ams({
    url: '/dict-biz/dictionary?code=account_currency',
    method: 'get'
  })
}

// 编辑
export const save = (obj) => {
  return request.$pss({
    url: '/supplierGoodsPrice/save',
    method: 'post',
    data: obj
  })
}

// 编辑
export const update = (obj) => {
  return request.$pss({
    url: '/supplierGoodsPrice/update',
    method: 'post',
    data: obj
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/supplierGoodsPrice/update',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/supplierGoodsPrice/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 下载模板
export const downloadTemplate = (supplierGoodsPriceVOList) => {
  return request.$pss({
    url: '/supplierGoodsPrice/exportGoodsPrice',
    method: 'post',
    responseType: 'blob',
    data: supplierGoodsPriceVOList
  })
}

// 导入
export const importTable = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.$pss({
    url: '/supplierGoodsPrice/importGoodsPrice',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
