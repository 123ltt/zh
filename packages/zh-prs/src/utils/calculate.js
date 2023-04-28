
export const sub = (arg1, arg2) => {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2
  // 原先是多少位,还是还原到多少位   避免1.335.toFixed(2)=1.33
  return Number(((arg1 * m - arg2 * m) / m).toFixed(n))
}
export const add = (arg1, arg2) => {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2

  return Number(((arg1 * m + arg2 * m) / m).toFixed(n))
}

// export const accMul = (arg1, arg2) => {
//   var m = 0; var s1 = arg1.toString(); var s2 = arg2.toString()
//   try { m += s1.split('.')[1].length } catch (e) {}
//   try { m += s2.split('.')[1].length } catch (e) {}
//   return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
// }
// export const accDiv = (arg1, arg2) => {
//   var t1 = 0; var t2 = 0; var r1; var r2
//   try { t1 = arg1.toString().split('.')[1].length } catch (e) { }
//   try { t2 = arg2.toString().split('.')[1].length } catch (e) { }
//   Math.r1 = Number(arg1.toString().replace('.', ''))
//   Math.r2 = Number(arg2.toString().replace('.', ''))
//   return (Math.r1 / Math.r2) * Math.pow(10, t2 - t1)
// }
