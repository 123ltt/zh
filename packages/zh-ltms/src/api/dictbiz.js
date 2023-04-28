import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$ltms_provider({
    url: '/dict-biz/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}
export const getParentList = (data) => {
  return request.$ltms_provider({
    url: '/dict-biz/parent-list',
    method: 'get',
    params: data
  })
}

export const getChildList = (data) => {
  return request.$ltms_provider({
    url: '/dict-biz/child-list',
    method: 'get',
    params: data
  })
}

export const remove = (ids) => {
  return request.$ltms_provider({
    url: '/dict-biz/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = (row) => {
  return request.$ltms_provider({
    url: '/dict-biz/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request.$ltms_provider({
    url: '/dict-biz/submit',
    method: 'post',
    data: row
  })
}

export const getDict = (id) => {
  return request.$ltms_provider({
    url: '/dict-biz/detail',
    method: 'get',
    params: {
      id
    }
  })
}
export const getDictTree = () => {
  return request.$ltms_provider({
    url: '/dict-biz/tree?code=DICT',
    method: 'get'
  })
}

export const getDictionary = (params) => {
  return request.$ltms_provider({
    url: '/dict-biz/dictionary',
    method: 'get',
    params
  })
}
