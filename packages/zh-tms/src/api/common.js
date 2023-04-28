import request from '@/router/axios'
/**
 * 业务字典接口
 * @param {*} code
 */
export const dictionary = (code) => {
  return request.$tms_provider({
    url: `/dict-biz/dictionary?code=${code}`,
    method: 'get'
  })
}
/**
 * 系统字典接口
 * @param {*} code
 */
export const systemDictionary = (code) => {
  return request.$tms_system({
    url: `/dict/dictionary?code=${code}`,
    method: 'get'
  })
}

/**
 * 渠道列表接口
 */
export const logisticsChannel = _ => request.$tms_provider({
  url: '/channel/listAll',
  method: 'get',
  params: {}
})
/**
 * 汇率接口
 */
export const exchangeRate = () => request.$tms_provider({
  url: '/currency/listAll',
  method: 'get',
  params: {

  }
})
/**
 * 国家数据接口
 */
export const getCountryList = () => request.$tms_system({
  url: '/system/country/listCountry',
  method: 'get'
})
/**
 * 属性数据接口
 */
export const logisticsProperty = () => request.$tms_system({
  url: '/logisticsProperty/listAll',
  method: 'get'
})
/**
 * 物流商接口
 */
export const getLogisticsProvider = () => {
  return request.$tms_provider({
    url: '/base/freightLp/listAll',
    method: 'get',
    params: {
    }
  })
}
/**
 * 实体仓信息
 */
export const getWarehouseTypeTree = () => {
  return request.$tms_provider({
    url: '/base/warehouse/getWarehouseTypeTree',
    method: 'get',
    params: {
      warehouseTypes: 'SELF_BUILT,THIRD'
    }
  })
}
// 操作日志接口
export const getLogisticsLog = (current, size, params) => request.$tms_system({
  url: '/system/logisticsLog/page',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})
/**
 * 币种接口
 */
export const getCurrencyList = () => request.$tms_provider({
  url: '/currency/listAll',
  method: 'get'
})
// 租户店铺
export const getAllTenantPlatformStore = (params) => {
  return request.$tms_system({
    url: '/samsProxy/getAllTenantPlatformStore',
    method: 'get',
    params
  })
}
// 租户总列表
export const getTenant = () => {
  return request.$tms_system({
    url: '/samsProxy/getTenantListWithGrantedApp',
    method: 'get'
  })
}
