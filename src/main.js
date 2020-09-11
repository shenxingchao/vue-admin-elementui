import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI)
Vue.config.productionTip = false

import i18n from './lang/i18n' //多语言 引入
import './mock' //引入mock.js 模拟数据 开启这里 使用moke/index.js文件拦截

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
