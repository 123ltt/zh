import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$tms_provider({
    url: '/dict-biz/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getParentList = (current, size, params) => {
  return request.$tms_provider({
    url: '/dict-biz/parent-list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getChildList = (current, size, parentId, params) => {
  return request.$tms_provider({
    url: '/dict-biz/child-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      parentId: parentId
    }
  })
}

export const remove = (ids) => {
  return request.$tms_provider({
    url: '/dict-biz/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = (row) => {
  return request.$tms_provider({
    url: '/dict-biz/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request.$tms_provider({
    url: '/dict-biz/submit',
    method: 'post',
    data: row
  })
}

export const getDict = (id) => {
  return request.$tms_provider({
    url: '/dict-biz/detail',
    method: 'get',
    params: {
      id
    }
  })
}
export const getDictTree = () => {
  return request.$tms_provider({
    url: '/dict-biz/tree?code=DICT',
    method: 'get'
  })
}

export const getDictionary = (params) => {
  return request.$tms_provider({
    url: '/dict-biz/dictionary',
    method: 'get',
    params
  })
}
