import request from '@/router/axios'
// 采购问题列表 - 分页查询
export const queryData = ({ problemCreateTimes, problemStatus, current, size }) => {
  return request.$pms({
    url: '/purchaseProblem/page',
    method: 'POST',
    params: { current, size },
    data: { problemCreateTimes, problemStatus }
  })
}

/**
 *  回复采购问题
 * @param {number} param id
 * @param {string} param number 问题编号
 * @param {string} param replyContent 答复内容
 */
export const reply = ({ id, number, replyContent }) => {
  return request.$pms({
    url: '/purchaseProblem/reply',
    method: 'POST',
    data: { id, number, replyContent }
  })
}

// 查看采购问题
export const getDetail = id => {
  return request.$pms({
    url: `/purchaseProblem/detail?id=${id}`,
    method: 'get'
  })
}
