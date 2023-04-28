/** 属性拦截接口 */
import request from '@/router/axios'
// 获取列表分页
export const getList = (current, size, params) => request.$tms_system({
  url: '/system/propertyConfig/queryConfig',
  method: 'get',
  params: {
    current,
    size,
    ...params
  }
})

// 新增-属性拦截
export const AddProperty = (data) => {
  return request.$tms_system({
    url: '/system/propertyConfig/saveConfig',
    method: 'post',
    data
  })
}

// 修改-属性拦截
export const UpdateProperty = (data) => request.$tms_system({
  url: '/system/propertyConfig/updateConfig',
  method: 'post',
  data
})

// 移除-属性拦截
export const DeleProperty = (data) => request.$tms_system({
  url: '/system/propertyConfig/removeConfig',
  method: 'post',
  data
})

// 启用停用-属性拦截
export const changeStatus = (data) => request.$tms_system({
  url: '/system/propertyConfig/updateStatus',
  method: 'post',
  data
})
