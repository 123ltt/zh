import request from '@/router/axios'
/**
 * @typedef  {object} obj
 * @property  {string} storeCode 店铺编号
 * @property  {string} orderTimeStart 付款时间开始 2020-1-23 12:21:45
 * @property  {string} orderTimeEnd 付款时间结束 2020-1-23 12:21:45
 * @property  {string} firstGrabDateStart 抓单时间开始
 * @property  {string} firstGrabDateEnd 抓单时间结束
 * @property  {string} searchType 搜索类型:1:平台单号 2:OMS单号 3:在线SKU 4:跟踪号
 * @property  {string} searchContent 内容
 */

/**
  * ebay平台订单接口
  * @param {obj} data
  */
export const getListPage = (data) => {
  return request.$oms({
    url: '/ebayMain/page',
    method: 'POST',
    data
  })
}

/**
 * ebay平台状态列表接口
 * @param {obj} data
 */
export const getCount = (data) => {
  return request.$oms({
    url: '/ebayMain/countDeliveryStatusTotal',
    method: 'POST',
    data
  })
}

/**
 * 平台订单批量手工同步
 * @param {object} data
 * @param {string} data.store 店铺编码
 * @param {string} data.country 国家二字编码
 * @param {string} data.searchContent 搜索内容，多个单号逗号或者换行隔开
 * @param {string} data.startTime 开始时间
 * @param {string} data.endTime 结束时间
 */
export const batchGrabAndSync = (data) => {
  return request.$oms({
    url: '/ebay/batchGrabAndSync',
    method: 'POST',
    data
  })
}

/**
 * ebay平台订单详情接口
 * @param {string} id 订单号id
 */
export const getDetails = id => request.$oms({
  url: '/ebayMain/detail',
  method: 'POST',
  data: { id }
})

/**
 * ebay日志接口
 * @param {object} data
 * @param {string} data.platOrderId 平台id
 * @param {number} data.current
 * @param {number} data.size
 */
export const getLogsPage = data => request.$oms({
  url: '/ebayHis/page',
  method: 'POST',
  data
})
