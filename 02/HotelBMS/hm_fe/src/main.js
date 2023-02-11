import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

import './assets/css/global.css'

nprogress.configure({ ease: 'ease', speed: 1000 })
axios.defaults.baseURL = 'http://127.0.0.1/'

axios.interceptors.request.use(config => {
  nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  nprogress.done()
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
