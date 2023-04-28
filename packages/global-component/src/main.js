import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import '@/styles/common.scss'
import GlobalComponents from './components/index'
import router from './router'
import '@/directives/index'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(GlobalComponents)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
