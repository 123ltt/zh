import Vue from 'vue'
Vue.directive('color', {
  update: function(el, binding) {
    const className = (binding.value || 'blue.red.green.gray.yellow').split('.')[binding.arg] || binding.value
    const colorObj = {
      gray: '#606266',
      green: '#13CE66',
      red: '#FF4848',
      blue: '#1890FF',
      yellow: '#FAAD14'
    }
    el.className = className
    el.style.color = colorObj[className] || '#' + className
  }
})
