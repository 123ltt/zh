import request from '@/plugins/request/index'
import { Currency } from './common.js'

export function getConditions(ruleType = [1]) {
  return request.$oms({
    url: '/rule/condition/list',
    method: 'POST',
    data: ruleType
  }).then(res => {
    return res.data.map(item => {
      return {
        label: item.fieldName,
        value: item.field,
        type: item.inputType,
        operatorList: (item.opList || []).map(el => {
          return { label: el.name, value: el.type }
        })
      }
    })
  })
}

export function getConditionValues(field, searchWord = '') {
  return request.$oms({
    url: '/rule/condition/valueItem',
    params: { field, searchWord },
    useCache: true
  }).then(res => {
    res = field === 'warehouseCode' ? recursiveFn(res.data) : reduceFn(res.data)
    return res
  })
}

// 获取币种
export function getCurrency() {
  return Currency().then(res => {
    return reduceFn(res.data, 'currency', 'currency')
  })
}

function reduceFn(data, label = 'name', value = 'value') {
  return (data || []).reduce((preArr, curObj) => {
    if (curObj[label] !== '' && curObj[value] !== '') {
      preArr.push({
        label: curObj[label],
        value: curObj[value]
      })
    }
    return preArr
  }, [])
}
function recursiveFn(data) {
  Array.isArray(data) && data.forEach(item => {
    item.label = item.name
    if (item.children.length === 0) {
      item.children = null
    } else {
      recursiveFn(item.children)
    }
  })
  return data
}
