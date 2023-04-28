import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$ers({
    url: '/floatingRate/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getDetail = (id, origCurrCode, trgtCurrCode) => {
  return request.$ers({
    url: '/floatingRate/detail',
    method: 'get',
    params: {
      id,
      origCurrCode,
      trgtCurrCode
    }
  })
}

export const save = (row) => {
  return request.$ers({
    url: '/floatingRate/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request.$ers({
    url: '/floatingRate/update',
    method: 'post',
    data: row
  })
}

export const adjust = (row) => {
  return request.$ers({
    url: '/floatingRate/adjust',
    method: 'post',
    data: row
  })
}

// 下载模板
export const downloadTemplate = () => {
  return request.$ers({
    url: '/floatingRate/exportTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

// 导入模板
export const importTable = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.$ers({
    url: '/floatingRate/import',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
