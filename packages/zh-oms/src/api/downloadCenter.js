import request from '@/router/axios'
// 站点下拉列表
export const downloadCenterList = (data) => {
  return request.$oms({
    url: '/downloadCenter/page',
    method: 'POST',
    data
  })
}
// 黑名单列表
export const blacklist = (data) => {
  return request.$oms({
    url: '/blacklist/page',
    method: 'GET',
    params: { ...data }
  })
}
// 删除黑名单
export const remove = (ids) => {
  return request.$oms({
    url: '/blacklist/remove?ids=' + ids,
    method: 'POST'
  })
}
// 新增黑名单
export const save = (data) => {
  return request.$oms({
    url: '/blacklist/save',
    method: 'POST',
    data
  })
}
// 修改黑名单
export const update = (data) => {
  return request.$oms({
    url: '/blacklist/update',
    method: 'POST',
    data
  })
}
// 根据ids查询黑名单详情
export const getDetailById = (ids) => {
  return request.$oms({
    url: '/blacklist/getDetailById?ids=' + ids,
    method: 'GET'
  })
}

// 下拉国家列表
export const baseCountry = () => {
  return request.$oms({
    url: '/baseCountry/list',
    method: 'get'
  })
}
