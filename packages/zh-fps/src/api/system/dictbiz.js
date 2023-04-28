import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$fps({
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
  return request.$fps({
    url: '/dict-biz/parent-list',
    params
  })
}

export const getChildList = (params) => {
  return request.$fps({
    url: '/dict-biz/child-list',
    params
  })
}

export const remove = (ids) => {
  return request.$fps({
    url: '/dict-biz/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = (row) => {
  return request.$fps({
    url: '/dict-biz/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request.$fps({
    url: '/dict-biz/submit',
    method: 'post',
    data: row
  })
}

export const getDict = (id) => {
  return request.$fps({
    url: '/dict-biz/detail',
    method: 'get',
    params: {
      id
    }
  })
}
export const getDictTree = () => {
  return request.$fps({
    url: '/dict-biz/tree?code=DICT',
    method: 'get'
  })
}

export const getDictionary = (params) => {
  return request.$fps({
    useCache: true,
    url: '/dict-biz/dictionary',
    method: 'get',
    params
  })
}

/**
 * 获取字典列表，并格式化数据
 * @param {string} code
 * @returns {Promise}
 */
export const getDictionaryList = code => {
  return getDictionary({ code }).then(res => {
    return res.data.map(({ dictKey, dictValue: label }) => {
      return { label, value: Number(dictKey) }
    })
  })
}
