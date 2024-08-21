import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/aura-light-blue/theme.css'
import 'primeicons/primeicons.css'
import router from './router/router'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'
import store from './store'

const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.use(ToastService)
app.use(store)
app.directive('tooltip', Tooltip)
app.mount('#app')
