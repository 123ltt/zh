
import request from '@/router/axios'
/**
 * 公用 - 销售平台
 */
export const getPlatformList = () => {
  return request.$oms({
    url: '/proxy/sams/store/platform/options'
  })
}

/**
 * 描述
 * @returns {any}
 */
export const baseCountry = () => {
  return request.$oms({
    url: '/baseCountry/list',
    method: 'get'
  })
}
// 包裹列表
export const packpage = data => {
  return request.$oms({
    url: '/packageMain/page',
    method: 'POST',
    data
  })
}
// 包裹列表数量
export const getCount = data => {
  return request.$oms({
    url: '/packageMain/count',
    method: 'POST',
    data
  })
}

// 重新预报接口 data.packageCode
export const againForecast = data => {
  return request.$oms({
    url: '/packageMain/pushPkgToForecast',
    method: 'POST',
    data
  })
}

// 发货仓库列表
export const wareCodeList = () => {
  return request.$oms({
    url: '/warehouse/getWarehouseList',
    method: 'POST'
  })
}

// 添加/拆分包裹获取信息
export const orderGoodDetail = omOrderId => {
  return request.$oms({
    url: '/orderMain/orderGoodDetail?omOrderId=' + omOrderId,
    method: 'GET'
  })
}

/**
 * @typedef list
 * @property {string} list.pmsSku sku
 * @property {string} list.productQuantity 发货数量
 * @property {string} list.platformProductId itimId
 * @property {string|number} list.goodId goodId
 */

/**
 * 拆分包裹 获取sku信息  （详情页的拆分包裹）
 * @param {object} data
 * @param {string} data.packageCode 包裹号
 * @param {string} data.warehouseCode 仓库编码
 * @param {list[]} data.goodInfoList 仓库编码
 */
export const orderGoodDetailByDetailPage = data => {
  return request.$oms({
    url: '/orderMain/orderGoodDetailByDetailPage',
    method: 'POST',
    data
  })
}

// 添加包裹根据omOrderId获取详情
export const getCurrentPackageInfo = params => {
  return request.$oms({
    url: '/packageMain/getCurrentPackageInfo',
    method: 'GET',
    params
  })
}

// item下拉列表
export const itemList = (omOrderId) => {
  return request.$oms({
    url: '/orderGood/itemList?omOrderId=' + omOrderId,
    method: 'GET'
  })
}
// 获取优选渠道和试算运费列表
export const getChannelAndPrice = (data) => {
  return request.$oms({
    url: '/packageMain/getChannelAndPrice',
    method: 'POST',
    data
  })
}
// 添加包裹
export const save = (data, type) => {
  let url = '/packageMain/save'
  if (type !== 'add') {
    url = '/packageMain/unpack'
  }
  return request.$oms({
    url,
    method: 'POST',
    data
  })
}
// 添加sku
export const analyzeSku = (params) => {
  return request.$oms({
    url: '/orderGood/analyzeSku',
    method: 'POST',
    params
  })
}
// 添加仓库列表
export const getBySkuAndPackageCode = (data) => {
  return request.$oms({
    url: '/stock/getBySkuAndPackageCode',
    method: 'POST',
    data
  })
}
// 获取发货列表
export const getWmsStatus = (data) => {
  return request.$oms({
    url: '/warehouse/getWmsStatus',
    method: 'POST',
    data
  })
}
// 获取消息模板列表
export const getTemplate = (params) => {
  return request({
    url: '/cms/msg-template/get-template-list',
    params,
    useCache: true
  })
}
// 发送站点信息
export const ebSave = (data) => {
  return request({
    url: '/cms/ebayMemberMessageSend/save',
    method: 'POST',
    data
  })
}
// 获取站点信息
export const ebSendInfo = (data) => {
  return request.$oms({
    url: '/packageMain/getEBPackageEmailSendInfo',
    method: 'POST',
    data
  })
}
// 获取站点信息
export const addEBSendLog = (data) => {
  return request.$oms({
    url: '/packageHis/addEBSendLog',
    method: 'POST',
    data
  })
}
