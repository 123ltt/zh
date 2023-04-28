import request from '@/router/axios'
/**
 * 公用 - 销售平台
 */
export const getPlatformList = () => request.$oms({ url: '/platform/options' })

/**
  * 公用 - 销售店铺
  * @param {string} platformCode 平台简码
  * @param {number} keywords 店铺名称关键词
  */
export const getStoreByPlatform = (platformCode, keywords, useCache = true) => {
  return request.$oms({
    url: '/proxy/sams/store/optionsWithKeywords',
    method: 'POST',
    useCache,
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
 * @param {object} data
 * @param {string} data.platformCode 销售平台
 * @param {string} [data.platOrderId] 平台单号
 * @param {string} [data.omOrderId] OMS单号
 * @param {string} [data.packageCode] 包裹号
 */
export const getOrderPosition = data => request.$oms({
  url: '/orderMain/orderTracking',
  method: 'POST',
  data
})

/**
 * 物流接口根据虚仓和虚仓目的国过滤可发渠道
 * @param {object} data
 * @param {string} data.countryCode 虚仓目的国
 * @param {string} data.virtualWarehouse 是否虚拟渠道 1虚拟渠道 2 非虚拟渠道
 * @param {string} data.warehouse 实际仓库
 */
export const getChannelByServiceArea = data => request.$oms({
  url: '/proxy/ims/channel/getChannelByServiceArea',
  method: 'POST',
  data
})

/**
 * 获取发货仓库list（手工分仓、修修改渠道、添加/拆分包裹）
 * @param {object} data
 * @param {string} data.country 虚仓目的国家
 * @param {string} data.platCode 虚仓目平台
 */
export const getWarehouseWithVirtualRule = data => request.$oms({
  url: '/warehouse/getWarehouseWithVirtualRule',
  method: 'POST',
  data
})
