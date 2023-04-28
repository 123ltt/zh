import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/visitFacRecord/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getEXeclList = (current, size, params) => {
  return request.$pss({
    url: '/visitFacRecord/export',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 地址接口
export const getlistAddress = () => {
  return request.$pss({
    url: '/supplierDistrict/listAddress',
    method: 'get'
  })
}

// 角色接口
export const getUserList = () => {
  return request.$ams({
    url: '/user/conciseInfo/page?current=1&size=-1',
    method: 'get'
  })
}

// 导入
export const importRecordExcel = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.$pss({
    url: '/visitFactoryRecord/uploadVisitFactoryApplyExcel',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

// 新增
export const save = (obj) => {
  return request.$pss({
    url: '/visitFacRecord/save',
    method: 'post',
    data: obj
  })
}

// 编辑
export const update = (obj) => {
  return request.$pss({
    url: '/visitFacRecord/edit',
    method: 'post',
    data: obj
  })
}

// 审核
export const audit = (obj) => {
  return request.$pss({
    url: '/visitFactoryApply/audit',
    method: 'post',
    data: obj
  })
}

// 访厂
export const visit = (obj) => {
  return request.$pss({
    url: '/visitFactoryApply/visit',
    method: 'post',
    data: obj
  })
}

// 提交
export const submit = (obj) => {
  return request.$pss({
    url: '/visitFacRecord/submit',
    method: 'post',
    data: obj
  })
}

/**
 *
 * @param {*string 传入id} id
 */
export const approval = (id) => {
  return request.$pss({
    url: '/visitFacRecord/approval',
    method: 'post',
    params: {
      id
    }
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/visitFacRecord/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/visitFacRecord/detail',
    method: 'get',
    params: {
      id
    }
  })
}
