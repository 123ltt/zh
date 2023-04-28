import request from '@/router/axios'

/**
 *获取物流商对账列表数据
 */
export const getCheckList = (current, size, params) => {
  return request.$lps({
    url: '/logistic-bill/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *物流商对账调整接口
 */
export const adjustBill = (data) => {
  return request.$lps({
    url: '/logistic-bill/update',
    method: 'post',
    data: {
      ...data
    }
  })
}

/**
 *物流商对账批量删除接口
 */
export const delBill = (data) => {
  return request.$lps({
    url: '/logistic-bill/remove',
    method: 'post',
    params: {
      ...data
    }
  })
}
/**
 *物流商对账按条件删除删除接口
 */
export const conditionDelBill = (data) => {
  return request.$lps({
    url: '/logistic-bill/remove-condition',
    method: 'post',
    params: {
      ...data
    }
  })
}
/**
 *获取操作日志接口
 */
export const getOperationLog = (current, size, params) => {
  return request.$lps({
    url: '/operation-his/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *获取物流商入账列表数据
 */
export const getEntryList = (current, size, params) => {
  return request.$lps({
    url: '/logistic-bill/page-coll',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
/**
 *获取物流商结算列表数据
 */
export const getSettlementList = (current, size, params) => {
  return request.$lps({
    url: '/logistic-settlement/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
/**
 *新增物流结算单
 */
export const addSettlement = (data) => {
  return request.$lps({
    url: '/logistic-settlement/save',
    method: 'post',
    data: {
      ...data
    }
  })
}
/**
 *编辑物流结算单
 */
export const editSettlement = (data) => {
  return request.$lps({
    url: '/logistic-settlement/edit-settle',
    method: 'post',
    data: {
      ...data
    }
  })
}

/**
 *查看结算单详情
 */
export const getSettlementDetail = (current, size, params) => {
  return request.$lps({
    url: '/logistic-settlement/detail',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
/**
 *查看结算单审核/反审核
 */
export const settlementVerify = (params) => {
  return request.$lps({
    url: '/logistic-settlement/verify',
    method: 'post',
    params: {
      ...params
    }
  })
}
/**
 *查看结算单批量删除
 */
export const settlementBatchDele = (params) => {
  return request.$lps({
    url: '/logistic-settlement/remove',
    method: 'post',
    params: {
      ...params
    }
  })
}
/**
 *获取结算单号
 */

export const getSettleNum = (params) => {
  return request.$lps({
    url: '/logistic-settlement/settle-num',
    method: 'get',
    params: {
      ...params
    }
  })
}
