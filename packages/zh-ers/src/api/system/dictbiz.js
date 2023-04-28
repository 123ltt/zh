import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$ers({
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
  return request.$ers({
    url: '/dict-biz/parent-list',
    method: 'get',
    params
  })
}

export const getChildList = (params) => {
  return request.$ers({
    url: '/dict-biz/child-list',
    method: 'get',
    params
  })
}

export const remove = (ids) => {
  return request.$ers({
    url: '/dict-biz/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = (row) => {
  return request.$ers({
    url: '/dict-biz/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request.$ers({
    url: '/dict-biz/submit',
    method: 'post',
    data: row
  })
}

export const getDict = (id) => {
  return request.$ers({
    url: '/dict-biz/detail',
    method: 'get',
    params: {
      id
    }
  })
}
export const getDictTree = () => {
  return request.$ers({
    url: '/dict-biz/tree?code=DICT',
    method: 'get'
  })
}

export const getDictionary = (params) => {
  return request.$ers({
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
