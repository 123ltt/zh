import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$pss({
    url: '/dict-biz/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getParentList = (params) => {
  return request.$pss({
    url: '/dict-biz/parent-list',
    params
  })
}

export const getChildList = (params) => {
  return request.$pss({
    url: '/dict-biz/child-list',
    params
  })
}

export const remove = (ids) => {
  return request.$pss({
    url: '/dict-biz/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = (row) => {
  return request.$pss({
    url: '/dict-biz/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request.$pss({
    url: '/dict-biz/submit',
    method: 'post',
    data: row
  })
}

export const getDict = (id) => {
  return request.$pss({
    url: '/dict-biz/detail',
    method: 'get',
    params: {
      id
    }
  })
}
export const getDictTree = () => {
  return request.$pss({
    url: '/dict-biz/tree?code=DICT',
    method: 'get'
  })
}

export const getDictionary = (params) => {
  return request.$pss({
    url: '/dict-biz/dictionary',
    method: 'get',
    params
  })
}
