import request from '@/router/axios'
/**
 * 字典接口
 * @param {*} code
 */
export const dictionary = (code) => {
  return request.$purchase({
    url: '/dict-biz/dictionary',
    method: 'get',
    params: {
      code
    }
  })
}
// 目的仓库接口
export const getWarehouse = () => {
  return request.$purchase({
    url: '/warehouse/list',
    method: 'get'
  })
}

// 需求方货主
export const getDemander = () => {
  return request.$purchase({
    url: '/demander/list',
    method: 'get'
  })
}

/**
 * 采购方接口
 */
export const purchaser = () => {
  return request.$purchase({
    url: '/demander/list/purSquareInfo',
    method: 'get',
    params: {}
  })
}

// 供应商接口
export const supplier = () => {
  return request.$pss({
    url: '/supplierAssign/listAssignSupplier',
    method: 'get'
  })
}

// 角色接口-需求人
export const getUserList = () => {
  return request.$ams({
    url: '/user/conciseInfo/page?current=1&size=-1',
    method: 'get'
  })
}

/**
 *
 * @param 请求组织架构
 */
export const getOrg = () => {
  return request.$purchase({
    url: '/tenant/getTenantOrganizationTree',
    method: 'get'
  })
}

/**
 *
 * @param 请求组织架构
 */
export const getOrgTree = () => {
  return request.$ams({
    url: '/org/tree-with-filter',
    method: 'get'
  })
}

/**
 * 得到的用户列表 会根据当前登录用户的权限进行过滤
 */
export function getUserListWithAuth(organizationId, current = 1, size = -1) {
  return request.$ams({
    url: '/user/conciseInfo/page',
    params: {
      organizationId,
      size,
      current
    }
  })
}

/**
 * 获取启用了的仓库信息
 */
export const getAllEnableWarehouse = () => {
  return request.$ims({
    url: '/warehouse/getAllEnableWarehouse',
    method: 'get'
  })
}

/**
 * 获取启用了的仓库信息
 */
export const getAllEnableSaas = () => {
  return request.$purchase({
    url: '/client/getAllEnableWarehouse',
    method: 'get'
  })
}

/**
 * 用户接口
 */
export const getUser = () => {
  return request.$ams({
    url: '/user/conciseInfo/page?current=1&size=-1',
    method: 'get'
  })
}
