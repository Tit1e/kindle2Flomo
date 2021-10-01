import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'
import './theme/index.scss'
import VueI18n from './language'

import '@/assets/css/index.scss'

const app = createApp(App)
app.use(ElementPlus)
app.use(VueI18n)
app.mount('#app')
