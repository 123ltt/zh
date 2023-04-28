import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$ers({
    url: '/monthlyRate/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const save = (row) => {
  return request.$ers({
    url: '/monthlyRate/save',
    method: 'post',
    data: row
  })
}

// 下载模板
export const downloadTemplate = () => {
  return request.$ers({
    url: '/monthlyRate/exportTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

// 导入模板
export const importTable = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.$ers({
    url: '/monthlyRate/import',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
