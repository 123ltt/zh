import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$ers({
    url: '/platformRateConfig/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const add = (row) => {
  return request.$ers({
    url: '/platformRateConfig/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request.$ers({
    url: '/platformRateConfig/update',
    method: 'post',
    data: row
  })
}

// 详情
export const getDetail = (id) => {
  return request.$ers({
    url: '/platformRateConfig/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 修改
export const updateStatus = (id, status) => {
  return request.$ers({
    url: '/platformRateConfig/updateStatus',
    method: 'post',
    params: {
      id: id,
      status: status
    }
  })
}
