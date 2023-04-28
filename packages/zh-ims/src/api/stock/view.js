import request from '@/router/axios'

/**
 *
 * @param {Number} current 当前页
 * @param {Number} size 每页最大记录数
 * @param {Object} params 查询条件
 */
export const getList = (current, size, params) => {
  return request.$ims({
    url: '/stock/listProductStockOfOwner',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *
 * @param {sting} id 请求详情时传入的id
 */
export const getDetail = (data) => {
  return request.$ims({
    url: '/stock/stockDetail',
    method: 'get',
    params: {
      ...data
    }
  })
}

/**
 *
 * @param 请求组织架构
 */
export const getOrg = () => {
  return request.$ims({
    url: '/tenant/getTenantOrganizationTree',
    method: 'get'
  })
}

/**
 *
 * @param {String} stockId 请求采购中的明细参数
 */
export const getPurchasingDetail = (current, size, params) => {
  return request.$ims({
    url: '/stock/purchasingStockDetail',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *
 * @param {String} stockId 请求在途的明细参数
 */
export const getIntransitDetail = (current, size, params) => {
  return request.$ims({
    url: '/stock/intransitStockDetail',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *
 * @param {String} stockId 请求采购中的明细参数
 */
export const getAvailableDetail = (current, size, params) => {
  return request.$ims({
    url: '/stock/availableStockDetail',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *
 * @param {String} stockId 请求备用的明细参数
 */
export const getReserveDetail = (current, size, params) => {
  return request.$ims({
    url: '/stock/reserveStockDetail',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *
 * @param {String} stockId 请求在库的明细参数
 */
export const getInWarehouseDetail = (current, size, params) => {
  return request.$ims({
    url: '/stock/inWarehouseStockDetail',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *
 * @param {String} stockId 请求冻结的明细参数
 */
export const getFreezeDetail = (current, size, params) => {
  return request.$ims({
    url: '/stock/freezeStockDetail',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *
 * @param {String} stockId 请求缺货的明细参数
 */
export const getOosDetail = (current, size, params) => {
  return request.$ims({
    url: '/stock/oosDetail',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 * @param  请求业务类型
 */
export const getType = (label) => {
  return request.$ims({
    url: '/businessType/list',
    method: 'get',
    params: {
      label
    }
  })
}
