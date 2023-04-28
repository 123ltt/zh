import request from '@/router/axios'

/**
 * 字典接口
 * @param {*} code
 */
export const getMyDictBiz = (code) => {
  return request.$prs({
    url: '/dict-biz/dictionary',
    method: 'get',
    params: {
      code
    }
  })
}
/**
 * 获取用户列表
 *
 */
export const getUserList = (current, size, params) => {
  return request.$prs({
    url: '/common/userList',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * 公共字典接口
 * @param {*} code
 */
export const getMyDictBizFromDict = (parentId) => {
  return request({
    url: '/dict/dict-biz/child-list',
    method: 'get',
    params: {
      parentId
    }
  })
}
/**
 *所有租户id
 */
export const getTenantList = () => {
  return request.$prs({
    url: '/common/getTenantList',
    method: 'get'

  })
}
/**
 * 所有店铺
 */
export const getStoreCodeList = (params) => {
  return request.$prs({
    url: '/common/getStoreCodeList',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * 无权限所有店铺
 */
export const getStoreCodeListUnlimit = (params) => {
  return request.$prs({
    url: '/common/getStoreCodeListByUnlimit',
    method: 'get',
    params: {
      ...params
    }
  })
}
/**
 * 上传下载中心分页
 */
export const getFileTask = (current, size, params) => {
  return request.$prs({
    url: '/fileTask/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * 上传下载中心删除list
 */
export const delFileTask = (data) => {
  return request.$prs({
    url: '/fileTask/remove',
    method: 'post',
    data
  })
}
/**
 * 获取平台列表
 */
export const getPlatformList = () => {
  return request.$prs({
    url: '/common/getPlatformList',
    method: 'get'
  })
}

/**
 * 获取无权限平台列表
 */
export const getPlatformListUnlimit = () => {
  return request.$prs({
    url: '/common/getPlatformListByUnlimit',
    method: 'get'
  })
}
/**
 *获取站点列表
 */
export const getSiteNameList = (params) => {
  return request.$prs({
    url: '/common/getSiteList',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 *获取任务类型列表
 */
export const getTaskTypeList = (params) => {
  return request.$prs({
    url: '/common/getTaskTypeList',
    method: 'get',
    params: {
      ...params
    }
  })
}
/**
 *上传下载中心导入文件
 */
export const fileImport = (data) => {
  return request.$prs({
    url: '/fileTask/fileImport',
    method: 'post',
    data
  })
}
/**
 *模板列表
 */
export const getTemplateList = (params) => {
  return request.$prs({
    url: '/common/getTemplateList',
    method: 'get',
    params: {
      ...params
    }
  })
}
/**
 *上传下载中心导入流水
 */
export const getFlowList = (current, size, params) => {
  return request.$prs({
    url: '/collectionflow/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
/**
 *账单对账批量关闭
 */
export const batchBillColse = (data) => {
  return request.$prs({
    url: '/verifybill/batchBillColse',
    method: 'post',
    data
  })
}
/**
 *已关闭账单-分页
 */
export const donePage = (current, size, params) => {
  return request.$prs({
    url: '/verifybill/donePage',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
/**
 *账单对账-分页
 */
export const billPage = (current, size, params) => {
  return request.$prs({
    url: '/verifybill/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
/**
 *账单对账-状态列表
 */
export const getBillStatus = () => {
  return request.$prs({
    url: '/verifybill/getBillStatus',
    method: 'get'

  })
}
/**
 *订单核销-分页
 */
export const verifyOrderPage = (current, size, params) => {
  return request.$prs({
    url: '/verifyOrder/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }

  })
}
/**
 *已核销订单-分页
 */
export const verifyOrderDonePage = (current, size, params) => {
  return request.$prs({
    url: '/verifyOrder/donePage',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }

  })
}
/**
 *订单核销-批量核销
 */
export const batchVerifyOrder = (data) => {
  return request.$prs({
    url: '/verifyOrder/batchVerifyOrder',
    method: 'post',
    data

  })
}
/**
*订单核销状态列表
*/
export const getOrderStatus = () => {
  return request.$prs({
    url: '/verifyOrder/getOrderStatus',
    method: 'get'

  })
}
/**
*订单核销差异原因列表
*/

export const getBillDiffCause = () => {
  return request.$prs({
    url: '/verifyOrder/getDiffCause',
    method: 'get'
  })
}
/**
*获取订单核销类型列表
*/

export const getVerifyType = () => {
  return request.$prs({
    url: '/verifyOrder/getVerifyType',
    method: 'get'
  })
}
/**
*已核销流水-分页
*/
export const getFlowDonePage = (current, size, params) => {
  return request.$prs({
    url: '/verifyflow/donePage',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
/**
*流水核销-分页
*/
export const getFlowPage = (current, size, params) => {
  return request.$prs({
    url: '/verifyflow/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
/**
*流水核销-调整
*/
export const flowAdjust = (data) => {
  return request.$prs({
    url: '/verifyflow/adjust',
    method: 'post',
    data
  })
}
/**
*获取匹配流水
*/
export const getMatchFlow = (params) => {
  return request.$prs({
    url: '/verifyflow/flowNumber',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
*获取流水核销差异原因列表
*/
export const getFlowVerifyDiffCause = () => {
  return request.$prs({
    url: '/verifyflow/getFlowVerifyDiffCause',
    method: 'get'
  })
}

/**
*流水核销-匹配流水
*/
export const matchFlow = (data) => {
  return request.$prs({
    url: '/verifyflow/matchFlow',
    method: 'post',
    data
  })
}

/**
*获取流水核销状态列表
*/
export const getFlowStatus = () => {
  return request.$prs({
    url: '/verifyflow/getFlowStatus',
    method: 'get'
  })
}
/**
*订单核销-人工调整
*/
export const manualAdjust = (data) => {
  return request.$prs({
    url: '/verifyOrder/manualAdjust',
    method: 'post',
    data
  })
}
/**
*订单核销-详情
*/
export const orderDetail = (data) => {
  return request.$prs({
    url: '/verifyOrder/orderDetail',
    method: 'post',
    data
  })
}
/**
*流水核销-详情
*/
export const flowDetail = (data) => {
  return request.$prs({
    url: '/verifyflow/flowDetail',
    method: 'post',
    data
  })
}
/**
*流水匹配--下拉框
*/
export const flowConditionNames = (params) => {
  return request.$prs({
    url: '/verifyflow/flowConditionNames',
    method: 'get',
    params: {
      ...params
    }
  })
}
/**
*流水匹配--获取收款类型
*/
export const getpayeeTypes = () => {
  return request.$prs({
    url: '/verifyflow/getpayeeTypes',
    method: 'get'
  })
}

/**
*流水核销--结转查询账单
*/
export const getCarryOverBills = (params) => {
  return request.$prs({
    url: '/verifyflow/getCarryOverBills',
    method: 'get',
    params: { ...params }
  })
}
/**
*流水核销--保存结转
*/
export const saveCarryOver = (data) => {
  return request.$prs({
    url: '/verifyflow/saveCarryOver',
    method: 'post',
    data
  })
}
