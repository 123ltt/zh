/**
 防抖（debounce）
所谓防抖，就是指触发事件后 n 秒后才执行函数，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
防抖函数分为非立即执行版和立即执行版。
 */
export const debounce = (func, wait, immediate) => {
  let timeout
  return function() {
    const context = this
    const args = [...arguments]
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 节流（throttle）
所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。 节流会稀释函数的执行频率。
对于节流，一般有两种方式可以实现，分别是时间戳版和定时器版。
 */
export function throttle(func, wait) {
  var previous = 0
  return function() {
    const now = Date.now()
    const context = this
    const args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}

export const getObjType = obj => {
  if (obj instanceof Element) {
    return 'element'
  }
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

/**
 * 对象深拷贝
 */
export const deepClone = data => {
  var type = getObjType(data)
  var obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}
