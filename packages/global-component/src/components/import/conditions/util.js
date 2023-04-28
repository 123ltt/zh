export function getUid() {
  return Number(String(Math.random()).slice(4) + new Date().getMilliseconds()).toString(32)
}

/**
 * 获取变量类型
 * @param {*} d
 * @returns {string}
 */
export function getTypeof(d) {
  const t = typeof d
  if (t === 'object') {
    return Object.prototype.toString.call(d).slice(8, -1).toLowerCase()
  }
  return t
}

/**
 * 克隆对象
 * @param {*} data 任意值
 * @param {(data:any;property:string[])=>any} [cb] 回调，必须返回值(通过cb改变值并返回)
 */
export function recursion(data, cb) {
  const recursion = (_d, property) => {
    const d = typeof cb === 'function' ? cb(_d, [...property]) : _d
    if (getTypeof(d) === 'object') {
      return Object.entries(d).reduce((preVal, [key, value]) => {
        preVal[key] = recursion(value, [...property, key])
        return preVal
      }, {})
    } else if (getTypeof(d) === 'array') {
      return d.map(item => {
        return recursion(item, [...property, '[]'])
      })
    }
    return d
  }
  return recursion(data, [])
}
