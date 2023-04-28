import request from '@/router/axios'
/**
 * 列表
 */
export function shopeeListingPage(params, data) {
  return request.$lmsShopee({
    url: '/shopeelisting/page',
    method: 'post',
    params: { ...params },
    data
  })
}
/**
 * Listing列表-变体
 * @param {string} id id
 * @returns array
 */
export function shopeeListingListVariant(id) {
  return request.$lmsShopee({
    url: '/shopeelisting/listVariant',
    method: 'post',
    params: { id }
  })
}
/**
 * 批量更新价格
 * @param {*} data
 * @returns
 */
export const batchPrice = (data) => request.$lmsShopee({
  url: '/shopeelistingvariant/batchPrice',
  method: 'post',
  data
})
/**
 * 批量更新库存
 * @param {*} data
 * @returns
 */
export const batchQuantity = (data) => request.$lmsShopee({
  url: '/shopeelistingvariant/batchQuantity',
  method: 'post',
  data
})
/**
 * 取消活动价
 * @param {*} id
 * @returns
 */
export const cancelPrice = ({ ids }) => request.$lmsShopee({
  url: '/shopeelisting/cancelDiscount',
  method: 'get',
  params: {
    ids
  }
})
/**
 * 批量新增保存价格/库存
 * @param {*} data
 * @returns
 */
export const batchUpdateByFile = (data) => request.$lmsData({
  url: '/batchfeed/save',
  method: 'post',
  data
})
/**
 * 批量更新下载模板
 * @param {*} ids
 * @returns
 */
export const templateDownload = (data) => request.$lmsShopee({
  url: '/shopeelisting/templateDownload',
  method: 'post',
  responseType: 'blob',
  data
})
// 手动同步平台属性
export const shopeeAttr = (params) => request.$lmsShopee({
  url: '/shopeecategoryattribute/sync/category/attr',
  method: 'get',
  params
})
// listing新增
export const save = (data, id) => {
  let url = '/shopeelisting/save'
  if (id.length) {
    url = '/shopeelisting/update'
    data.accountPrefix = '1'
  }
  return request.$lmsShopee({
    url,
    method: 'post',
    data
  })
}
// listing 详情
export const detail = (params) => request.$lmsShopee({
  url: '/shopeelisting/detail',
  method: 'get',
  params
})
// 修改预购发货天数
export const updatePreOrder = (params) => {
  return request.$lmsShopee({
    url: '/shopeelisting/updatePreOrder',
    method: 'get',
    params
  })
}
// 上传
export const uploading = (data) => {
  return request.$lmsShopee({
    url: '/shopeelisting/uploading',
    method: 'post',
    data
  })
}
// 实时同步物流
export const shopeelogistic = (params) => {
  return request.$lmsShopee({
    url: '/shopeelogistic/currentSyncLogistic',
    method: 'get',
    params
  })
}
// 价格计算
export const calculatePrice = (data, type) => {
  let url = '/common/calculatePrice'
  if (type === 'price') {
    url = '/common/calculateProfitRate'
  }
  return request.$lmsShopee({
    url,
    method: 'post',
    data
  })
}
