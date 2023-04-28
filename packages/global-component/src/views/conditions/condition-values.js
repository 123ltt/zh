const arr = [
  { name: '科索沃', value: 'KS' },
  { name: '安道尔', value: 'AD' },
  { name: '阿联酋', value: 'AE' },
  { name: '阿富汗', value: 'AF' },
  { name: '安提瓜和巴布达', value: 'AG' },
  { name: '安圭拉', value: 'AI' },
  { name: '阿尔巴尼亚', value: 'AL' },
  { name: '亚美尼亚', value: 'AM' },
  { name: '安哥拉', value: 'AO' },
  { name: '南极洲', value: 'AQ' },
  { name: '阿根廷', value: 'AR' },
  { name: '美属萨摩亚', value: 'AS' },
  { name: '奥地利', value: 'AT' },
  { name: '澳大利亚', value: 'AU' },
  { name: '阿鲁巴', value: 'AW' },
  { name: '奥兰群岛', value: 'AX' },
  { name: '阿塞拜疆', value: 'AZ' },
  { name: '波黑', value: 'BA' },
  { name: '巴巴多斯', value: 'BB' },
  { name: '孟加拉国', value: 'BD' }
]

export default () => {
  return [...new Array(5)].map(() => arr).flat()
}
