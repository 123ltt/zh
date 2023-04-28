import request from '@/plugins/request'

/**
 *
 * @typedef {*} data
 * @param {*} params
 */

/**
 * 获取刊登约束列表
 * @param {object} [data]
 * @param {string} [data.ruleName] 规则名称
 * @param {string[]} [data.developerIds] 开发人员id
 * @param {string[]} [data.salesmanIds] 销售人员id
 * @param {string[]} [data.accounts] 店铺
 * @param {string} [data.platformCode] 平台
 * @param {string} [data.status] 状态 1有效 2无效
 *
 * @param {object} params
 * @param {number} params.current
 * @param {number} params.size
 */
export function getList(data, params) {
  return request.$pms({
    url: '/publishRestrictRule/page',
    method: 'POST',
    params,
    data
  })
}

/**
 * 创建刊登约束
 * @typedef {object} platformStores
 * @property {string} platformCode 平台的code
 * @property {string[]} accounts 店铺的code
 *
 * @param {object} data
 * @param {string} [data.id]
 * @param {string} data.ruleName
 * @param {string[]} data.developerIds
 * @param {string[]} data.salesmanIds
 * @param {platformStores[]} data.platformStores
 * @param {0|1} data.status 1有效, 2无效
 * @param {0|1} type 0保存，1修改
 */
export function save(data, type = 0) {
  return request.$pms({
    url: ['/publishRestrictRule/create', '/publishRestrictRule/update'][type],
    method: 'post',
    data
  })
}

/**
 * @param {string} id
 */
export function detail(id) {
  return request.$pms({
    url: '/publishRestrictRule/detail',
    params: { id }
  })
}
