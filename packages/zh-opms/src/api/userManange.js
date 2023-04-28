import request from '@/plugins/request'
/**
 * module: 用户管理
 * 后端开发： 李景华
 * 文档地址： https://www.showdoc.com.cn/1058340152082282?page_id=5504937212848657
 * 文档地址： http://192.168.114.171:8888/doc.html#/ams/用户表接口/pageUsingGET_8
 **/

// 修改密码
export function updatePassWord(data) {
  return request.$opms({
    url: '/user/update-password',
    method: 'post',
    params: data
  })
}
