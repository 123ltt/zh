import request from '@/router/axios'
import { isSaas } from '@/config/env'

/*
*店铺下拉项-平台简码
*/
export const storeOptionsWithPlatformCode = (data) => {
  return request.$sams({
    url: '/store/optionsWithPlatformCode',
    method: 'POST',
    data
  })
}

/*
*店铺简单数据-店铺码
*/
export const getShortStoreByCode = (code) => {
  return request.$sams({
    url: `/store/shortStoreInfo/${code}`,
    method: 'get'
  })
}
/**
 * @param {number} type 0 服务中心， 1租户中心
 * @returns
 */
function rebuildItem(type = 1) {
  const mapping = {
    name: ['platformName', 'displayName'][type],
    code: ['platformCode', 'candidateDisplayName'][type],
    value: ['id', 'hiddenValue'][type]
  }
  return res => {
    return (res.data || []).map(item => ({
      name: item[mapping.name],
      code: item[mapping.code],
      value: item[mapping.value]
    }))
  }
}

/**
 * 获取 店铺的平台列表
 */
export function getPlatforms() {
  // 租户使用sams的接口（/store/platform/options），服务中心使用 cpms下的接口（/common/platform/options）
  const commonOptions = {
    useCache: true,
    headers: {
      tenantId: '000000'
    }
  }
  return isSaas
    ? request.$sams({ url: '/store/platform/options', method: 'post', ...commonOptions }).then(rebuildItem(1))
    : request.$pms({ url: '/common/platform/options', ...commonOptions }).then(rebuildItem(0))
}

/**
 * 根据关键词获取平台下的店铺列表
 * @param {String} platformCode
 * @param {String} keywords
 */
export function getStoresByPlatformAndKeyword(platformCode, keywords = '') {
  return request.$sams({
    url: '/store/optionsWithKeywords',
    method: 'post',
    data: { platformCode, keywords },
    headers: {
      tenantId: '000000'
    }
  }).then(rebuildItem(1))
}
