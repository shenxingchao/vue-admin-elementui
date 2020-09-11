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

//多语言 引入
import i18n from './lang/i18n'

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
