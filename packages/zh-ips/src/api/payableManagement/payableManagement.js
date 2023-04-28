import request from '@/router/axios'

// 列表信息分页接口
/**
 *
 * @param {*formData}  列表信息分页参数
 */
export const getList = (formData) => {
  return request.$purchase({
    url: '/orderShouldPay/page',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

export const getLists = (formData) => {
  return request.$purchase({
    url: '/orderShouldPayDetail/page',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

/**
 *
 * @param {*} 获取供应商信息
 */
export const getSupplierAccount = (id) => {
  return request.$pss({
    url: `/supplierAccount/list/${id}`,
    method: 'get'
  })
}

/**
 *
 * @param {*row}  请款参数
 */
export const save = (row) => {
  return request.$purchase({
    url: '/orderShouldPayDetail/save',
    method: 'post',
    data: row
  })
}

/**
 *
 * @param {*id} 单次详情
 */
export const getSimpleDetail = (id) => {
  return request.$purchase({
    url: `/orderShouldPay/simple/detail/${id}`,
    method: 'get'
  })
}

/**
 *
 * @param {*id} 账期详情
 */
export const getAccountPeriodDetail = (id) => {
  return request.$purchase({
    url: `/orderShouldPay/accountPeriod/detail/${id}`,
    method: 'get'
  })
}

/**
 *
 * @param {*id} 账期详情中应付明细的详情
 */
export const getOrderDetail = (id) => {
  return request.$purchase({
    url: '/purchase/order/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 采购方名称
export const getDemander = () => {
  return request.$purchase({
    url: '/demander/list',
    method: 'get'
  })
}

// 需求方货主
export const getSupplierInfo = () => {
  return request.$pss({
    url: '/supplierInfo/listImportedSupplierInfos',
    method: 'get'
  })
}
