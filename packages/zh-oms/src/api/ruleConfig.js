import request from '@/router/axios'
// 获取发货优先级列表
export const page = (params) => {
  return request.$oms({
    url: '/deliverPriority/page',
    method: 'GET',
    params
  })
}
// 根据id获取发货优先级规则
export const getRule = (params) => {
  return request.$oms({
    url: '/deliverPriority/get',
    method: 'GET',
    params
  })
}
// 修改发货优先级规则
export const update = (data, type) => {
  let url = '/deliverPriority/update'
  if (type === 'add') {
    url = '/deliverPriority/save'
  }
  return request.$oms({
    url,
    method: 'POST',
    data
  })
}

// 发货优先级规则日志list
export const getDeliveryLogs = params => {
  return request.$oms({
    url: '/deliverPriorityHis/page',
    params
  })
}

// 根据id删除发货优先级规则
export const ruleDelete = (id) => {
  return request.$oms({
    url: '/deliverPriority/delete',
    method: 'POST',
    params: id
  })
}
// 标记规则列表
export const list = (data) => {
  return request.$oms({
    url: '/packagemarkpriorityrule/page',
    method: 'POST',
    data
  })
}
// ( 标记/自动)规则新增/修改
export const save = (data, editType, type) => {
  const urlObj = {
    tag: { // 标记规则
      add: '/packagemarkpriorityrule/save',
      edit: '/packagemarkpriorityrule/update'
    },
    auto: { // 自动撤单
      add: '/cancelPkgRule/addOrUpdate',
      edit: '/cancelPkgRule/addOrUpdate'
    }
  }
  return request.$oms({
    url: urlObj[type][editType],
    method: 'POST',
    data
  })
}
// 标记规则根据id获取详情
export const detail = (params, type) => {
  let url = '/packagemarkpriorityrule/detail'
  if (type === 'auto') {
    url = '/cancelPkgRule/detail'
  }
  return request.$oms({
    url,
    method: 'GET',
    params
  })
}
// 标记规则根据id删除数据
export const remove = (id) => {
  return request.$oms({
    url: '/packagemarkpriorityrule/delete?id=' + id,
    method: 'POST'
  })
}
// 获取自动撤单的日志
export const getAutoLogList = data => {
  return request.$oms({
    url: '/cancelPkgRuleHis/page',
    method: 'POST',
    data
  })
}
// 可选条件
export const condition = (params) => {
  return request.$oms({
    url: '/rule/condition/list',
    method: 'GET',
    params
  })
}
// 自动撤单规则列表
export const cancelPkgRulePage = (data) => {
  return request.$oms({
    url: '/cancelPkgRule/page',
    method: 'POST',
    data
  })
}
// 自动撤单规则详情
export const cancelPkgRuleDetail = (data) => {
  return request.$oms({
    url: '/cancelPkgRule/detail',
    method: 'POST',
    data
  })
}
// 自动撤单规则删除
export const cancelPkgRuleDelete = (id) => {
  return request.$oms({
    url: '/cancelPkgRule/delete',
    method: 'POST',
    data: { data: id }
  })
}
