import request from '@/plugins/request'

// walmart平台订单列表
export const getWmPlatList = data => {
  return request.$oms({
    url: '/walmart/page',
    method: 'POST',
    data
  })
}

// walmart平台详情  可合并订单列表
export const getWmPlatMergeList = data => {
  return request.$oms({
    url: '/walmart/mergePage',
    method: 'POST',
    data
  })
}

/**
 * walmart平台详情  合并订单操作
 * @param {object} data
 * @param {string} data.storeCode 店铺编码
 * @param {string} data.orderIds 订单号
 * @returns
 */
export const getWmPlatMerge = data => {
  return request.$oms({
    url: '/walmart/merge',
    method: 'POST',
    data
  })
}

// walmart平台详情页日志列表
export const getLogList = purchaseOrderId => {
  return request.$oms({
    url: '/wmplatOrderhis/page',
    params: { purchaseOrderId }
  })
}
// walmart平台状态数量统计
export const getCountList = data => {
  return request.$oms({
    url: '/walmart/count',
    method: 'POST',
    data
  })
}

// 获取标记的itemID
export const getItems = params => {
  return request.$oms({
    url: '/walmart/items',
    params
  })
}

/**
 * walmart手工同步
 * @param {object} data
 */
export const batchGrabAndSync = data => {
  return request.$oms({
    url: '/wmManualOrderSyn/batchGrabAndSync',
    method: 'POST',
    data
  })
}
