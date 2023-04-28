import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$purchase({
    url: '/invRule/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 获取类目，名称
export const searchSkuTopN = (row) => {
  return request.$purchase({
    url: '/pms/sku/searchSkuTopN',
    method: 'post',
    data: row
  })
}

// 新增保存
export const save = (row) => {
  return request.$purchase({
    url: '/invRule/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$purchase({
    url: '/invRule/update',
    method: 'post',
    data: row
  })
}

// 删除
export const remove = (ids) => {
  return request.$purchase({
    url: '/invRule/deleteDraft',
    method: 'post',
    params: {
      ids
    }
  })
}

// 类目
export const getCategorAll = () => {
  return request.$pms({
    url: '/category/getAll',
    method: 'get'
  })
}

// 详情
export const getDetail = (id) => {
  return request.$purchase({
    url: '/invRule/detail',
    method: 'get',
    params: {
      id
    }
  })
}
