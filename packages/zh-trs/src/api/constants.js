import request from '@/plugins/request'

/**
 * 获取常量列表
 * 已加入store
 * this.$store.dispatch('getConstants').then(res => res.tenantDbStatus)
 */
export const getConstants = (params) => {
  return request.$opms({
    url: '/constants',
    method: 'get',
    params: {
      ...params
    },
    useCache: true
  })
}
