import { createApp } from 'vue'
import App from './App.vue'

import './style.css'

import './App.vue'
createApp(App)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
