import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/conditions',
    name: 'Conditions',
    component: () => import(/* webpackChunkName: "conditions" */ '../views/conditions/index.vue')
  },
  {
    path: '/select',
    name: 'Select',
    component: () => import(/* webpackChunkName: "select" */ '../views/select.vue')
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue')
  },
  {
    path: '/table',
    name: 'Table',
    component: () => import('../views/table.vue')
  },
  {
    path: '/multipleInput',
    name: 'MultipleInput',
    component: () => import('../views/multipleInput.vue')
  },
  {
    path: '/cascader',
    name: 'Cascader',
    component: () => import('../views/cascader.vue')
  },
  {
    path: '/ossWatermark',
    name: 'ossWatermark',
    component: () => import('../views/ossWatermark.vue')
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('../views/editor.vue')
  },
  {
    path: '/inputTree',
    name: 'inputTree',
    component: () => import('../views/inputTree/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
