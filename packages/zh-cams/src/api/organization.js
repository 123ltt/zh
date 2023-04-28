import request from '@/router/axios'

// 获取组织机构列表数据
export const getOrgList = (params) => {
  return request.$ams({
    url: '/org/lazy-list',
    method: 'get',
    timeout: 12000,
    params: { ...params }
  })
}
// 获取子级机构
export const getOrgChildList = (params) => {
  return request.$ams({
    url: '/org/findSon',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 获取列表logo
export const getOrgLogo = (params) => {
  return request.$ams({
    url: '/orglogo/detail',
    method: 'get',
    timeout: 120000,
    params: {
      ...params
    }
  })
}
// 获取组织机构树
export const getOrgTree = (params) => {
  return request.$ams({
    url: '/org/tree',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 上传logo
export const uploadLogo = ({ file }) => {
  const formData = new FormData()
  formData.append('logo', file)
  return request.$ams({
    url: '/orglogo/upload',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
// 保存组织
export const submitOrg = (params) => {
  const formData = new FormData()
  Object.keys(params).forEach(key => {
    formData.append(key, params[key])
  })
  return request.$ams({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/org/submit',
    method: 'post',
    timeout: 120000,
    data: formData
  })
}
// 删除
export const deleteOrg = (ids) => {
  return request.$ams({
    url: '/org/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 负责人列表
export const getManagerList = (data) => {
  return request.$ams({
    url: '/user/list',
    method: 'get',
    params: data
  })
}
