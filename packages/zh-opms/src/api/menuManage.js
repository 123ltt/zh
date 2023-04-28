import request from '@/plugins/request'
/**
 * module: 菜单管理
 * 后端开发： 任永亮
 * 文档地址： http://192.168.114.166:8888/doc.html#/权限模块/菜单接口/listUsingGET_2
 **/
// 获取菜单列表
export function getMenuList(data) {
  return request.$opms({
    url: '/menu/list',
    method: 'get',
    params: data
  })
}

// 获取菜单详情
export function getMenuDetail(data) {
  return request.$opms({
    url: '/menu/detail',
    method: 'get',
    params: data
  })
}

// 删除菜单
export function removeMenu(data) {
  return request.$opms({
    url: '/menu/remove',
    method: 'post',
    params: data
  })
}

// 分页条件查询资源树
export function getResourceTree(data) {
  return request.$opms({
    url: '/resource/tree',
    method: 'get',
    params: data
  })
}

// 新增或修改资源
export function submitResourceList(data) {
  return request.$opms({
    url: '/menu/submit',
    method: 'post',
    data: data
  })
}

// 菜单拥有人员分页列表
export function countDetails(data) {
  console.log(data)
  return request.$opms({
    url: '/menu/user-page',
    method: 'get',
    params: data
  })
}
