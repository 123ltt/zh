import request from '@/router/axios'

// 表格数据
export const getList = (current, size, params) => {
  return request.$fps({
    url: '/transaction/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

// 交易账号查询
export const accountList = (params) => {
  return request.$fps({
    url: '/transaction/account/list',
    method: 'get',
    params
  })
}

// 导入
export const importInfo = (params) => {
  const formData = new FormData()
  formData.append('file', params.file, params.value)
  console.log('formData----', params.file)
  formData.append('transactionAccount', params.transactionAccount)
  console.log('params.transactionAccount-', params.transactionAccount)
  return request.$fps({
    url: '/transaction/import', // 当前接口
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
