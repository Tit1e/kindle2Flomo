import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

import './theme/index.css'
import '@/assets/css/index.scss'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
