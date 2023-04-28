import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pps({
    url: '/productCost/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 新增
export const save = (row) => {
  return request.$pps({
    url: '/productCost/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$pps({
    url: '/productCost/update',
    method: 'post',
    data: row
  })
}

// 修改
export const updateStatus = (id, status) => {
  return request.$pps({
    url: '/productCost/updateStatus',
    method: 'post',
    params: {
      id: id,
      status: status
    }
  })
}

// 删除
export const remove = (ids) => {
  return request.$pps({
    url: '/productCost/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 下载模板
export const downloadTemplate = () => {
  return request.$pps({
    url: '/productCost/export',
    method: 'get',
    responseType: 'blob'
  })
}

// 导入模板
export const importTable = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.$pps({
    url: '/productCost/import',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pps({
    url: '/productCost/detail',
    method: 'get',
    params: {
      id
    }
  })
}
