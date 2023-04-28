/**
 * 限制可输入的多少位数
 */
export const limitDecimal = (val, num) => {
  val = val.replace(/[^(0-9|.)]+/, '')
  var reg = '/^\\d+(\\.?\\d{0,' + num + '})/g'
  // eslint-disable-next-line no-eval
  const newVal = val.match(eval(reg))
  return newVal ? newVal[0] : val
}

/**
 *  强制限制输入 0-1之间 保留两位小数
 * @param {string} inputStr
 * @returns
 */
export const forcedInput = (inputStr, num = 2) => {
  const val = inputStr.replace(/[^(0-9|.)]+/, '')
  if (val[0] !== '1' && val[0] !== '0') {
    return ''
  } else if (val[0] === '1') {
    return 1
  } else if (val[0] === '0') {
    if (val[1] === '.') {
      var reg = '/^\\d+(\\.?\\d{0,' + num + '})/g'
      // eslint-disable-next-line no-eval
      const newVal = val.match(eval(reg))
      return newVal ? newVal[0] : val
    }
    return 0
  }
}
/**
 * 限制输入空格以及<>
 * @param {string} val
 * @returns
 */
export const limitSpaceOrGtLt = (val) => {
  const trimResult = val.trim()
  const result = trimResult.match(/[\\< | \\> ]/)
  return result ? val.substring(0, val.length - 1) : trimResult
}

/**
 * 校验输入有效的值
 */
export const invalidVerification = (rules, value, cb, label) => {
  if (parseFloat(value) === 0) {
    return cb(new Error(`请输入有效的${label}`))
  }
  return cb()
}
/**
 * 获取字典详情
 */
export const getDictVal = (list, key) => {
  return list.find(
    item => key + '' === item.dictKey
  )?.dictValue
}

// 详情保留多少小数
export const takeWholeNum = (val, num) => {
  return Number(Number(val).toFixed(num))
}
