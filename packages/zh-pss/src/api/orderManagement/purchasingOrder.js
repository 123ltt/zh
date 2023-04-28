import request from '@/router/axios'

// 发货
export const deliverGoods = (id, params) => {
  return request.$pss({
    url: '/supplier/purchase/deliver',
    method: 'post',
    data: {
      ...params,
      id
    }
  })
}
// 详情
export const detail = (id) => {
  return request.$pss({
    url: '/supplier/purchase/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 详情
export const detailByPurCode = (purchaseCode) => {
  return request.$pss({
    url: '/supplier/purchase/detailByPurCode',
    method: 'get',
    params: {
      purchaseCode
    }
  })
}
// 订单处理
export const apiProcess = (id, params) => {
  return request.$pss({
    url: '/supplier/purchase/handle',
    method: 'post',
    data: {
      ...params,
      id
    }
  })
}
// 分页
export const paging = (current, size, params) => {
  return request.$pss({
    url: '/supplier/purchase/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
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

// 合同接口
export const contract = () => {
  return request.$pss({
    url: '/supplier/purchase/generatePurchaseContract',
    method: 'post'
  })
}
// 物流商接口
export const logisticsProvider = () => {
  return request.$pss({
    url: '/tms/logistics/provider/listAll',
    method: 'get'
  })
}
