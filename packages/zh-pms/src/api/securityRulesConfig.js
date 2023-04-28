import request from '@/router/axios'

// 新增或修改安全审核接口
export const updateSafety = data => {
  return request.$pms({
    url: '/safety/saveSafetyList',
    method: 'POST',
    data
  })
}

// 安全审核分配查询接口-分页查询
export const querySafety = ({ safetyAuditName, categoryIdList, safeStatus, current, size }) => {
  return request.$pms({
    url: '/safety/selectSafetyAuditPage',
    method: 'GET',
    params: {
      safetyAuditName, categoryIdList, safeStatus, current, size
    }
  })
}

// 根据id查询安全审核信息
export const querySafetyById = (id) => {
  return request.$pms({
    url: '/safety/selectSafetyAuditById',
    method: 'GET',
    params: {
      id
    }
  })
}

// 删除安全审核信息接口

export const delSafety = (ids) => {
  return request.$pms({
    url: '/safety/remove',
    method: 'POST',
    meta: {
      isSerialize: true
    },
    data: {
      ids
    }
  })
}
