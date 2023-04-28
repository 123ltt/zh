// transitionend事件兼容多浏览器
export function whichTransitionEvent() {
  const el = document.createElement('surface')
  const transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  }

  for (const t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t]
    }
  }
}

// 映射关系
const channelPriceVOMap = {
  C00001: 'firstCost',
  C00002: 'tailCost',
  C00003: 'fullCost',
  B00001: 'fuelCost',
  A00002: 'remoteCost'
}

// 初始化各项费用
const initChannelPriceVO = {
  additionCost: 0,
  firstCost: 0,
  fuelCost: 0,
  fullCost: 0,
  remoteCose: 0,
  tailCost: 0,
  tax: 0
}

// 返回物流运费试算的各项费用
export const getChannelPriceVO = (obj) => {
  const priceObj = obj.details.reduce((objVO, cur) => Object.assign(objVO, { [channelPriceVOMap[cur.itemCode]]: cur.price }), { tax: obj.tax })
  return Object.assign({}, initChannelPriceVO, priceObj)
}
