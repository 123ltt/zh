import request from '@/router/axios'

/**
 * 店铺列表分页接口
 */
export const storeList = (data) => {
  return request.$sams({
    url: '/store/list',
    method: 'POST',
    data
  })
}
/**
 * 获取店铺状态
 */
export const getStoreStatusList = () => {
  return request.$sams({
    url: '/store/getStoreStatusList',
    method: 'POST'
  })
}
/**
 * 导出日志分页
 */
export const recordList = (data) => {
  return request.$sams({
    url: '/store/exportHis/page',
    method: 'POST',
    data
  })
}

/**
 * 获取基础信息接口
 * id 店铺id
 */
export const getBaseInfoById = (id) => {
  return request.$sams({
    url: '/store/getBaseInfoById',
    method: 'POST',
    data: id
  })
}

/**
 * 店铺评级
 */
export const getStoreGradeList = () => {
  return request.$sams({
    url: '/store/getStoreGradeList',
    method: 'POST'
  })
}

/**
 * 店铺等级
 * platformId: 平台id
 */
export const listOfPlatform = (platformName) => {
  return request.$sams({
    url: '/storeLevel/listOfPlatform',
    method: 'GET',
    params: platformName
  })
}

/**
 * 修改基本信息接口
 */
export const updateBaseInfoById = (data) => {
  return request.$sams({
    url: '/store/updateBaseInfoById',
    method: 'POST',
    data
  })
}

/**
 * 获取店铺运营信息
 */
export const getStoreOperationInfoById = (id) => {
  return request.$sams({
    url: '/store/getStoreOperationInfoById',
    method: 'POST',
    data: id
  })
}

/**
 * 修改店铺运营信息
 */
export const updateOperationInfoById = (data) => {
  return request.$sams({
    url: '/store/updateOperationInfoById',
    method: 'POST',
    data
  })
}

/**
 * 获取注册信息
 */
export const getRegisterInfoById = (id) => {
  return request.$sams({
    url: '/store/getRegisterInfoById',
    method: 'POST',
    data: id
  })
}
/**
 * 修改注册信息
 */
export const updateRegisterInfoById = (data) => {
  return request.$sams({
    url: '/store/updateRegisterInfoById',
    method: 'POST',
    data
  })
}

/**
 * 修改网络费用接口
 */
export const updateNetCostById = (data) => {
  return request.$sams({
    url: '/store/updateNetCostById',
    method: 'POST',
    data
  })
}

/**
 * 获取网络费用接口
 */
export const getNetCosByStoreId = (id) => {
  return request.$sams({
    url: '/store/getNetCosByStoreId',
    method: 'POST',
    data: id
  })
}
/**
 * 日志信息
 */
export const listByStoreId = (data) => {
  return request.$sams({
    url: '/store/history/listByStoreId',
    method: 'POST',
    data
  })
}
/**
 * 获取财务信息接口
*/
export const getFinanceInfoById = (id) => {
  return request.$sams({
    url: '/store/getFinanceInfoById',
    method: 'POST',
    data: id
  })
}

/**
 * 更新财务信息接口
*/
export const updateFinanceInfoById = (data) => {
  return request.$sams({
    url: '/store/updateFinanceInfoById',
    method: 'POST',
    data
  })
}
/**
 * 导出店铺列表
*/
export const exportStore = (data) => {
  return request.$sams({
    url: '/store/export',
    method: 'POST',
    data,
    responseType: 'blob'
  })
}

/**
 * 查看销售
*/
export const listSellerList = (id) => {
  return request.$sams({
    url: '/store/seller/listSellerList',
    method: 'POST',
    data: id
  })
}

/**
 * 分配时查看已经分配的和待分配的销售接口
 * 店铺id
*/
export const getAssignSellerList = (id) => {
  return request.$sams({
    url: '/store/seller/getAssignSellerList',
    method: 'POST',
    data: id
  })
}
/**
 店铺确认分配接口
*/
export const saveSellerAssign = (data) => {
  return request.$sams({
    url: '/store/seller/assign',
    method: 'POST',
    data
  })
}

/**
 批量分配下的销售列表
 * 店铺ids
*/
export const batchGetAssignSellerList = (id) => {
  return request.$sams({
    url: '/store/seller/batchGetAssignSellerList',
    method: 'POST',
    data: id
  })
}
/*
*批量分配确认接口
*/
export const saveBatchAssign = (data) => {
  return request.$sams({
    url: '/store/seller/batchAssign',
    method: 'POST',
    data
  })
}
/*
*修改网络费用
*/
export const batchUpdateNetCost = (data) => {
  return request.$sams({
    url: '/store/updateNetCostById',
    method: 'POST',
    data
  })
}
