import request from '@/router/axios'

const PLATFORM_COST = 'platformCost'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pps({
    url: '/' + PLATFORM_COST + '/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 新增
export const save = (row) => {
  return request.$pps({
    url: '/' + PLATFORM_COST + '/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$pps({
    url: '/' + PLATFORM_COST + '/update',
    method: 'post',
    data: row
  })
}

// 修改
export const updateStatus = (id, status) => {
  return request.$pps({
    url: '/' + PLATFORM_COST + '/updateStatus',
    method: 'post',
    params: {
      id: id,
      status: status
    }
  })
}

// 删除
export const remove = (ids) => {
  return request.$pps({
    url: '/' + PLATFORM_COST + '/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pps({
    url: '/' + PLATFORM_COST + '/detail',
    method: 'get',
    params: {
      id
    }
  })
}
