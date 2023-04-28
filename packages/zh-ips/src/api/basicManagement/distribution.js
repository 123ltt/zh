import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$purchase({
    url: '/supplierAssign/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 新增保存
export const save = (row) => {
  return request.$purchase({
    url: '/supplierAssign/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$purchase({
    url: '/supplierAssign/update',
    method: 'post',
    data: row
  })
}

// 修改状态
export const updateStatue = (row) => {
  return request.$purchase({
    url: '/supplierAssign/updateStatus',
    method: 'post',
    data: row
  })
}

// 删除
export const remove = (ids) => {
  return request.$purchase({
    url: '/supplierAssign/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$purchase({
    url: '/supplierAssign/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 批量修改
export const batchUpdate = (row) => {
  return request.$purchase({
    url: '/supplierAssign/batchUpdate',
    method: 'post',
    data: row
  })
}
