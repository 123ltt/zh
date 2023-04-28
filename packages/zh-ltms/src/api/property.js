import request from '@/router/axios'
// 获取属性配置
export const getProperty = (propertyName) =>
  request.$ltms_system({
    url: '/logisticsProperty/getProperty',
    method: 'get',
    params: {
      propertyName
    }
  })
// 新增属性配置
export const AddProperty = (parentId, propertyName, id) =>
  request.$ltms_system({
    url: '/logisticsProperty/saveProperty',
    method: 'post',
    params: {
      id,
      parentId,
      propertyName
    }
  })
// 修改属性配置
export const UpdateProperty = (id, parentId, propertyName) =>
  request.$ltms_system({
    url: '/logisticsProperty/updateProperty',
    method: 'post',
    params: {
      id,
      parentId,
      propertyName
    }
  })
// 删除属性配置
export const DeleProperty = (id, parentId, propertyName) =>
  request.$ltms_system({
    url: '/logisticsProperty/removeProperty',
    method: 'post',
    params: {
      id,
      parentId,
      propertyName
    }
  })
