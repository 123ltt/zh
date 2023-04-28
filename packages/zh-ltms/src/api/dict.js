import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$ltms_system({
    url: '/dict/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getParentList = (data) => {
  return request.$ltms_system({
    url: '/dict/parent-list',
    method: 'get',
    params: data
  })
}

export const getChildList = (data) => {
  return request.$ltms_system({
    url: '/dict/child-list',
    method: 'get',
    params: data
  })
}

export const remove = (ids) => {
  return request.$ltms_system({
    url: '/dict/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = (row) => {
  return request.$ltms_system({
    url: '/dict/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request.$ltms_system({
    url: '/dict/submit',
    method: 'post',
    data: row
  })
}

export const getDict = (id) => {
  return request.$ltms_system({
    url: '/dict/detail',
    method: 'get',
    params: {
      id
    }
  })
}
export const getDictTree = () => {
  return request.$ltms_system({
    url: '/dict/tree?code=DICT',
    method: 'get'
  })
}

export const getDictionary = (params) => {
  return request.$ltms_system({
    url: '/dict/dictionary',
    method: 'get',
    params
  })
}
