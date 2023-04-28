import request from '@/router/axios'

// 平台限价配置列表
export const getList = data => {
  return request.$pms({
    url: '/platformLimitedPrice/page',
    method: 'POST',
    data
  })
}

// 删除/批量删除平台限价配置
export const delItem = ids => {
  return request.$pms({
    url: '/platformLimitedPrice/batchDelete',
    method: 'POST',
    data: { ids }
  })
}

// 新增平台限价配置
export const add = data => {
  return request.$pms({
    url: '/platformLimitedPrice/add',
    method: 'POST',
    data
  })
}

// 更新平台限价配置
export const update = data => {
  return request.$pms({
    url: '/platformLimitedPrice/update',
    method: 'POST',
    data
  })
}
