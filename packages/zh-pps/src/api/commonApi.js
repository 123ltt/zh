import request from '@/router/axios'
/**
 * 字典接口
 * @param {*} code
 */
export const getMyDictBiz = (code) => {
  return request.$pps({
    url: '/dict-biz/dictionary',
    method: 'get',
    params: {
      code
    }
  })
}
// 仓库名称接口
export const getWarehouse = () => {
  return request.$pps({
    url: '/common/getWarehouse',
    method: 'get'
  })
}

/**
 * 字典接口
 * @param {*} productSku
 */
export const getSkuInfoBySku = (productSku) => {
  return request.$pps({
    url: '/common/getSkuInfoBySku',
    method: 'get',
    params: {
      productSku
    }
  })
}

// 获取类目，名称
export const searchSkuTopN = (row) => {
  return request.$pms({
    url: '/api/sku/searchSkuTopN',
    method: 'post',
    data: row
  })
}

// 获取类目，名称
export const getByIds = (params) => {
  return request.$pms({
    url: '/api/category/getByIds',
    method: 'get',
    params: {
      idList: params
    }
  })
}
/**
 * 获取平台
 */
export const listPlatForm = () => {
  return request.$pps({
    url: '/common/listAllWithSites',
    method: 'get',
    params: {
    }
  })
}
/**
 * 获取平台网站
 */
export const listPlatformSite = () => {
  return request.$pps({
    url: '/common/getPlatformSite',
    method: 'get',
    params: {
    }
  })
}
/**
 * 获取平台
 */
export const listStoreLevel = () => {
  return request.$pps({
    url: '/common/getStoreLevelInfo',
    method: 'get',
    params: {
    }
  })
}
/**
 * 获取平台
 */
export const getStoreInfoByPlatformCode = (platformCode) => {
  return request.$pps({
    url: '/common/getStoreCodeByPlatformCode',
    method: 'get',
    params: {
      platformCode: platformCode
    }
  })
}
