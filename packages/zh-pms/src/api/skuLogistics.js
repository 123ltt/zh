import request from '@/router/axios'

export const getDetail = (id) => {
  return request.$pms({
    url: '/skulogistics/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const update = (row) => {
  return request.$pms({
    url: '/skulogistics/submit',
    method: 'post',
    data: row
  })
}
