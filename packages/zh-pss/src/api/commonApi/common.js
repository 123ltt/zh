// 公共接口
import request from '@/router/axios'

export const getDictBiz = (code) => { // 状态接口
  return request.$ams({
    url: '/dict-biz/dictionary?code=' + code,
    method: 'get'
  })
}

// 供应商接口
export const supplier = () => {
  return request.$pss({
    url: '/supplierInfo/listImportedSupplierInfos',
    method: 'get'
  })
}

export const getMyDictBiz = (code) => { // 状态接口
  return request.$pss({
    url: '/dict-biz/dictionary?code=' + code,
    method: 'get'
  })
}

/**
 *
 * @param 请求组织架构(获取需求方)
 */
export const getOrg = () => {
  return request.$pss({
    url: '/tenant/getTenantOrganizationTree',
    method: 'get'
  })
}
