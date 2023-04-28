import request from '@/router/axios'

/**
 * 异常订单拦截规则查询接口
 * @param {object} data
 * @param {string} data.platformCode - 平台CODE
 * @param {string} data.ruleName - 规则名称
 * @param {number} data.ruleScope - 规则作用域
 * @param {number} data.ruleStatus - 规则状态
 * @param {number} data.ruleType - 规则类型
 */
export const getPageList = data => {
  return request.$oms({
    url: '/interceptRule/page',
    method: 'POST',
    data
  })
}

/**
 * 异常订单拦截规则详情接口
 * @param {number} id 规则ID
 */
export const getDetail = id => {
  return request.$oms({
    url: '/interceptRule/detail',
    method: 'POST',
    data: { id }
  })
}

/**
 * 异常订单拦截规则修改、增加接口
 * @param {object} data 包含很多的参数
 * @param {number} data.id - 如果是修改则需要传ID，否则不传
 */
export const addOrUpdate = data => {
  return request.$oms({
    url: '/interceptRule/addOrUpdate',
    method: 'POST',
    data
  })
}

/**
 * 获取规则的详情信息
 * @param {string} id 规则id
 */
export const getRuleDetail = id => {
  return request.$oms({
    url: '/interceptRule/detail',
    method: 'POST',
    data: { id }
  })
}

/**
 * 规则类型下拉接口
 * @param {number} scope 规则作用域字典的值
 */
export const getRuleTypesList = scope => request.$oms({
  url: '/interceptRule/ruleTypes',
  method: 'POST',
  data: { scope }
})

// 获取日志接口
export const getRuleLogs = data => request.$oms({
  url: '/interceptRuleHis/page',
  method: 'POST',
  data
})

/**
 * 更新规则的状态接口
 * @param {string} id 规则id
 * @param {0|1} status 状态
 */
export const updateStatus = (id, status) => request.$oms({
  url: '/interceptRule/updateStatus',
  method: 'POST',
  data: { id, status }
})
