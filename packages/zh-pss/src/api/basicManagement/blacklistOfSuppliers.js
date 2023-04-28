// 供应商接口文档
import request from '@/router/axios'

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/supplierBlacklist/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 分页
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplierBlacklist/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
// 新增保存
export const save = (status, row) => {
  return request.$pss({
    url: '/supplierBlacklist/save',
    method: 'post',
    data: {
      ...row,
      status
    }
  })
}
// 修改
export const update = (id, row) => {
  return request.$pss({
    url: '/supplierBlacklist/update',
    method: 'post',
    data: {
      ...row,
      id
    }
  })
}
// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/supplierBlacklist/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 供应商接口
export const supplier = () => {
  return request.$pss({
    url: '/supplierInfo/listImportedSupplierInfos',
    method: 'get'
  })
}

// 商品名单
export const getGoods = (supplierId) => {
  return request.$pss({
    url: '/supplierGoods/getGoodsBySupplierId',
    methods: 'get',
    params: {
      supplierId
    }
  })
}

// 商品图片
export const goodsPicture = (goodsId) => {
  return request.$pss({
    url: '/supplierGoods/getOneGoods',
    method: 'get',
    params: {
      goodsId
    }
  })
}

// 图片
export const getPicture = (goodsId) => {
  return request.$pss({
    url: '/supplierGoods/getOneGoods',
    method: 'get',
    params: {
      goodsId
    }
  })
}
