import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$purchase({
    url: '/requirement/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 目的仓库接口
export const getWarehouse = () => {
  return request.$purchase({
    url: '/warehouse/list',
    method: 'get'
  })
}

// 添加产品
export const addOneRqmtProduct = (row) => {
  return request.$purchase({
    url: '/stockuprqmtproduct/addOneRqmtProduct',
    method: 'get',
    params: row
  })
}

// 新增保存
export const save = (row) => {
  return request.$purchase({
    url: '/requirement/saveRqmtProduct',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$purchase({
    url: '/requirement/updateRqmtProduct',
    method: 'post',
    data: row
  })
}

// 编辑详情
export const getUpdateDetail = (id) => {
  return request.$purchase({
    url: '/requirement/getUpdateDetail',
    method: 'get',
    params: {
      id
    }
  })
}

// 删除
export const remove = (ids) => {
  return request.$purchase({
    url: '/requirement/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 提交
export const submit = (row) => {
  return request.$purchase({
    url: '/requirement/submit',
    method: 'post',
    data: row
  })
}

// 类目
export const getCategorAll = () => {
  return request({
    url: '/pms/category/getAll',
    method: 'get'
  })
}

// 审核详情
export const getVerifyDetail = (id) => {
  return request.$purchase({
    url: '/requirement/getVerifyDetail',
    method: 'get',
    params: {
      id
    }
  })
}

// 审核
export const verify = (row) => {
  return request.$purchase({
    url: '/requirement/verify',
    method: 'post',
    data: row
  })
}

// 详情
export const getDetail = (id) => {
  return request.$purchase({
    url: '/requirement/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 下载模板
export const downloadTemplate = () => {
  return request.$purchase({
    url: '/stockuprqmtproduct/exportRqmtProduct',
    method: 'get',
    responseType: 'blob'
  })
}

// 导入模板
export const importTable = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.$purchase({
    url: '/stockuprqmtproduct/importRqmtProduct',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

// 详情
export const getOweOrderDetail = (id) => {
  return request.$purchase({
    url: '/requirement/getOweOrderDetail',
    method: 'get',
    params: {
      id
    }
  })
}
