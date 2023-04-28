import Vue from 'vue'
Vue.directive('grid', {
  inserted: function(el, binding) {
    let doms = []
    if (el.className === 'el-row') {
      doms = el.querySelectorAll('.el-col')
    } else if (el.className.includes('el-col')) {
      doms.push(el)
    }
    const { arg } = binding
    const grid = {
      x: 'xs',
      s: 'sm',
      m: 'md',
      l: 'lg'
    }
    let classList = ''
    Object.entries(arg).forEach(([key, val]) => {
      classList += ' el-col-' + grid[key] + '-' + val
    })
    doms.forEach(item => {
      item.className += classList
    })
  }
})
