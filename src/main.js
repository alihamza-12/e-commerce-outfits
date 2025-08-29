import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'


// Quasar styles (must be imported first)
import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'

// Tailwind CSS (import after Quasar base styles)
import './assets/main.css'

// Quasar
import { Quasar, Notify, Dialog } from 'quasar'

const app = createApp(App)
const pinia = createPinia()

app.use(Quasar, {
  plugins: { Notify, Dialog },
  config: {
    brand: {
      primary: '#1976D2',
      secondary: '#26A69A',
      accent: '#9C27B0',
      positive: '#21BA45',
      negative: '#C10015',
      info: '#31CCEC',
      warning: '#F2C037'
    }
  }
})

app.use(pinia)
app.use(router)

app.mount('#app')
