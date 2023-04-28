
/**
 * 过滤空字符串或者null
 * @param {Array,Object} data 原始数据
 * @param {Array} headers 表头数组
 * @param {Array} arr 某个表头字段保留小数2位
 */

export function filterData(data, headers = [], arr = []) {
  if (Object.prototype.toString.call(data) === '[object Object]') {
    changeData(data, arr)
  } else if (Array.isArray(data)) {
    data.length && data.forEach(item => {
      changeData(item, arr)
      // 如果返回的数据没有heades对应项就默认设置--
      headers.forEach(ele => {
        item[ele.prop] || (item[ele.prop] = '--')
      })
    })
  } else {
    console.warn('请传入数组或对象')
    return data
  }
  function changeData(item, arr) {
    for (const i in item) {
      if (item[i] === '' || item[i] === null) {
        item[i] = '--'
      }
      // 小数去零
      var bool = item[i].toString().indexOf('.')
      if (!isNaN(item[i]) && bool !== -1) {
        item[i] = Number(item[i])
        // 保留两位小数
        arr.forEach(ele => {
          if (ele === i) {
            item[i] = Number(item[i]).toFixed(2)
          }
        })
      }
    }
  }
  return data
}
