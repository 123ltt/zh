import request from '@/router/axios'
/**
 * 字典接口
 * @param {*} code
 */
export const getMyDictBiz = (code) => {
  return request.$ers({
    url: '/dict-biz/dictionary',
    method: 'get',
    params: {
      code
    }
  })
}

/**
 * 获取平台
 */
export const listPlatForm = () => {
  return request.$ers({
    url: '/common/listAllWithSites',
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

/**
 * 获取币种信息
 */
export const getCurrencyList = () => {
  return request.$ers({
    url: '/currency/list',
    method: 'get',
    params: {
    }
  })
}
