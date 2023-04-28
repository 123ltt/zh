import request from '@/router/axios'
// 获取配置属性
export const getAttrs = () => {
  return request.$oms({
    url: '/configExportPro/getAllPro'
  })
}

// 查询个人的所有模板
export const getTempList = () => {
  return request.$oms({
    url: '/exportTem/list'
  })
}

/**
 * 新增个人模板
 * @param {object} data
 * @param {string} data.name 模板名称
 * @param {string} data.proIds 属性id，英文逗号隔开
 * @param {number} data.ifDefault 是否默认0否 1是
 * @param {number} data.proDim  维度 0：订单 1包裹 2sku
 */
export const addTemp = data => {
  return request.$oms({
    url: '/exportTem/save',
    method: 'POST',
    data
  })
}

// 删除模板
export const delTemp = ids => {
  return request.$oms({
    url: '/exportTem/remove',
    method: 'POST',
    params: { ids }
  })
}

// 设置默认模板
export const setDefaultTemp = id => {
  return request.$oms({
    url: '/exportTem/setDefaultTem',
    method: 'POST',
    params: { id }
  })
}

// 修改模板
export const updateTemp = data => {
  return request.$oms({
    url: '/exportTem/update',
    method: 'POST',
    data
  })
}

// 修改模板
export const getTempDetail = id => request.$oms({ url: `/exportTem/detail?id=${id}` })

// 导出模板（往下载中心下载）
export const exportTemp = data => {
  return request.$oms({
    url: '/downloadCenter/add',
    method: 'POST',
    data
  })
}
