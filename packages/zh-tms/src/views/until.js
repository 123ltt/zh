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
