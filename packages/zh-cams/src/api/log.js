import request from '@/router/axios'
/**
 * module: 日志查询
 * 后端开发： 杨锐波
 * 文档地址：
 * https://www.showdoc.com.cn/1058340152082282?page_id=5441223833674464
 * http://192.168.114.167:8888/doc.html#/ams模块/日志接口/getBusinessLogForPageUsingGET
 **/
// 获取日志列表
export function getLogList(data) {
  return request.$ams({
    url: '/log/bus/page',
    method: 'get',
    params: data
  })
}
