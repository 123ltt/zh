import request from '@/router/axios'

export function batchfeedList(params) {
  return request.$lmsData({
    url: '/batchfeed/list',
    method: 'get',
    params: { ...params }
  })
}
/**
 * 获取批量处理类型
 */
export function batchFeedType() {
  return request.$lmsData({
    url: '/constant/batchFeedType',
    method: 'get'
  })
}
/**
 * 平台下拉列表
 */
export const platformOption = () => {
  return request.$sams({
    url: '/store/platform/options',
    method: 'POST'
  })
}
/**
 * 明细
 */
export const batchfeedDetailList = ({ current, size }, params) => {
  return request.$lmsData({
    url: '/batchfeeddetail/list',
    method: 'post',
    params: { current, size },
    data: { ...params }
  })
}
/**
 * 下载结果
 * @param {number} id 模板id
 * @returns 文件流
 */
export const batchfeedDown = (id) => {
  return request.$lmsData({
    url: '/batchfeed/download',
    method: 'get',
    params: id,
    responseType: 'blob'
  })
}
/**
 * 图片域名列表
 */
export const imglist = (data) => {
  return request.$trs({
    url: '/imageConfig/list',
    method: 'POST',
    data
  })
}
// 添加/编辑域名
export const imgAddorUpdate = (type, data) => {
  const url = type === 'add' ? '/imageConfig/save' : '/imageConfig/update'
  return request.$lmsData({
    url,
    method: 'POST',
    data
  })
}
// 平台全称
export const platformAll = (data) => {
  return request.$sams({
    url: '/store/platform/page',
    method: 'POST',
    data
  })
}
// 图片域名管理日志
export const logList = (data) => {
  return request.$lmsData({
    url: '/dataOpsLog/list',
    method: 'POST',
    data
  })
}
/**
 * @description: 导入模板
**/
export function importTemplate({ file }) {
  const formData = new FormData()
  formData.append('file', file)
  return request.$lmsData({
    url: '/imageConfig/importFile',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
    responseType: 'blob',
    reportError: false
  })
}

/**
 * 公用 - 销售平台
 */
export const getPlatformList = () => request.$oms({ url: '/platform/options' })

/**
   * 公用 - 销售店铺
   * @param {string} platformCode 平台简码
   * @param {number} keywords 店铺名称关键词
   */
export const getStoreByPlatform = (platformCode, keywords) => {
  return request.$oms({
    url: '/proxy/sams/store/optionsWithKeywords',
    method: 'POST',
    useCache: true,
    data: { platformCode, keywords }
  })
}

/**
  * 获取对应平台的站点(店铺)list
  * platformCode 平台id
 */
export const getSiteList = (data) => {
  return request.$oms({
    url: '/proxy/sams/store/optionsWithPlatformCode',
    method: 'POST',
    data
  })
}

/**
  * 公用 - 币种
  */
export const Currency = () => {
  return request.$oms({
    url: '/downloadCenter/getCurrency',
    method: 'get'
  })
}
export const valueItem = () => {
  const params = {
    field: 'channelCode',
    searchWord: 3
  }
  return request.$oms({
    url: '/rule/condition/valueItem',
    method: 'get',
    params
  })
}
// 发货渠道
// 获取所有的发货渠道 http://showdoc.zehui.local/web/#/77?page_id=799
export const getChannelListAll = params => request.$oms({
  url: '/proxy/tms/channel/listAll',
  params
})

// lazada、walmart手工标记item信息获取
export const getItems = (platCode, params) => {
  const url = platCode === 'LZ' ? '/lzPlatOrderMain/items' : '/walmart/items'
  return request.$oms({ url, params })
}

/**
  * 订单定位数据获取
  * @param {object} params
  * @param {string} params.platformCode 销售平台
  * @param {string} params.platOrderId 平台单号
  */
export const getOrderPosition = params => request.$oms({
  url: '/orderMain/orderTracking',
  params
})
