import request from '@/router/axios'
/**
 * @typedef  {object} obj
 * @property  {string} storeCode 店铺编号
 * @property  {string} orderTimeStart 付款时间开始 2020-1-23 12:21:45
 * @property  {string} orderTimeEnd 付款时间结束 2020-1-23 12:21:45
 * @property  {string} firstGrabDateStart 抓单时间开始
 * @property  {string} firstGrabDateEnd 抓单时间结束
 * @property  {string} searchType 搜索类型:1-平台单号, 2-OMS单号, 3-在线SKU, 4-跟踪号, 5-收件人姓名
 * @property  {string} searchContent 内容
 */

/**
  * lazada平台订单接口
  * @param {obj} data
  */
export const getListPage = (data) => {
  return request.$oms({
    url: '/lzPlatOrderMain/page',
    method: 'POST',
    data
  })
}

/**
 * lazada平台状态列表接口
 * @param {obj} data
 */
export const getCount = (data) => {
  return request.$oms({
    url: '/lzPlatOrderMain/countStatus',
    method: 'POST',
    data
  })
}

/**
 * 平台订单批量手工同步
 * @param {object} data
 * @param {string} data.storeCode 店铺编码
 * @param {string} data.ordersId 搜索内容，多个单号逗号或者换行隔开
 * @param {string} data.updateTimeAction 开始时间
 * @param {string} data.updateTimeEnding 结束时间
 * @param {string} data.timeType 时间类型
 */
export const batchGrabAndSync = (data) => {
  return request.$oms({
    url: '/lzManualOrderSyn/batchGrabAndSync',
    method: 'POST',
    data
  })
}

/**
 * lazada平台订单详情接口
 * @param {string} data 订单号id
 */
export const getDetails = data => request.$oms({
  url: '/lzPlatOrderMain/detail',
  data
})

/**
 * lazada 日志接口
 * @param {object} data
 * @param {string} data.data 平台id
 * @param {number} data.query.current
 * @param {number} data.query.size
 */
export const getLogsPage = data => request.$oms({
  url: '/lzPlatOrderHis/page',
  method: 'POST',
  data
})
