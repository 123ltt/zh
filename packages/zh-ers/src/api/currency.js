import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$ers({
    url: '/currency/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const save = (array) => {
  return request.$ers({
    url: '/currency/save',
    method: 'post',
    data: array
  })
}

export const update = (row) => {
  return request.$ers({
    url: '/currency/update',
    method: 'post',
    data: row
  })
}

// 下载模板
export const downloadTemplate = () => {
  return request.$ers({
    url: '/currency/exportTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

// 导入模板
export const importTable = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.$ers({
    url: '/currency/import',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
