import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import './index.css'
import './App.css'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
