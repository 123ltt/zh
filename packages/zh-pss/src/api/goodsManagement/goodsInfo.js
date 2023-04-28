import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/supplierGoods/list',
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

// 商品品牌接口
export const getBrand = (id) => {
  return request.$pss({
    url: `/supplierBrand/listBrand?supplierId=${id}`,
    method: 'get'
  })
}

// 新增
export const save = (obj) => {
  return request.$pss({
    url: '/supplierGoods/save',
    method: 'post',
    data: obj
  })
}

// 编辑
export const update = (obj) => {
  return request.$pss({
    url: '/supplierGoods/update',
    method: 'post',
    data: obj
  })
}

// 开启，停用
export const updateStatus = (id, status) => {
  return request.$pss({
    url: '/supplierGoods/updateStatus',
    method: 'post',
    params: {
      id,
      status
    }
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/supplierGoods/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/supplierGoods/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 生成商品编码
export const getGoodsCode = (supplierId) => {
  return request.$pss({
    url: '/supplierGoods/genGoodsCode',
    method: 'get',
    params: {
      supplierId
    }
  })
}

// 获取商品信息
export const productInfo = (url) => {
  return request.$pss({
    url: '/ali1688/getCrossProductInfo',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    meta: {
      isSerialize: true
    },
    data: {
      url
    }
  })
}
